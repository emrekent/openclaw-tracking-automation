# Google Tag Manager & Meta Pixel Automation Skill

**Production-grade tracking automation toolkit for AI agents.**

A comprehensive toolkit for Claude Code and OpenClaw that streamlines analytics implementation from codebase audit to production reporting, completely automating the GTM and Meta Pixel lifecycle.

---

## Install

From GitHub:
```bash
npx skills add https://github.com/emrekent/openclaw-tracking-automation --skill openclaw-tracking-automation
```

---

## What It Does

When you need to instrument a new React/Next.js site, this skill guides you through:

```
1. AUDIT → Scans codebase for trackable elements (buttons, forms)
2. PLAN → Maps elements to GTM DataLayer and Meta Pixel events
3. IMPLEMENT → Injects standardized `js-track` CSS classes into source
4. TEST → Verifies implementation via Playwright tests
5. REPORT → Generates event schemas and deployment logs
```

## What Makes This Worth Installing
- **Zero-Friction DOM Injection**: Automatically standardizes your element IDs and classes (`js-track js-click_button`) without breaking visual styling.
- **Dual-Engine Output**: Generates both Google Tag Manager `dataLayer` schemas and Meta Pixel Standard Events.
- **Tiered Testing**: Starts with automated headless tests and escalates to manual GA4 DebugView checklists if needed.

## Quick Proof

Before (Messy React Component):
```jsx
<button className="bg-blue-500 rounded" onClick={submit}>Join Now</button>
```

After (Automated standardization):
```jsx
<button className="bg-blue-500 rounded js-track js-generate_lead" id="btn_hero_join_now" onClick={submit}>Join Now</button>
```

---

## Best Prompts To Try

```text
"Audit my /src directory for tracking opportunities."
"Standardize my DOM for GTM tracking."
"Implement the tracking plan and inject classes."
"Generate documentation for my new analytics setup."
```

---

## What's Inside

```
openclaw-tracking-automation/
├── SKILL.md                 Core skill guide and execution workflow
├── audit.js                 Codebase scanner and report generator
├── plan.js                  Event taxonomy and strategy mapper
├── implement.js             DOM manipulation and CSS class injector
└── credentials.js           API token handler
```

---

## About the Creator

Built by **[Emre Kent](https://www.linkedin.com/in/emrekent)** — Systems architect & builder. Former math teacher turned automation designer.

I design growth engines, AI workflows, and automation systems. I build CRM architectures, AI agents, n8n automation systems, and personal operating systems that compound.

For discussions on AI agents, skills architecture, and automation systems — [connect on LinkedIn](https://www.linkedin.com/in/emrekent).

---

## License

Open source. Free to use, adapt, and build on.
