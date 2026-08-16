---
layout: post
title: "Kubernetes 기반 무중단 서비스 배포 플랫폼 개발"
date: 2026-08-16
description: >-
  AWS EKS와 Kubernetes를 기반으로 애플리케이션의 컨테이너화부터 배포, 확장, 모니터링까지 자동화한 서비스 배포 플랫폼
badges:
  - Essay
---

## 들어가며

서비스를 개발하는 것과 개발한 서비스를 안정적으로 운영하는 것은 또 다른 문제다.

특히 인프라 운영 경험이나 전담 인력이 부족한 환경에서는 서비스 이중화, 트래픽 증가에 따른 확장, 새로운 버전의 배포와 장애 발생 시 롤백까지 직접 구성하고 운영하기 쉽지 않다.

이 프로젝트에서는 이러한 문제를 해결하기 위해 사용자가 개발한 애플리케이션을 등록하면 컨테이너화부터 Kubernetes 배포까지 자동으로 수행하고, 서비스 운영에 필요한 확장과 모니터링 환경을 제공하는 배포 플랫폼을 개발했다.

프로젝트에서 나는 Backend 개발과 Cloud Infrastructure 구축을 담당했으며, 주요 기술로 다음을 사용했다.

**Infrastructure**

- Kubernetes · AWS EKS · ECR · RDS · ALB
- Docker · Jenkins · ArgoCD
- Prometheus · Grafana

**Backend**

- Spring Boot · Spring Security
- JPA · QueryDSL
- REST API · REST Docs
- JWT · Redis

## 무엇을 해결하고자 했는가?

일반적으로 개발자가 서비스를 운영하려면 애플리케이션 개발 이외에도 여러 인프라 작업이 필요하다.

```text
Application
     ↓
Containerization
     ↓
Infrastructure
     ↓
Deployment
     ↓
Scaling
     ↓
Monitoring
     ↓
Update / Rollback
```

초기에는 작은 서버 하나로도 서비스를 운영할 수 있지만 사용자가 증가하면 서버 부하에 대응해야 하고, 새로운 버전을 배포하는 과정에서도 서비스 장애가 발생할 수 있다.

이를 해결하기 위해서는 Kubernetes와 같은 Container Orchestration 환경을 직접 구축하고 배포 및 운영 체계를 구성해야 한다.

하지만 모든 개발자가 Kubernetes나 Cloud Infrastructure에 대한 전문 지식을 가지고 있는 것은 아니다.

그래서 다음과 같은 목표를 세웠다.

> 개발자는 애플리케이션과 필요한 서버 사양을 입력하고, 플랫폼이 나머지 배포 과정을 자동화할 수 없을까?

## 프로젝트 목표

플랫폼의 기본적인 동작은 다음과 같이 설계했다.

```text
Application 등록
        ↓
Build
        ↓
Dockerizing
        ↓
Container Registry
        ↓
Kubernetes Deployment
        ↓
Service
        ↓
Monitoring
```

사용자가 프로젝트 정보를 입력하면 Jenkins를 통해 애플리케이션을 빌드하고 Docker Image를 생성한다.

생성된 Image는 Registry에 저장하고, 이를 기반으로 AWS EKS 환경에 서비스를 배포한다.

배포된 서비스는 사용량 변화에 따라 Kubernetes 환경에서 확장할 수 있도록 구성했으며, 서비스 업데이트 과정에서는 현재 배포된 Component의 Version을 관리하고 문제가 발생할 경우 이전 버전으로 돌아갈 수 있도록 하는 것을 목표로 했다.

## 전체 시스템 구조

플랫폼의 애플리케이션은 크게 세 가지 서버로 구성했다.

```text
                    ┌──────────────┐
                    │ Front Server │
                    └──────┬───────┘
                           │
                        REST API
                           │
             ┌─────────────┴─────────────┐
             │                           │
      ┌──────▼──────┐             ┌──────▼──────┐
      │ Auth Server │             │ API Server  │
      └─────────────┘             └──────┬──────┘
                                         │
                                      REST API
                                         │
                                  ┌──────▼──────┐
                                  │   Jenkins   │
                                  └──────┬──────┘
                                         │
                                         ▼
                                      AWS EKS
```

각 서버는 서로 다른 역할을 담당한다.

| Component | Role |
|:--|:--|
| Front Server | 서비스 배포 및 운영 화면 제공 |
| Auth Server | 사용자 인증·인가 및 JWT 관리 |
| API Server | 회원/프로젝트 관리 및 Jenkins 연동 |
| Jenkins | Application Build 및 배포 작업 수행 |
| EKS | 사용자 Application 실행 |

각 Component 간 통신에는 REST API를 사용했다.

## Backend 개발

### Auth Server

인증 서버는 사용자의 **인증(Authentication)과 인가(Authorization)**를 담당하도록 분리했다.

사용자가 로그인하면 JWT를 발급하여 인증된 사용자를 식별하도록 구성했다.

```text
Login
  ↓
Authentication
  ↓
JWT Issuance
  ↓
Redis Session Information
  ↓
Authenticated Request
```

로그인에 성공하면 Redis에는 사용자의 UUID와 로그인 시간, 만료 시간을 저장한다.

토큰의 유효 시간이 만료되거나 사용자가 로그아웃하면 Redis에 저장된 해당 사용자 정보를 제거하도록 구현했다.

이를 통해 인증 관련 기능을 별도의 서버에서 관리할 수 있도록 구성했다.

### API Server

API Server는 플랫폼의 핵심 Backend 역할을 담당한다.

회원 정보에 대한 CRUD와 함께 사용자가 배포하고자 하는 프로젝트의 정보를 입력받는 기능을 구현했다.

특히 프로젝트 배포 요청이 들어오면 입력된 정보를 기반으로 Jenkins와 REST 통신하여 Build 및 Deployment Process를 시작하도록 구성했다.

```text
User
 ↓
Project Configuration
 ↓
API Server
 ↓
Jenkins REST API
 ↓
Build Pipeline
 ↓
EKS Deployment
```

즉 API Server가 단순한 데이터 CRUD 역할만 하는 것이 아니라 사용자의 요청과 실제 Infrastructure Deployment Pipeline을 연결하는 역할을 담당했다.

### Front Server

Front Server에서는 사용자가 자신의 서비스와 배포 상태를 확인할 수 있도록 구성했다.

사용자는 플랫폼을 통해 프로젝트 정보를 입력하고 서비스의 배포 현황과 전반적인 운영 상태를 확인할 수 있다.

이를 통해 Kubernetes나 Jenkins를 직접 다루지 않더라도 플랫폼을 통해 배포 과정을 수행할 수 있도록 하는 것이 목표였다.

## Cloud Infrastructure

서비스가 실제로 실행되는 환경은 AWS 기반 Cloud Infrastructure로 구성했다.

{% include paper-figure.html src="projects/zero-downtime-architecture.png" alt="AWS 기반 서비스 배포 플랫폼 Architecture" caption="MSA 플랫폼 아키텍처 — AWS 기반 서비스 배포 플랫폼" %}

주요 AWS Resource의 역할은 다음과 같다.

| Service | Role |
|:--|:--|
| Amazon EKS | 사용자 Application 실행 |
| Amazon ECR | Docker Image 저장 |
| Amazon RDS | 서비스 Database |
| ALB | 외부 Traffic 분산 |
| Route 53 | Domain 관리 |
| Global Accelerator | Multi-AZ 환경의 접근 경로 구성 |

핵심은 EKS였다.

사용자가 등록한 Application은 Docker Image로 만들어 ECR에 저장하고, 이후 Kubernetes Manifest를 이용하여 EKS Cluster에 배포하도록 구성했다.

```text
Application
     ↓
Docker Build
     ↓
Amazon ECR
     ↓
Amazon EKS
     ↓
Pod
     ↓
Service / Load Balancer
```

이를 통해 Application과 실행 환경을 Container 단위로 관리할 수 있도록 했다.

## Jenkins를 이용한 배포 자동화

이 프로젝트에서 Backend와 Infrastructure가 직접 연결되는 부분이 Jenkins Server였다.

사용자는 프로젝트 등록 과정에서 자신이 원하는 Application 및 Resource 정보를 입력한다.

API Server는 해당 정보를 Jenkins로 전달하고, Jenkins에서는 미리 작성해둔 Shell Script를 실행하여 EKS에 배포할 Kubernetes YAML을 생성하도록 구성했다.

```text
사용자 입력
     ↓
API Server
     ↓
Jenkins REST API
     ↓
Shell Script
     ↓
Kubernetes Manifest 생성
     ↓
Build / Dockerizing
     ↓
ECR
     ↓
EKS Deployment
```

결과적으로 개발자가 Kubernetes Manifest를 직접 작성하거나 EKS에 직접 접근하지 않아도 플랫폼에서 입력한 정보를 기반으로 배포 환경을 생성할 수 있도록 했다.

## CI/CD Pipeline

서비스 업데이트를 자동화하기 위해 Jenkins와 ArgoCD를 활용한 CI/CD Pipeline도 구성했다.

{% include paper-figure.html src="projects/zero-downtime-cicd.png" alt="Jenkins와 ArgoCD를 이용한 CI/CD Pipeline" caption="배포 및 CI/CD 흐름 — Jenkins · ArgoCD" %}

전체적인 흐름은 다음과 같다.

```text
Developer
    ↓
Source Code
    ↓
Jenkins
    ↓
Build
    ↓
Docker Image
    ↓
Amazon ECR
    ↓
Deployment Configuration
    ↓
ArgoCD
    ↓
Amazon EKS
```

Jenkins는 Application Build와 Docker Image 생성을 담당하고, Kubernetes 환경에서는 ArgoCD를 이용해 배포 상태를 관리하도록 구성했다.

서비스가 변경되었을 때 반복적으로 발생하는 수동 Build 및 Deployment 작업을 줄이고, Application과 Infrastructure의 배포 과정을 자동화하는 것이 목적이었다.

## Scale-Out을 고려한 서비스 운영

플랫폼에서 배포하는 Application은 처음부터 많은 Resource를 할당하기보다 최소한의 Resource로 시작하고, 이후 사용량 증가에 대응하여 Kubernetes 환경에서 확장할 수 있도록 설계했다.

```text
Normal Traffic
       ┌─────┐
       │ Pod │
       └─────┘

Traffic Increase
       ┌─────┐
       │ Pod │
       └─────┘
          ↓
    Scale-Out
      ↙   ↓   ↘
   Pod   Pod   Pod
```

이를 통해 초기에는 필요한 만큼의 Resource만 사용하고, Traffic 증가 시 Container 단위로 Application을 확장할 수 있도록 했다.

서비스를 특정 서버 한 대에 종속시키기보다 Kubernetes를 통해 여러 Pod로 실행할 수 있도록 구성한 것이 핵심이었다.

## Monitoring

서비스를 배포하는 것에서 끝내지 않고 Prometheus와 Grafana를 이용한 Monitoring 환경도 구성했다.

```text
Kubernetes / Application
          ↓
      Prometheus
          ↓
       Metrics
          ↓
       Grafana
          ↓
      Dashboard
```

이를 통해 배포된 서비스와 Infrastructure의 상태를 확인할 수 있도록 했다.

서비스를 자동으로 배포하더라도 운영 상태를 확인할 수 없다면 장애 상황에 대응하기 어렵기 때문에 배포 자동화와 Monitoring을 하나의 운영 과정으로 연결하고자 했다.

## 구현하면서 어려웠던 점

### 1. 사용자 입력으로 Kubernetes Manifest 생성하기

Jenkins에서는 사용자가 입력한 Resource 정보를 기반으로 Shell Script를 실행하여 Kubernetes Manifest를 생성했다.

이 과정에서 가장 고민했던 부분 중 하나는 사용자 입력값을 Shell Script에 안전하고 일관된 형태로 전달하는 것이었다.

입력값에 대한 검증이 충분하지 않으면 잘못된 값으로 인해 생성되는 Manifest 자체가 올바르지 않을 수 있기 때문이다.

당시에는 Shell Script 중심으로 처리했기 때문에 입력 검증에 한계가 있었고, 이를 어떻게 구조화할 것인지 고민했던 기억이 있다.

### 2. API Server와 Jenkins 연동

또 하나 어려웠던 부분은 Spring 기반 API Server와 Jenkins 사이의 REST 통신이었다.

사용자가 입력한 프로젝트 정보를 Jenkins에 전달하여 Build 작업을 생성하거나 실행해야 했는데, 이 과정에서 Jenkins가 요구하는 XML 형식에 맞추어 데이터를 생성하고 전달해야 했다.

```text
Spring API Server
       ↓
Project Information
       ↓
XML Conversion
       ↓
Jenkins REST API
       ↓
Build Job
```

단순히 API를 호출하는 것에서 끝나는 것이 아니라 애플리케이션에서 관리하는 프로젝트 정보를 Jenkins가 이해할 수 있는 형식으로 변환하는 과정이 필요했다.

이 부분을 구현하면서 외부 시스템의 API와 Backend Service를 연동할 때 데이터 형식과 Interface를 정확히 이해하는 것이 중요하다는 것을 경험했다.

## 프로젝트를 돌아보며

이 프로젝트에서 가장 많이 배운 것은 Backend 개발과 Infrastructure가 서로 독립적인 영역이 아니라는 것이었다.

처음에는 사용자에게 프로젝트 정보를 입력받고 Kubernetes에 배포하는 기능을 만드는 것이 목표였다.

하지만 이를 실제로 구현하려면

```text
Backend API
     ↓
Authentication
     ↓
Jenkins
     ↓
Docker
     ↓
Container Registry
     ↓
Kubernetes
     ↓
GitOps
     ↓
Monitoring
```

까지 여러 기술이 하나의 흐름으로 연결되어야 했다.

특히 Spring Boot로 작성한 API Server에서 Jenkins를 호출하고, Jenkins가 Application을 Build하고 Container Image를 생성한 뒤 EKS에 배포되는 과정을 구현하면서 Application Code가 실제 Cloud Infrastructure 위에서 서비스가 되기까지의 전체 과정을 경험할 수 있었다.

또한 Kubernetes를 사용하면서 단순히 Container를 실행하는 것을 넘어 서비스 확장, 배포 상태 관리 및 Monitoring과 같은 운영 관점의 문제도 함께 고민하게 되었다.

지금 다시 구현한다면 사용자 입력을 직접 Shell Script로 전달하여 Manifest를 생성하는 구조나 CI/CD Pipeline의 역할 분리 등 여러 부분을 다시 설계해보고 싶다.

그럼에도 이 프로젝트는 Backend 개발에서 시작하여 Docker, Kubernetes, AWS, Jenkins, ArgoCD와 Monitoring까지 직접 연결해보며 Cloud-Native Application이 개발되고 배포되는 전체 Lifecycle을 처음 경험했던 프로젝트로 기억에 남아 있다.
