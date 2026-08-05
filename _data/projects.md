---
layout: default
title: Projects
permalink: /projects/
---

<div class="hero">
  <h1>Projects</h1>
  {% include page-lead.html page="projects" %}
</div>

<section>
  <h2>Security Research</h2>
  <div class="card-grid">
    <div class="card">
      <h3>CLEAR</h3>
      <p class="meta">Multi-Agent Vulnerability Detection Framework</p>
      <p>LLM · Knowledge Graph · Multi-Agent 기반 취약점 탐지 프레임워크 구현.</p>
      <p class="cross-link">
        <a href="https://arxiv.org/abs/2608.03134" target="_blank" rel="noopener">http://arxiv.org/abs/2608.03134
</a>
        · <a href="{{ '/publications/' | relative_url }}">details</a>
      </p>
      <div class="tags">
        <span class="tag">LLM</span>
        <span class="tag">Knowledge Graph</span>
        <span class="tag">Multi-Agent</span>
        <span class="tag tag-green">Python</span>
      </div>
    </div>

    <div class="card">
      <h3>Unreal Engine Vulnerability Analysis with Fuzzing</h3>
      <p class="meta">BoB 10기</p>
      <p>Fuzzing 기반 게임 엔진 취약점 분석. RCE 2건, DoS 1건 발견 · Bug Bounty $17,500.</p>
      <div class="tags">
        <span class="tag">Fuzzing</span>
        <span class="tag">Reverse Engineering</span>
        <span class="tag tag-purple">Bug Bounty</span>
      </div>
    </div>

    <div class="card">
      <h3>AI-Based Malware Detection MSA</h3>
      <p class="meta">Capstone Project · 조선대학교</p>
      <p>AI 기반 악성코드 탐지 마이크로서비스 아키텍처 설계 및 구현.</p>
      <div class="tags">
        <span class="tag">AI</span>
        <span class="tag">MSA</span>
        <span class="tag tag-green">Python</span>
      </div>
    </div>
  </div>
</section>

<section>
  <h2>Engineering</h2>
  <div class="card-grid">
    <div class="card">
      <h3>Kubernetes 기반 MSA Deployment Platform</h3>
      <p class="meta">Cloud / DevOps</p>
      <p>마이크로서비스 배포 플랫폼 및 CI/CD 파이프라인 자동화.</p>
      <div class="tags">
        <span class="tag">Kubernetes</span>
        <span class="tag">Docker</span>
        <span class="tag tag-green">GitHub Actions</span>
      </div>
    </div>

    <div class="card">
      <h3>Live Coding Platform</h3>
      <p class="meta">조선대학교</p>
      <p>Linux 기반 대규모 코딩 실습 환경 운영 및 자동화.</p>
      <div class="tags">
        <span class="tag">Linux</span>
        <span class="tag">Apache</span>
        <span class="tag">PHP</span>
        <span class="tag">MySQL</span>
      </div>
    </div>
  </div>
</section>
