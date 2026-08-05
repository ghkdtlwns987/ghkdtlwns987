---
layout: default
title: Home
---

<div class="hero">
  <h1>황시준 (Si June Hwang)</h1>
  <p class="subtitle">AI Security Researcher · Vulnerability Researcher · Security Engineer</p>
  <p class="bio">
    취약점 분석 경험과 소프트웨어 보안 연구를 기반으로
    <strong>Large Language Models (LLMs), Knowledge Graph, Multi-Agent Reasoning</strong>을
    활용한 차세대 AI 기반 취약점 탐지 기술을 연구하고 있습니다.
  </p>
  <div class="hero-links">
    <a class="btn btn-primary" href="{{ '/research/' | relative_url }}">Research</a>
    <a class="btn" href="{{ '/publications/' | relative_url }}">Publications</a>
    <a class="btn" href="{{ '/blog/' | relative_url }}">Blog</a>
    <a class="btn" href="https://github.com/ghkdtlwns987" target="_blank" rel="noopener">GitHub</a>
  </div>
</div>

<section>
  <h2>News</h2>
  <ul class="news-list">
    <li class="news-item">
      <div class="news-meta">
        <time class="news-date">Aug 2026</time>
        <span class="news-badge">New</span>
        <span class="news-tag">ASE 2026</span>
      </div>
      <p class="news-text">
        <strong>CLEAR</strong> 논문이 arXiv에 게재되었습니다.
        <em>CLEAR: Causal Context-Based Agentic Reasoning for Vulnerability Detection</em>
        — IEEE/ACM ASE 2026 ·
        <a href="https://arxiv.org/abs/2608.03134" target="_blank" rel="noopener">arXiv:2608.03134</a>
      </p>
    </li>
    <li class="news-item">
      <div class="news-meta">
        <time class="news-date">2025</time>
        <span class="news-tag">Research</span>
      </div>
      <p class="news-text">
        한양대학교 정보보호학과 석사과정 입학 — AI Security · Knowledge Graph · Vulnerability Detection 연구 시작
      </p>
    </li>
    <li class="news-item">
      <div class="news-meta">
        <time class="news-date">2025</time>
        <span class="news-tag">Publication</span>
      </div>
      <p class="news-text">
        국내 학술대회 2편 발표 — CISC-S 2025, 한국통신학회 AI학술대회
      </p>
    </li>
  </ul>
</section>

<section>
  <h2>Highlights</h2>
  <div class="card-grid">
    <div class="card">
      <h3>ASE 2026 Full Paper (1st Author)</h3>
      <p class="meta">IEEE/ACM Automated Software Engineering</p>
      <p><em>CLEAR: Causal Context-based Agentic Reasoning for Vulnerability Detection</em></p>
    </div>
    <div class="card">
      <h3>Bug Bounty — Unreal Engine</h3>
      <p class="meta">RCE ×2 · DoS ×1</p>
      <p>총 <strong>$17,500</strong> 획득</p>
    </div>
    <div class="card">
      <h3>한양대학교 정보보호학과</h3>
      <p class="meta">석사과정 · 2025 ~</p>
      <p>AI Security · Vulnerability Detection · Knowledge Graph</p>
    </div>
  </div>
</section>

<section>
  <h2>Recent Posts</h2>
  <ul class="post-list">
    {% for post in site.posts limit:5 %}
    <li>
      <h3><a href="{{ post.url | relative_url }}">{{ post.title }}</a></h3>
      <time datetime="{{ post.date | date_to_xmlschema }}">{{ post.date | date: "%Y.%m.%d" }}</time>
      {% if post.excerpt %}
        <p>{{ post.excerpt | strip_html | truncate: 120 }}</p>
      {% endif %}
    </li>
    {% endfor %}
  </ul>
  {% if site.posts.size == 0 %}
    <p class="empty-state">아직 작성된 글이 없습니다. <code>_posts/</code> 디렉터리에 마크다운 파일을 추가하세요.</p>
  {% endif %}
</section>

<section>
  <h2>Contact</h2>
  <div class="card">
    <div class="contact-grid">
      <div class="contact-item">
        <span class="label">Email</span>
        <span class="value"><a href="mailto:ghkdtlwns987@naver.com">ghkdtlwns987@naver.com</a></span>
      </div>
      <div class="contact-item">
        <span class="label">Phone</span>
        <span class="value">010-4828-2771</span>
      </div>
      <div class="contact-item">
        <span class="label">GitHub</span>
        <span class="value"><a href="https://github.com/ghkdtlwns987" target="_blank" rel="noopener">github.com/ghkdtlwns987</a></span>
      </div>
      <div class="contact-item">
        <span class="label">Velog</span>
        <span class="value"><a href="https://velog.io/@ghkdtlwns987" target="_blank" rel="noopener">velog.io/@ghkdtlwns987</a></span>
      </div>
      <div class="contact-item">
        <span class="label">Tistory</span>
        <span class="value"><a href="https://pwnable-study.tistory.com" target="_blank" rel="noopener">pwnable-study.tistory.com</a></span>
      </div>
    </div>
  </div>
</section>
