---
layout: post
title: "Multi-Agent System(MAS)이란?"
date: 2026-08-16
description: >-
  여러 Agent가 역할을 나눠 문제를 푸는 Multi-Agent System 개념과 활용을 정리합니다.
image: /assets/images/covers/multi-agent-system.png
badges:
  - Multi-Agent
---

## 들어가며

ChatGPT와 같은 LLM을 사용하다 보면 대부분 하나의 LLM에게 질문을 전달하고 하나의 답변을 받는다.

```text
User
  ↓
LLM
  ↓
Response
```

하지만 실제 서비스를 만들다 보면 하나의 요청 안에서도 여러 종류의 작업이 필요한 경우가 있다.

예를 들어 사용자가 다음과 같이 요청했다고 해보자.

> "다음 주말에 부산으로 1박 2일 여행을 가려고 하는데, 숙소와 맛집을 찾아서 일정을 만들어줘.”

사람이 이 요청을 처리한다면 단순히 여행 일정을 바로 작성하기보다는 여러 작업을 수행하게 된다.

```text
여행 조건 확인
    ↓
숙소 검색
    ↓
맛집 검색
    ↓
이동 거리 확인
    ↓
일정 구성
    ↓
최종 검토
```

하나의 LLM에게 이 모든 작업을 맡길 수도 있지만, 각각의 작업을 전문적으로 수행하는 여러 개의 Agent로 분리할 수도 있다.

```text
                  User Request
                       │
                       ▼
                 Planner Agent
                  /     |     \
                 /      |      \
                ▼       ▼       ▼
          Hotel Agent Food Agent Place Agent
                 \      |      /
                  \     |     /
                       ▼
                Schedule Agent
                       │
                       ▼
                 Travel Plan
```

이처럼 여러 Agent가 서로 역할을 나누어 하나의 목표를 해결하도록 구성한 시스템을 **Multi-Agent System(MAS)**이라고 한다.

이번 글에서는 LLM 기반 Multi-Agent System이 무엇인지, 그리고 실제 서비스에서는 어떤 형태로 사용할 수 있는지 알아보려고 한다.

---

## Agent란?

먼저 Agent가 무엇인지부터 알아보자.

LLM 기반 시스템에서 Agent는 단순히 LLM 자체만을 의미하지 않는다.

일반적으로 Agent는 특정 목표를 수행하기 위해 LLM을 중심으로 Prompt, Memory, Tool 등을 결합한 하나의 실행 단위라고 볼 수 있다.

```text
Agent
 ├── Role
 ├── LLM
 ├── Prompt
 ├── Memory
 └── Tools
```

예를 들어 날씨를 알려주는 Agent를 만든다고 생각해보자.

LLM 자체는 현재 날씨를 정확하게 알 수 없기 때문에 외부 Weather API가 필요하다.

```text
User
 │
 │ "서울 날씨 알려줘"
 ▼
Weather Agent
 │
 ├── LLM
 │
 └── Weather API
         │
         ▼
      Weather
```

Agent는 사용자의 요청을 이해하고 필요한 Tool을 선택하여 정보를 가져온 뒤, 결과를 다시 사용자에게 전달한다.

즉, **LLM이 무엇을 해야 할지 판단하고, 필요한 도구를 사용하여 목표를 수행하는 구조**라고 생각할 수 있다.

---

## Multi-Agent System은?

그렇다면 Multi-Agent System은 어렵지 않다.

하나의 Agent가 모든 작업을 담당하는 것이 아니라 서로 다른 역할을 가진 여러 Agent가 협력하여 하나의 목표를 수행하는 구조다.

예를 들어 여행 계획 서비스를 만든다고 해보자.

사용자가 다음과 같이 요청한다.

> "이번 주말 서울에서 데이트할 건데 맛집이랑 카페를 포함해서 하루 일정을 만들어줘.”

이를 하나의 Agent가 처리할 수도 있다.

```text
User
 ↓
Travel Agent
 ↓
Restaurant Search
 ↓
Cafe Search
 ↓
Route Planning
 ↓
Schedule
```

하지만 역할을 나눌 수도 있다.

```text
                    User
                     │
                     ▼
                Planner Agent
                     │
          ┌──────────┼──────────┐
          ▼          ▼          ▼
    Restaurant     Cafe       Place
      Agent        Agent      Agent
          │          │          │
          └──────────┼──────────┘
                     ▼
               Schedule Agent
                     │
                     ▼
                Final Plan
```

각 Agent는 서로 다른 역할을 수행한다.

- **Planner Agent**는 사용자의 요청을 분석한다.
- **Restaurant Agent**는 조건에 맞는 음식점을 찾는다.
- **Cafe Agent**는 주변 카페를 찾는다.
- **Place Agent**는 방문할 장소를 찾는다.
- 마지막으로 **Schedule Agent**가 이 결과들을 조합하여 하나의 여행 일정을 만든다.

이것이 가장 직관적인 Multi-Agent System의 형태다.

---

## 왜 하나의 Agent로 하지 않을까?

여기서 한 가지 의문이 생긴다.

> "그냥 ChatGPT한테 전부 시키면 되는 거 아닌가?”

물론 가능하다.

간단한 작업이라면 오히려 하나의 Agent를 사용하는 것이 더 좋을 수도 있다.

하지만 서비스가 복잡해지면 하나의 Agent가 처리해야 하는 책임도 계속 증가한다.

예를 들어 여행 Agent 하나가 다음 기능을 모두 담당한다고 해보자.

```text
Travel Agent
├── Restaurant Search
├── Hotel Search
├── Weather Search
├── Transportation
├── Route Planning
├── Budget Calculation
├── Reservation
└── Schedule Generation
```

처음에는 편하지만 기능이 늘어날수록 Prompt가 복잡해지고 사용할 수 있는 Tool도 많아진다.

반면 역할을 나누면 다음처럼 구성할 수 있다.

```text
Restaurant Agent
 └── Restaurant Search API
Hotel Agent
 └── Hotel Search API
Weather Agent
 └── Weather API
Transport Agent
 └── Map / Transportation API
```

각 Agent가 자신의 역할에 필요한 Tool과 Context만 가지게 되는 것이다.

소프트웨어 구조로 생각하면 하나의 거대한 클래스에 모든 기능을 넣는 것보다 책임에 따라 여러 Component로 분리하는 것과 비슷하다.

---

## 실생활에서는 어디에 사용할 수 있을까?

여행 계획은 가장 이해하기 쉬운 예시지만 MAS는 다양한 서비스에 적용할 수 있다.

### AI 비서

개인 AI Assistant를 만든다고 해보자.

```text
                     Assistant
                         │
          ┌──────────────┼──────────────┐
          ▼              ▼              ▼
     Calendar         Email           Todo
      Agent           Agent           Agent
          │              │              │
          ▼              ▼              ▼
      Calendar         Gmail         Task API
```

사용자가

> "다음 주에 김교수님과 가능한 시간을 찾아서 미팅 일정을 잡고 이메일도 보내줘.”

라고 요청하면 하나의 요청에서 여러 Agent가 동작할 수 있다.

```text
User Request
    ↓
Calendar Agent
    ↓
Available Time
    ↓
Scheduling Agent
    ↓
Calendar Event
    ↓
Email Agent
    ↓
Confirmation Email
```

단순한 챗봇을 넘어 실제 작업을 수행하는 AI Assistant가 되는 것이다.

### 고객 지원

고객 지원 시스템도 좋은 예시다.

사용자가

> "주문한 물건이 아직 도착하지 않았는데 확인해주세요.”

라고 문의했다고 해보자.

```text
Customer
   │
   ▼
Router Agent
   │
   ├── Order Agent
   │      └── Order DB
   │
   ├── Delivery Agent
   │      └── Delivery API
   │
   └── Refund Agent
          └── Payment API
```

Router Agent가 문의 내용을 분석하고 적절한 Agent에게 작업을 전달한다.

배송 문제라면 Delivery Agent가 배송 정보를 확인하고, 환불이 필요하다면 Refund Agent가 후속 작업을 수행하는 방식이다.

### 개발 자동화

개발 과정에서도 MAS를 사용할 수 있다.

예를 들어 GitHub Issue 하나를 기반으로 코드 수정부터 테스트까지 수행하는 시스템을 생각해볼 수 있다.

```text
GitHub Issue
     │
     ▼
Planner Agent
     │
     ▼
Developer Agent
     │
     ▼
Test Agent
     │
     ▼
Review Agent
     │
     ▼
Pull Request
```

각 Agent의 역할을 나누면 다음과 같다.

- **Planner** -> Issue 분석 및 작업 계획 생성
- **Developer** -> 코드 작성 및 수정
- **Tester** -> 테스트 생성 및 실행
- **Reviewer** -> 코드 변경 사항 검토

실제 Software Engineering의 개발 프로세스를 Agent의 역할로 옮긴 형태라고 볼 수 있다.

---

## 여러 Agent는 어떻게 연결할까?

가장 간단한 방법은 이전 Agent의 출력을 다음 Agent의 입력으로 전달하는 것이다.

```python
request = """
서울에서 하루 데이트 코스를 만들어줘.
맛집과 카페를 포함해줘.
"""

plan = planner.run(request)
restaurants = restaurant_agent.run(plan)
cafes = cafe_agent.run(plan)
schedule = schedule_agent.run({
    "plan": plan,
    "restaurants": restaurants,
    "cafes": cafes
})
```

구조로 보면 다음과 같다.

```text
Request
   ↓
Planner
   ↓
Plan
   ├──────────┐
   ▼          ▼
Restaurant   Cafe
Agent        Agent
   │          │
   └────┬─────┘
        ▼
    Schedule
      Agent
        │
        ▼
   Final Result
```

하지만 실제 서비스에서는 Agent가 많아질수록 이런 연결 관계를 직접 관리하기 어려워진다.

그래서 Agent 간의 상태와 실행 흐름을 관리하는 Orchestrator를 두는 경우가 많다.

---

## Orchestrator

Orchestrator는 전체 Agent의 실행 흐름을 관리한다.

```text
                  Orchestrator
                       │
       ┌───────────────┼───────────────┐
       ▼               ▼               ▼
   Weather          Hotel          Restaurant
    Agent            Agent            Agent
       │               │               │
       └───────────────┼───────────────┘
                       ▼
                  Final Result
```

Orchestrator는 현재 상태를 보고

```text
어떤 Agent를 실행할지
        ↓
어떤 정보를 전달할지
        ↓
다음 Agent는 누구인지
        ↓
언제 작업을 종료할지
```

등을 결정한다.

이 구조가 중요한 이유는 실제 MAS가 단순히 여러 LLM을 호출하는 시스템이 아니기 때문이다.

결국 Multi-Agent System을 구현한다는 것은 Agent 간의 Workflow를 설계하는 것과 밀접하게 연결되어 있다.

---

## Sequential과 Parallel

Agent의 실행 방법도 여러 가지가 있다.

가장 간단한 것은 Sequential 방식이다.

```text
Agent A
   ↓
Agent B
   ↓
Agent C
```

앞 Agent의 결과를 다음 Agent가 사용하는 구조다.

예를 들어 개발 자동화라면

```text
Planning
   ↓
Coding
   ↓
Testing
   ↓
Review
```

처럼 자연스럽게 연결할 수 있다.

반면 서로 독립적인 작업이라면 Parallel 방식을 사용할 수도 있다.

```text
               Planner
                  │
       ┌──────────┼──────────┐
       ▼          ▼          ▼
     Hotel     Restaurant   Weather
      Agent       Agent      Agent
       │          │          │
       └──────────┼──────────┘
                  ▼
              Scheduler
```

숙소, 음식점, 날씨 검색은 서로의 결과를 기다릴 필요가 없기 때문에 동시에 수행할 수 있다.

이를 통해 전체 응답 시간을 줄일 수도 있다.

---

## Agent가 많으면 더 좋은 시스템일까?

그렇지는 않다.

Agent 하나를 실행할 때마다 LLM 호출이 발생한다고 생각해보자.

```text
Single Agent
User -> Agent -> Response
LLM Calls: 1
```

반면 MAS는

```text
Planner
   ↓
Restaurant
   ↓
Cafe
   ↓
Schedule
   ↓
Reviewer
LLM Calls: 5+
```

처럼 호출 횟수가 크게 증가할 수 있다.

이는 자연스럽게

```text
Token Usage ↑
API Cost ↑
Latency ↑
System Complexity ↑
```

로 이어진다.

게다가 Agent 하나가 잘못된 결과를 생성하면 그 결과가 다음 Agent에게 전달되면서 오류가 전파될 수도 있다.

```text
Agent A
  │
  │ Wrong Result
  ▼
Agent B
  │
  ▼
Agent C
  │
  ▼
Wrong Final Result
```

따라서 MAS를 설계할 때 중요한 것은 Agent의 개수가 아니다.

> 이 역할을 정말 별도의 Agent로 분리해야 하는가?

를 먼저 생각해야 한다.

---

## 그렇다면 언제 MAS를 사용하는 것이 좋을까?

개인적으로는 하나의 작업 안에 명확하게 분리 가능한 책임이 여러 개 존재할 때 MAS를 고려해볼 수 있다고 생각한다.

예를 들어

```text
여행 계획
├── 숙소 검색
├── 음식점 검색
├── 날씨 확인
└── 일정 생성
```

이나

```text
AI Assistant
├── Email
├── Calendar
├── Todo
└── Search
```

처럼 역할과 사용하는 Tool이 명확하게 구분되는 경우다.

반대로 단순히

> "이 글을 요약해줘.”

와 같은 작업이라면 여러 Agent를 사용할 이유가 크지 않다.

```text
Summarizer
   ↓
Reviewer
   ↓
Critic
   ↓
Judge
```

처럼 필요 이상으로 복잡하게 만드는 것은 오히려 Over-Engineering이 될 수 있다.

---

## 마치며

Multi-Agent System은 단순히 여러 개의 LLM을 동시에 사용하는 기술이 아니다.

오히려 하나의 복잡한 작업을 여러 역할과 책임으로 나누고, 각각의 Agent가 서로 협력하도록 Workflow를 설계하는 방식에 가깝다.

```text
Single Agent
User
 ↓
LLM
 ↓
Result
```

에서

```text
Multi-Agent System
                   User
                    │
                    ▼
               Orchestrator
                    │
         ┌──────────┼──────────┐
         ▼          ▼          ▼
      Agent A    Agent B    Agent C
         │          │          │
         └──────────┼──────────┘
                    ▼
                  Result
```

로 확장되는 것이다.

특히 LLM이 API, Database, Search Engine, Calendar, Email 등 실제 서비스의 여러 Tool과 연결되기 시작하면 하나의 Agent가 모든 책임을 가지는 것보다 역할에 따라 Agent를 분리하는 구조가 유용할 수 있다.

하지만 Agent가 많아진다고 시스템이 무조건 좋아지는 것은 아니다.

Agent가 증가할수록 API 비용과 응답 시간뿐 아니라 상태 관리, 오류 처리, Agent 간 통신 등 Engineering 관점에서 해결해야 할 문제 역시 증가한다.

결국 MAS를 설계할 때 중요한 것은

> "Agent를 몇 개 만들 것인가?”

보다

> "하나의 문제를 어떤 책임으로 나누고, 이 책임들이 어떻게 협력하도록 만들 것인가?”

라고 생각한다.

결국 LLM 기반 Multi-Agent System도 하나의 Software Architecture 문제로 바라볼 수 있지 않을까 싶다.
