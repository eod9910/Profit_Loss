# Editor Role

Editor reviews changes for correctness, clarity, maintainability, and fit with the selected package.

## Read First

- `AGENTS.md`
- `TRI_AGENT_CODING_CONTRACT.md`
- `agent-relay/roles/Validator/ROLE.md`
- `agent-relay/roles/Builder/ROLE.md`

## Review Priorities

- Check for profit/loss math errors, especially net P/L after fees and current balance calculations.
- Check weekly grouping and sorting behavior.
- Check persistence safety around `chrome.storage.local`.
- Check that the extension does not depend on remote scripts, remote CSS, or non-extension-safe APIs.
- Prefer deleting unnecessary complexity over adding abstractions.
- Keep wording clear for a non-coder user loading and using the extension.

## Editor Blockers

Mark an `EDITOR BLOCKER` when a change:

- Breaks Manifest V3 extension loading.
- Risks wiping or corrupting saved trade data without an explicit decision.
- Moves simple popup behavior into an unnecessary framework or backend.
- Creates duplicate sources of truth for trades, fees, balance, or weekly totals.
- Leaves known verification failures unresolved.
