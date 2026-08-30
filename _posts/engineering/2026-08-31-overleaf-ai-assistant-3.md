---
layout: post
title: "Overleaf AI Assistant 만들기 - 3"
date: 2026-08-31
description: >-
  사이드바를 오가는 대신, 선택한 LaTeX 바로 위에서 질문하고 답변을 받을 수 있는 Ask AI 인터페이스를 만든 과정
badges:
  - Essay
series: overleaf-ai-assistant
series_order: 3
series_title: "Overleaf AI Assistant 만들기"
---

## 들어가며

[2편](/engineering/2026-08-31-overleaf-ai-assistant-2/)까지 만들면서 Overleaf 안에서 실제 LLM을 사용할 수 있게 됐다.

문장을 선택하고, Polish나 Review를 실행하고, 결과를 다시 Apply하는 것까지 가능했다.

기능적으로는 처음 생각했던 Assistant에 꽤 가까워졌다.

그런데 실제 논문을 수정하면서 사용해보니 새로운 불편함이 보였다.

AI가 여전히 내가 글을 쓰고 있는 곳에서 조금 멀리 있었다.

이번에는 기능을 더 추가하기보다, **AI를 사용하는 위치 자체**를 바꿔보기로 했다.

## 문제: Overleaf 안에서도 작업 흐름은 끊겼다

기존에는 문장을 선택하면 오른쪽 Sidebar에서 AI 기능을 사용했다.

```text
문장 선택
    ↓
Sidebar로 시선 이동
    ↓
Action 선택
    ↓
결과 확인
    ↓
Apply
    ↓
Editor로 복귀
```

ChatGPT와 Overleaf를 오갈 필요는 없어졌지만, 짧은 문장 하나를 수정할 때도 Editor와 Sidebar를 계속 오가야 했다.

특히 논문을 읽다가

- 이 표현이 너무 강한가?
- 이 문장 조금 더 자연스럽게 바꿀 수 있을까?
- Reviewer가 이 부분을 공격하지 않을까?

같은 생각이 들었을 때는 고정된 Polish, Review 버튼보다 **선택한 문장에 바로 질문**할 수 있는 방식이 더 자연스럽다고 느꼈다.

그래서 Sidebar의 기능을 늘리는 대신 다른 방향을 선택했다.

AI 창으로 이동하지 말고, **지금 보고 있는 문장에서 바로 AI를 호출**하자.

## 목표: 선택한 문장 바로 위에서 질문하기

원하는 흐름은 단순했다.

```text
LaTeX 선택
    ↓
✨ Ask AI
    ↓
질문
    ↓
Answer
    ↓
Apply
```

사용자가 문장을 드래그하면 선택 영역 근처에 **✨ Ask AI**가 나타난다.

버튼을 누르면 Sidebar를 열지 않고 작은 패널에서 바로 질문할 수 있도록 했다.

![Ask AI — Improve 질문과 Answer]({{ '/assets/images/engineering/overleaf-ai-ask-improve-writing.png' | relative_url }})

직접 질문을 입력할 수도 있고, 자주 사용하는 작업은 Quick Action으로 실행할 수 있게 했다.

LLM 호출 자체는 2편에서 만든 구조를 그대로 사용했다.

결국 이번 버전에서 바꾼 것은 모델이 아니라 **모델을 호출하는 인터페이스**였다.

## 여러 문장을 동시에 검토할 수 있게 만들기

Ask AI를 사용하다 보니 또 하나 필요한 기능이 생겼다.

논문을 검토할 때 하나의 질문이 끝날 때까지 기다렸다가 다음 문장을 보는 경우는 많지 않았다.

한 문장을 Review에 넣어두고 다른 문장을 읽다가 또 궁금한 부분을 발견할 수 있었다.

그래서 Ask AI 창을 닫아버리는 대신 **pill** 형태로 최소화하도록 만들었다.

```text
[Ask AI - 1]  [Ask AI - 2]  [Ask AI - 3]
```

각 Ask AI는 질문을 시작한 시점의 선택 영역을 기억한다.

따라서 다른 문장을 선택해도 기존 질문이 어느 문장을 대상으로 했는지 유지된다.

![Ask AI 다중 세션 — 에디터 하이라이트 + Review]({{ '/assets/images/engineering/overleaf-ai-ask-multi-session-review.png' | relative_url }})

필요할 때 pill을 다시 누르면 해당 질문과 답변을 이어서 확인할 수 있다.

## 어느 문장에 질문했는지도 보여주기

여러 Ask AI를 동시에 열 수 있게 하니, 각 질문이 **어느 문장에 대한 것인지** 구분할 필요가 생겼다.

처음에는 선택 영역 위에 점선 박스를 직접 그리는 방식을 사용했다.

하지만 에디터를 스크롤하거나 레이아웃이 변경될 때마다 위치를 다시 계산해야 했고, 실제 텍스트와 박스의 좌표가 어긋나는 문제가 계속 발생했다.

결국 외부에 박스를 그리는 대신 **CodeMirror 내부에서 해당 범위를 배경 하이라이트**하도록 변경했다.

```text
Ask AI - 2
      │
      └──────────────┐
                     ▼
CRAFT achieves the highest P-C ...
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
          Highlight
```

필요하지 않을 때는 방해되지 않도록 Highlight를 ON/OFF할 수 있게 했다.

Ask AI 내부에서도 **Answer**와 **Request**를 분리해, 모델에게 무엇을 보냈고 어떤 답변을 받았는지 확인할 수 있도록 했다.

## 결과

이번 버전부터 AI를 사용하는 위치가 Sidebar에서 Editor로 이동했다.

**Before**

```text
Editor ───────────────→ Sidebar
                         AI
                         ↓
Editor ←─────────────── Apply
```

**After**

```text
Editor
  │
  ├─ Select
  │    ↓
  │  ✨ Ask AI
  │    ↓
  │  Answer
  │    ↓
  └─ Apply
```

새로운 모델을 추가하거나 Prompt를 크게 변경한 것은 아니다.

대신 실제 논문을 수정하면서 반복적으로 발생했던 **시선 이동과 context switching**을 줄이는 것에 집중했다.

## 구현하면서 느낀 점

이번 버전에서는 모델을 개선하지 않았는데도 사용감의 차이가 생각보다 컸다.

2편까지는 “Overleaf에서 AI를 사용할 수 있다”는 것에 의미가 있었다면, 이번에는 조금 더 **Overleaf의 일부처럼** AI를 사용할 수 있게 만드는 것에 가까웠다.

특히 직접 사용해보면서 기능의 개수보다 중요한 것이, **기능에 도달하기 위해 사용자가 현재 작업을 얼마나 벗어나야 하는가**라는 생각이 들었다.

처음에는 **Overleaf ↔ ChatGPT**라는 큰 이동을 없애는 것이 목표였다.

그걸 없애고 나니 이번에는 **Editor ↔ Sidebar**라는 더 작은 이동이 보였다.

그래서 Ask AI는 새로운 AI 기능이라기보다, **기존 기능을 사용자가 실제로 글을 작성하는 위치까지 가져온 변화**라고 생각한다.

물론 pill, highlight, floating panel을 추가하면서 UI 쪽 코드가 이전보다 복잡해졌다. 특히 화면 좌표를 따라다니는 점선 박스보다 에디터 자체의 highlight를 사용하는 것이 훨씬 안정적이라는 것도 직접 시행착오를 겪으며 알게 됐다.

아직 UI는 다듬을 부분이 많지만, 적어도 처음 원했던 경험에는 더 가까워졌다.

**문장을 읽다가 궁금하면, 그 문장에서 바로 묻는다.**

## 아직 남아 있는 문제

Ask AI까지 만들면서 질문하고 수정하는 과정은 상당히 자연스러워졌다.

하지만 Apply에는 여전히 마음에 걸리는 부분이 있었다.

현재 방식에서는 AI가 제안한 문장을 적용하면 **기존 문장이 그대로 교체**된다.

```latex
% Before
CRAFT achieves strong performance.

% Apply 후
CRAFT consistently achieves strong performance.
```

수정 자체는 정상적이지만, 논문을 Revision하는 상황에서는 **어디가 어떻게 변경되었는지** 확인하기 어렵다.

특히 여러 문장을 AI로 수정하기 시작하면 원문과 수정본을 비교하는 과정도 중요해진다.

그래서 다음 버전에서는 Apply의 의미를 조금 바꿔보기로 했다.

## 마치며

3편에서는 Sidebar에 새로운 기능을 추가하는 대신 **AI를 사용하는 위치**를 바꿨다.

```text
Sidebar AI  →  Inline Ask AI
```

선택한 LaTeX 바로 위에서 질문하고, 여러 질문을 pill로 남기고, 각 질문이 가리키는 영역을 Editor에서 확인할 수 있도록 만들었다.

결과적으로 AI를 사용하기 위해 현재 작성하고 있는 문장에서 벗어나는 횟수가 줄었다.

그리고 직접 사용하다 보니 다음 문제도 자연스럽게 보였다.

AI가 수정한 결과를 적용하는 것만큼, **무엇이 수정됐는지를 남기는 것**도 중요했다.

다음 편에서는 기존 문장을 바로 덮어쓰는 대신, 원문과 Suggested Revision을 함께 남길 수 있는 Apply 방식을 만들어본다.

→ [Overleaf AI Assistant 만들기 - 4](/engineering/2026-08-31-overleaf-ai-assistant-4/)
