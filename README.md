# Google Tag Manager & Meta Pixel Automation Skill

A comprehensive automation toolkit for AI agents (OpenClaw/Claude Code) that streamlines analytics implementation from audit to production deployment.

## Overview
This skill handles the complete analytics lifecycle by passing state files between 7 core steps:
1. `audit.js` - Scans React/Next.js codebases for trackable elements
2. `plan.js` - Maps elements to GTM DataLayer and Meta Pixel standard events
3. `implement.js` - Injects `js-track` CSS classes into source code
4. (Additional steps document the API pushes and testing)

## Installation
```bash
npx skills add aimonk2025/google-tag-manager-automation
```

## Structure
- `SKILL.md` - Core agent instructions and workflow
- `scripts/` - Node.js scripts for DOM manipulation and API logic
