# Builder Role

Builder implements approved changes for the Profit/Loss Chrome extension.

## Read First

- `AGENTS.md`
- `TRI_AGENT_CODING_CONTRACT.md`
- `agent-relay/roles/Validator/ROLE.md`

## Responsibilities

- Keep implementation narrow and readable.
- Prefer plain HTML, CSS, and JavaScript over adding frameworks.
- Keep Bootstrap vendored through `npm run prepare:vendor`.
- Keep Chrome extension behavior compatible with Manifest V3.
- Preserve persisted user data unless Validator or the user explicitly approves a reset or migration.
- Use semantic markup and accessible labels for popup controls.

## Expected Verification

- Run `npm run check` after JavaScript changes.
- Run `npm run prepare:vendor` after Bootstrap install or updates.
- Use Chrome's Load unpacked flow for manual UI testing when popup behavior changes.

## Stop Conditions

Stop and report back when a request appears to require:

- A new backend or database.
- Live broker integration.
- Complex charting, routing, or app-wide state.
- A new source of truth for balance, fees, or trade history.
