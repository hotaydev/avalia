---
title: "Avalia: An Open-Source System for Managing and Evaluating Science Fairs in Basic Education"
tags:
  - Typescript
  - Scientific Fairs
  - Educational Assessment
  - Science Education
  - Educational Tools
authors:
  - name: Taylor Hoffmann
    orcid: 0000-0002-8418-514X
    affiliation: "1,2"
affiliations:
  - name: Hotay Software, Rio Grande do Sul, Brazil
    index: 1
  - name: Fundação CERTI, Santa Catarina, Brazil
    index: 2
date: 13 May 2025
bibliography: paper.bib
---

# Summary

Many schools organize science fairs and related initiatives to foster students’
interest in research and innovation. However, coordinating these activities
often falls to teachers who voluntarily devote hours beyond the instructional
period to project planning and evaluation, leading to fatigue and decreased
motivation. In this paper, we present an integrated open-source platform for
managing science fairs, encompassing project registration, evaluator assignment,
and the generation of rankings and reports. Evaluation of the system in primary
education schools demonstrated an 80% reduction in teachers’ time spent on
administrative tasks in these science fairs, enabling them to focus on
pedagogical support and scientific mentorship.

# Statement of need

The importance of school‐level science fairs is well established: they enhance
students’ aptitude and interest in STEM disciplines
[@Grinnell:2020; @Schmidt:2017] and contribute broadly to improved learning
outcomes in primary and secondary education [@Jaworski:2017].

Although formats vary, such fairs typically involve the following stages:
application of the scientific method, literature review, experimental practice,
project presentation, and evaluation, culminating in a ranking of projects
according to quality assessments [@Kook:2020].

A major barrier to organizing these events is the scarcity of resources.
Teachers must guide students through every phase of their projects and then
coordinate the fair itself: recruiting and assigning evaluators, designing and
distributing assessment materials, and aggregating scores. We estimate that, for
just the tasks of contacting evaluators, managing assignments, and computing
final rankings, a team of three teachers invests approximately 40 hours each
over three days, work carried out largely outside their regular hours.

This overload leads to fatigue and reduced teacher motivation, undermining
incentives to sustain such events [@Tortop:2013]. To streamline fair management,
we collaborated with the school community to specify a lightweight system for
handling projects, evaluators, and rankings.

The result of this collaboration is Avalia, the software presented in this
paper. Trialed in three distinct science fairs, Avalia reduced teachers’
administrative workload to about 8 hours, only 20% of the effort previously
required, demonstrating its substantial utility.

Before Avalia’s development, we reviewed alternative solutions. Existing tools
tended to be over‑engineered, offering extensive feature sets that were not
tailored to the specific needs of school fairs, and often required paid
subscriptions - an impractical model given the budgetary constraints typical of
Brazilian public schools [@Rossi:2019]. Moreover, searches on GitHub, GitLab,
and Zenodo revealed no open‑source software providing equivalent functionality.

# Architecture, Features, and Future Directions

The system was designed so that any member of the school community with
technical skills can deploy and customize their instance. We also maintain a
public deployment at [https://avalia.hotay.dev](https://avalia.hotay.dev) to
facilitate general access.

To keep the platform free of charge and freely available, we use Google Sheets
hosted on Google Drive as our data store, accessed securely via the free tier of
the Google Cloud Console APIs. User authentication is handled through Firebase,
with the implementation of social login and magic-link authentication,
eliminating passwords and reducing potential attack vectors. Hosting is provided
by Vercel under its free plan. Additionally, we employ Cloudflare’s free Web
Application Firewall (WAF), caching, and rate limiting on API endpoints to
mitigate security risks.

Key features of Avalia include:

- Project registration and management;
- Reviewer registration and administration;
- Assignment of projects to reviewers;
- Administrative user management;
- Direct-access links for reviewers;
- Automatic project ranking;
- Dynamic definition of award categories and evaluation criteria;
- Handles multiple fair editions via separate spreadsheets.

To streamline adoption, we supply ready-to-clone spreadsheet templates and
comprehensive documentation, including Brazilian-Portuguese video tutorials on
platform usage.

Future enhancements

- Internationalization of the interface and content;
- Reviewer/participant self-registration portal to lighten teachers’ work.

# Acknowledgements

We thank Escola Estadual de Ensino Médio João Wagner for allowing the initial
testing of the Avalia system during its science fair, and Professor Wilson
Júnior for proposing the project. We also acknowledge the schools in Rio Grande
do Sul, Brazil, whose adoption and feedback helped improve the system.

# References
