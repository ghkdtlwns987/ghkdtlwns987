---
layout: post
title: "Overleaf AI Assistant 만들기 - 4"
date: 2026-08-31
description: >-
  Ask AI Apply changes — 원문을 LaTeX 주석으로 남기고 Suggested Revision을 아래에 추가하는 v0.7.8–v0.8.0
badges:
  - Essay
series: overleaf-ai-assistant
series_order: 4
series_title: "Overleaf AI Assistant 만들기"
---

## 들어가며

[3편](/engineering/2026-08-31-overleaf-ai-assistant-3/)까지 Ask AI로 **선택 → 질문 → Answer → Apply suggestion** 흐름을 에디터 안에서 만들었다.  
다만 Apply를 누르면 원문이 **그 자리에서 통째로 바뀌었다.** 수정본만 남고, “AI 적용 전에 뭐였는지”는 히스토리나 git diff에 맡겨야 했다.

논문을 고칠 때는 한 번에 덮어쓰기보다, **원문을 남겨 두고 수정본을 옆에/아래에 붙여** 비교하는 편이 낫다. LaTeX라면 `%` 주석으로 원문을 보존하면 compile에는 영향 없고, diff도 읽기 쉽다.

**v0.7.8 ~ v0.8.0**에서는 Apply 동작을 **“교체”에서 “추가”** 쪽으로 바꿨다.

## 3편에서 남은 문제

3편 Ask AI는 Suggested Revision을 `APPLY_TEXT`로 **선택 구간 전체 교체**했다.

- Apply 후 원문 복구가 어렵다
- 여러 Ask 세션이 쌓이면 “어느 질문에서 바뀐 문장인지” 추적이 힘들다
- busy 상태/파싱 이슈로 **Apply changes** 버튼이 비활성인 경우가 있었다

## 핵심 변경 (v0.7.8 → v0.8.0)

### 1. Apply changes: 주석 + Suggested Revision (v0.7.8)

**Apply changes**를 누르면:

1. Ask했던 **원문**을 `%` LaTeX 주석으로 보존
2. 바로 아래에 **Suggested Revision** 본문 삽입
3. 세션에 저장된 `selectionRange`로 위치 적용 (cached 선택에 덜 의존)

원문을 지우지 않고, 수정본을 **아래에 추가**하는 형태다.

### 2. Apply changes 버튼 활성화 (v0.7.9)

- AI 응답 완료 후 `busy` 해제 뒤 **UI 재렌더** → Apply changes 정상 활성화
- `Suggested Revision` 파싱 강화 (`###`, `**`, 코드블록 fallback)
- 버튼 `title` 툴팁으로 적용 가능/불가 이유 표시

### 3. 구분선 + id 라벨 (v0.8.0)

Apply 시 `% =================` 구분선과 **세션 id 라벨**을 넣는다.

```latex
% ================= id(ASK AI - 1) before
% (원문 — 주석으로 보존)
% ================= id(ASK AI - 1) after
(Suggested Revision 본문)
```

Ask AI - N pill과 에디터 안 주석 id가 맞물려, **어느 세션에서 바뀐 블록인지** 바로 보인다.

```text
v0.7.8  원문 주석 보존 + Revision 아래 삽입
v0.7.9  Apply changes 활성화 / 파싱 강화
v0.8.0  구분선 + id(ASK AI - N) 라벨
```

## 결과 화면

CLEAR 논문 초록 일부에 **Ask AI - 1**로 academic writing 개선을 요청한 뒤, **Apply changes**를 적용한 모습이다.

- `% id(ASK AI - 1) before` 아래: 원문 (주석)
- `% id(ASK AI - 1) after` 아래: Suggested Revision (compile 대상)
- pill **Ask AI - 1**은 에디터 위에 그대로 남아 있다

![Apply changes — before/after 주석 + Revision 추가]({{ '/assets/images/engineering/overleaf-ai-ask-apply-before-after.png' | relative_url }})

덮어쓰기가 아니라 **내용을 추가**하는 쪽으로 바뀐 점이 이 스크린샷에서 가장 잘 드러난다.

## 변경 파일

| 파일 | 역할 |
|------|------|
| `ask-bubble.js` | Apply changes, id 라벨/구분선 삽입 |
| `editor-bridge.js` | `selectionRange` 기준 apply |
| `manifest.json` | v0.7.8 → v0.8.0 |

## 적용 방법

1. 확장 / Overleaf 탭 새로고침
2. 문장 드래그 → **✨ Ask AI** → 질문 또는 Quick 버튼
3. Answer에 Suggested Revision 확인 → **Apply changes**
4. 에디터에서 `before` 주석 / `after` 본문 구조 확인

## 마무리

3편에서 “어디서 질문하는가”를 바꿨다면, 4편은 **Apply가 에디터에 무엇을 남기는가**를 바꿨다.  
원문 주석 + Revision 추가 + id 라벨까지 맞추면서, AI 수정을 논문 초안 안에서 **추적 가능한 diff**처럼 다룰 수 있게 됐다.
