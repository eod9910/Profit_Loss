# Profit/Loss Agent Guide

## Startup Memory

If present, read only `memory-bank/LATEST.md` and `memory-bank/CHAT_MEMORY.md` at conversation start. Do not preload historical memory files.

## Role Bootloader

This project uses a lightweight tri-agent workflow. Read `TRI_AGENT_CODING_CONTRACT.md`, then read the role document that matches the work:

- Validator reads `agent-relay/roles/Validator/ROLE.md` before freezing requirements, approving scope, judging reports, or accepting work.
- Builder reads `agent-relay/roles/Builder/ROLE.md` before implementing feature, refactor, package, or extension changes.
- Editor reads `agent-relay/roles/Editor/ROLE.md` before reviewing, simplifying, or marking an `EDITOR BLOCKER`.
- When one running agent mediates the roles, it must read all three role documents before simulating role handoffs.

## Project Coding Paradigm

- This project is governed as `small-node-static-web`, adapted to a static Chrome extension popup.
- Keep the extension simple: static HTML, CSS, and JavaScript unless the project clearly outgrows that shape.
- Bootstrap CSS is vendored locally from the npm package with `npm run prepare:vendor`; do not use a CDN in extension pages.
- Store extension data in `chrome.storage.local`; keep `localStorage` only as a test fallback.
- Prefer narrow edits in `manifest.json`, `popup/`, `vendor/`, and `scripts/`.

## Verification

Run this after changing JavaScript or package scripts:

```powershell
npm run check
```

Run this after installing or updating Bootstrap:

```powershell
npm run prepare:vendor
```
