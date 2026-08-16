---
layout: post
title: "Stack Buffer Overflow로 이해하는 System Hacking"
date: 2026-08-16
description: >-
  Register, Calling Convention, Stack 구조를 살펴보고 Stack-Based Buffer Overflow로 프로그램 실행 흐름이 어떻게 바뀌는지 이해한다.
badges:
  - Essay
series: re-system-hacking
series_order: 2
series_title: "Reverse Engineering → System Hacking"
---

## 들어가며

[이전 글]({{ '/poster/2026/08/16/reverse-engineering-with-games/' | relative_url }})에서는 Memory와 Assembly를 따라가며 Reverse Engineering의 기본 흐름을 다뤘다.

이번에는 같은 강의 시리즈의 다음 단계로, **System Hacking** 기초를 학생들과 함께 실습한 내용을 정리한다.

System Hacking을 처음 접하면 `Register`, `Stack`, `Calling Convention`, `EIP`, `Buffer Overflow`가 제각각으로 보이기 쉽다.  
실제로는 아래처럼 한 줄로 이어진다.

```text
Register → Calling Convention → Stack → Return Address
         → EIP → Buffer Overflow → Control Flow
```

강의에서는 간단한 C 프로그램을 GDB로 보면서 각 개념이 Binary에서 어떻게 나타나는지 확인한 뒤, 마지막에 **Stack-Based Buffer Overflow가 실행 흐름에 미치는 영향**까지 연결했다.

## 1. Register

CPU가 연산을 하려면 데이터가 필요하다. HDD/RAM과 달리 CPU 안의 아주 작은 공간이 **Register**다.

| 저장소 | 역할 |
|:--|:--|
| HDD | 장기 저장 |
| RAM | 실행 중 데이터 |
| Register | 현재 연산에 쓰는 데이터 |

System Hacking에서 자주 다루는 Register는 다음과 같다.

| Register | 역할 |
|:--|:--|
| `EAX` | 연산 결과 · 반환값 |
| `EBP` | 현재 Stack Frame 기준점 |
| `ESP` | Stack Top |
| `EIP` | Instruction Pointer (실행 위치) |

이후 Buffer Overflow를 이해할 때 특히 중요한 것은 **EBP, ESP, EIP**다.

## 2. 함수는 어떻게 호출될까?

C에서는 `add(1, 2)`가 자연스럽지만, CPU에는 “함수 호출”이라는 고수준 개념이 없다.  
인자를 넘기고, 함수를 실행하고, 끝나면 원래 위치로 돌아와야 한다. 그 약속이 **Calling Convention**이다.

> 함수 호출 시 Parameter를 어떻게 전달·관리할지에 대한 규칙

Architecture · OS · ABI에 따라 Convention은 달라질 수 있다.  
실습에서는 32-bit x86 환경을 기준으로 Stack에 인자를 올리는 방식을 확인했다.

## 3. GDB로 Disassemble 해보기

간단한 프로그램을 컴파일한 뒤 GDB에서 `main`을 본다.

```bash
gdb -q ./1
(gdb) disassemble main
```

예를 들어 아래 C 코드라면,

```c
char buf[0x30];

scanf("%s", buf);
puts(buf);
```

Assembly에서는 이런 형태를 볼 수 있다.

```asm
lea  eax, [ebp-0x30]
push eax
push ...
call scanf
```

핵심은 `lea eax, [ebp-0x30]`이다.  
`buf[0x30]`(48 Bytes)이 Stack에 잡히고, 그 Address로 입력을 받는다.  
C와 Assembly를 나란히 보면 지역 변수가 Stack에서 어떻게 관리되는지 바로 보인다.

## 4. Stack과 push / pop

Calling Convention을 이해하려면 **Stack**(LIFO)이 필요하다.

```text
        ┌─────┐
push C  │  C  │ ← Top
        ├─────┤
push B  │  B  │
        ├─────┤
push A  │  A  │
        └─────┘
```

- `push eax` — 값을 Stack에 넣는다  
- `pop eax` — Top 값을 꺼낸다  

자료구조로서의 Stack을 알고 있으면 두 명령의 의미가 훨씬 명확해진다.

## 5. EBP와 ESP

```text
EBP → Stack Frame 기준점
ESP → 현재 Stack Top
```

예:

```asm
mov DWORD PTR [ebp-0x4], 0x1
```

`DWORD`는 4 Bytes, `mov`는 저장이다.  
즉 `EBP` 기준 `-0x4` 위치에 `1`을 쓴다. 지역 변수도 이런 식으로 Stack에 놓일 수 있다.

```text
Higher Address
┌─────────────────┐
│ Return Address  │
├─────────────────┤
│ Saved EBP       │
├─────────────────┤
│ Local Variable  │
├─────────────────┤
│ Buffer          │
└─────────────────┘
Lower Address
```

이 Layout이 바로 뒤에서 볼 Buffer Overflow와 직접 연결된다.

## 6. Parameter는 어떻게 전달될까?

```c
void func1(int a, int b, int c) {
    printf("result : %d\n", a + b + c);
}

int main() {
    int num1 = 1, num2 = 2, num3 = 3;
    func1(num1, num2, num3);
    return 0;
}
```

32-bit x86 실습 환경에서는 호출 전에 인자가 Stack에 이렇게 올라갔다.

```asm
push [ebp-0xc]   ; num3
push [ebp-0x8]   ; num2
push [ebp-0x4]   ; num1
call func1
```

즉 Parameter가 **역순으로 Stack에 전달**되는 과정을 GDB로 확인할 수 있었다.  
C의 `func1(num1, num2, num3)`가 Register·Stack으로 어떻게 풀리는지 보여주는 구간이다.

## 7. 함수가 끝나면 어디로 돌아갈까?

함수가 끝나면 호출한 곳으로 돌아와야 한다.  
그래서 호출 시 Stack에 **Return Address**가 저장되고, `ret`이 그 주소로 점프한다.

```text
main() ──call──► func() ──ret──► main()의 다음 Instruction
```

Epilogue에서는 `leave` / `ret`을 자주 본다.

여기서 핵심 질문이다.

> Return Address가 원래 값이 아닌 다른 값으로 바뀌면 어떻게 될까?

이 질문이 Buffer Overflow로 이어진다.

## 8. EIP와 Control Flow

32-bit x86에서 **EIP**는 현재 실행 Instruction을 가리킨다.  
정상이라면 Control Flow를 따라 순차·분기로 움직인다.

Return Address처럼 Control Data가 변조되면, 원래 복귀 주소가 아니라 **다른 주소로 실행 흐름이 옮겨갈 수 있다.**

```text
정상: Function → RET → Original Return Address → Normal Execution
변조: Function → RET → Modified Address → Different Flow
```

Buffer Overflow가 위험한 이유를 여기서부터 설명할 수 있다.

## 9. Buffer Overflow란?

**할당된 Buffer 크기보다 큰 데이터가 기록되는 현상**이다.

```c
char buf[16];
```

길이 검사가 없으면 Buffer 경계를 넘어 Saved EBP · Return Address까지 덮을 수 있다.

```text
┌────────────────┐
│ Buffer         │ ← AAAA...
├────────────────┤
│ Saved EBP      │ ← AAAA
├────────────────┤
│ Return Address │ ← AAAA
└────────────────┘
```

단순히 Buffer만 깨지는 게 아니라, Stack의 **Control Data**까지 영향을 받을 수 있다.

## 10. 왜 Return Address가 중요한가?

Buffer 뒤에 Saved EBP와 Return Address가 있으면, 충분히 긴 입력으로 Return Address까지 덮을 수 있다.  
`A`(ASCII `0x41`)를 반복 입력했을 때 Debugger에서 EIP/Return Address가 `0x41414141`이 되면, 입력이 그 영역까지 도달한 증거다.

```text
AAAAAAAAAAAAAAAA... → Buffer → Saved EBP → Return Address → 0x41414141
```

Crash만이 아니라,

> **어디로 돌아갈지를 정하는 값에 사용자 입력이 영향을 준 것**

이라는 점이 핵심이다.

## 11. Stack Buffer Overflow의 핵심

```text
사용자 입력 → Buffer 저장 → 크기 초과
           → 인접 Stack 침범
           → Saved EBP / Return Address 손상
           → Control Flow 영향
```

중요한 문장은 이것이다.

> “Buffer보다 큰 데이터를 넣었다”가 아니라,  
> **경계를 벗어난 Write가 Control Data에 영향을 줄 수 있다.**

## 12. CTF 문제로 연결하기

개념을 묶기 위해 Pwnable 스타일 CTF 문제도 실습에 넣었다.

{% include paper-figure.html src="projects/syshack-pwnable.png" alt="Pwnable Stack Buffer Overflow 실습" caption="Pwnable 실습 자료 — Stack · Buffer Overflow" %}

예제에서는 `buf[0x80]`과 길이 제한이 약한 `gets()` 구조를 본다.

```text
main()
  ├── initialize()
  ├── buf[0x80]   (= 128 Bytes)
  └── gets(buf)
```

```text
┌──────────────────┐
│ Return Address   │
├──────────────────┤
│ Saved EBP        │
├──────────────────┤
│    buf[0x80]     │
└──────────────────┘
```

취약점 “발견”보다 **입력이 Stack 어디까지 닿는지**를 이해하는 게 목표다.  
GDB로 Stack·Register 변화를 보면서 Overflow가 Return Address에 닿는 과정을 확인했다.

## 13. Python으로 Payload 만들기

긴 입력을 손으로 쓰지 않고 Script로 길이를 맞춘다.

```python
payload = b"A" * 128
```

```text
Buffer까지 몇 Byte? → Saved EBP까지? → Return Address까지?
```

32-bit 주소는 Little Endian을 고려해 `pwntools`의 `p32()`를 쓸 수 있다.

```python
from pwn import *
address = p32(0x08049123)
```

64-bit면 `p64()`다.

Exploit은 긴 문자열을 넣는 게임이 아니라 Memory Layout을 맞춰 가는 과정에 가깝다.

```text
Binary 분석 → Stack 파악 → Buffer 크기 → Return Address 위치
           → Payload 구성 → GDB 검증
```

## 14. CTF와 System Hacking

Pwnable에서는 Binary 동작 · 취약점 · Memory 구조를 이어서 본다.

```text
Program → Vulnerability → Memory/Register → Exploit → Flag
```

앞에서 따로 다루던 Assembly, Register, Stack, Calling Convention, EIP, Buffer Overflow가 **한 문제 안에서 하나로 연결**된다.

## 마치며

처음 Overflow를 보면 “Buffer보다 크게 넣으면 망가진다” 정도로 끝나기 쉽다.  
Stack과 Calling Convention을 같이 보면 질문이 바뀐다.

```text
왜 Buffer 주변에 다른 값이 있는가?
 → 함수 호출 시 Stack은 어떻게 구성되는가?
 → Return Address는 왜 필요한가?
 → ret은 어떻게 복귀하는가?
 → Return Address가 바뀌면?
```

결국 Stack-Based Buffer Overflow는 취약점 하나만의 문제가 아니라,  
**CPU가 함수를 호출하고 Memory를 관리하며 Control Flow를 유지하는 방식**을 함께 이해해야 한다.

```text
Assembly → Register → Calling Convention → Stack → EIP → Buffer Overflow
```

이 흐름은 이후 **Stack Canary, NX, ASLR, PIE** 같은 Memory Protection과 **ROP**를 배우기 위한 기초가 된다.

## 강의 자료

실습에 사용한 System Hacking Overview 자료를 아래에 올려 두었다.

[System Hacking Overview.pdf]({{ '/assets/documents/system-hacking-overview.pdf' | relative_url }})
