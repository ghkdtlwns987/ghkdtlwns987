---
layout: post
title: "Software Engineering이란?"
date: 2026-08-16
description: |
  Software Engineering이라는 이름에는 왜 Engineering이 붙었을까? 소프트웨어 공학이 무엇을 고민하는 분야인지 알아본다.
badges:
  - Essay
---

## 들어가기 전
최근 주변 사람들과 이야기를 나누다 보면 **Software Engineering(SE)**을 단순히 소프트웨어를 개발하는 것으로 이해하는 경우가 많은 것 같다.

물론, Software Engineering은 소프트웨어 개발과 밀접하게 연관되어 있고, 실제로 개발 과정에서 접하는 많은 활동을 포함하고 있기 때문에 그렇게 이해하는 것도 자연스럽다고 생각한다.

하지만 Software Engineering에서 말하는 Engineering은 단순히 코드를 작성하고 프로그램을 개발하는 것보다 조금 더 넓은 의미를 가지고 있다.

그렇다면 Software Engineering은 정확히 무엇을 의미하고, 단순한 Software Development와는 어떤 차이가 있을까?

이번 글에서는 이러한 궁금증에서 시작하여 Software Engineering이 무엇을 중요하게 생각하는 분야인지 간단하게 정리해보려고 한다.

## 들어가며
**Software Engineering(소프트웨어 공학)**이라는 말을 처음 들으면 단순히 소프트웨어를 개발하는 것이라고 생각하기 쉽다.

하지만 이름을 조금 자세히 살펴보면 Software + Engineering이라는 두 단어가 결합되어 있다.

```text
Software(소프트웨어) + Engineering(공학))
```
그렇다면 먼저 Software는 왜 만들까?

개인적으로 Software의 가장 중요한 목적 중 하나는 사람이 직접 해야 하는 일을 줄이고, 반복되는 작업을 자동화하여 현실의 문제를 해결하는 것이라고 생각한다.

사람이 매번 직접 계산하던 것을 프로그램이 대신 계산하고, 수작업으로 데이터를 정리하던 것을 시스템이 자동으로 처리하며, 여러 사람이 반복적으로 수행하던 업무를 하나의 서비스가 대신할 수 있다.

결국 Software를 만드는 목적은 단순히 코드를 작성하는 것 자체에 있는 것이 아니라, 현실의 문제를 소프트웨어를 통해 해결하는 것에 가깝다.

그런데 해결하려는 문제가 복잡해지고 소프트웨어의 규모가 커지면, 단순히 프로그램이 동작하는 것만으로는 충분하지 않게 된다.

사용자가 늘어나고, 요구사항이 계속 변경되며, 여러 개발자가 하나의 시스템을 함께 수정하고, 예상하지 못한 장애도 발생한다.

바로 이 지점에서 Engineering이 필요해진다.

그렇다면 프로그램을 단순히 개발하는 것과 소프트웨어를 공학적으로 만든다는 것에는 어떤 차이가 있을까?  

이번 글에서는 Software Engineering의 세부 분야를 하나씩 설명하기보다는, Software Engineering에서는 무엇을 중요하게 생각하고 어떤 문제를 해결하려 하는지에 대해 정리해보려고 한다.

---

## Software + Engineering

Software는 우리가 흔히 작성하는 Code만을 의미하지 않는다.

실제 소프트웨어는 코드뿐만 아니라 데이터베이스, API, 인프라, 테스트, 문서 등 다양한 요소가 함께 동작하는 하나의 System에 가깝다.


```text
Software System
├── Source Code
├── Database
├── API
├── Infrastructure
├── Test
└── Documentation
```

그렇다면 Engineering은 무엇일까?

Engineering의 핵심은 단순히 무언가를 만드는 데 있지 않다.

`주어진 요구사항과 현실적인 제약 속에서 신뢰할 수 있는 결과물을 체계적인 방법으로 만들어내는 것`에 가깝다.

이 두 가지를 합치면 Software Engineering을 조금 다르게 바라볼 수 있다.

Software Engineering은 단순히 동작하는 프로그램을 만드는 것이 아니라, 신뢰할 수 있는 소프트웨어를 체계적으로 만들고 유지하기 위한 분야다.

즉, 중요한 것은 단순히

`"어떻게 코드를 작성할 것인가?"`

가 아니다.

오히려

`어떻게 좋은 소프트웨어를 지속적으로 만들어낼 것인가?"`

라는 질문에 조금 더 가깝다.

---
## 동작하는 코드가 좋은 Software 일까?
만약 2개의 프로그램이 있다고 해보자.
```text
Software A 
정상 동작(O)
테스트코드 없음(X)
유지보수 어려움(X)
재현 불가(X)
보안 문제(X)
```

```text
Software A 
정상 동작(O)
테스트코드 없음(O)
유지보수 어려움(O)
재현 불가(O)
보안 문제(O)
```

현재 시점에서는 둘 다 동일한 결과를 출력할 수 있다.

Programming의 관점에서는 두 프로그램 모두 문제를 해결했다고 볼 수도 있다.

하지만 Software Engineering의 관점에서는 조금 다른 질문을 하게 된다.

- 1년 뒤에도 쉽게 수정할 수 있을까?
- 개발자가 바뀌어도 이해할 수 있을까?
- 사용자가 100배 증가해도 동작할까?
- 코드가 재현 가능한가??
- 새로운 기능을 추가했을 때 기존 기능이 깨지지 않을까?

결국 "동작하는 소프트웨어”와 "잘 만들어진 소프트웨어”는 반드시 같은 의미가 아니다.

Software Engineering은 바로 이 차이를 다루는 분야라고 생각한다.

---

## Software Engineering은 결국 복잡성을 다룬다

Software Engineering이 필요한 가장 근본적인 이유 중 하나는 Complexity라고 생각한다.

작은 프로그램은 혼자서 전체 코드를 이해할 수 있다.

```text
Developer
   ↓
  Code
```

하지만 시스템이 커지기 시작하면 이야기가 달라진다.

```text
                  Software System
                         │
        ┌────────────────┼────────────────┐
        ▼                ▼                ▼
     Team A           Team B           Team C
        │                │                │
    Service A        Service B        Service C
```

코드가 많아지고, 여러 개발자가 참여하고, 수많은 Component가 연결되고, 요구사항은 계속 변경된다.

그리고 시간이 지나면서 기존에 작성한 코드 위에 새로운 코드가 계속 쌓인다.

따라서 Software Engineering에서 사용하는 많은 기술을 살펴보면 결국 복잡성을 통제하기 위한 방법이라는 공통점을 발견할 수 있다.

```text
Abstraction
Architecture
Modularity
Testing
Code Review
Version Control
CI/CD
Documentation
Monitoring
```

좋은 Architecture를 고민하는 것도,

Test를 작성하는 것도,

Code Review를 하는 것도,

문서를 남기는 것도,

결국 사람이 감당하기 어려워지는 소프트웨어의 복잡성을 관리하기 위한 방법이라고 볼 수 있다.

---

## Software Engineering에서는 정답보다 Trade-off가 중요하다

Software Engineering을 공부하거나 실제 시스템을 설계하다 보면 재미있는 점이 하나 있다.

많은 문제에는 절대적인 정답이 없다.

예를 들어 어떤 시스템을 설계할 때

```text
Monolith vs Microservices
SQL vs NoS
## 동작하는 코드가 좋은 Software일까?

두 개의 프로그램이 있다고 해보자.

```text
Software A
✓ 정상적으로 동작함
✗ 테스트 없음
✗ 수정하기 어려움
✗ 장애 원인을 찾기 어려움
✗ 보안 문제 존재
```

그리고 다른 프로그램은 다음과 같다.

```text
Software B
✓ 정상적으로 동작함
✓ 테스트 가능
✓ 유지보수 가능
✓ 장애 추적 가능
✓ 보안 고려
Consistency vs Availability
Performance vs Maintainability
Development Speed vs Technical Debt
```

처럼 여러 선택지가 존재한다.

어떤 선택이 항상 옳다고 말하기 어렵다.

사용자 수가 적은 서비스에 복잡한 Microservice Architecture를 적용하는 것이 오히려 좋지 않은 선택일 수도 있고, 빠르게 검증해야 하는 프로토타입에서 완벽한 Architecture를 만드는 것 역시 비효율적일 수 있다.

따라서 Software Engineering에서는

`"어떤 기술이 가장 좋은가?"`

보다

`"현재 문제와 제약 조건에서 어떤 선택이 가장 적절한가?`

를 판단하는 능력이 중요하다.

결국 Engineering은 선택의 연속이고, 좋은 Software Engineer는 단순히 많은 기술을 아는 사람이 아니라 각 선택의 Trade-off를 이해하고 설명할 수 있는 사람이라고 생각한다.

---

## 실패를 가정하는 것도 Engineering이다

Software Engineering에서 개인적으로 중요하다고 생각하는 또 하나의 관점은 Failure를 자연스럽게 받아들이는 것이다.

실제 시스템에서는 언제든 문제가 발생할 수 있다.

```text
Server can fail.
Network can fail.
Database can fail.
Deployment can fail.
Human can make mistakes.
```

따라서 중요한 것은

`어떻게 하면 절대로 실패하지 않을까?"`

만을 고민하는 것이 아니다.

오히려

`"실패했을 때 시스템이 어떻게 동작해야 하는가?"`

까지 고민하는 것이 Engineering에 가깝다.

좋은 시스템은 반드시 실패하지 않는 시스템이라기보다, 실패를 예상하고 실패했을 때 적절하게 대응할 수 있도록 설계된 시스템에 더 가깝다.

---

## Software Engineering을 연구한다는 것

Software Engineering은 단순히 개발 방법을 배우는 분야만은 아니다.

실제로 Software Engineering 연구에서는

```text
Software Testing
Program Analysis
Program Repair
Code Generation
Bug Detection
Software Security
Mining Software Repositories
AI for Software Engineering
```

등 굉장히 다양한 문제를 다룬다.

분야는 서로 달라 보이지만 궁극적으로는 비슷한 질문으로 연결된다.

`"소프트웨어를 더 정확하고, 신뢰할 수 있고, 효율적으로 만들려면 어떻게 해야 할까?"`

최근에는 LLM의 발전으로 Code Generation, Program Repair, Bug Detection, Test Generation 등 기존 Software Engineering 문제를 AI로 해결하려는 **AI for Software Engineering(AI4SE)** 연구 역시 활발하게 이루어지고 있다.

하지만 사용하는 기술이 LLM이든 Static Analysis든 새로운 Testing 기법이든 결국 중요한 것은 기술 자체가 아니다.

`실제 Software Engineering의 어떤 문제를 해결하고 있는가?`

연구에서도 이 질문을 놓치지 않는 것이 중요하다고 생각한다.

---

## 마치며

Software Engineering을 한 문장으로 정의하는 것은 생각보다 어렵다.

Requirements, Design, Testing, Maintenance 등 수많은 분야를 포함하고 있기 때문이다.

하지만 개인적으로 Software Engineering을 관통하는 생각은 비교적 단순하다고 생각한다.

`동작하는 코드를 넘어, 신뢰할 수 있는 소프트웨어를 어떻게 지속적으로 만들어낼 것인가?`

이를 위해 복잡성을 관리하고,

실패를 예상하고,

여러 선택 사이의 Trade-off를 고민하며,

변화하는 요구사항 속에서도 시스템이 지속적으로 유지될 수 있도록 만든다.

그래서 Software Engineering에서 중요한 질문은

```text
"Does it work?"
```

에서 끝나지 않는다.

한 걸음 더 나아가

```text
"Will it keep working?"
"Can we understand it?"
"Can we change it?"
"Can we trust it?"
```

까지 질문하게 된다.

어쩌면 이러한 질문을 계속 던지는 것 자체가 Software에 Engineering이라는 단어가 붙은 이유가 아닐까 싶다.
