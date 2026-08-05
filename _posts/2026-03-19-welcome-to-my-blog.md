---
layout: post
title: "GitHub Pages 블로그 시작하기"
date: 2026-03-19
categories: [Meta]
tags: [GitHub Pages, Jekyll, Blog]
---

이 저장소는 **포트폴리오 + 기술 블로그**를 위한 GitHub Pages 사이트입니다.

## 구조

```
ghkdtlwns987/
├── README.md              # GitHub 프로필 (프로필 페이지에 표시)
├── _config.yml            # Jekyll 설정
├── _posts/                # 블로그 포스트 (YYYY-MM-DD-title.md)
├── _layouts/              # HTML 레이아웃
├── _includes/             # 재사용 컴포넌트
├── assets/css/            # 스타일시트
├── index.md               # 홈페이지
├── about.md               # 소개
├── research.md            # 연구
├── projects.md            # 프로젝트
├── publications.md        # 논문
└── blog.md                # 블로그 목록
```

## 새 글 작성

1. `_posts/` 에 `2026-03-19-my-post-title.md` 형식으로 파일 생성
2. Front matter에 `layout: post`, `title`, `date`, `categories` 작성
3. `main` 브랜치에 push하면 GitHub Actions가 자동 배포

## 로컬 미리보기

```bash
bundle install
bundle exec jekyll serve
# http://localhost:4000/ghkdtlwns987/
```

앞으로 AI Security, Vulnerability Research 관련 글을 이곳에 작성할 예정입니다.
