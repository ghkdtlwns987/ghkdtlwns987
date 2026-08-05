---
layout: default
title: Poster
permalink: /poster/
---

<div class="hero">
  <h1>Poster</h1>
  {% include page-lead.html page="poster" %}
</div>

{% for cat in site.data.poster_categories %}
<section class="poster-category">
  <h2 class="section-title">{{ cat.title }}</h2>
  {% if cat.description %}<p class="poster-category-desc">{{ cat.description }}</p>{% endif %}

  <ul class="post-list">
    {% assign has_post = false %}
    {% for post in site.posts %}
      {% if post.categories contains cat.slug %}
        {% assign has_post = true %}
        <li>
          <h3><a href="{{ post.url | relative_url }}">{{ post.title }}</a></h3>
          <time datetime="{{ post.date | date_to_xmlschema }}">{{ post.date | date: "%Y.%m.%d" }}</time>
          {% if post.excerpt %}
            <p>{{ post.excerpt | strip_html | truncate: 160 }}</p>
          {% endif %}
        </li>
      {% endif %}
    {% endfor %}
  </ul>

  {% unless has_post %}
    <p class="empty-state">아직 등록된 포스터가 없습니다.</p>
  {% endunless %}
</section>
{% endfor %}

<section>
  <div class="card">
    <h3>포스터 추가 방법</h3>
    <p class="meta"><code>_posts/</code> 디렉터리에 파일 생성</p>
    <pre><code>---
layout: post
title: "포스터 제목"
date: 2026-03-19
categories: [paper]   # paper · algorithm · etc
---

내용...</code></pre>
  </div>
</section>
