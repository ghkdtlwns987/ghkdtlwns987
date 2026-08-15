---
layout: default
title: Research
permalink: /research/
description: >-
  LLM for Software Engineering and AI-driven Software Security. Knowledge Graph · RAG · Multi-Agent Reasoning.
---

<div class="hero">
  <h1>Research</h1>
  {% include page-lead.html page="research" %}
</div>

<section class="research-focus">
  <p class="research-focus__text">
    My research focuses on LLM for Software Engineering and AI-driven Software Security.
  </p>
  <p class="research-focus__sub">
    I explore knowledge-augmented and agentic reasoning to improve LLMs’ understanding and analysis of software.
  </p>
</section>

<section>
  <h2>Research Topics</h2>
  <ol class="research-topics">
    <li class="research-topic research-topic--se">
      <span class="research-topic__num" aria-hidden="true">01</span>
      <div class="research-topic__body">
        <h3>LLM for Software Engineering</h3>
        <p>코드 이해 · 프로그램 분석 · 자동 추론</p>
      </div>
    </li>
    <li class="research-topic research-topic--sec">
      <span class="research-topic__num" aria-hidden="true">02</span>
      <div class="research-topic__body">
        <h3>AI-driven Software Security</h3>
        <p>취약점 탐지 · 취약점 분석 · 프로그램 수리</p>
      </div>
    </li>
    <li class="research-topic research-topic--kg">
      <span class="research-topic__num" aria-hidden="true">03</span>
      <div class="research-topic__body">
        <h3>Knowledge-Augmented Reasoning</h3>
        <p>Knowledge Graph · RAG · Multi-Agent</p>
      </div>
    </li>
  </ol>
</section>

<section>
  <h2>Selected Publications</h2>
  <div class="research-pubs">
    {% for pub in site.data.publications.international %}
      {% if pub.featured %}
        {% assign review_post = false %}
        {% for post in site.posts %}
          {% if post.publication == pub.slug %}
            {% assign review_post = post %}
          {% endif %}
        {% endfor %}
        <article class="research-pub">
          <p class="research-pub__venue">{{ pub.venue }}</p>
          <h3 class="research-pub__title">{{ pub.headline | default: pub.title }}</h3>
          {% if pub.authors %}
            <p class="research-pub__authors">{{ pub.authors }}</p>
          {% endif %}
          <div class="research-pub__links">
            {% if pub.links %}
              {% for item in pub.links %}
                <a href="{{ item.url }}" target="_blank" rel="noopener">{% if item.label == 'arXiv' %}Paper{% else %}{{ item.label }}{% endif %}</a>
              {% endfor %}
            {% elsif pub.link %}
              <a href="{{ pub.link }}" target="_blank" rel="noopener">Paper</a>
            {% endif %}
            {% if review_post %}
              <a href="{{ review_post.url | relative_url }}">Review</a>
            {% endif %}
            <button type="button" class="research-pub__more" data-pub-modal="{{ pub.slug }}">Details</button>
          </div>
        </article>
      {% endif %}
    {% endfor %}
  </div>
  <p class="cross-link">
    <a href="{{ '/publications/' | relative_url }}">All publications →</a>
  </p>
</section>

<section>
  <h2>Patents</h2>
  <div class="card">
    <h3>지식그래프 기반 취약점 탐지 시스템</h3>
    <p class="meta">출원 진행 중</p>
  </div>
</section>

{% include publication-modal.html %}
