---
name: openclaw-tracking-automation
description: Automate GTM and Meta Pixel tracking audits, planning, and implementation.
emoji: 🎯
---

# OpenClaw Tracking Automation

This skill automates the process of auditing a website's existing tracking, creating a comprehensive GTM/Meta Pixel tracking plan, and implementing those tags programmatically via GTM APIs and Meta Conversions API.

## Commands

### 1. Audit
Run a technical audit on a target website to discover existing DataLayer events, GTM containers, and Meta Pixels.
```bash
node audit.js <target_url>
```
*Outputs: `audit-results.json`*

### 2. Plan
Generate a standardized tracking plan mapping business objectives to GTM triggers, DataLayer variables, and Meta standard events.
```bash
node plan.js
```
*Outputs: `gtm-tracking-plan.json`*

### 3. Implement
Push the tracking plan to Google Tag Manager and configure Meta Conversions API endpoints.
```bash
node implement.js
```
*Outputs: `implementation-log.json`*

## Setup Requirements
- Requires Google Tag Manager API access (OAuth).
- Requires Meta Business Manager System User Token (for Conversions API).
- Ensure `.env` is configured with valid credentials before running `implement.js`.
