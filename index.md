---
layout: default
title: Home
---

<div class="page-intro">
  {% include intro.html %}
</div>

<section class="content-section">
  <h2 class="section-title">News</h2>
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
          <a href="{{ item.link }}" target="_blank" rel="noopener">{{ item.link_label }}</a>
        {% endif %}
      </p>
    </li>
    {% endfor %}
  </ul>
</section>

<section class="content-section">
  <h2 class="section-title">Poster</h2>
  {% if site.posts.size > 0 %}
  <ul class="post-list">
    {% for post in site.posts limit:5 %}
    <li>
      <h3><a href="{{ post.url | relative_url }}">{{ post.title }}</a></h3>
      <time datetime="{{ post.date | date_to_xmlschema }}">{{ post.date | date: "%Y.%m.%d" }}</time>
    </li>
    {% endfor %}
  </ul>
  <p class="cross-link"><a href="{{ '/poster/' | relative_url }}">전체 보기 →</a></p>
  {% else %}
  <p class="empty-state">아직 등록된 포스터가 없습니다.</p>
  {% endif %}
</section>

<section class="content-section">
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
