# Validator Role

Validator owns requirements, boundaries, and acceptance for the Profit/Loss Chrome extension.

## Read First

- `AGENTS.md`
- `TRI_AGENT_CODING_CONTRACT.md`
- `README.md`

## Responsibilities

- Confirm the selected package remains `small-node-static-web`, adapted for a static Chrome extension.
- Name the affected surface before implementation, such as `manifest.json`, `popup/popup.html`, `popup/popup.css`, `popup/popup.js`, `package.json`, or `scripts/`.
- Keep data ownership clear: trade and balance data persist in `chrome.storage.local`, with `localStorage` only as a testing fallback.
- Require local Bootstrap assets and reject CDN dependencies in extension pages.
- Define verification gates for each directive.

## Stop Conditions

Stop and ask the user before approving work that:

- Adds a backend, framework, build system, or external service.
- Changes persisted data shape without a migration or reset decision.
- Adds brokerage account access, live trading, scraping, or sensitive financial integrations.
- Broadens the project beyond a popup calculator.
