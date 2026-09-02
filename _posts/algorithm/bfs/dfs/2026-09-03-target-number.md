---
layout: post
title: "타겟 넘버"
date: 2026-09-03
problem: "43165"
description: >-
  프로그래머스 타겟 넘버 — DFS로 +/- 조합 경우의 수 구하기
---

- Platform : 프로그래머스
- 난이도 : 2
- 언어 : Python
- 날짜 : 2026-09-03

## 문제
문제 링크 : https://school.programmers.co.kr/learn/courses/30/lessons/43165

---

## 문제 설명

n개의 음이 아닌 정수들이 있습니다. 이 정수들을 **순서를 바꾸지 않고** 적절히 더하거나 빼서 타겟 넘버를 만들려고 합니다.

예를 들어 `[1, 1, 1, 1, 1]`로 숫자 3을 만들려면 다음 다섯 방법을 쓸 수 있습니다.

```
-1+1+1+1+1 = 3
+1-1+1+1+1 = 3
+1+1-1+1+1 = 3
+1+1+1-1+1 = 3
+1+1+1+1-1 = 3
```

사용할 수 있는 숫자가 담긴 배열 numbers, 타겟 넘버 target이 매개변수로 주어질 때, 숫자를 적절히 더하고 빼서 타겟 넘버를 만드는 **방법의 수**를 return 하도록 solution 함수를 작성해주세요.

제한사항
- 주어지는 숫자의 개수는 2개 이상 20개 이하입니다.
- 각 숫자는 1 이상 50 이하인 자연수입니다.
- 타겟 넘버는 1 이상 1000 이하인 자연수입니다.

입출력 예

| numbers | target | return |
| --- | --- | --- |
| [1, 1, 1, 1, 1] | 3 | 5 |
| [4, 1, 2, 1] | 4 | 2 |

입출력 예 설명

입출력 예 #1

문제 예시와 같습니다.

입출력 예 #2

```
+4+1-2+1 = 4
+4-1+2-1 = 4
```

총 2가지 방법이 있으므로 2를 return 합니다.

---

## 문제 풀이

각 숫자마다 **더하기(+)** 또는 **빼기(-)** 두 가지 선택이 있다. 숫자 개수가 최대 20이므로 최대 2²⁰ ≈ 100만 가지 분기 — **완전 탐색(DFS)** 로 충분하다.

---

## DFS가 동작하는 방식

DFS는 **결정 트리**를 깊이 우선으로 내려간다. 각 레벨은 `numbers[idx]`를 +할지 -할지 고르는 단계다.

```
numbers = [1, 1, 1], target = 1

                    (0, idx=0)
                   /          \
              +1 /              \ -1
                /                \
           (1,1)                  (-1,1)
           /    \                 /     \
        +1/      \-1           +1/       \-1
         /        \             /          \
      (2,2)      (0,2)       (0,2)        (-2,2)
      /  \       /  \        /  \         /  \
   +1  -1    +1  -1     +1  -1      +1  -1
   ...       ...        ...          ...

idx=3 도달 시 current == target 이면 answer += 1
```

- **상태**: `(current, idx)` — 지금까지의 합, 다음에 고를 숫자 위치
- **분기**: `dfs(current + numbers[idx], idx + 1)` / `dfs(current - numbers[idx], idx + 1)`
- **종료(base case)**: `idx == len(numbers)` → 합이 target이면 카운트

한 경로를 끝까지 탐색한 뒤, 되돌아와(backtrack) 다른 분기(+/-)를 탐색한다. **모든 leaf까지** 내려가며 경우의 수를 센다.

---

## visited를 쓰는 문제 vs 안 쓰는 문제

| | visited **쓰는** 유형 | visited **안 쓰는** 유형 (타겟 넘버) |
| --- | --- | --- |
| 예시 | [게임 맵 최단거리]({{ '/poster/2026/09/01/game-map-shortest-path/' | relative_url }}), [단어 변환]({{ '/poster/2026/08/06/translate-verb/' | relative_url }}) | 타겟 넘버 |
| 그래프 형태 | 같은 **정점/칸**을 여러 경로로 재방문 가능 | **트리** — idx가 항상 1씩 증가 |
| 목적 | 최단거리, 도달 가능 여부 (경로 하나) | **모든 +/- 조합** 경우의 수 |
| visited 역할 | 이미 처리한 칸/단어 재탐색 방지 | 불필요 — 같은 idx를 두 번 가지 않음 |

### visited를 **쓰는** 것이 좋을 때

- **사이클**이 있는 그래프 (A→B→A)
- **격자/그래프**에서 같은 위치를 다시 밟을 수 있을 때
- **한 번만 방문**해도 되는 문제 (최단거리 BFS, connected component)
- 같은 상태를 **중복 탐색하면 시간만 낭비**하고 답은 변하지 않을 때

```python
# BFS 예: visited[ny][nx] = True 후 큐에 추가
# 같은 칸을 다시 넣으면 불필요한 탐색
```

### visited를 **쓰지 않는** 것이 좋을 때 (이 문제)

- **순서대로** 하나씩 결정하고 `idx`만 앞으로 가는 **트리 탐색**
- **모든 경로**를 세야 할 때 — 중간 상태를 "방문 처리"하면 **서로 다른 +/- 경로**를 잘못 막을 수 있음
- 같은 `(current, idx)`에 다른 경로로 도달해도, **남은 숫자 조합**은 동일 → 이건 visited가 아니라 **메모이제이션(DP)** 로 최적화 가능 (아래 참고)

### 주의: visited와 메모이제이션은 다르다

타겟 넘버에서 `dfs(current, idx)`의 결과는 **경로에 따라 달라지지 않고** `(current, idx)`만으로 결정된다. 같은 상태를 다시 만나면 **이전에 구한 경우의 수를 재사용**할 수 있다.

```python
# 최적화 (선택): memo[(current, idx)] = 남은 경우의 수
```

이건 "방문 금지"가 아니라 **중복 계산 제거**다. 기본 DFS만으로도 n≤20이면 통과한다.

---

## 재귀 DFS 작성 팁

1. **base case를 먼저** — `idx == len(numbers)`일 때 target 비교 후 return
2. **상태를 인자로** — `current`(누적합), `idx`(다음 숫자 위치). 전역 변수 남발보다 명확
3. **두 갈래 재귀** — + 분기, - 분기. for문 없이도 됨
4. **답 누적** — `nonlocal answer` 또는 `return dfs(...) + dfs(...)` 로 합산
5. **idx는 항상 증가** — 무한 재귀 없음, visited 불필요

```python
# return 방식 (nonlocal 대신)
def dfs(current, idx):
    if idx == len(numbers):
        return 1 if current == target else 0
    return dfs(current + numbers[idx], idx + 1) + dfs(current - numbers[idx], idx + 1)
```

---

### Solution

```python
def solution(numbers, target):
    answer = 0

    def dfs(current, idx):
        nonlocal answer

        if idx == len(numbers):
            if current == target:
                answer += 1
            return

        dfs(current + numbers[idx], idx + 1)
        dfs(current - numbers[idx], idx + 1)

    dfs(0, 0)
    return answer
```

- `dfs(0, 0)` : 합 0에서, 0번 숫자부터 결정 시작
- `idx == len(numbers)` : 모든 숫자를 +/- 처리한 뒤 target과 비교
- 각 숫자마다 **두 번** 재귀 호출 → 전체 2ⁿ 경로 탐색

---

## 정리

| 키워드 | 내용 |
| --- | --- |
| 알고리즘 | DFS (완전 탐색) |
| 상태 | `(current, idx)` |
| 분기 | `+numbers[idx]` / `-numbers[idx]` |
| visited | **불필요** (트리, 모든 경로 카운트) |
| base case | `idx == len(numbers)` |

**경우의 수를 모두 세는 +/- 트리** 문제는 idx가 깊이를 보장하므로 visited 없이 DFS가 자연스럽다. 반면 **그래프/격자에서 같은 칸 재방문**이 문제면 visited(또는 BFS dist)가 필요하다.

[주식가격]({{ '/poster/2026/09/02/stock-price/' | relative_url }})에서 stack으로 "아직 처리 안 된 인덱스"를 관리했다면, 이번에는 재귀 `idx`로 **아직 결정하지 않은 숫자**를 순서대로 내려가며 탐색한다.
