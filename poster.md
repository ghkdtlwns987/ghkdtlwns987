---
layout: default
title: Poster
permalink: /poster/
description: >-
  논문 리뷰, 알고리즘 풀이, 연구 노트를 모아 둔 Poster 아카이브입니다.
---

<div class="post-layout page-layout">
  <div class="page-layout-main">
    <div class="hero">
      <h1>Poster</h1>
      {% include page-lead.html page="poster" %}
    </div>

    {% include poster-tree.html %}
  </div>

  {% include poster-side-rail.html poster_limit=5 %}
</div>
