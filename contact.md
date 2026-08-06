---
layout: default
title: Contact
permalink: /contact/
---

<div class="hero">
  <h1>Contact</h1>
  {% include page-lead.html page="contact" %}
</div>

<section>
  <div class="contact-card">
    <p>
      연구 협업, 프로젝트 문의, 채용 관련 연락 등은 아래 이메일로 보내 주세요.
    </p>
    <p class="contact-actions">
      <a
        href="mailto:{{ site.author.email }}?subject=Portfolio%20Inquiry"
        class="btn btn-primary"
      >
        {{ site.author.email }} 로 메일 보내기
      </a>
    </p>
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
      <div class="contact-item">
        <span class="label">Tistory</span>
        <span class="value"><a href="{{ site.author.tistory }}" target="_blank" rel="noopener">pwnable-study.tistory.com</a></span>
      </div>
    </div>
  </div>
</section>
