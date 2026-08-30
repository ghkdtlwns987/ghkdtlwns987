---
layout: post
title: "Overleaf AI Assistant 만들기 - 2"
date: 2026-08-31
description: >-
  Stub 자리에 LLM API를 연결하고, OpenRouter·로컬 모델까지 지원하며, CodeMirror 6에서도 선택/Apply가 되도록 확장한 과정
badges:
  - Essay
series: overleaf-ai-assistant
series_order: 2
series_title: "Overleaf AI Assistant 만들기"
---

## 들어가며

[1편](/engineering/2026-08-31-overleaf-ai-assistant-1/)에서 **AI Paper Copilot** 사이드바와 선택 → 결과 → Apply 루프를 v0.2.0으로 고정해 두었다.  
당시 LLM API는 일부러 붙이지 않았다. API 품질 문제와 에디터 연동 문제를 섞지 않으려는 선택이었다. v0.2.0 사이드바·확장 등록 화면은 [1편 결과 화면](/engineering/2026-08-31-overleaf-ai-assistant-1/#결과-화면-v020)에서 볼 수 있다.

이번 편은 그 stub 자리에 실제 모델을 넣은 **v0.3.x** 작업을 정리한다.  
OpenAI뿐 아니라 OpenRouter, LM Studio 같은 로컬 서버까지 연결할 수 있게 했고, Overleaf 최신 에디터인 CodeMirror 6에서도 선택과 Apply가 동작하도록 bridge를 추가했다.

## 1편에서 남겨 둔 것

v0.2.0에서 끝난 것과 일부러 미룬 것을 다시 적어 두면, 이번 버전의 범위가 선명해진다.

**끝난 것**

- 논문 작성 중 고른 LaTeX를 사이드바에서 다루고 에디터로 되돌리는 **루프**
- Polish / Shorten / Review / LaTeX Check / Citation Check 액션별 system prompt 분리
- CodeMirror 5 기준 선택 캐시 + `replaceRange` Apply

**미룬 것**

- LLM API 연결 — stub 미리보기만 반환
- CodeMirror 6 전용 선택/Apply

1편 마지막에 적어 두었던 로드맵은 이번에 아래처럼 채워졌다.

```text
Stub
  ↓  ✅ v0.3.0
LLM API 연결
  ↓  ✅ v0.3.0
액션별 Prompt / 출력 형식
  ↓  ✅ v0.3.0
OpenRouter · Custom API URL
  ↓  ✅ v0.3.1
CM6 선택/Apply + Review Rewrite Apply
  ↓  ✅ v0.3.2
```

## LLM API 연결 (v0.3.0)

stub을 실제 호출로 바꾸는 일은 생각보다 UI부터 시작했다.

Settings에서 **Provider**, **API Key**, **Model**을 고르고 `chrome.storage.local`에 저장한다.  
Key가 없으면 stub 미리보기를 보여 주고 Settings 패널을 자동으로 펼친다. “API key required” 상태가 바로 보이게 한 이유다.

background에서는 OpenAI Chat Completions 형식으로 요청을 보낸다.  
사이드바는 여전히 `AI_ACTION`만 보내고, Provider·Base URL·프롬프트 조립은 background가 맡는다. 1편에서 나눠 둔 층 구조 덕분에 API만 갈아끼우면 됐다.

Settings·Review + Score·CM6 배지가 보이는 v0.3 화면은 아래 **결과 화면** 섹션에서 확인할 수 있다.

## 액션별 Prompt와 출력 형식

모델을 붙인 뒤 바로 드러난 문제는 “응답을 어떻게 받을 것인가”였다.  
액션마다 목적이 다르니 출력 형식도 달라야 Apply가 가능하다.

| 액션 | 프롬프트 언어 | 출력 | Apply |
|------|--------------|------|-------|
| Review + Score | 영어 (peer-review) | 6차원 + Overall 점수, Summary, Strengths, Weaknesses, Recommendations | Apply Rewrite |
| Polish | 영어 | LaTeX만 | Apply |
| Shorten | 영어 | LaTeX만 | Apply |
| LaTeX Check | 영어 | Quality X/10 + Issues + Corrected LaTeX | Apply Rewrite |
| Citation Check | 영어 | 4차원 점수 + Issues + Recommendations | — |

Review는 peer-review 톤으로 점수와 코멘트를 구조화했다.  
Polish·Shorten은 결과 전체가 LaTeX여야 **Apply**로 바로 덮어쓸 수 있다.  
Review와 LaTeX Check는 본문과 수정본이 섞이므로, 나중에 **Apply Rewrite**로 suggested 부분만 파싱해 넣도록 했다.

Review / LaTeX Check / Citation Check 응답은 **점수 카드 UI**로 파싱해 보여 준다.  
드래그 선택은 `selectionchange`로 동기화해, 버튼을 누르기 전에 선택이 바뀌었는지 다시 확인한다.

## OpenRouter · Custom API URL (v0.3.1)

OpenAI 하나만 지원하면 실험 비용과 모델 선택이 막힌다.  
v0.3.1에서 Provider를 세 갈래로 늘렸다.

| Provider | Base URL | 비고 |
|----------|----------|------|
| OpenAI | `https://api.openai.com/v1/chat/completions` | 기본 |
| OpenRouter | `https://openrouter.ai/api/v1/chat/completions` | `HTTP-Referer`, `X-Title` 헤더 |
| Custom | 사용자 입력 | LM Studio, vLLM, 사내 프록시 등 OpenAI-compatible |

Provider별 모델 프리셋(OpenAI 6종, OpenRouter 5종)과 Custom model 필드를 두었다.  
Custom URL을 저장할 때는 `host_permissions`와 runtime request로 origin 권한을 요청한다.

**OpenRouter 예시**

- Provider: OpenRouter
- API Key: `or-...`
- Model: `anthropic/claude-sonnet-4` (또는 Custom model 필드)

**LM Studio / 로컬 예시**

- Provider: Custom
- API Base URL: `http://localhost:1234/v1/chat/completions`
- API Key: `lm-studio` (로컬 서버가 요구하는 값)
- Model: 로컬에 로드된 model ID

## CodeMirror 6 — MAIN world bridge (v0.3.2)

Overleaf 최신 에디터는 CodeMirror 6다.  
문제는 content script가 **isolated world**에서 돌아가 `EditorView`에 직접 닿을 수 없다는 점이다.

그래서 **MAIN world bridge** (`editor-bridge.js`)를 추가했다.

```text
sidebar (iframe)
   ↕ postMessage
content.js (isolated)
   ↕ window.postMessage
editor-bridge.js (MAIN world)
   ↕ CodeMirror 5/6 API
Overleaf editor
```

| 기능 | CM5 | CM6 |
|------|-----|-----|
| 드래그 선택 캐시 | `.CodeMirror` API | `view.state.sliceDoc(from, to)` |
| Apply | `replaceRange` | `view.dispatch({ changes })` |
| 에디터 표시 | 사이드바 **CM5** 배지 | **CM6** 배지 |

CM6 view 탐색 순서:

1. `.cm-content.cmView.view`
2. `.cm-editor.cmView.view`
3. `window.EditorView.findFromDOM()` (페이지에 노출된 경우)

v0.3.2부터 content.js는 CM5 직접 접근 대신 bridge를 경유한다.  
사이드바에는 현재 에디터가 CM5인지 CM6인지 배지로 표시한다.

## Review / LaTeX Check — Apply Rewrite

Review + Score 결과에서 `## Suggested Rewrite` 섹션만 파싱해 **Apply Rewrite**로 넣는다.  
LaTeX Check는 corrected LaTeX 코드 블록을 같은 방식으로 적용한다.  
Polish·Shorten은 기존처럼 결과 전체를 **Apply**한다.

점수와 코멘트는 읽기용이고, 실제 편집에 쓰는 건 rewrite 구간뿐이라 UX를 이렇게 나눴다.

## 결과 화면 — 아직 UI/UX는 투박하다

v0.3.x까지 기능은 한 화면에 모였지만, 솔직히 말하면 **UI/UX는 아직 투박하다.**

Settings, 선택 영역, 액션 버튼, 결과, Apply까지 필요한 요소는 다 있다.  
다만 레이아웃·간격·버튼 계층·로딩/에러 상태 표현은 “동작 확인용 프로토타입”에 가깝다.  
점수 카드와 CM6 배지도 정보 전달에는 충분하지만, Overleaf 본 UI와 나란히 두면 다듬어지지 않은 느낌이 남는다.

이번 버전의 우선순위는 겉모습이 아니라 **루프가 끝까지 도는지**였다.  
API 연결, CM6 bridge, Apply Rewrite까지 맞춘 뒤에야 UI를 정리할 여유가 생긴다.  
지금 스크린샷은 “이렇게 쓸 수 있다”는 증거에 가깝고, “이미 다듬어졌다”는 선언은 아니다.

Settings에서 API Key를 저장하고, Overleaf CM6 에디터에서 LaTeX를 선택한 뒤 **Review + Score**를 실행하는 모습이다.

![AI Paper Copilot v0.3 — Settings, Review + Score, CM6 배지]({{ '/assets/images/engineering/overleaf-ai-copilot-v03-settings.png' | relative_url }})

API Key 입력, Provider·Model 선택, 선택된 LaTeX, Review + Score, CM6 배지까지 한 패널에 들어 있다.  
다음 단계에서는 이 화면을 덜 거칠게 만드는 쪽—Settings 접기/펼치기, 액션 그룹 정리, 결과 영역 가독성, 대기 중 피드백—을 손볼 예정이다.

## 변경 파일 요약

| 파일 | 변경 |
|------|------|
| `background.js` | LLM 호출, peer-review 프롬프트, Provider/Base URL |
| `editor-bridge.js` | **신규** — MAIN world CM5/CM6 bridge (v0.3.2) |
| `content.js` | bridge 경유 선택/Apply (v0.3.2) |
| `sidebar/*` | Settings, 점수 카드, CM 배지, Apply Rewrite |
| `manifest.json` | v0.3.2, MAIN world content script |

## 적용 방법

1. `chrome://extensions` → 확장 **새로고침**
2. Overleaf 탭 **새로고침**
3. AI 버튼 → **Settings** → Provider·API Key·Model 저장
4. LaTeX 드래그 선택 → **Review + Score** 또는 다른 액션 실행

## 아직 미룬 것

- 사이드바 UI/UX 다듬기 (레이아웃, 버튼 계층, 로딩·에러 상태)
- 스트리밍 응답, 토큰 사용량 표시
- 액션별 temperature / max_tokens 설정
- 프롬프트·점수 형식 A/B 테스트 후 고정

## 다음에 할 일

1. CM5·CM6 실제 Overleaf 프로젝트에서 선택·Apply 회귀 테스트
2. Review 응답 스트리밍으로 대기 UX 개선
3. 사이드바 UI 정리 — Settings·액션·결과 영역을 덜 투박하게
4. 프롬프트·점수 형식을 A/B 테스트한 뒤 고정

1편에서 “에디터와의 연결”을 먼저 고정했기 때문에, 이번에는 API와 CM6만 집중해서 올릴 수 있었다.  
기능은 이어지지만 화면은 아직 거칠다. 다음 편에서는 스트리밍·프롬프트 튜닝과 함께 UI도 한 번 더 다듬을 예정이다.
