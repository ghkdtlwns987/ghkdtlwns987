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
  <div class="poster-tree">
    {% for cat in site.data.poster_categories %}
    <div class="poster-tree-group">
      <h3 class="poster-tree-label">{{ cat.title }}</h3>
      <ul class="poster-tree-list">
        {% assign has_post = false %}
        {% for post in site.posts %}
          {% if post.categories contains cat.slug %}
            {% assign has_post = true %}
            <li><a href="{{ post.url | relative_url }}">{{ post.title }}</a></li>
          {% endif %}
        {% endfor %}
        {% unless has_post %}
          <li class="poster-tree-empty">—</li>
        {% endunless %}
      </ul>
    </div>
    {% endfor %}
  </div>
  <p class="cross-link"><a href="{{ '/poster/' | relative_url }}">전체 보기 →</a></p>
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
