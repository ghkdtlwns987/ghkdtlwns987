---
layout: post
title: "Overleaf AI Assistant 만들기 - 4"
date: 2026-08-31
description: >-
  AI 수정안으로 원문을 덮어쓰는 대신, 기존 LaTeX를 보존하면서 Suggested Revision을 적용하도록 개선한 과정
badges:
  - Essay
series: overleaf-ai-assistant
series_order: 4
series_title: "Overleaf AI Assistant 만들기"
---

## 들어가며

{% include post-series-part-link.html order=3 label="3편" markdown=true %}까지 만들면서 Overleaf에서 문장을 선택하고, 바로 옆에서 AI에게 질문한 뒤 결과를 Apply할 수 있게 됐다.

**Select → Ask AI → Answer → Apply**

기능적으로는 원하는 흐름이 완성됐지만, 실제 논문을 수정하면서 마지막으로 하나가 마음에 걸렸다.

**Apply를 누르는 순간 원문이 사라졌다.**

시리즈 마지막인 4편에서는 AI의 수정안을 어떻게 생성할지가 아니라, **수정 결과를 어떻게 안전하게 문서에 남길 것인가**를 바꿔봤다.

## 문제: Apply가 너무 destructive했다

기존 Apply는 선택한 영역을 AI의 Suggested Revision으로 **바로 교체**했다.

```latex
% Before
CRAFT achieves strong performance.

% Apply 후
CRAFT consistently achieves strong performance.
```

수정 자체는 정상적이지만, 원래 문장을 다시 확인하려면 Undo나 Version History에 의존해야 했다.

Ask AI 세션이 여러 개 쌓이면 **어떤 질문을 통해 어느 문장이 변경됐는지** 추적하기도 어려워졌다.

논문 수정에서는 AI가 제안한 문장을 바로 채택하는 것보다, **원문과 수정안을 비교한 뒤 판단**하는 과정이 더 중요하다고 생각했다.

그래서 Apply를 덮어쓰기 방식에서 **원문을 보존하는 방식**으로 바꾸기로 했다.

## 개선: 원문을 남기면서 Revision 적용하기

LaTeX에서는 `%` 뒤의 내용이 compile 결과에 포함되지 않는다.

이 점을 이용해 Apply 시 기존 문장을 삭제하지 않고 **주석으로 남기도록** 했다.

```latex
% ================= id(ASK AI - 1) before
% CRAFT achieves strong performance.
% ================= id(ASK AI - 1) after
CRAFT consistently achieves strong performance.
```

사용자에게 보이는 PDF에는 **after**만 반영되지만, 에디터에서는 기존 문장과 수정된 문장을 동시에 확인할 수 있다.

또한 `ASK AI - N`을 함께 기록해, **어느 Ask AI 세션**에서 만들어진 수정인지 추적할 수 있게 했다.

```text
Ask AI - 1
    │
    └── id(ASK AI - 1)
            ├── before → 원문
            └── after  → Suggested Revision
```

Apply 위치는 각 세션이 가지고 있는 `selectionRange`를 사용했다.  
여러 Ask AI 세션을 열어두거나 pill로 최소화했다가 다시 열어도, **처음 질문했던 영역**에 수정안을 적용할 수 있다.

## 결과

실제 논문 문장을 Ask AI로 수정한 뒤 **Apply changes**를 실행하면, 원문과 수정본이 함께 남는다.

![Apply changes — before/after 주석 + Revision 추가]({{ '/assets/images/engineering/overleaf-ai-ask-apply-before-after.png' | relative_url }})

`before`는 LaTeX 주석이기 때문에 compile에는 영향을 주지 않고, `after`만 실제 논문에 반영된다.

Apply의 의미가 이렇게 바뀌었다.

**Before**

```text
Original ──Apply──> Revision
```

**After**

```text
Original ──Apply──> % Original
                    Revision
```

작은 변화지만, AI가 기존 내용을 바로 파괴하지 않는다는 점에서 실제로 사용할 때 부담이 훨씬 줄었다.

## 느낀 점

이번 수정에서 가장 크게 느낀 것은, AI 편집 기능에서는 **생성 품질뿐 아니라 되돌릴 수 있는가**도 중요하다는 점이었다.

AI가 항상 더 좋은 문장을 만든다고 가정할 수는 없다. 그렇다면 시스템이 해야 할 일은 결과를 바로 확정하는 것이 아니라, **사용자가 원본과 제안을 비교하고 선택**할 수 있도록 만드는 쪽에 가깝다.

처음에는 Apply를 단순히 “AI 결과로 선택 영역을 교체한다”고 생각했다.

지금은 조금 다르게 생각한다.

> “AI의 제안을 문서에 반영하되, 사용자의 원래 작업을 잃지 않는다.”

특히 논문처럼 여러 번 수정하고 검토하는 문서에서는 이 방식이 더 잘 맞았다.

## 시리즈를 마치며

처음 이 프로젝트를 시작한 이유는 단순했다.

논문을 고칠 때마다 Overleaf와 외부 AI를 오가는 과정이 번거로웠다.

그래서 네 편에 걸쳐 조금씩 작업 흐름을 줄여봤다.

| 편 | 해결한 문제 |
|----|-------------|
| {% include post-series-part-link.html order=1 label="1편" markdown=true %} | 선택한 LaTeX를 다시 정확한 위치에 Apply |
| {% include post-series-part-link.html order=2 label="2편" markdown=true %} | 실제 LLM, CM6, Streaming 연결 |
| {% include post-series-part-link.html order=3 label="3편" markdown=true %} | Sidebar 대신 선택한 문장 위에서 Ask AI |
| 4편 | 원문을 보존하면서 AI Revision 적용 |

결과적으로 처음의 흐름

```text
Overleaf → Copy → External AI → Copy → Overleaf
```

을

```text
Overleaf
   │
 Select
   ↓
 Ask AI
   ↓
 Compare
   ↓
 Apply
```

로 바꿀 수 있었다.

돌아보면 이 프로젝트에서 계속 개선한 것은 **LLM 자체**가 아니었다.

AI를 사용하기 위해 논문 작성 흐름을 **얼마나 적게 벗어나게** 만들 수 있는가, 그리고 AI가 개입하더라도 사용자가 **자신의 원문에 대한 통제권**을 유지할 수 있는가가 더 중요한 문제였다.

UI와 테스트 등 아직 다듬을 부분은 남아 있지만, 처음 만들고 싶었던 **Overleaf 안에서 자연스럽게 사용하는 AI Assistant**의 기본 흐름은 여기까지 완성했다.
