---
layout: default
title: Home
---

<div class="page-intro">
  {% include intro.html %}
</div>

<section class="content-section content-section--feed">
  <h2 class="section-title section-title--feed">News</h2>
  <ul class="news-list">
    {% for item in site.data.profile.news %}
    <li class="news-item{% if forloop.first %} news-item--featured{% endif %}">
      <div class="news-meta">
        <time class="news-date">{{ item.date }}</time>
        {% if item.badges %}
          {% for badge in item.badges %}
            <span class="news-badge news-badge--{{ badge | downcase }}">{{ badge }}</span>
          {% endfor %}
        {% elsif item.badge %}
          <span class="news-badge">{{ item.badge }}</span>
        {% endif %}
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

<section class="content-section content-section--feed">
  <h2 class="section-title section-title--feed">Recent Poster</h2>
  <div class="home-feed-panel">
    {% include poster-recent.html %}
  </div>
  <p class="cross-link cross-link--feed"><a href="{{ '/poster/' | relative_url }}">Poster 전체 보기 →</a></p>
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
