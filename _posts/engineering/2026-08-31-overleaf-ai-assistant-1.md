---
layout: post
title: "Overleaf AI Assistant 만들기 - 1"
date: 2026-08-31
description: >-
  논문 작성 흐름을 끊지 않고 AI를 활용하기 위해, Overleaf에서 선택한 LaTeX를 검토하고 다시 적용할 수 있는 Chrome Extension을 만든 과정
badges:
  - Essay
series: overleaf-ai-assistant
series_order: 1
series_title: "Overleaf AI Assistant 만들기"
---

## 들어가며

논문을 작성하면서 ChatGPT를 자주 사용한다.

영어 문장을 다듬거나, 긴 문장을 줄이고, LaTeX나 Citation을 확인하거나, Reviewer 관점에서 작성한 문단을 다시 검토할 때 유용하다.

그런데 반복해서 사용하다 보니 모델의 성능과는 별개로 불편한 점이 있었다.

**논문을 작성하는 곳과 AI를 사용하는 곳이 분리되어 있었다.**

```text
Overleaf에서 문장 선택
        ↓
Copy
        ↓
ChatGPT
        ↓
Prompt 작성
        ↓
결과 Copy
        ↓
Overleaf
        ↓
원래 위치를 찾아 Paste
```

한두 번은 괜찮지만 논문 전체를 수정하다 보면 이 과정을 계속 반복하게 된다.

그래서 생각했다.

**AI를 사용하기 위해 논문 작성 흐름을 벗어나지 않게 할 수 없을까?**

이 생각에서 Overleaf AI Assistant를 만들기 시작했다.

## 무엇을 만들고 싶었나

목표는 단순했다.

**Select → Action → Preview → Apply**

Overleaf에서 LaTeX를 선택하고 원하는 작업을 실행한 뒤, 결과가 괜찮으면 바로 원래 위치에 적용한다.

초기에는 논문을 작성하면서 자주 사용하는 기능 다섯 개만 넣었다.

- **Polish** — 학술적인 문장으로 다듬기
- **Shorten** — 의미를 유지하면서 압축
- **Review** — Reviewer 관점에서 검토
- **LaTeX Check** — LaTeX 구조 확인
- **Citation Check** — Citation과 Claim 점검

Chrome Extension은 Manifest V3를 사용했고 역할을 간단하게 나눴다.

```text
Overleaf Editor
      ↕
  content.js
      ↕
Sidebar
      ↕
background.js
```

`content.js`가 Overleaf 에디터와 연결되고, Sidebar는 사용자 인터페이스를 담당한다. `background.js`는 이후 LLM을 연결할 수 있도록 AI 요청을 담당하게 했다.

## 그런데 LLM부터 연결하지 않았다

처음에는 OpenAI API부터 붙이려고 했다.

하지만 생각해보니 이 Extension에서 더 먼저 확인해야 할 것이 있었다.

**AI가 수정한 결과를 사용자가 선택했던 정확한 위치에 다시 넣을 수 있는가?**

LLM과 에디터 연동을 동시에 만들면 결과가 이상할 때 원인을 구분하기 어려워진다.

```text
Prompt 문제?
API 문제?
선택 영역 문제?
Apply 위치 문제?
```

그래서 첫 버전에서는 의도적으로 실제 LLM을 사용하지 않고 **stub response**를 반환하도록 했다.

```text
Selected LaTeX
      ↓
Action
      ↓
Stub Response
      ↓
Preview
      ↓
Apply
```

모델 품질을 제외하고 **Editor → Extension → Editor** 흐름부터 검증하고 싶었다.

## 선택한 문장을 어떻게 다시 찾을까?

Apply를 구현하면서 중요한 것은 선택한 문자열뿐만 아니라 **선택한 위치**라는 것을 알게 됐다.

예를 들어 논문에 같은 문장이 두 번 있다면,

```text
CRAFT achieves strong performance.
...
CRAFT achieves strong performance.
```

문자열만 저장해서는 어느 문장을 수정해야 하는지 알 수 없다.

그래서 선택한 text와 함께 CodeMirror의 cursor range를 저장했다.

```javascript
selection = {
  text: selectedText,
  from: editor.getCursor("from"),
  to: editor.getCursor("to")
};
```

그리고 Apply할 때 저장해둔 범위만 교체했다.

```javascript
editor.replaceRange(
  revisedText,
  selection.from,
  selection.to
);
```

즉,

- **What was selected?** → text
- **Where was selected?** → range

를 하나의 selection state로 관리했다.

이렇게 하니 문서 전체에서 문자열을 다시 검색할 필요 없이, **사용자가 실제로 선택했던 영역만** 수정할 수 있었다.

## 결과

첫 번째 버전에서는 실제 AI 없이 다음 흐름을 완성했다.

```text
LaTeX 선택 → Action → 결과 확인 → Apply → 선택했던 영역 수정
```

![AI Paper Copilot v0.2.0 사이드바]({{ '/assets/images/engineering/overleaf-ai-copilot-sidebar.png' | relative_url }})

Chrome Extension으로 등록해 실제 Overleaf에서도 동작하는 것을 확인했다.

![Chrome Extension 0.2.0 설치 화면]({{ '/assets/images/engineering/overleaf-ai-extension-installed.png' | relative_url }})

아직 LLM도 없고 UI도 단순하지만, 이 버전에서 확인하고 싶었던 것은 **Overleaf와 AI 사이를 연결할 편집 루프를 만들 수 있는가**였다.

## 느낀 점

처음에는 AI Assistant를 만든다고 하니 자연스럽게 어떤 모델을 사용할지, Prompt를 어떻게 작성할지를 먼저 생각했다.

그런데 직접 만들어보니 **모델보다 먼저 해결해야 할 문제**가 있었다.

아무리 좋은 결과를 생성해도 엉뚱한 위치에 적용된다면 사용할 수 없는 도구다.

특히 이번에 구현하면서 **선택한 내용과 선택한 위치는 서로 다른 상태**라는 점이 인상적이었다. 단순한 문자열 처리라고 생각했지만, 실제 Editor와 연결되면서 상태를 어떻게 기억하고 복원할지가 중요한 문제가 됐다.

LLM을 일부러 늦게 붙인 것도 도움이 됐다.

```text
Editor → Extension → Editor
```

를 먼저 확인했기 때문에, 다음 단계에서는 여기에 LLM만 추가하면 된다.

기능을 한꺼번에 붙이는 것보다 **가장 중요한 흐름을 먼저 만들고 외부 의존성을 하나씩 추가**하는 편이 문제를 찾기 쉬웠다.

## 다음

첫 번째 버전에서 편집 루프는 만들었지만 아직 실제 AI Assistant는 아니다.

다음에는 stub을 실제 LLM으로 교체해야 한다. 동시에 최신 Overleaf의 CodeMirror 6에서도 같은 선택과 Apply 흐름이 동작해야 한다.

즉 다음 문제는

```text
Editor → Extension → LLM → Extension → Editor
```

를 완성하는 것이다.

2편에서는 실제 LLM API를 연결하고, CodeMirror 6와 Streaming까지 붙여본다.
