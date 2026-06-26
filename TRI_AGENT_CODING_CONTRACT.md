# Tri-Agent Coding Contract

This project uses a lightweight Validator, Builder, and Editor workflow.

## Startup Order

1. Read `AGENTS.md`.
2. Read this contract.
3. Read the active role document before doing role-specific work:
   - `agent-relay/roles/Validator/ROLE.md`
   - `agent-relay/roles/Builder/ROLE.md`
   - `agent-relay/roles/Editor/ROLE.md`

## Project Boundary

The project is a `small-node-static-web` bootstrap adapted to a static Chrome extension popup. Keep work inside the extension boundary unless the user explicitly asks to expand the architecture.

## Role Responsibilities

- Validator freezes requirements, names affected files, calls out risks, and defines verification.
- Builder implements the smallest correct change inside the approved boundary.
- Editor reviews for bugs, overengineering, unclear UX, extension-policy issues, and drift from the selected package.

## Verification Baseline

Use `npm run check` after JavaScript changes. Use `npm run prepare:vendor` after Bootstrap install or updates.
