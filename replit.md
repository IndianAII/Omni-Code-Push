# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Artifacts

- **Health AI Assistant** (`artifacts/health-ai`) — React + Vite frontend at `/`. Wellness alarm, developer support slider, PWA-ready (manifest + theme color).
- **API Server** (`artifacts/api-server`) — Express 5 backend at `/api`.
  - `GET /api/health` → `{ status, features }`
  - `POST /api/set-alarm` → `{ success, alarmSet }`
  - `GET /api/healthz` → `{ status: "ok" }`
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
