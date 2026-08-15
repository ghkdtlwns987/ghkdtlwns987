---
layout: default
title: Blog
permalink: /poster/
description: >-
  연구, 보안, 엔지니어링, 알고리즘, 일상 글을 모은 블로그입니다.
---

<div class="post-layout page-layout">
  <div class="page-layout-main">
    <div class="hero">
      <h1>Blog</h1>
      {% include page-lead.html page="poster" %}
    </div>

    {% include poster-tree.html %}

    <section class="poster-archive" id="poster-archive" aria-label="Blog archive">
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
        <div class="poster-filter-group" data-filter-group="badge">
          <span class="poster-filter-label">Badge</span>
          <button type="button" class="poster-filter-chip is-active" data-filter="all">All</button>
          {% assign badge_str = '' %}
          {% for post in site.posts %}
            {% if post.badges %}
              {% for badge in post.badges %}
                {% assign b = badge | append: '' %}
                {% assign by = b | plus: 0 | append: '' %}
                {% assign skip = false %}
                {% if b.size == 4 and by == b %}
                  {% assign skip = true %}
                {% endif %}
                {% unless skip %}
                  {% assign hay = '|' | append: badge_str | append: '|' %}
                  {% assign token = '|' | append: b | append: '|' %}
                  {% unless hay contains token %}
                    {% if badge_str != '' %}
                      {% assign badge_str = badge_str | append: '|' | append: b %}
                    {% else %}
                      {% assign badge_str = b %}
                    {% endif %}
                  {% endunless %}
                {% endunless %}
              {% endfor %}
            {% endif %}
          {% endfor %}
          {% assign badge_list = badge_str | split: '|' %}
          {% for b in badge_list %}
            {% if b != '' %}
          <button type="button" class="poster-filter-chip" data-filter="{{ b }}">{{ b }}</button>
            {% endif %}
          {% endfor %}
        </div>
      </div>

      <ul class="post-list post-list--cards poster-archive-list" id="poster-archive-list">
        {% for post in site.posts %}
          {% include poster-card.html post=post %}
        {% else %}
          <li class="poster-recent-empty">아직 등록된 글이 없습니다.</li>
        {% endfor %}
      </ul>
      <p class="poster-filter-empty" id="poster-filter-empty" hidden>해당 조건의 글이 없습니다.</p>
    </section>
  </div>

  <div class="post-side-rail">
    {% include content-topbar.html %}
    {% include poster-side-rail.html poster_limit=5 %}
  </div>
</div>

<script src="{{ '/assets/js/poster-filter.js' | relative_url }}?v=4"></script>
