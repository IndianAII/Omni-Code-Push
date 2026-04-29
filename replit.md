# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Artifacts

- **Omni-Code AI** (`artifacts/health-ai`) — React + Vite web app at `/`. Maya AI sidebar, live HTML code editor with side-by-side preview, multi-currency support popup (INR/USD).
- **API Server** (`artifacts/api-server`) — Express 5 backend at `/api`.
- **Canvas** (`artifacts/mockup-sandbox`) — design sandbox at `/__mockup`.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Frontend**: React 19 + Vite

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
