---
layout: post
title: "여행 경로"
date: 2026-08-14
problem: "43164"
description: |
  Platform : 프로그래머스
  난이도 : 3
  언어 : Python
---

- Platform : 프로그래머스
- 난이도 : 3
- 언어 : Python
- 날짜 : 2026-08-09

# 문제
문제 링크 : https://school.programmers.co.kr/learn/courses/30/lessons/43164



## 문제 설명

문제 설명
주어진 항공권을 모두 이용하여 여행경로를 짜려고 합니다. 항상 "ICN" 공항에서 출발합니다.

항공권 정보가 담긴 2차원 배열 tickets가 매개변수로 주어질 때, 방문하는 공항 경로를 배열에 담아 return 하도록 solution 함수를 작성해주세요.

제한사항
모든 공항은 알파벳 대문자 3글자로 이루어집니다.  

주어진 공항 수는 3개 이상 10,000개 이하입니다.  

tickets의 각 행 [a, b]는 a 공항에서 b 공항으로 가는 항공권이 있다는 의미입니다.  

주어진 항공권은 모두 사용해야 합니다.  

만일 가능한 경로가 2개 이상일 경우 알파벳 순서가 앞서는 경로를 return 합니다.  

모든 도시를 방문할 수 없는 경우는 주어지지 않습니다.  
입출력 예  

tickets	return  
```
[["ICN", "JFK"], ["HND", "IAD"], ["JFK", "HND"]]	["ICN", "JFK", "HND", "IAD"]
[["ICN", "SFO"], ["ICN", "ATL"], ["SFO", "ATL"], ["ATL", "ICN"], ["ATL","SFO"]]	["ICN", "ATL", "ICN", "SFO", "ATL", "SFO"]
```
입출력 예 설명
예제 #1

["ICN", "JFK", "HND", "IAD"] 순으로 방문할 수 있습니다.

예제 #2

["ICN", "SFO", "ATL", "ICN", "ATL", "SFO"] 순으로 방문할 수도 있지만 ["ICN", "ATL", "ICN", "SFO", "ATL", "SFO"] 가 알파벳 순으로 앞섭니다.

문제가 잘 안풀린다면😢
힌트가 필요한가요? [코딩테스트 연습 힌트 모음집]으로 오세요! → 클릭

## 문제 풀이

1. 문제 조건을 확인해보면, `알파벳 순서가 앞서는 경로를 우선 return` -> 정렬
2. `모든 도시를 방문할 수 없는 경우는 주어지지 않는다` -> 모든 경로를 탐색할 수 있다.
3. 시작 경로는 `ICN` 에서 시작한다.

즉, 해당 문제는 `현재 위치` 에서 경로를 계속해서 갱신해 나가는 구조인데, 한가지 유의할 점이, `visited` 선언이다.  

처음 `visited = []` 으로만 선언하게 되었을 경우에는 중복되는 여행경로가 있을 경우 잘못될 가능성이 있다.  

예를 들어서 다음과 같이 `ICN` 이 2개 이상 있을 경우 중복되는 경로는 포함하지 않게 된다. 따라서 `visited = [0] * (len(tickets) + 1)` 로 선언해야 한다.  

나머지는 백트래킹해서 풀자.
```
[["ICN", "JFK"], ["HND", "IAD"], ["JFK", "HND"], ["ICN", "BBB"]]
```

### Solution
```python
def solution(tickets):
    visited = [0] * (len(tickets) + 1)
    tickets.sort()
    
    def dfs(current, path):
        if len(path) == len(tickets) + 1:
            return path
        
        for i in range(len(tickets)):
            start, end = tickets[i]
            if current == start and not visited[i]:
                visited[i] = True
                path.append(end)
                
                result = dfs(end, path)
                if result:
                    return result
                visited[i] = False
                path.pop()
                
    answer = dfs("ICN", ["ICN"])
    return answer
```
