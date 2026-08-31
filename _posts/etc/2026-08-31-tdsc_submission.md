---
layout: post
title: "TDSC Submission - 회고"
date: 2026-08-31
description: >-
  ASE 2026 CLEAR 논문을 Journal Extension하여 IEEE TDSC에 제출한 과정과 소감을 정리한 회고입니다.
image: /assets/images/etc/tdsc-submission.png
badges:
  - Research
  - TDSC
---

## 들어가며

{% include paper-figure.html src="etc/tdsc-submission.png" alt="IEEE TDSC 제출 완료 화면" caption="IEEE Author Portal — TDSC 제출 완료" width="720" %}

**IEEE Transactions on Dependable and Secure Computing (TDSC)**에 논문을 제출했다.

→ 이전 글: [ASE Accept 회고]({{ '/poster/2026/08/13/accepted/' | relative_url }})

ASE 2026에 Accept된 CLEAR를 기반으로 Journal Extension을 시작했고,
추가 실험과 방법론 수정을 거쳐 이번에 TDSC에 제출하게 되었다.

Conference 논문을 Journal로 확장하는 것은 처음이었기 때문에,
이번 글에서는 그 과정에서 무엇이 달라졌고 어떤 작업을 했는지 간단히 정리해보려고 한다.

---

## TDSC?

**IEEE Transactions on Dependable and Secure Computing (TDSC)**는
Dependable Computing과 Security를 주요 주제로 다루는 IEEE 저널이다.

Software Security, Vulnerability Analysis, System Security 등
현재 연구하고 있는 주제와 관련된 논문도 꾸준히 게재되고 있다.

[저널 점수 확인하는 법]({{ '/poster/2026/08/13/journal/' | relative_url }})을 작성할 때
TDSC를 예시로 사용한 적이 있었는데, 이번에는 실제 투고까지 진행하게 되었다.

이번에 제출한 논문은 ASE 2026에 Accept된
**CLEAR: Causal Context-Based Agentic Reasoning for Vulnerability Detection**의
Journal Extension이다.

Conference 버전에서 제안했던 Causal Reasoning 기반 취약점 탐지 방법을
확장하고, 방법론과 실험을 추가하여 **CRAFT: Causality-aware Reasoning and
Adaptive Framework for Vulnerability Types**로 정리했다.

---

## Conference 이후, Extension

처음에는 Journal Extension을 단순히
**Conference 논문에 추가 실험을 보강하는 작업** 정도로 생각했다.

실제로 진행해보니 생각보다 고려해야 할 부분이 많았다.

Conference 논문과 충분히 구별되는 새로운 Contribution이 있어야 했고,
기존 방법에서 부족했던 부분을 다시 살펴보면서
방법론 자체도 상당 부분 수정해야 했다.

[Paper Extension]({{ '/poster/2026/08/14/writing_paper/' | relative_url }})에서도 일부 정리했지만,
이번 Extension에서는 크게 다음과 같은 부분을 추가했다.

- 취약점의 Causality Type을 고려한 Knowledge Representation
- Causality-specific Expert 기반 Multi-Agent Reasoning
- 독립적인 외부 Dataset을 활용한 Generalization Evaluation
- Evidence Role 및 Architecture Ablation
- CWE 및 Causality Type별 분석
- 다양한 LLM Backbone에 대한 Robustness Evaluation
- CTVKG 구축 비용 및 Limitation 분석

특히 실험을 추가하는 것보다 어려웠던 부분은
**왜 이러한 확장이 필요한지를 하나의 연구 질문으로 연결하는 것**이었다.

기능을 추가했다고 해서 그 자체가 Contribution이 되는 것은 아니기 때문에,
기존 방법의 어떤 한계를 해결하기 위한 것인지,
그리고 실험 결과가 실제로 그 주장을 뒷받침하는지를 계속 확인해야 했다.

실험 과정에서도 결과에 따라 Retrieval 방식이나 Graph 구성,
Prompt 등을 수정하고 다시 평가하는 작업을 여러 번 반복했다.

---

## Submit 직전

논문이 어느 정도 완성된 이후에도 제출까지 확인할 것이 많았다.

Manuscript PDF뿐만 아니라 Cover Letter,
Conference Version과의 차이, Author Information,
Conflict of Interest, Data Availability, Keywords,
Reference와 Figure 형식 등을 하나씩 확인했다.

특히 Conference Extension이기 때문에
기존 CLEAR와 CRAFT의 차이를 명확하게 설명하는 것이 중요했다.

Cover Letter에는 CTVKG 구성 방식, Causality-specific Expert,
새로운 외부 Dataset, 추가 RQ 및 Ablation 등
Conference 버전에서 확장된 부분을 별도로 정리했다.

내용을 수정하는 것과 별개로,
실제 Submission 과정에서도 생각보다 확인할 것이 많다는 것을 알게 되었다.

---

## 제출 후

Submit을 완료했고, 이제 Review를 기다리는 단계가 되었다.

Journal Review는 Conference와 진행 방식이나 기간이 다르기 때문에
앞으로 어떤 피드백을 받게 될지는 아직 알 수 없다.

이번 Extension을 진행하면서 가장 크게 느낀 점은
**Conference 논문을 Journal 논문으로 확장하는 과정이 단순한 분량 확장은 아니라는 것**이었다.

추가된 방법이 기존 연구와 어떤 차이를 만드는지,
그 차이를 어떤 실험으로 검증할 것인지,
그리고 결과를 통해 어디까지 주장할 수 있는지를 다시 정리해야 했다.

CLEAR를 작성할 때보다 실험의 범위도 넓어졌고,
Ablation, Generalization, Robustness, Limitation 등
연구 결과를 여러 관점에서 설명하는 방법도 고민하게 되었다.

---

## 마무리

ASE 2026부터 이어진 작업을 정리하면 대략 다음과 같다.

```
ASE 2026 Accept -> Journal Extension -> CRAFT -> TDSC Submission -> Review
```

결과는 아직 알 수 없지만,

이번 작업을 통해 Conference 논문을 Journal로 확장할 때

어떤 부분을 추가로 고민해야 하는지는 확실히 경험할 수 있었다.

특히 **새로운 실험을 추가하는 것과 새로운 Contribution을 만드는 것은 다르다**는 점을 많이 느꼈다.

이제 당분간은 논문에서 조금 벗어나

미뤄두었던 취업 준비를 본격적으로 시작할 예정이다.

Review 결과가 도착하면,

그때 다시 Revision 과정을 정리해보려고 한다.

---

## Related

- [ASE Paper Accepted - 회고]({{ '/poster/2026/08/13/accepted/' | relative_url }})
- [Paper Extension]({{ '/poster/2026/08/14/writing_paper/' | relative_url }})
- [CLEAR Review]({{ '/poster/2026/08/14/clear/' | relative_url }})
- [저널 점수 확인하는 법]({{ '/poster/2026/08/13/journal/' | relative_url }})