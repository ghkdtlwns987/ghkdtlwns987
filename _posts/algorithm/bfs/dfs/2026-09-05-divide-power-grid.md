---
layout: post
title: "전력망을 둘로 나누기"
date: 2026-09-05
problem: "86971"
description: >-
  프로그래머스 전력망을 둘로 나누기 — 트리에서 간선 하나를 끊고 BFS로 두 컴포넌트 크기 차이 최소화
---

- Platform : 프로그래머스
- 난이도 : 2
- 언어 : Python
- 날짜 : 2026-09-05

## 문제
문제 링크 : https://school.programmers.co.kr/learn/courses/30/lessons/86971

---

## 문제 설명

n개의 송전탑이 전선을 통해 **하나의 트리** 형태로 연결되어 있습니다. 전선 중 **하나**를 끊어서 전력망을 2개로 나누고, 두 전력망의 송전탑 개수를 최대한 비슷하게 맞추고자 합니다.

송전탑 개수 `n`, 전선 정보 `wires`가 주어질 때, 전선 하나를 끊어 두 전력망의 송전탑 개수 차이(**절대값**)가 최소가 되도록 한 값을 return 하세요.

제한사항
- n은 2 이상 100 이하
- `wires` 길이는 n-1. 각 원소는 `[v1, v2]` (v1번과 v2번이 연결)
- 1 ≤ v1 < v2 ≤ n
- 트리가 아닌 입력은 주어지지 않음

입출력 예

| n | wires | result |
| --- | --- | --- |
| 9 | [[1,3],[2,3],[3,4],[4,5],[4,6],[4,7],[7,8],[7,9]] | 3 |
| 4 | [[1,2],[2,3],[3,4]] | 0 |
| 7 | [[1,2],[2,7],[3,7],[3,4],[4,5],[6,7]] | 1 |

입출력 예 #1 — 4-7을 끊으면 6개와 3개. 차이 3이 최소. 3-4를 끊어도 같다.

```
    1   2
     \ /
      3
      |
      4 - 5
     /|
    6 7 - 8
      |
      9
```

입출력 예 #2 — 1-2-3-4 직선. 2-3을 끊으면 2와 2. 차이 0.

입출력 예 #3 — 3-7을 끊으면 4개와 3개. 차이 1.

```
1 - 2 - 7 - 3 - 4 - 5
        |
        6
```

---

## 한 간선을 끊으면 항상 두 덩어리다

입력이 **트리**다. 정점 n개, 간선 n-1개, 사이클 없음.

트리에서 간선 하나를 제거하면 연결 요소가 **정확히 2개**가 된다. [네트워크]({{ '/poster/2026/09/04/network/' | relative_url }})처럼 "몇 덩어리인가"를 셀 필요가 없다. 이미 두 개다.

해야 할 일은:

1. `wires`의 **모든 전선**을 하나씩 끊어 본다
2. 한쪽 덩어리의 송전탑 수 `cnt`를 센다
3. 다른 쪽은 `n - cnt`
4. `abs(cnt - (n - cnt))` 의 **최솟값**이 답

n ≤ 100, 간선 n-1개라서 간선마다 BFS 한 번 해도 O(n²) 정도. 완전 탐색으로 충분하다.

```text
answer = n
for 각 전선 (a, b):
  a-b를 무시하고 a에서 BFS → 한쪽 크기 cnt
  answer = min(answer, abs(cnt - (n - cnt)))
```

한쪽만 세면 된다. 나머지 크기는 전체에서 빼면 나오기 때문이다.

---

## 번호가 1부터다

송전탑 번호는 **1 ~ n** 이다. 0번 정점은 없다.

그래서 그래프와 visited를 `n`이 아니라 **`n + 1`** 로 잡는다. [게임 맵 최단거리]({{ '/poster/2026/09/01/game-map-shortest-path/' | relative_url }})에서 n(행)/m(열)을 맞추던 것과 같이, 여기서는 **1-based** 를 맞추는 것이 실수 포인트다.

```python
graph = [[] for _ in range(n + 1)]   # 0번 칸은 비워 둠
visited = [0] * (n + 1)

for a, b in wires:
    graph[a].append(b)
    graph[b].append(a)               # 무방향
```

`wires`는 한 방향만 주어지지만 전선은 양방향이다. 인접 리스트에 **양쪽 다** 넣는다.

---

## 끊은 전선을 BFS에서 건너뛰기

그래프를 매번 다시 만들 필요 없다. BFS할 때 **지금 끊은 간선 (a, b)** 만 타지 않으면 된다.

무방향이라 `a → b` 와 `b → a` 둘 다 막아야 한다.

```python
if current == ignore_a and next == ignore_b:
    continue
if current == ignore_b and next == ignore_a:
    continue
```

시작점은 끊은 간선의 한쪽 끝 `a`로 둔다. `a-b`를 무시하므로 BFS는 **a가 속한 전력망만** 방문한다. `cnt`가 그 크기이고, 반대편은 `n - cnt`다.

예제 1에서 4-7을 끊고 `bfs(4, 4, 7)`:

```
4에서 시작
  → 3, 5, 6  (7은 무시)
  → 3에서 1, 2
→ cnt = 6, 반대편 = 3, 차이 = 3
```

---

## 로직 흐름

```text
graph: 1..n 양방향 인접 리스트

bfs(here, ignore_a, ignore_b):
  here에서 시작, (ignore_a, ignore_b) 간선은 사용 안 함
  방문한 정점 수 cnt를 return

answer = n
for 각 wires[i] = (a, b):
  cnt = bfs(a, a, b)
  answer = min(answer, abs(cnt - (n - cnt)))
```

예제 2 (1-2-3-4)에서 2-3을 끊으면 `bfs(2, 2, 3)` 이 1-2만 방문해 `cnt = 2`. `abs(2 - 2) = 0`.

---

### Solution

```python
from collections import deque
def solution(n, wires):
    graph = [[] for _ in range(n + 1)]

    for a, b in wires:
        graph[a].append(b)
        graph[b].append(a)

    def bfs(here, ignore_a, ignore_b):
        visited = [0] * (n + 1)
        q = deque()
        q.append(here)
        visited[here] = 1
        cnt = 1
        while q:
            current = q.popleft()
            for next in graph[current]:
                if visited[next] != 0:
                    continue
                if current == ignore_a and next == ignore_b:
                    continue
                if current == ignore_b and next == ignore_a:
                    continue
                visited[next] = 1
                q.append(next)
                cnt += 1
        return cnt

    answer = n
    for i in range(len(wires)):
        a, b = wires[i]
        cnt = bfs(a, a, b)
        answer = min(answer, abs(cnt - (n - cnt)))

    return answer
```

- `n + 1` : 송전탑이 1번부터. `graph[0]`, `visited[0]`은 쓰지 않음
- `graph[a].append(b)`와 `graph[b].append(a)` : 무방향 트리
- `ignore_a`, `ignore_b` : 이번에 끊은 전선. 양방향 모두 skip
- `cnt`는 한쪽 크기. 차이 `abs(cnt - (n - cnt))` = `abs(2 * cnt - n)`
- `answer` 초깃값 `n` : 차이 상한. 어떤 절단이든 차이 ≤ n-2

DFS로 서브트리 크기를 세도 같다. 트리라서 한 간선을 끊은 뒤 한쪽에서 탐색하면 그 컴포넌트 크기가 나온다.

---

## 정리

| 키워드 | 내용 |
| --- | --- |
| 그래프 | 트리 (n개 정점, n-1개 간선) |
| 인덱싱 | **1 ~ n**, 배열은 `n + 1` |
| 아이디어 | 모든 간선을 하나씩 끊고 완전 탐색 |
| 한 번의 BFS | 끊은 간선 한쪽의 송전탑 수 `cnt` |
| 다른 쪽 | `n - cnt` |
| 답 | `abs(cnt - (n - cnt))` 의 최솟값 |

[네트워크]({{ '/poster/2026/09/04/network/' | relative_url }})는 이미 나뉜 컴포넌트를 세는 문제고, 이 문제는 **간선 하나를 골라 일부러 나눈 뒤** 두 쪽 크기를 맞추는 문제다. 트리가 보장되므로 끊을 후보는 전선 n-1개뿐이다.
