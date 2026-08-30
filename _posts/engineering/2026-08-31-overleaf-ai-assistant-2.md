---
layout: post
title: "Overleaf AI Assistant 만들기 - 2"
date: 2026-08-31
description: >-
  stub을 실제 LLM으로 교체하고, CodeMirror 6와 스트리밍까지 연결해 Overleaf 안에서 AI를 사용할 수 있게 만든 과정
badges:
  - Essay
series: overleaf-ai-assistant
series_order: 2
series_title: "Overleaf AI Assistant 만들기"
---

## 들어가며

{% include post-series-part-link.html order=1 label="1편" markdown=true %}에서는 실제 LLM을 연결하지 않고 **Select → Action → Preview → Apply** 흐름부터 만들었다.

이번에는 stub을 실제 LLM으로 교체했다.

단순히 API만 연결하면 될 것 같았지만, 실제 Overleaf에서 사용하려면 **CodeMirror 6 연동**, **액션별 결과 처리**, **긴 응답의 대기 UX**도 함께 해결해야 했다.

## 어떤 문제가 있었나

먼저 특정 모델에만 종속되고 싶지 않았다.

OpenAI뿐 아니라 OpenRouter나 로컬 LLM도 사용할 수 있도록 OpenAI-compatible API를 기준으로 Provider를 분리했다.

```text
Extension
    ↓
API Layer
    ├─ OpenAI
    ├─ OpenRouter
    └─ Custom / Local
```

더 큰 문제는 Overleaf의 에디터였다.

최신 Overleaf는 CodeMirror 6(CM6)를 사용하는데, Chrome Extension의 content.js는 **isolated world**에서 실행되기 때문에 페이지 내부의 EditorView에 직접 접근하기 어려웠다.

또한 LLM 결과도 모두 같은 방식으로 처리할 수 없었다.

Polish와 Shorten은 결과 자체가 수정된 LaTeX지만, Review는 분석 내용과 Suggested Rewrite가 함께 반환된다. 따라서 Review 전체를 그대로 Apply해서는 안 됐다.

## 어떻게 개선했나

먼저 LLM 설정을 Extension에서 변경할 수 있도록 했다.

Provider와 Model, API Key를 설정할 수 있고, Custom endpoint를 통해 OpenAI-compatible API도 사용할 수 있도록 구성했다.

![AI Paper Copilot — Settings, Review + Score, CM6 배지]({{ '/assets/images/engineering/overleaf-ai-copilot-v03-settings.png' | relative_url }})

Prompt도 액션마다 역할을 나눴다.

- **Polish** — 학술적인 문장으로 수정
- **Shorten** — 의미를 유지하면서 압축
- **Review** — Reviewer 관점에서 분석
- **LaTeX Check** — LaTeX 구조 확인
- **Citation Check** — Citation과 Claim 점검

특히 LaTeX를 수정할 때 `\cite`, `\ref`, label, 수치 결과처럼 **모델이 임의로 변경해서는 안 되는 부분**을 Prompt에 명시했다.

Apply 방식도 결과에 따라 구분했다.

| 액션 | Apply |
|------|-------|
| Polish / Shorten | 결과 전체 Apply |
| Review / LaTeX Check | Suggested Rewrite만 Apply |

단순히 LLM 응답을 문자열 하나로 처리하는 대신, **분석을 위한 결과**와 **실제 문서에 들어갈 결과**를 구분했다.

## CodeMirror 6 연결

CM6 문제는 작은 bridge를 두는 방식으로 해결했다.

```text
Sidebar
   ↕
content.js
   ↕
MAIN-world Bridge
   ↕
Overleaf CM6
```

Overleaf 페이지와 같은 context에서 동작하는 bridge가 실제 에디터와 통신하도록 했다.

선택한 문장은 CM6에서 읽어오고, Apply할 때는 `view.dispatch()`를 통해 해당 영역만 변경한다.

기존 CM5와 CM6의 차이는 bridge 내부에서 처리하고, 나머지 Extension에서는 어떤 에디터가 사용되는지 신경 쓰지 않도록 했다.

## Streaming도 추가했다

실제 LLM을 연결하니 Review처럼 긴 응답에서는 기다리는 시간이 생각보다 길게 느껴졌다.

그래서 전체 응답이 끝난 뒤 한 번에 보여주는 대신 **streaming**을 적용했다.

```text
LLM → chunk → background.js → Sidebar
```

모델이 생성하는 내용을 바로 보여주니, 실제 응답 시간이 크게 달라지지 않아도 **체감 대기 시간**이 줄었다.

단순한 API 옵션이라고 생각했던 Streaming이, 실제로는 사용자에게 **작업이 진행되고 있다는 feedback** 역할을 했다.

## 결과

이제 stub 대신 실제 모델을 이용해 Overleaf 안에서 다음 흐름을 사용할 수 있게 됐다.

```text
LaTeX 선택
    ↓
Polish / Review / ...
    ↓
LLM
    ↓
Streaming Response
    ↓
Preview
    ↓
Apply
```

OpenAI뿐 아니라 OpenAI-compatible Provider를 선택할 수 있고, CM6에서도 선택과 Apply가 정상적으로 동작한다.

1편에서 만든 편집 루프에 실제 AI가 들어오면서, 처음 생각했던 **Overleaf 안에서 끝나는 AI Assistant**가 기능적으로 만들어졌다.

## 느낀 점

처음에는 이번 작업을 단순히 stub을 API 호출로 바꾸는 일이라고 생각했다.

하지만 실제로 만들어보니, **모델을 호출하는 것**보다 **모델과 에디터를 기존 흐름에 어떻게 연결할 것인가**가 더 중요한 문제였다.

특히 Overleaf와 LLM Provider처럼 내가 통제할 수 없는 부분을 직접 연결하지 않고, **bridge**와 **API layer** 뒤에 분리해 둔 것이 도움이 됐다.

또 LLM의 결과도 모두 같은 문자열로 취급하면 안 된다는 것을 느꼈다. Review는 사람이 읽기 위한 분석이고, Suggested Rewrite는 문서에 들어갈 결과다. **같은 모델 출력**이라도 어디에 사용되는 결과인지에 따라 다르게 다뤄야 했다.

## 다음

기능적으로는 처음 원했던 형태가 만들어졌지만, 직접 사용해보니 또 다른 불편함이 보였다.

문장을 선택한 뒤 AI를 사용하려면 여전히 **오른쪽 Sidebar로 시선을 옮겨야** 했다.

```text
Editor → Sidebar → Editor
```

Overleaf와 외부 AI를 오가는 문제는 해결했지만, Overleaf 안에서도 **작은 context switching**이 남아 있었다.

그래서 다음에는 AI를 Sidebar가 아니라 **지금 선택한 문장 바로 옆**으로 가져오기로 했다.
