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

  {% if cat.slug == 'algorithm' %}
    {% include poster-algorithm-tree.html %}
  {% else %}
    <ul class="post-list">
      {% assign has_post = false %}
      {% for post in site.posts %}
        {% include poster-path.html post=post %}
        {% if poster_cat == cat.slug and poster_sub == '' %}
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
  {% endif %}
</section>
{% endfor %}

<section>
  <div class="card">
    <h3>폴더 구조</h3>
    <pre><code>_posts/
├── algorithm/
│   └── dp/
│       ├── 2026-03-19-knapsack.md       → dp/1 (problem: "1")
│       └── 2026-03-20-lcs.md            → dp/2 (problem: "2")
├── paper/
│   └── 2026-08-04-clear-poster.md       → paper
└── etc/
    └── 2026-03-21-bob.md                → etc</code></pre>

    <p class="meta" style="margin-top: 1rem;">파일명은 <code>YYYY-MM-DD-slug.md</code> 형식이어야 Jekyll이 포스트로 인식합니다. 분류는 폴더가 결정하고, 화면의 <code>dp/N</code> 표시는 front matter <code>problem</code>으로 지정합니다.</p>
    <pre><code>---
layout: post
title: "문제 제목"
date: 2026-03-19
problem: "1"
---</code></pre>
  </div>
</section>
