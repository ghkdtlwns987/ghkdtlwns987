---
layout: post
title: "HCCC 2022 침해사고 분석 및 대응"
date: 2026-08-16
description: >-
  Web Server와 Windows PC의 침해 흔적을 분석하고, 공격 흐름 재구성부터 취약점 패치와 방어 환경 구축까지 수행한 HCCC 2022 침해사고 대응 프로젝트
badges:
  - Essay
---

## 들어가며

학부 시절 팀 고점에사람있어요로 참가했던 HCCC(Honam Collegiate CERT Challenge) 2022에서 진행한 침해사고 분석 및 대응 과정을 정리해보려고 한다.

대회에서는 이미 공격이 발생한 Linux Web Server와 Windows PC가 주어졌고, 시스템에 남아 있는 로그, 파일, 네트워크 및 시스템 흔적을 분석하여 공격자가 어떻게 침투했고, 어떤 행위를 수행했는지 밝혀내야 했다.

단순히 공격 흔적 하나를 발견하는 것이 아니라 서로 다른 시스템에 남아 있는 증거를 연결하여 전체 공격 흐름을 재구성하는 것이 핵심이었다.

분석 결과 Web Server에서는 Webshell → Reverse Shell → Privilege Escalation → Backdoor → SQL Injection → DB Manipulation으로 이어지는 공격을 확인했고, Windows PC에서는 Malware Execution → Persistence → C2 Connection → Data Exfiltration Attempt로 이어지는 침해 흔적을 확인했다.

또한 분석에서 끝나는 것이 아니라 발견한 웹 취약점을 직접 수정하고, Firewall / IPS / WAF를 결합한 Docker 기반 NFV 환경까지 구성했다.

## 전체 침해사고 흐름

가장 먼저 각각의 시스템에서 발견한 증거를 발생 시각, IP 주소, 파일 및 프로세스를 기준으로 연결하여 전체 공격 흐름을 재구성했다.

{% include paper-figure.html src="hccc/hccc1.png" alt="HCCC 침해사고 분석 개요" caption="침해사고 분석 개요" %}

전체 사고는 크게 Web Server 침해와 Windows PC 침해로 구분할 수 있었다.

| Target | 주요 공격 흐름 |
|:--|:--|
| Web Server | Webshell → Reverse Shell → Dirty Pipe → Apache Backdoor → SQL Injection → DB Manipulation |
| Windows PC | Malicious ISO → Malware Execution → Service Registration → C2 → Exfiltration Attempt |

개별 로그만 보면 서로 관계없는 이벤트처럼 보였지만, 여러 Artifact를 시간 순서대로 연결하면서 공격자의 행위를 단계적으로 재구성할 수 있었다.

## Web Server 침해사고 분석

### 1. Webshell과 Reverse Shell

웹 서버 Access Log를 분석하던 중 `ws.php`라는 비정상적인 PHP 파일에 대한 접근 흔적을 발견했다.

파일의 동작을 분석해보니 전달된 명령어를 처리한 뒤 PHP의 `system()` 함수를 통해 OS 명령을 실행하는 Webshell이었다.

실제 로그에서도 다음과 같은 명령의 실행 흔적을 확인했다.

```text
id
uname -a
```

이후 `/tmp`에 Named Pipe를 생성하고 Netcat을 이용하여 외부 C2 서버로 Reverse Shell 연결을 시도한 기록이 발견되었다.

{% include paper-figure.html src="hccc/hccc2.png" alt="공격 경로 및 로그 분석" caption="공격 경로 및 로그 분석" %}

흥미로운 점은 첫 번째 연결 시도가 실패한 뒤 다시 요청한 기록이 존재했다는 것이다. HTTP Response Code와 이후 시스템 이벤트를 함께 분석하여 실제 연결이 성공한 시점까지 추적했다.

```text
Webshell
    ↓
Command Execution
    ↓
Reverse Shell
    ↓
C2 Server
```

### 2. Dirty Pipe를 이용한 권한 상승

Reverse Shell 획득 이후 공격자는 `uname -a` 명령을 실행하여 시스템 정보를 확인했다.

처음에는 단순한 시스템 정보 수집으로 보일 수도 있었지만, 이후 발견한 Kernel Exploit과 연결하면서 공격 의도를 확인할 수 있었다.

당시 Web Server의 Kernel Version을 분석한 결과 **CVE-2022-0847(Dirty Pipe)**의 영향을 받는 환경이었고, 실제 시스템에서도 해당 취약점을 이용한 Local Privilege Escalation 흔적을 확인했다.

```text
Reverse Shell
      ↓
Kernel Version Check
      ↓
Dirty Pipe (CVE-2022-0847)
      ↓
Privilege Escalation
```

즉, 하나의 `uname -a` 기록만 보는 것이 아니라 이후 발생한 행위와 연결함으로써 공격자가 왜 해당 명령을 실행했는지 추론할 수 있었다.

### 3. Apache Module Backdoor

권한 상승 이후에는 Apache 설정에서 비정상적인 Module이 등록된 흔적을 발견했다.

Apache Module 설정을 추적한 결과 별도의 `.so` 파일이 로드되도록 구성되어 있었으며, 파일 생성 시각과 패키지 설치 기록 등을 비교하면서 Backdoor가 설치된 과정을 분석했다.

공격 흐름을 정리하면 다음과 같다.

```text
Privilege Escalation
        ↓
Apache Development Package
        ↓
Malicious .so Module
        ↓
Apache Configuration
        ↓
Persistence
```

단순 Webshell을 유지하는 대신 Apache 자체에 악성 Module을 등록함으로써 지속적인 접근을 위한 Persistence를 확보하려 한 것으로 분석했다.

### 4. SQL Injection과 DB 조작

웹 서버 로그에서는 sqlmap을 이용한 SQL Injection 흔적도 확인했다.

공격자는 Blind SQL Injection을 이용해 데이터베이스 구조를 확인하고 테이블과 데이터를 단계적으로 추출했다.

이후 SSH 및 DBMS 관련 흔적에서는 게시판과 사용자 테이블의 데이터를 삭제하거나 새로운 데이터를 추가한 기록이 발견되었으며, 최종적으로 웹사이트에 협박성 게시글이 등록된 것까지 확인했다.

```text
SQL Injection
      ↓
DB Enumeration
      ↓
Data Extraction
      ↓
SSH Access
      ↓
DB Manipulation
      ↓
Extortion Post
```

즉 단순한 SQL Injection 시도가 아니라 데이터 탈취와 서비스 데이터 변조까지 이어진 공격이었다.

## Windows PC 침해사고 분석

Windows PC에서는 Linux Web Server와는 다른 종류의 Artifact를 활용했다.

Browser History, Windows Event Log, File System Metadata, PE Binary, Service 정보 등을 연결하여 공격 흐름을 분석했다.

### 1. 악성 ISO 다운로드 및 실행

Microsoft Edge History에서 특정 ISO 파일이 Web Server로부터 다운로드된 기록을 발견했다.

이후 `Microsoft-Windows-VHDMP-Operational.evtx`를 분석하여 해당 ISO의 Mount 기록을 확인했고, 마운트된 위치에서 실행 파일이 실행된 흔적까지 추적했다.

```text
Browser History
      ↓
ISO Download
      ↓
VHDMP Event Log
      ↓
ISO Mount
      ↓
Malware Execution
```

중요했던 점은 브라우저 기록만 보고 악성파일이 실행됐다고 결론 내리지 않았다는 것이다.

다운로드 → Mount → 실행에 해당하는 서로 다른 Artifact를 연결하여 실제 행위를 검증했다.

### 2. 악성파일 Reverse Engineering

실행된 PE 파일은 별도로 정적 분석을 진행했다.

PE Header와 문자열을 확인하고 Disassembler를 이용해 주요 함수의 동작을 추적했다.

분석 과정에서 프로그램이 먼저 관리자 권한으로 실행되고 있는지 검사하는 로직을 확인했으며, 이후 특정 경로에 실행 파일을 생성하는 동작을 확인했다.

```text
C:\Windows\System32\wmiApSrvs.exe
```

{% include paper-figure.html src="hccc/hccc3.png" alt="침해 행위 분석" caption="침해 행위 분석" %}

여기서 분석을 끝내지 않고 Windows Event Log를 다시 확인했다.

그 결과 정적 분석에서 발견한 파일과 관련된 Windows Service 설치 Event를 확인할 수 있었다.

즉,

```text
Binary Reverse Engineering
            ↓
Expected Behavior
            ↓
Windows Event Log
            ↓
Actual Behavior Verification
```

처럼 바이너리에서 분석한 행위와 실제 침해 시스템에 남아 있는 Artifact를 교차 검증할 수 있었다.

### 3. Persistence와 C2 Connection

악성 프로그램은 Windows Service로 등록되어 시스템 시작 이후에도 자동으로 실행되도록 구성되어 있었다.

실제 Event Log와 시스템 부팅 시각을 비교해보면 재부팅 이후 악성 서비스가 실행되고 외부 C2 서버로 Reverse Connection을 생성한 흔적을 확인할 수 있었다.

```text
Malware Execution
      ↓
Service Registration
      ↓
System Reboot
      ↓
Service Start
      ↓
Reverse Connection
      ↓
C2 Server
```

이를 통해 최초 악성파일 실행뿐 아니라 공격자가 Persistence와 Command & Control Channel을 어떻게 유지했는지까지 추적할 수 있었다.

### 4. 정보 유출 시도

C2 연결 이후에는 추가적인 공격 행위가 이어졌다.

분석 과정에서 RDP 접근, Mimikatz 다운로드 시도, FTP/SFTP/SCP 사용 등의 흔적을 확인했으며, 일부 데이터를 압축하거나 외부로 전송하려 한 정황도 발견했다.

특히 `important.txt` 파일을 외부로 전송하려 한 흔적이 존재하여 공격자가 내부 정보 탈취를 시도한 것으로 판단했다.

## 침해사고 대응

공격자가 무엇을 했는지 분석하는 것에서 끝내지 않고, 확인된 취약점에 대한 패치와 방어 환경 구축까지 진행했다.

### 웹 애플리케이션 패치

분석 과정에서 확인한 취약점을 바탕으로 실제 웹 애플리케이션의 소스코드를 수정했다.

대표적으로 파일 업로드 기능에는 별도의 확장자 검증이 존재하지 않아 Webshell과 같은 파일이 업로드될 수 있었다.

이에 따라 허용된 확장자만 업로드할 수 있도록 제한하고, Apache 설정에서도 업로드 디렉터리의 PHP 실행을 차단했다.

```text
Attack
   ↓
Root Cause Analysis
   ↓
Vulnerability Identification
   ↓
Patch
```

공격 기법 자체를 이해하는 것에서 한 단계 더 나아가 어떤 구현상의 문제가 공격을 가능하게 했는지 찾고 이를 직접 수정했다.

### Docker 기반 NFV 구축

네트워크 레벨에서 공격을 탐지하고 차단하기 위한 Docker 기반 NFV(Network Function Virtualization) 환경도 구성했다.

사용한 주요 보안 기능은 다음과 같다.

| Component | Role |
|:--|:--|
| iptables | Firewall |
| Snort 3 | IPS |
| ModSecurity | Web Application Firewall |

전체적인 트래픽 흐름은 다음과 같이 구성했다.

```text
Internet
   ↓
Firewall
   ↓
IPS
   ↓
WAF
   ↓
Web Server
```

각 보안 기능을 Docker Container로 분리하고, iptables를 이용하여 NAT 및 Packet Forwarding을 구성했다.

{% include paper-figure.html src="hccc/hccc4.png" alt="대응 및 보안 강화" caption="대응 및 보안 강화 — Firewall · IPS · WAF" %}

외부에서 Web Server로 접근하는 데 필요한 80/443 포트만 허용하고, 내부 시스템에 대한 불필요한 접근은 차단하도록 방화벽 정책도 구성했다.

## 프로젝트를 돌아보며

이 프로젝트에서 가장 많이 배운 것은 특정 보안 도구의 사용법보다 서로 다른 증거를 연결하여 하나의 공격 시나리오를 재구성하는 과정이었다.

하나의 Access Log만으로 전체 공격을 파악할 수는 없었다.

```text
Web Access Log          Windows Event Log
System Log              Browser History
Authentication Log      File System Metadata
Package History         PE Binary
Apache Configuration    Network Connection
Database Log
```

각 Artifact가 보여주는 것은 공격의 일부분이었다.

하지만 시간, IP, 파일, 프로세스, 계정을 기준으로 이들을 연결하면서 다음과 같은 전체 흐름을 재구성할 수 있었다.

```text
Initial Access
      ↓
Execution
      ↓
Privilege Escalation
      ↓
Persistence
      ↓
Command & Control
      ↓
Data Access
      ↓
Exfiltration
```

특히 기억에 남는 부분은 분석한 악성코드의 행위를 실제 Windows Event Log와 교차 검증했던 과정이었다. 정적 분석을 통해 예상한 행위가 실제 침해 시스템에서도 발생했음을 확인하면서, 악성코드 분석과 디지털 포렌식이 서로 독립적인 작업이 아니라 하나의 침해사고를 이해하기 위해 연결될 수 있다는 것을 경험했다.

또한 공격 흐름을 재구성하는 것에서 끝나지 않고 취약한 웹 소스코드를 직접 수정하고, Firewall·IPS·WAF를 이용한 방어 환경까지 구축하면서 분석 → 원인 파악 → 대응으로 이어지는 침해사고 대응 과정을 경험할 수 있었다.

학부 시절 진행했던 프로젝트이지만, 공격 자체보다 공격 이후 시스템에 남는 흔적을 어떻게 해석하고 연결할 것인가를 처음 깊게 고민해본 경험으로 기억에 남아 있다.
