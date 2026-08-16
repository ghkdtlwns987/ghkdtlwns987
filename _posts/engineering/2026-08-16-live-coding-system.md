---
layout: post
title: "교내 라이브 코딩 시스템 구축 및 운영"
date: 2026-08-16
description: >-
  교내 코딩 시험 및 과제에 사용되는 라이브 코딩 시스템을 구축하고, 운영 중 발생한 DB 병목과 장애를 개선한 경험
badges:
  - Essay
---

## 들어가며

2021년부터 2023년까지 교내 과제, 중간고사 및 기말고사에 실제 사용되는 라이브 코딩 시스템의 인프라를 구축하고 운영했다.

라이브 코딩 시스템은 학생이 온라인으로 코드를 제출하면 Worker Server에서 코드를 컴파일 및 실행하고 결과를 자동으로 채점하는 시스템이다.

프로젝트에서 PL(Project Leader) 역할을 맡아 다음 업무를 담당했다.

- Ubuntu 기반 서버 환경 구축
- Web / DB / Worker Server 구성
- SSL 및 방화벽 정책 적용
- DB 백업 및 장애 알림 자동화
- PHP Web Application 유지보수 및 보안 취약점 개선
- 서비스 장애 분석 및 Database 구조 개선

특히 실제 시험에 사용되는 서비스였기 때문에 단순히 시스템을 구축하는 것보다 많은 학생이 동시에 사용하는 상황에서도 서비스를 안정적으로 운영하는 것이 중요했다.

## 시스템 구조

전체 시스템은 크게 Web Server, Database Server, Worker Server로 구성되어 있었다.

{% include paper-figure.html src="projects/live-coding-overview.png" alt="라이브 코딩 시스템 구성도" caption="라이브코딩 플랫폼 인프라 구성" %}

학생이 코드를 제출하면 다음 과정을 거쳐 자동으로 채점된다.

```text
학생 코드 제출
     ↓
Web Server
     ↓
Database
     ↓
Worker Server
     ↓
Compile & Execute
     ↓
Database
     ↓
채점 결과 제공
```

교수나 조교가 문제를 등록하면 Database에 저장되고, 학생들은 Web Server를 통해 문제를 확인하고 코드를 제출한다.

제출된 코드는 Worker Server에서 컴파일 및 실행되며, 실행 결과는 다시 Database에 저장되어 학생에게 제공된다.

## Infrastructure 구축 및 운영

Ubuntu Server를 기반으로 실제 서비스 운영에 필요한 환경을 구성했다.

Web Server, Database, Worker Server를 구성하고 외부에서 안전하게 서비스를 이용할 수 있도록 SSL과 방화벽 정책을 적용했다.

시스템을 장기간 운영하면서 반복적인 관리 작업도 자동화했다.

대표적으로 Database Backup, 장애 발생 시 알림 전송, 서버 관리 Script 등을 작성하여 운영 부담을 줄였다.

기존 PHP Web Application에서 발견된 보안 취약점에 대해서는 Backend Code를 직접 분석하고 수정했으며, 불필요한 기능을 제거하는 등 서비스 안정화 작업도 함께 진행했다.

## 실제 운영 중 발생한 장애

이 프로젝트에서 가장 기억에 남는 것은 실제 시험 중 발생한 서비스 장애를 해결했던 경험이다.

평소에는 문제가 없었지만 시험이 시작되면 많은 학생이 비슷한 시간에 문제를 조회하고 코드를 제출했다.

코드 제출이 발생하면 Web Server, Database, Worker Server 사이에서 여러 작업이 동시에 수행된다.

```text
Student
   ↓
Web Server
   ↓
Database ↔ Manager ↔ Worker
                         ↓
                  Compile / Execute
                         ↓
                      Result
```

동시에 많은 요청이 발생하면서 Database의 작업량이 급격하게 증가했고, 결국 Database와 Worker 간 동기화를 담당하던 Manager Process가 종료되는 문제가 발생했다.

단순히 프로세스를 다시 실행하는 것만으로는 같은 문제가 반복될 가능성이 높았기 때문에 Database의 부하를 줄일 방법이 필요했다.

## MySQL Replication을 이용한 DB 부하 분산

서비스의 Database 작업을 분석해보니 문제 조회뿐 아니라 코드 제출 결과와 점수를 반영하기 위한 Read와 Update 작업이 지속적으로 발생하고 있었다.

기존에는 하나의 Database가 모든 요청을 처리하고 있었다.

```text
Before

                ┌────────┐
Web ───────────→│        │
                │   DB   │←──── Manager ──── Worker
                │        │
                └────────┘
                     ↑
                  Bottleneck
```

이를 개선하기 위해 MySQL Replication을 적용하여 Database의 역할을 분리했다.

```text
After

                   ┌────────────────┐
                   │ Master DB      │
                   │ C / U / D      │
                   └───────┬────────┘
                           │
                     Replication
                           │
                   ┌───────▼────────┐
                   │ Slave DB       │
                   │ Read           │
                   └────────────────┘
```

Master Database에서는 Create / Update / Delete를 처리하고, Slave Database에서는 Read를 담당하도록 구성했다.

이를 통해 하나의 Database에 집중되던 작업을 분산시키고, 동시 요청이 증가하면서 발생했던 문제를 개선할 수 있었다.

이 경험에서 가장 의미 있었던 부분은 MySQL Replication이라는 기술 자체보다 실제 운영 중 발생한 장애의 원인을 분석하고 시스템 구조를 변경하여 해결했다는 점이었다.

## 보안 및 운영 자동화

서비스를 장기간 운영하면서 안정성뿐 아니라 보안과 운영 효율성도 함께 개선했다.

### Security

서비스의 Inbound / Outbound Traffic을 관리하기 위한 방화벽을 구성하고 필요한 통신만 허용하도록 보안 정책을 적용했다.

또한 PHP 기반 Web Application을 운영하면서 발견된 취약점을 분석하고 문제가 되는 Backend Code를 직접 수정했다.

### Automation

반복적인 운영 작업을 줄이기 위해 관리 Script도 작성했다.

- Database 자동 Backup
- 장애 발생 시 관리자 알림
- Server Management 자동화

단순히 서버를 구축하는 데서 끝나지 않고 지속적으로 운영할 수 있는 환경을 만드는 것을 목표로 했다.

## 프로젝트를 돌아보며

처음 시스템을 구축할 때는 서버가 정상적으로 실행되는 것이 가장 중요하다고 생각했다.

하지만 약 2년 동안 실제 서비스를 운영하면서 생각이 달라졌다.

개발 환경에서 정상적으로 동작하는 것과 실제 사용자가 사용하는 서비스를 안정적으로 운영하는 것은 다른 문제였다.

특히 시험처럼 특정 시간에 사용자가 집중되는 환경에서는 평소에는 발견되지 않았던 문제가 실제 운영 중에 나타났다.

이번 프로젝트에서도 시험 중 Database 부하가 증가하면서 Manager Process가 종료되는 문제가 발생했다.

단순히 프로세스를 재시작하는 것으로 대응하지 않고 요청 특성과 Database 부하를 분석했고, MySQL Replication을 적용해 Read와 Write 역할을 분리하는 방식으로 시스템 구조를 개선했다.

또한 장기간 서비스를 운영하면서 자연스럽게 Database Backup, 장애 알림, 서버 관리 자동화, 방화벽 정책 및 Web Application 보안까지 고민하게 되었다.

이 프로젝트는 새로운 서비스를 처음부터 개발한 경험이라기보다,

> 실제 사용자가 존재하는 서비스를 구축하고, 장기간 운영하면서 발생하는 문제를 직접 해결해 나간 경험

이라는 점에서 기억에 남아 있다.
