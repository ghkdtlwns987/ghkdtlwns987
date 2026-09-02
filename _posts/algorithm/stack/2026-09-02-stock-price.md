---
layout: post
title: "주식가격"
date: 2026-09-02
problem: "42584"
description: >-
  프로그래머스 주식가격 — stack으로 가격이 떨어지지 않은 기간 구하기
---

- Platform : 프로그래머스
- 난이도 : 2
- 언어 : Python
- 날짜 : 2026-09-02

## 문제
문제 링크 : https://school.programmers.co.kr/learn/courses/30/lessons/42584

---

## 문제 설명

초 단위로 기록된 주식가격이 담긴 배열 prices가 매개변수로 주어질 때, **가격이 떨어지지 않은 기간**은 몇 초인지를 return 하도록 solution 함수를 완성하세요.

제한사항
- prices의 각 가격은 1 이상 10,000 이하인 자연수입니다.
- prices의 길이는 2 이상 100,000 이하입니다.

입출력 예

| prices | return |
| --- | --- |
| [1, 2, 3, 2, 3] | [4, 3, 1, 1, 0] |

입출력 예 설명

| 시점 | 가격 | 가격이 떨어지지 않은 기간 |
| --- | --- | --- |
| 1초 | ₩1 | 끝까지 안 떨어짐 → 4초 |
| 2초 | ₩2 | 끝까지 안 떨어짐 → 3초 |
| 3초 | ₩3 | 1초 뒤 ₩2로 하락 → 1초 |
| 4초 | ₩2 | 1초 뒤까지 유지 → 1초 |
| 5초 | ₩3 | 마지막 → 0초 |

---

## 문제 풀이

각 시점 `i`마다, `prices[i]`보다 **작아지는 순간**까지 몇 초가 지났는지 구하면 된다.

### naive 접근

`i`부터 끝까지 순회하며 `prices[j] < prices[i]`인 `j`를 찾으면 O(n²)이다. 길이가 10만이면 시간 초과다.

### stack 접근

**아직 가격이 떨어지지 않은 시점**의 인덱스를 stack에 쌓아 둔다.

- stack에는 **가격이 오름차순(또는 같음)** 으로 유지되는 인덱스만 남는다.
- 새 가격 `prices[i]`가 stack top보다 **작으면** → top 시점의 "안 떨어진 기간"이 확정 → pop
- 확정된 기간 = `i - top` (top 시점부터 i 직전까지)

```
prices = [1, 2, 3, 2, 3]
index:    0  1  2  3  4
```

| i | prices[i] | 동작 | answer 갱신 |
| --- | --- | --- | --- |
| 0 | 1 | push 0 | |
| 1 | 2 | push 1 | |
| 2 | 3 | push 2 | |
| 3 | 2 | 3>2 → pop 2 | answer[2]=1 |
| 4 | 3 | push 4 | |

끝까지 pop되지 않은 인덱스는 **끝까지 가격이 안 떨어진 경우**다.

```
answer[i] = (len(prices) - 1) - i
```

남은 stack: 0, 1, 3, 4 → `[4, 3, _, 1, 0]` → 최종 `[4, 3, 1, 1, 0]`

---

### Solution

```python
def solution(prices):
    n = len(prices)
    answer = [0] * n
    stack = []  # 아직 가격이 떨어지지 않은 시점(인덱스)

    for i in range(n):
        while stack and prices[i] < prices[stack[-1]]:
            top = stack.pop()
            answer[top] = i - top
        stack.append(i)

    while stack:
        top = stack.pop()
        answer[top] = (n - 1) - top

    return answer
```

- `stack` : **인덱스**를 저장 (가격은 `prices[idx]`로 조회)
- `prices[i] < prices[stack[-1]]` : i 시점에 top 가격이 **처음으로** 하락
- 마지막 `while stack` : 끝까지 하락하지 않은 시점 처리

---

## 정리

| 키워드 | 내용 |
| --- | --- |
| 자료구조 | stack (인덱스 저장) |
| 핵심 | 더 낮은 가격 등장 시 pop → 기간 확정 |
| 끝까지 유지 | `(n - 1) - i` |
| 시간 | O(n) — 각 인덱스 push/pop 최대 1번 |

**"언제 처음으로 조건이 깨지는가"**를 stack으로 미루어 처리하는 패턴이다. [기능개발]({{ '/poster/2026/09/02/feature-development/' | relative_url }})에서 순서를 묶었다면, 이번에는 **아직 답이 정해지지 않은 인덱스**를 stack에 두고, 조건이 충족될 때 한꺼번에 계산한다.

```python
# prices[i] >= prices[stack[-1]] 일 때만 push → 단조 stack
# 가격이 떨어지는 순간 = stack에서 꺼내 answer를 채우는 순간
```

이 문제는 **monotonic stack(단조 stack)** 의 대표 예제로 자주 나온다.
