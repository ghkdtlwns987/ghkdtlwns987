---
layout: post
title: "게임을 통해 이해하는 Reverse Engineering"
date: 2026-08-16
description: >-
  SW마이스터고 정보보안 강의에서 Cheat Engine과 x64dbg로 게임 Memory·Assembly를 분석하며 Reverse Engineering 기초를 가르친 실습 설계
badges:
  - Essay
series: re-system-hacking
series_order: 1
series_title: "Reverse Engineering → System Hacking"
---

## 들어가며

SW마이스터고등학교에서 정보보안을 강의할 때, Reverse Engineering 입문에서 가장 막히는 지점은 Assembly 문법 자체보다 **실행 중인 프로그램 · Memory · Assembly Code가 어떻게 연결되는지**였다.

그래서 이론 나열 대신, 간단한 게임(피카츄 배구)을 대상으로 학생들이 직접 따라가며 분석할 수 있는 실습을 설계했다.

실습에 사용한 도구는 두 가지다.

| 도구 | 역할 |
|:--|:--|
| Cheat Engine | 실행 중 Process의 Memory 탐색 · 값 확인 |
| x64dbg | Assembly Code · Control Flow 동적 분석 |

실습 흐름은 의도적으로 단계적으로 쌓이게 했다.

1. 화면에 보이는 점수(값)를 Memory에서 찾기  
2. 그 값을 바꾸는 Instruction 추적  
3. Breakpoint로 실행 흐름 분석  
4. 조건 분기를 바꿔 게임 동작 변경  

아래는 그 강의·실습을 어떻게 구성했는지 정리한 내용이다.

## 1. 점수는 어디에 저장될까?

게임 화면의 점수는 결국 Process Memory 어딘가에 있다.  
그래서 학생들에게 먼저 이런 질문을 던졌다.

> 화면에 보이는 이 숫자는 프로그램 내부에서 어디에 저장되어 있을까?

접근 방식은 단순하다. 점수가 `10`이면 Memory에서 `10`을 검색하고, `11`로 바뀌면 다시 검색해 후보를 Address를 좁힌다.

{% include paper-figure.html src="projects/re-pikachu1.png" alt="Cheat Engine을 이용한 Memory Scan" caption="Cheat Engine Memory Scan — 강의 실습 자료" %}

```text
점수 10 검색 → 후보 다수
        ↓
점수 11로 변화 후 재검색
        ↓
점수 Address 식별
```

처음엔 같은 값을 가진 Address가 많지만, 게임 상태를 바꾸며 검색을 반복하면 **점수와 함께 변하는 Address**만 남는다.  
학생들이 “값이 메모리에 있다”는 추상적인 말을 체감하는 첫 단계였다.

## 2. Memory 값을 바꾸면 화면도 바뀔까?

Address를 찾은 뒤에는 반대로 묻는다.

> Memory 값을 직접 바꾸면, 게임 점수도 바뀔까?

{% include paper-figure.html src="projects/re-pikachu2.png" alt="Memory 값 변경 전후" caption="Memory 값 변경 전후 — 강의 실습 예제" %}

실제로 값을 바꾸면 화면 점수도 함께 바뀐다.  
표시되는 UI와 Process Memory가 연결되어 있다는 점을 바로 확인할 수 있다.

```text
Game State  ↔  Process Memory  ↔  Displayed Score
```

여기까지는 **Memory Manipulation**이다.  
그다음 질문으로 실습의 방향을 바꾼다.

> 값을 직접 고치는 게 아니라, 점수가 올라가는 **로직 자체**를 바꿀 수는 없을까?

이 지점부터 x64dbg 동적 분석으로 넘어간다.

## 3. Memory에서 Assembly로

Cheat Engine으로 Address를 찾았다면, 그 Memory에 접근하는 Assembly Instruction을 추적할 수 있다.  
실습에서는 Process에 Attach한 뒤, 찾은 Address와 연결된 Instruction을 따라가도록 했다.

```text
Game → Memory Value → Address → Assembly Instruction → Game Logic
```

학생 입장에서는 “점수”라는 UI 숫자에서 시작해, 결국 그 값을 읽거나 쓰는 Code까지 이어지는 경로를 처음 보는 경험이 된다.

### 점수 증가 Instruction

상대/자신 점수를 다루는 구간은 Offset이 다르게 쓰이는 등, 실제 Binary에서 Instruction과 게임 규칙을 대응시켜 볼 수 있다.  
예를 들어 `inc`는 값을 1 증가시키는 명령이다.

```text
Score → Address → INC → Score + 1
```

문법표만 외울 때보다, **점수가 오르는 순간 Instruction이 실행되는 장면**을 보여주는 편이 훨씬 직관적이었다.

## 4. Breakpoint로 Control Flow 따라가기

다음 질문은 값이 아니라 조건이다.

> 어떤 조건에서 점수가 증가하는가?

피카츄 배구에서는 공이 바닥에 닿으면 Round가 끝나고 한쪽 점수가 오른다.  
내부적으로는 대략 이런 Logic을 가정할 수 있다.

```text
Ball Movement → Ground Collision?
                    ↙ Yes          ↘ No
               Round End          Continue
                    ↓
                 Score + 1
```

Binary만 보고 위치를 바로 알 수는 없다.  
그래서 점수 증가 Instruction 근처부터 Breakpoint를 걸고, `jle` / `jne` 같은 Branch 주변을 따라가며 Control Flow를 추적하도록 실습을 구성했다.

## 5. 조건 분기 바꾸기

Conditional Jump는 비교 결과에 따라 실행 경로를 나눈다.

```text
Compare → Conditional Jump → Path A / Path B
```

Branch나 Jump Target을 바꾸면, 프로그램이 원래와 다른 경로를 탄다.  
실습에서는 Breakpoint로 흐름을 확인한 뒤 Branch를 수정해 게임 동작이 어떻게 달라지는지 확인했다.

이 단계는 단순 값 변경과 성격이 다르다.

| 구분 | 무엇을 바꾸는가 |
|:--|:--|
| Memory Manipulation | 결과 값 |
| Control Flow Modification | 결과를 만드는 Logic |

즉 **결과를 고치는 단계**에서 **결과가 만들어지는 흐름을 고치는 단계**로 넘어간다.

## 6. Script로 정리하고, 예상 밖 동작을 다시 분석하기

Assembly를 손으로만 고치지 않고, 분석 내용을 Script로도 묶어 두었다.

처음 Control Flow 수정에서는 예상과 다른 동작도 나왔다.  
공이 바닥에 닿아도 계속 진행되게 만들었는데, 특정 상황에서는 여전히 종료되는 식이다.  
실습 자료에도 그 케이스를 넣고, Script를 추가 수정하는 과정을 함께 다뤘다.

Reverse Engineering에서는 Instruction 하나로는 전체 동작을 다 설명하기 어렵다.  
실행 결과를 보고 가설을 고치는 반복이 필요하다.

```text
Hypothesis → Breakpoint → Analysis → Modify
     → Unexpected Behavior → Re-analysis → Modify
```

## Memory Manipulation ≠ Reverse Engineering

강의에서 강조한 포인트는 이것이다.  
**값을 바꾸는 것**과 **동작 원리를 분석하는 것**은 다르다.

처음 단계는 Cheat Engine으로 Address를 찾아 값을 바꾸는 Memory Manipulation이다.  
이후 질문은 이렇게 바뀐다.

- 이 값은 어디에서 바뀌는가?  
- 어떤 Instruction이 실행되는가?  
- 왜 그 Instruction이 실행되는가?  
- 어떤 조건으로 그 경로에 들어오는가?  
- 조건을 바꾸면 프로그램은 어떻게 동작하는가?

실습 전체 흐름은 대략 다음과 같다.

```text
Memory Search
 → Memory Modification
 → Instruction Analysis
 → Breakpoint
 → Control Flow Analysis
 → Conditional Branch Analysis
 → Behavior Modification
```

## 강의를 돌아보며

이 실습의 목표는 학생들이 Reverse Engineering의 **사고 과정**을 처음 경험하게 하는 것이었다.

화면의 점수에서 시작해 Memory → Instruction → Breakpoint → Control Flow까지 이어가며, 프로그램 내부를 읽는 감각을 익히게 했다.

특히 강조한 전환은 이것이다.

> “이 값이 어디에 있는가?” → “이 값은 왜 이렇게 바뀌는가?”

Assembly를 암기시키기보다, `mov` / `inc` / Conditional Jump / Register가 **실제 동작과 어떻게 연결되는지**를 보게 하는 편이 효과적이었다.  
작은 수정이 전체 동작에 미치는 영향도 바로 확인할 수 있다.

시스템 해킹·악성코드 분석으로 넘어가도 결국 Memory, Assembly, Register, Control Flow 이해가 기반이 된다.  
그 기초를 게임이라는 익숙한 소재로 풀었던 강의·실습으로 기억에 남아 있다.

## 강의 자료

실습에 사용한 Reverse Engineering Overview 자료를 아래에 올려 두었다.

[Reverse Engineering Overview.pdf]({{ '/assets/documents/reverse-engineering-overview.pdf' | relative_url }})

다음 글에서는 Register · Stack · Calling Convention을 이어 **Stack Buffer Overflow**로 System Hacking 기초를 정리한다.
