---
layout: default
title: "황시준 | Si June Hwang"
description: >-
  황시준(Si June Hwang) 개인 사이트. LLM for Software Engineering, AI Security 연구 소개와 Poster 글을 모았습니다.
image: /assets/images/1.png
---

<div class="page-intro">
  {% include intro.html %}
</div>

<section class="content-section content-section--feed" id="news">
  <h2 class="section-title section-title--feed">News</h2>
  <ul class="news-list">
    {% for item in site.data.profile.news %}
      {% include assign-news-has-new.html item=item %}
      {% if news_has_new %}
        {% include news-item.html item=item %}
      {% endif %}
    {% endfor %}
  </ul>
  {% include publication-modal.html %}
</section>

<section class="content-section content-section--feed" id="recent-poster">
  <h2 class="section-title section-title--feed">Recent Poster</h2>
  {% include poster-recent.html %}
  <p class="cross-link cross-link--feed"><a href="{{ '/poster/' | relative_url }}">Poster 전체 보기 →</a></p>
</section>

<section class="content-section" id="contact">
  <h2 class="section-title">Contact</h2>
  <div class="contact-card">
    <div class="contact-grid">
      <div class="contact-item">
        <span class="label">Email</span>
        <span class="value"><a href="mailto:{{ site.author.email }}">{{ site.author.email }}</a></span>
      </div>
      <div class="contact-item">
        <span class="label">GitHub</span>
        <span class="value"><a href="https://github.com/{{ site.author.github }}" target="_blank" rel="noopener">github.com/{{ site.author.github }}</a></span>
      </div>
      <div class="contact-item">
        <span class="label">Velog</span>
        <span class="value"><a href="{{ site.author.velog }}" target="_blank" rel="noopener">velog.io/@{{ site.author.github }}</a></span>
      </div>
    </div>
  </div>
</section>
