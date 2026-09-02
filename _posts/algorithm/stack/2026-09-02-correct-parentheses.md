---
layout: post
title: "올바른 괄호"
date: 2026-09-02
problem: "12909"
description: >-
  프로그래머스 올바른 괄호 — stack으로 짝 검사하기
---

- Platform : 프로그래머스
- 난이도 : 2
- 언어 : Python
- 날짜 : 2026-09-02

## 문제
문제 링크 : https://school.programmers.co.kr/learn/courses/30/lessons/12909

---

## 문제 설명

괄호가 바르게 짝지어졌다는 것은 `(` 문자로 열렸으면 반드시 짝지어서 `)` 문자로 닫혀야 한다는 뜻입니다.

- `()()` 또는 `(())()` → 올바른 괄호
- `)(()` 또는 `(()(` → 올바르지 않은 괄호

`(` 또는 `)`로만 이루어진 문자열 s가 주어졌을 때, 문자열 s가 올바른 괄호이면 true를 return하고, 올바르지 않은 괄호이면 false를 return 하는 solution 함수를 완성해 주세요.

제한사항
- 문자열 s의 길이 : 100,000 이하의 자연수
- 문자열 s는 `(` 또는 `)`로만 이루어져 있습니다.

입출력 예

| s | answer |
| --- | --- |
| "()()" | true |
| "(())()" | true |
| ")()(" | false |
| "(()(" | false |

입출력 예 설명

입출력 예 #1, 2, 3, 4

문제의 예시와 같습니다.

---

## 문제 풀이

여는 괄호 `(`를 만나면 **나중에 닫을 예정**이고, 닫는 괄호 `)`를 만나면 **가장 최근에 열린 `(`와 짝**을 지어야 한다.

가장 최근에 처리하지 않은 것을 기억하는 구조 → **stack**

### 기본 흐름

1. `(` → stack에 push
2. `)` → stack top이 `(`이면 pop (짝 완성)
3. 문자열을 끝까지 돌았을 때 stack이 **비어 있으면** true

---

### 핵심: stack이 비어 있는지 확인

`)`를 만났을 때 **pop하기 전에** stack에 짝이 될 `(`가 있는지 반드시 확인해야 한다.

```
s = ")()("
      ↑
   첫 글자부터 ')'
   → 짝지을 '('가 없음
```

stack이 비어 있는데 `)`가 오면, 닫을 여는 괄호가 없다는 뜻이므로 **즉시 올바르지 않은 괄호**다.

```python
if s[i] == ')':
    if not stack:       # ← 이 검사가 핵심
        # pop 불가: 짝이 없음
```

`stack.pop()`을 **무조건** 호출하면 `IndexError`가 난다. Python list에서 빈 리스트에 `pop()`하면 예외가 발생하기 때문이다.

| 상황 | stack | `)` 만났을 때 |
| --- | --- | --- |
| 정상 | `['(', '(']` | pop → `['(']` |
| 짝 없음 | `[]` | pop 불가 → false |
| 개수 불일치 | `['(']` (끝) | stack 남음 → false |

마지막 경우 `(()(`처럼 `(`가 남으면 stack이 비어 있지 않으므로 false다.

---

### Solution

```python
def solution(s):
    stack = []

    for i in range(len(s)):
        if s[i] == '(':
            stack.append(s[i])
        if s[i] == ')':
            if not stack:
                stack.append(s[i])
            elif stack and stack[-1] == '(':
                stack.pop()
            elif stack and stack[-1] == ')':
                stack.append(s[i])

    if not stack:
        return True
    else:
        return False
```

`')'`를 만났을 때 `if not stack` 분기가 **stack 존재 여부**를 검사하는 부분이다. 비어 있으면 pop할 `(`가 없으므로, `')'`를 stack에 넣어 두고 마지막에 stack이 남아 false를 반환하게 한다.

동작 예: `")()("`

```
')' → stack 비어 있음 → ')' push → stack = [')']
...
끝 → stack 비어 있지 않음 → False
```

더 직관적으로는 `')'`이고 stack이 비어 있을 때 **바로 False**를 반환하는 방식도 많이 쓴다.

```python
def solution(s):
    stack = []
    for c in s:
        if c == '(':
            stack.append(c)
        else:
            if not stack:
                return False
            stack.pop()
    return not stack
```

핵심은 같다. **`pop` 전에 stack이 비어 있지 않은지** 확인하는 것.

---

## 정리

| 키워드 | 내용 |
| --- | --- |
| 자료구조 | stack (LIFO) |
| `(` | push |
| `)` | top이 `(`이면 pop, **stack 비었으면 실패** |
| 종료 조건 | stack이 비어 있어야 true |

괄호 짝 맞추기는 stack의 대표 문제다. `(`는 쌓고, `)`는 꺼내며, **꺼내기 전에 쌓인 것이 있는지** 항상 확인하는 것이 실수 없이 푸는 포인트다.

[전화번호 목록]({{ '/poster/2026/09/02/phone-book/' | relative_url }})에서 LIFO 대신 정렬을 썼다면, 이번에는 **열린 순서를 되돌리는 stack**이 자연스럽다.
