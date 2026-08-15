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

    <section class="poster-archive" id="poster-archive" aria-label="Poster archive">
      <h2 class="section-title">All Posts</h2>

      <div class="poster-filters" id="poster-filters">
        <div class="poster-filter-group" data-filter-group="category">
          <span class="poster-filter-label">Category</span>
          <button type="button" class="poster-filter-chip is-active" data-filter="all">All</button>
          {% for cat in site.data.poster.categories %}
          <button type="button" class="poster-filter-chip" data-filter="{{ cat.slug }}">{{ cat.title }}</button>
          {% endfor %}
        </div>
        <div class="poster-filter-group" data-filter-group="year">
          <span class="poster-filter-label">Year</span>
          <button type="button" class="poster-filter-chip is-active" data-filter="all">All</button>
          {% assign year_str = '' %}
          {% for post in site.posts %}
            {% assign y = post.date | date: '%Y' %}
            {% assign hay = ',' | append: year_str | append: ',' %}
            {% assign token = ',' | append: y | append: ',' %}
            {% unless hay contains token %}
              {% if year_str != '' %}
                {% assign year_str = year_str | append: ',' | append: y %}
              {% else %}
                {% assign year_str = y %}
              {% endif %}
            {% endunless %}
          {% endfor %}
          {% assign years = year_str | split: ',' %}
          {% for y in years %}
            {% if y != '' %}
          <button type="button" class="poster-filter-chip" data-filter="{{ y }}">{{ y }}</button>
            {% endif %}
          {% endfor %}
        </div>
      </div>

      <ul class="post-list post-list--cards poster-archive-list" id="poster-archive-list">
        {% for post in site.posts %}
          {% include poster-card.html post=post %}
        {% else %}
          <li class="poster-recent-empty">아직 등록된 Poster가 없습니다.</li>
        {% endfor %}
      </ul>
      <p class="poster-filter-empty" id="poster-filter-empty" hidden>해당 조건의 Poster가 없습니다.</p>
    </section>
  </div>

  <div class="post-side-rail">
    {% include content-topbar.html %}
    {% include poster-side-rail.html poster_limit=5 %}
  </div>
</div>

<script src="{{ '/assets/js/poster-filter.js' | relative_url }}?v=2"></script>
