---
layout: default
title: Poster
permalink: /poster/
---

<div class="hero">
  <h1>Poster</h1>
  {% include page-lead.html page="poster" %}
</div>

<section>
  <ul class="post-list">
    {% for post in site.posts %}
    <li>
      <h3><a href="{{ post.url | relative_url }}">{{ post.title }}</a></h3>
      <time datetime="{{ post.date | date_to_xmlschema }}">{{ post.date | date: "%Y.%m.%d" }}</time>
      {% if post.categories %}
        <span class="tags">
          {% for category in post.categories %}
            <span class="tag">{{ category }}</span>
          {% endfor %}
        </span>
      {% endif %}
      {% if post.excerpt %}
        <p>{{ post.excerpt | strip_html | truncate: 200 }}</p>
      {% endif %}
    </li>
    {% endfor %}
  </ul>

  {% if site.posts.size == 0 %}
    <p class="empty-state">아직 등록된 포스터가 없습니다.</p>
  {% endif %}
</section>
