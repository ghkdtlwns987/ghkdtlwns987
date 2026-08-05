---
layout: default
title: Home
---

<div class="hero-banner">
  <h2 class="hero-banner-title">👋 안녕하세요, {{ site.data.profile.name }}입니다</h2>
  <p class="hero-banner-sub">{{ site.data.profile.tagline }}</p>
  <div class="hero-banner-actions">
    <a class="btn btn-white" href="{{ '/publications/' | relative_url }}">Publications</a>
    <a class="btn btn-white" href="{{ '/research/' | relative_url }}">Research</a>
    <a class="btn btn-white" href="{{ '/about/' | relative_url }}">About Me</a>
  </div>
</div>

<section class="content-section">
  <h2 class="section-title">📌 Featured</h2>
  <article class="featured-card">
    <div class="featured-visual">
      <div class="featured-icon">📄</div>
    </div>
    <div class="featured-body">
      <span class="featured-tag">{{ site.data.profile.featured.tag }}</span>
      <h3 class="featured-title">
        <a href="{{ site.data.profile.featured.link }}" target="_blank" rel="noopener">
          {{ site.data.profile.featured.title }}
        </a>
      </h3>
      <p class="featured-meta">{{ site.data.profile.featured.venue }} · <a href="{{ site.data.profile.featured.link }}" target="_blank" rel="noopener">arXiv:2608.03134</a></p>
      <p class="featured-desc">{{ site.data.profile.intro | truncate: 180 }}</p>
    </div>
  </article>
</section>

<section class="content-section">
  <h2 class="section-title">🔬 Research in Progress</h2>
  <div class="series-grid">
    {% for area in site.data.profile.research_areas %}
    <div class="series-card">
      <h3 class="series-name">{{ area.name }}</h3>
      <div class="progress-bar">
        <div class="progress-fill" style="width: {{ area.progress }}%;"></div>
      </div>
      <p class="series-meta">Ongoing research</p>
    </div>
    {% endfor %}
  </div>
</section>

<section class="content-section mobile-only">
  <h2 class="section-title">📢 News</h2>
  <ul class="news-list">
    {% for item in site.data.profile.news %}
    <li class="news-item">
      <div class="news-meta">
        <time class="news-date">{{ item.date }}</time>
        {% if item.badge %}<span class="news-badge">{{ item.badge }}</span>{% endif %}
        {% if item.tag %}<span class="news-tag">{{ item.tag }}</span>{% endif %}
      </div>
      <p class="news-text">
        {{ item.text }}
        {% if item.link %}
          — <a href="{{ item.link }}" target="_blank" rel="noopener">{{ item.link_label }}</a>
        {% endif %}
      </p>
    </li>
    {% endfor %}
  </ul>
</section>

<section class="content-section">
  <h2 class="section-title">✨ Highlights</h2>
  <div class="card-grid">
    <div class="card">
      <h3>ASE 2026</h3>
      <p class="meta">IEEE/ACM Automated Software Engineering</p>
      <p><em>CLEAR</em> — Multi-Agent + VCKG 기반 취약점 탐지</p>
    </div>
    <div class="card">
      <h3>Bug Bounty</h3>
      <p class="meta">Unreal Engine · RCE ×2 · DoS ×1</p>
      <p>총 <strong>$17,500</strong></p>
    </div>
    <div class="card">
      <h3>BoB 10기</h3>
      <p class="meta">취약점 분석 트랙 수료</p>
      <p>Fuzzing · Reverse Engineering</p>
    </div>
  </div>
</section>
