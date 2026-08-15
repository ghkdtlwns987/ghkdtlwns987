---
layout: post
title: "Paper Extension"
date: 2026-08-14
description: >-
  Conference 논문을 Journal로 확장(Paper Extension)할 때 고려할 점과 CLEAR 후속 작업 메모입니다.
badges:
  - Essay
---
`CLEAR:Causal Context-based Agentic Reasoning for Vulnerability Detection` 논문이 Accept 되고 나서, 교수님께서 논문을 Extension 하라고 하셔서 논문을 작성했는데, 현재 추가실험 중이라 이 글을 작성해본다.

Extension 을 진행하게 되면서 Conference에 발표한 연구를 확장하여 Journal에 제출하는 경우가 있다. 처음에는 단순히 "Conference 논문에 내용을 조금 더 추가해서 Journal에 내는 것"이라고 생각했는데, 실제로 준비해보니 생각보다 고려해야 할 부분이 많았다.

이번 글에서는 **Paper Extension이 무엇인지**, 그리고 Conference 논문을 Journal 논문으로 확장할 때 어떤 부분을 고려해야 하는지 정리해보려고 한다.

---

## Paper Extension?

**Paper Extension**은 기존에 발표된 Conference 논문을 기반으로 연구 내용과 실험, 분석 등을 실질적으로 확장하여 새로운 Journal 논문으로 발전시키는 것을 의미한다.

예를 들어 Conference 논문에서 하나의 방법론을 제안했다면, Journal Extension에서는 단순히 실험 몇 개를 추가하는 것이 아니라 기존 연구에서 충분히 다루지 못했던 문제를 확장하거나, 방법론 자체를 발전시키고 더 다양한 환경에서 검증하는 방식으로 연구를 확장할 수 있다.

대략적으로 다음과 같은 형태가 될 수 있다.

- 기존 Methodology의 구조 또는 알고리즘 확장
- 새로운 Research Question 추가
- 추가 Dataset을 이용한 Generalization 검증
- 최신 Baseline과의 비교 실험 추가
- Ablation Study 및 Component Analysis 강화
- 반복 실험 및 Confidence Interval 등을 통한 통계적 신뢰성 보강
- Failure Case 및 Error Analysis 추가
- 기존 연구의 Limitation을 해결하는 새로운 방법 제안

따라서 Extension은 단순한 **"Conference Paper + Additional Experiments"**라기보다는 기존 연구를 기반으로 **새로운 Research Contribution을 추가한 확장 연구**에 가깝다고 볼 수 있다.

---

## Conference Paper와 Journal Paper

Conference 논문은 일반적으로 정해진 페이지 제한 안에서 핵심 아이디어와 주요 실험 결과를 압축해서 보여준다.

반면 Journal은 상대적으로 연구를 보다 자세하게 설명할 수 있기 때문에 Methodology, Experimental Analysis, Discussion 등을 더 깊게 다룰 수 있다.

하지만 여기서 중요한 점은 **길이가 길어진다고 Extension이 되는 것은 아니라는 것**이다.

예를 들어 기존 Conference 논문의 Methodology는 그대로 두고 설명만 길게 작성하거나, 동일한 실험 결과를 더 많은 표와 Figure로 보여주는 것만으로는 충분한 Extension이라고 보기 어려울 수 있다.

결국 중요한 것은 다음 질문이라고 생각한다.

> **"Conference 논문과 비교했을 때 Journal 논문에서 새롭게 얻을 수 있는 연구적 Contribution은 무엇인가?"**

이 질문에 명확하게 답할 수 있어야 한다.

---

## 얼마나 확장해야 할까?

가장 헷갈렸던 부분 중 하나가 바로 **"얼마나 바뀌어야 Extension이라고 할 수 있는가?"**였다.

종종 Conference 논문 대비 30% 이상의 새로운 내용을 추가해야 한다는 이야기를 볼 수 있는데, 이를 단순히 문장이나 페이지 수 기준으로 생각하면 안 된다.

중요한 것은 **Substantial Extension**, 즉 연구 내용 측면에서 실질적인 확장이 이루어졌는지 여부다.

예를 들어 기존 연구에서 하나의 공통된 방법으로 모든 문제를 처리했다면, Extension에서는 문제 유형에 따라 서로 다른 메커니즘을 모델링하도록 방법론을 확장할 수 있다. 여기에 새로운 실험과 분석까지 추가된다면 단순한 실험 보강보다 훨씬 명확한 Extension이 된다.

개인적으로는 다음 세 가지를 기준으로 확인하는 것이 가장 이해하기 쉬웠다.

1. **Methodology에 새로운 Contribution이 있는가?**
2. **새로운 실험이 새로운 Research Question에 답하고 있는가?**
3. **Conference 논문과 비교했을 때 Journal에서 새롭게 주장할 수 있는 Conclusion이 있는가?**

세 번째가 특히 중요하다고 생각한다.

---

## 기존 Conference 논문은 숨겨야 할까?

당연히 아니다.

Journal 논문이 기존 Conference 논문의 Extension이라면 기존 논문과의 관계를 명확하게 밝히는 것이 중요하다.

일반적으로 기존 Conference 논문을 Related Work 등에서 인용하고, Journal 논문이 기존 연구에서 **무엇을 새롭게 확장했는지** 명확하게 설명한다.

필요한 경우 첫 페이지의 Footnote나 Cover Letter 등을 통해 해당 논문이 기존 Conference 논문의 확장 버전이라는 사실을 명시할 수도 있다.

오히려 기존 논문과의 관계를 숨기면 Self-Plagiarism이나 중복 출판과 관련된 문제가 발생할 수 있기 때문에, 두 논문의 관계와 새로운 Contribution을 투명하게 설명하는 것이 중요하다.

---

## 단순히 실험을 많이 추가하면 될까?

실험의 양보다 **왜 해당 실험이 필요한지**가 더 중요하다고 생각한다.

예를 들어 Dataset 하나에서만 평가했던 연구에 여러 Dataset을 추가하는 것은 Generalization 측면에서 좋은 보강이 될 수 있다. 반복 실험과 95% Confidence Interval을 추가하는 것도 결과의 신뢰성을 높일 수 있다.

하지만 이런 실험들은 기본적으로 기존 주장을 **더 강하게 검증하는 역할**을 한다.

반면 새로운 Methodology를 제안하고 그 효과를 검증하기 위한 새로운 RQ와 Ablation Study를 추가한다면 이는 기존 연구에서 새로운 질문으로 연구 범위 자체가 확장된 것이다.

따라서 Journal Extension을 준비할 때는

> **Methodological Extension + Experimental Extension + Deeper Analysis**

세 가지를 함께 가져가는 것이 가장 이상적이라고 생각한다.

---

## 작성하면서 느낀 점

처음에는 Extension을 단순히 **"Conference 논문을 더 크게 만드는 작업"**이라고 생각했다.

하지만 실제로 작성해보면 기존 논문의 핵심 아이디어를 유지하면서도 **"왜 새로운 논문으로 볼 수 있는가?"**를 설득하는 과정에 더 가깝다.

특히 새로운 Dataset이나 Baseline을 계속 추가하는 것보다 먼저,

- 기존 연구가 해결하지 못했던 문제는 무엇인가?  
- 그 문제를 해결하기 위해 방법론이 어떻게 달라졌는가?  
- 그리고 새로운 실험은 그 변화를 실제로 증명하는가?

이 세 질문을 명확하게 만드는 것이 중요하다고 느꼈다.

결국 좋은 Paper Extension은 기존 논문에 내용을 덧붙이는 것이 아니라, **기존 연구를 출발점으로 한 단계 더 발전된 Research Story를 만드는 과정**이라고 생각한다.

## 여담
재미삼아서 한번 해봤는데..
![Meta-Review1]({{ '/assets/images/etc/meta-review1.png' | relative_url }})
![Meta-Review2]({{ '/assets/images/etc/meta-review2.png' | relative_url }})

ㅋㅋ...