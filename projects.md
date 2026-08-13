---
layout: with-rail
title: Projects
permalink: /projects/
---

<div class="hero">
  <h1>Projects</h1>
  {% include page-lead.html page="projects" %}
</div>

{% for section in site.data.projects.sections %}
<section>
  <h2>{{ section.title }}</h2>
  <div class="card-grid card-grid--uniform">
    {% for project in section.projects %}
      {% include project-card.html project=project %}
    {% endfor %}
  </div>
</section>
{% endfor %}

{% include project-modal.html %}
