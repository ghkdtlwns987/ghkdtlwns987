---
layout: post
title: "등굣길"
date: 2026-08-15
problem: "42898"
description: >-
  프로그래머스 등굣길 — DP로 최단경로 개수 구하는 풀이
image: /assets/images/covers/way-to-school.png
---

- Platform : 프로그래머스
- 난이도 : 3
- 언어 : Python
- 날짜 : 2026-08-15

## 문제
문제 링크 : https://school.programmers.co.kr/learn/courses/30/lessons/42898

---

## 문제 설명
문제 설명
계속되는 폭우로 일부 지역이 물에 잠겼습니다. 물에 잠기지 않은 지역을 통해 학교를 가려고 합니다. 집에서 학교까지 가는 길은 m x n 크기의 격자모양으로 나타낼 수 있습니다.

아래 그림은 m = 4, n = 3 인 경우입니다.

image0.png

가장 왼쪽 위, 즉 집이 있는 곳의 좌표는 (1, 1)로 나타내고 가장 오른쪽 아래, 즉 학교가 있는 곳의 좌표는 (m, n)으로 나타냅니다.

격자의 크기 m, n과 물이 잠긴 지역의 좌표를 담은 2차원 배열 puddles이 매개변수로 주어집니다. 오른쪽과 아래쪽으로만 움직여 집에서 학교까지 갈 수 있는 최단경로의 개수를 1,000,000,007로 나눈 나머지를 return 하도록 solution 함수를 작성해주세요.

제한사항
격자의 크기 m, n은 1 이상 100 이하인 자연수입니다.
m과 n이 모두 1인 경우는 입력으로 주어지지 않습니다.
물에 잠긴 지역은 0개 이상 10개 이하입니다.
집과 학교가 물에 잠긴 경우는 입력으로 주어지지 않습니다.
입출력 예
```
m	n	puddles	return
4	3	[[2, 2]]	4
```

---

## 문제 풀이
문제를 보면 격자의 크기 `m`, `n`은 최대 `100`으로, 격자의 최대 크기는 `10000` 로 제한된다.  
또한 `최단 경로`라는 단어를 보자마자 `BFS` 로 풀어야겠다고 생각할 수 있다.  
하지만 이 문제는 말 그대로 `최단 경로의 개수` 를 구하는 문제이므로, 기존 BFS로는 풀 수 없다.  
예를 들어보자. 문제에서 이동 가능한 방향은 오직 `오른쪽` 과 `아래`로만 이동할 수 있다.  
하지만, 최단 경로의 개수를 구하는 문제에서는, 매 칸을 이동할 때마다 `오른쪽`, `아래` 방향으로 이동하는 경우의 수를 계산해야 한다.  
즉, 1칸을 이동할 때마다 2가지 경우의 수를 계산해야 하기 때문에, 매 칸을 이동할 때마다 기록해야 할 경우의 수가 2배가 되며, 이를 최대 100칸씩 이동하게 된다면, 그 수가 기하급수적으로 커지게 된다.

만약, `BFS` 코드로 문제를 풀게되면 다음과 같이 풀 수 있으나, 시간초과가 난다.
```python
from collections import deque

def solution(m, n, puddles):
    puddles = set(map(tuple, puddles))

    q = deque()
    q.append((1, 1))

    answer = 0

    while q:
        x, y = q.popleft()

        # 학교에 도착
        if x == m and y == n:
            answer += 1
            continue

        # 오른쪽
        nx, ny = x + 1, y
        if nx <= m and (nx, ny) not in puddles:
            q.append((nx, ny))

        # 아래쪽
        nx, ny = x, y + 1
        if ny <= n and (nx, ny) not in puddles:
            q.append((nx, ny))

    return answer % 1000000007
```

그런데 해당 문제는 DP 로 풀 수 있다. 그 근거는 문제에 나와있는데, `오른쪽으로 가는 경우의 수`, `왼쪽으로 가는 경우의 수` 를 계속해서 더해가면 된다.  
예를 들어 `[1, 1]` 이라는 경로에 도달하기 위해서는 `[1, 0]`의 경우의 수 + `[0, 1]`의 경우의 수를 더하면 되는데,  
시작점인 `[0, 0]` 을 1로 잡고, `[1, 0] = [0, 0] + 1`, `[0, 1] = [0, 0] + 1` 을 더해주면 된다.  
즉, `위에서 오는 경우의 수 + 오른쪽에서 오는 경우의 수를 더한게` 해당 문제의 점화식이라 할 수 있다. 

최종 정의된 점화식은 다음과 같다.
```python
dp[i][j] = dp[i - 1][j] + dp[i][j - 1] (i, j > 0)
```

---

### Solution

```python
def solution(m, n, puddles):
    dp = [[0] * m for _ in range(n)]
    visited = [[0] * m for _ in range(n)]
    dp[0][0] = 1
    
    for x, y in puddles:
        visited[y - 1][x - 1] = 1
        
    for i in range(n):
        for j in range(m):
            # 웅덩이면 건너뛴다.
            if visited[i][j] == 1:
                continue
            # 위에서 올 수 있다면
            # dp[i][j]에 dp[i-1][j]를 더한다.
            if i > 0: 
                dp[i][j] += dp[i - 1][j]

            # 왼쪽에서 올 수 있다면
            # dp[i][j]에 dp[i][j-1]을 더한다.
            if j > 0:
                dp[i][j] += dp[i][j - 1]
            
#    for row in dp:
#        print(row)
        
    return (dp[n - 1][m - 1]) % 1000000007
```


시간 복잡도는 $$O(nm)$$ 이다.
