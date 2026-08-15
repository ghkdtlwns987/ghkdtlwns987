---
layout: default
title: "황시준 | Si June Hwang"
description: >-
  Si June Hwang, LLM, Software Engineering, AI Security Researcher
image: /assets/images/1.png
---

<div class="home-panel">
  <div class="home-panel__body">
    <div class="home-panel__main">
      <section class="home-panel__block" aria-label="Research identity">
        <p class="home-panel__label">Research Identity</p>
        <p class="home-panel__tagline">{{ site.data.profile.tagline }}</p>
        <div class="home-panel__intro">
          <p class="home-panel__intro-label">Introduction</p>
          <p class="bio bio--ko">{{ site.data.profile.intro }}</p>
          <p class="bio bio--en">{{ site.data.profile.intro_en }}</p>
        </div>
      </section>

      <section class="home-panel__block home-panel__block--news" id="news">
        <p class="home-panel__label">News</p>
        <ul class="news-list home-news-list">
          {% for item in site.data.profile.news %}
            {% include assign-news-has-new.html item=item %}
            {% if news_has_new %}
              {% include news-item.html item=item %}
            {% endif %}
          {% endfor %}
        </ul>
        {% include publication-modal.html %}
      </section>
    </div>

    <aside class="home-panel__rail" aria-label="Research interests and links">
      <div class="home-panel__rail-block">
        <p class="home-panel__label">Research Interests</p>
        <ul class="home-interest-list">
          <li class="home-interest-item home-interest-item--se">
            <span class="home-interest-num" aria-hidden="true">01</span>
            <span class="home-interest-body">
              <span class="home-interest-name">LLM for Software Engineering</span>
              <span class="home-interest-meta">Code Understanding · Program Analysis</span>
            </span>
          </li>
          <li class="home-interest-item home-interest-item--sec">
            <span class="home-interest-num" aria-hidden="true">02</span>
            <span class="home-interest-body">
              <span class="home-interest-name">AI-driven Software Security</span>
              <span class="home-interest-meta">Vulnerability Detection · Analysis</span>
            </span>
          </li>
          <li class="home-interest-item home-interest-item--kg">
            <span class="home-interest-num" aria-hidden="true">03</span>
            <span class="home-interest-body">
              <span class="home-interest-name">Knowledge-Augmented Reasoning</span>
              <span class="home-interest-meta">Knowledge Graph · RAG · Multi-Agent</span>
            </span>
          </li>
        </ul>
      </div>

      <div class="home-panel__rail-block home-panel__rail-block--links">
        <p class="home-panel__label">Links</p>
        <nav class="home-quick-links" aria-label="Quick links">
          <a href="{{ '/research/' | relative_url }}">Research</a>
          <a href="{{ '/publications/' | relative_url }}">Publications</a>
          <a href="{{ '/poster/' | relative_url }}">Blog</a>
          <a href="{{ '/about/' | relative_url }}">CV</a>
        </nav>
      </div>
    </aside>
  </div>

  <section class="home-panel__section" id="recent-poster">
    <div class="home-panel__section-head">
      <p class="home-panel__label">Recent Posts</p>
      <a class="home-panel__more" href="{{ '/poster/' | relative_url }}">Blog →</a>
    </div>
    {% include poster-recent.html limit=4 grid=true %}
  </section>

  <section class="home-panel__section home-panel__section--contact" id="contact">
    <p class="home-panel__label">Contact</p>
    <div class="home-contact">
      <a href="mailto:{{ site.author.email }}">Email</a>
      <span class="home-contact__sep" aria-hidden="true">·</span>
      <a href="https://github.com/{{ site.author.github }}" target="_blank" rel="noopener">GitHub</a>
      <span class="home-contact__sep" aria-hidden="true">·</span>
      <a href="{{ site.author.velog }}" target="_blank" rel="noopener">Velog</a>
    </div>
  </section>
</div>
