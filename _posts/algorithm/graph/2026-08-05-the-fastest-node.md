---
layout: post
title: "가장 긴 노드"
date: 2026-08-05
problem: "49189"
description: >-
  프로그래머스 가장 먼 노드 — BFS로 최단 거리 최대 노드 구하기
---

- Platform : 프로그래머스
- 난이도 : 3
- 언어 : Python
- 날짜 : 2026-08-05

## 문제
문제 링크 : https://school.programmers.co.kr/learn/courses/30/lessons/49189

---

## 문제 설명 : 
문제 설명
n개의 노드가 있는 그래프가 있습니다. 각 노드는 1부터 n까지 번호가 적혀있습니다. 1번 노드에서 가장 멀리 떨어진 노드의 갯수를 구하려고 합니다. 가장 멀리 떨어진 노드란 최단경로로 이동했을 때 간선의 개수가 가장 많은 노드들을 의미합니다.

노드의 개수 n, 간선에 대한 정보가 담긴 2차원 배열 vertex가 매개변수로 주어질 때, 1번 노드로부터 가장 멀리 떨어진 노드가 몇 개인지를 return 하도록 solution 함수를 작성해주세요.

제한사항
노드의 개수 n은 2 이상 20,000 이하입니다.
간선은 양방향이며 총 1개 이상 50,000개 이하의 간선이 있습니다.
vertex 배열 각 행 [a, b]는 a번 노드와 b번 노드 사이에 간선이 있다는 의미입니다.
입출력 예
n	vertex	return
6	[[3, 6], [4, 3], [3, 2], [1, 3], [1, 2], [2, 4], [5, 2]]	3
입출력 예 설명
예제의 그래프를 표현하면 아래 그림과 같고, 1번 노드에서 가장 멀리 떨어진 노드는 4,5,6번 노드입니다.

---

## 문제 풀이

이 문제는 **BFS** 을 이용하여 해결할 수 있다.
문제의 핵심은 `그래프의 시직점에서 가장 멀리 떨어진 노드` 의 거리를 구하면 되는 문제이다.  
풀이 방법은 다음과 같다. 

---

### Solution

```python
def solution(n, edge):
    graph = [[] for _ in range(n + 1)]
    
    for a, b in edge:
        graph[a].append(b)
        graph[b].append(a)
        
    from collections import deque
    q = deque()
    q.append(1)
    visited = [0] * (n + 1)
    visited[1] = True
    while q:
        here = q.popleft()
        
        for next in graph[here]:
            if visited[next]:
                continue
            if not graph[next]:
                continue
            
            visited[next] = visited[here] + 1
            q.append(next)
    
    return visited.count(max(visited))    
```
