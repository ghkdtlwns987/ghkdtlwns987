---
layout: default
title: Blog
permalink: /blog/
---

<div class="hero">
  <h1>Blog</h1>
  <p class="bio">AI Security, Vulnerability Research, 그리고 기술에 관한 글</p>
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
    <p class="empty-state">아직 작성된 글이 없습니다.</p>
  {% endif %}
</section>

<section>
  <h2>글 작성 방법</h2>
  <div class="card">
    <p><code>_posts/</code> 디렉터리에 다음 형식의 파일을 추가하세요:</p>
    <pre><code>---
layout: post
title: "글 제목"
date: 2026-03-19
categories: [AI Security, Research]
tags: [LLM, Vulnerability]
---

본문 내용...</code></pre>
  </div>
</section>
