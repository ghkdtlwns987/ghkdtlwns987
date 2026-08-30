---
layout: post
title: "Overleaf AI Assistant 만들기 - 3"
date: 2026-08-31
description: >-
  오른쪽 사이드바 대신 선택 위 Ask AI로 질문하고, pill/다중 세션/에디터 하이라이트까지 다듬은 v0.5.0–v0.7.7
badges:
  - Essay
series: overleaf-ai-assistant
series_order: 3
series_title: "Overleaf AI Assistant 만들기"
---

## 들어가며

[2편](/engineering/2026-08-31-overleaf-ai-assistant-2/)까지 **AI Paper Copilot** 사이드바는 꽤 쓸 만해졌다.  
API 연결, CM6 bridge, 스트리밍, Apply Rewrite까지. “선택 → 결과 → 에디터 반영” 루프는 오른쪽 패널 안에서 끝까지 돌아간다.

그런데 논문을 고치다 보면, **오른쪽 탭을 따로 여는 것**이 여전히 걸렸다.

문장을 드래그하고, AI 버튼을 누르고, 사이드바가 열릴 때까지 기다리고, 선택이 넘어왔는지 확인하고, 액션을 고른다. Apply까지는 잘 되지만 시선은 계속 에디터와 패널 사이를 오간다.

> 사이드바는 “기능”은 해결했지만, “지금 쓰는 문장 바로 옆에서 AI와 대화하기”는 아직 아니었다.

**v0.5.0**에서 **Ask AI**로 방향을 바꿨고, **v0.7.7**까지 선택 위 UX를 계속 다듬었다.

## 이전 방식: 오른쪽 탭에서 별도 작업

```text
에디터에서 LaTeX 선택
        ↓
(시선 이동) 우측 AI 버튼 클릭
        ↓
사이드바 열림 → 액션 선택 → Apply
```

왼쪽은 논문, 오른쪽은 Copilot. **작업 공간이 둘**로 나뉜다.

## 목표 UX: 선택 위 Ask AI

```text
LaTeX 드래그 선택
        ↓
선택 위 [✨ Ask AI] 칩
        ↓
질문 / Quick 버튼 (Review, Improve, Clarity, Shorten)
        ↓
AI 답변 → [Apply suggestion]
```

사이드바를 열지 않아도 **선택 → 질문 → 추천 확인**이 가능해야 했다.

## 핵심 변경 (v0.5.0 → v0.7.7)

세부 패치는 많지만, 방향을 바꾼 지점은 다섯 가지다.

### 1. Ask AI bubble (v0.5.0)

- 선택 rect 기준으로 **✨ Ask AI** 칩 + 플로ating 패널
- `ask` 액션: LaTeX excerpt + 자유 질문 (Quick 프리셋 포함)
- 2편과 같은 `ai-stream` 스트리밍, **Apply suggestion**으로 에디터 반영

### 2. 패널 열림 안정화 (v0.5.1)

Shadow DOM을 쓰면 `position: fixed` UI가 안 보였다. Shadow DOM을 제거하고, rect가 없어도 패널이 열리도록 fallback을 넣었다. API Key 미등록 안내와 선택 텍스트 미리보기도 패널 안에서 처리한다.

### 3. pill + 대화 유지 (v0.5.3~)

바깥 클릭/Esc는 **닫기가 아니라 최소화**. `💬 AI 답변` pill로 질문/답변을 남기고, pill 클릭 시 패널을 복원한다. pill은 드래그로 옮길 수 있다.

### 4. 다중 세션 (v0.6.0~)

질문마다 **Ask AI - 1, 2, 3…** pill을 따로 유지한다. 질문 시점의 선택 범위를 `selectionLocked`로 고정해, 이후 다른 문장을 드래그해도 이전 Ask 위치가 흔들리지 않게 했다.

### 5. 점선 → 에디터 하이라이트 (v0.7.0~)

“어느 문장에 물었는지”를 점선 박스로 표시하려다 스크롤/좌표에서 계속 깨졌다. **v0.7.0**부터 CM6 에디터 **내부 배경 하이라이트**로 바꿨다. **v0.7.6**에서 ON/OFF 토글(기본 OFF), **v0.7.7**에서 OFF 후 재등장 버그를 정리했다. **v0.7.2**에서 Answer / Request 탭도 추가했다.

```text
v0.5.0  Ask AI chip + ask action
v0.5.1  패널 열림 / Shadow DOM 제거
v0.5.3  pill + 최소화
v0.6.0  다중 Ask 세션
v0.7.0  에디터 하이라이트
v0.7.7  하이라이트 OFF 안정화
```

## 결과 화면 (v0.7.x)

아래는 Overleaf CM6 에디터에서 실제로 쓴 화면이다.  
오른쪽 사이드바를 열지 않고, 선택한 문단 위에서 **Ask AI - 2**, **Ask AI - 3** pill이 동시에 남고, 에디터 안에 **하이라이트**로 “어느 구간에 물었는지”가 표시된다.

### 다중 세션 + Review

한 문단에 peer review를 요청한 **Ask AI - 3** 패널과, 이전에 남겨 둔 **Ask AI - 2** pill이 같이 보인다.  
선택 구간은 에디터 배경 하이라이트로 표시되고, **Answer** 탭에서 수정 제안을 확인한 뒤 **Apply suggestion**으로 반영할 수 있다.

![Ask AI 다중 세션 — 에디터 하이라이트 + Review]({{ '/assets/images/engineering/overleaf-ai-ask-multi-session-review.png' | relative_url }})

### Improve 질문

“How can I improve the academic writing”처럼 **자유 질문**도 같은 패널에서 처리한다.  
Quick 버튼 없이 입력해도 되고, 응답이 채워지면 Apply로 에디터에 넣을 수 있다.

![Ask AI — Improve 질문과 Answer]({{ '/assets/images/engineering/overleaf-ai-ask-improve-writing.png' | relative_url }})

v0.5.x 초반에는 칩 + 플로ating 패널만 있었지만, pill/다중 세션/하이라이트가 쌓이면서 위처럼 **에디터 안에서 바로 질문하고 고르는** 형태가 됐다.

## 변경 파일

| 파일 | 역할 |
|------|------|
| `ask-bubble.js` | Ask AI 칩, pill, 패널, 하이라이트 |
| `editor-bridge.js` | 선택 bounds, range 복구 |
| `background.js` | `ask` action |
| `manifest.json` | v0.5.0 → v0.7.7 |

## 적용 방법

1. `chrome://extensions` → 확장 새로고침
2. Overleaf 탭 새로고침
3. Settings에 API Key 저장
4. 문장 드래그 → **✨ Ask AI** → 질문 또는 Quick 버튼

## 아직 미룬 것

- Ask bubble / 사이드바 선택 상태 동기화
- Recommendations만 Copy
- CM6 rect / 하이라이트 회귀 테스트

## 마무리

1편에서 에디터 연결, 2편에서 API/스트리밍까지 맞춘 뒤, 3편에서는 **어디서 AI를 쓰는가**를 바꿨다.  
오른쪽 탭에서 별도로 작업하던 흐름에서, **선택한 문장 옆에서 바로 질문하는 흐름**으로 옮긴 셈이다.

4편에서는 Apply가 원문을 덮어쓰지 않고 **주석 + Suggested Revision을 추가**하는 쪽으로 바뀐다. → [4편](/engineering/2026-08-31-overleaf-ai-assistant-4/)
