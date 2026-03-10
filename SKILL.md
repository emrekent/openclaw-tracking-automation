# OpenClaw Tracking Automation

## Overview
This skill builds the foundational pipeline to automatically implement, test, and report on tracking architecture, explicitly targeting Google Tag Manager (GTM) dataLayer injections and Meta Pixel standard events.

## Architecture

The automation follows a 7-stage file-passing architecture, ensuring zero data loss and complete traceability between steps:

1. **Init (`init.js`)**: Initialize and parse the tracking request parameters (URL, desired events).
2. **Audit (`audit.js`)**: Scan existing site markup, current tracking setup, and dataLayer presence.
3. **Plan (`plan.js`)**: Generate the exact GTM dataLayer schemas and Meta Pixel events (e.g., `ViewContent`, `AddToCart`, `Purchase`) needed.
4. **Credentials (`credentials.js`)**: Securely fetch and validate GTM container IDs and Meta Pixel IDs.
5. **Implement (`implement.js`)**: Inject the dataLayer configuration, GTM base snippet, Meta Pixel base code, and specific trigger events into the codebase or tag manager UI.
6. **Test (`test.js`)**: Run headless verification to trigger actions and intercept network requests (ensuring tags fire correctly).
7. **Report (`report.js`)**: Compile the results, proof of execution, and any anomalies into a final payload.

## Core Scripts
- `init.js`
- `audit.js`
- `plan.js`
- `credentials.js`
- `implement.js`
- `test.js`
- `report.js`
