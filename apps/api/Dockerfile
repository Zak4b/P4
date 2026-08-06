# Backend Dockerfile
# Built from the repo root, not from apps/api (see docker-compose.yml:
# `context: .` + `dockerfile: apps/api/Dockerfile`). The pnpm workspace lives at
# the root, so the lockfile and pnpm-workspace.yaml are only reachable there.
# Node 22 (not 20): pnpm 11 requires >=22.13, and Node 20 reached EOL in April 2026.
FROM node:22-alpine AS base
# corepack is no longer bundled in recent Node majors, so pin pnpm explicitly.
# Keep this version in sync with "packageManager" in package.json.
RUN npm install -g pnpm@11.20.0

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# The root pnpm-workspace.yaml carries the allowBuilds settings — without it
# prisma/bcrypt/esbuild postinstall scripts are silently skipped.
# apps/web/package.json is copied even though only the api is installed:
# --frozen-lockfile fails if an importer recorded in the lockfile is missing.
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json apps/api/
COPY apps/web/package.json apps/web/
RUN pnpm install --frozen-lockfile --filter @p4/api

# Builder stage
FROM base AS builder
WORKDIR /app

# Copy the installed workspace (root node_modules + apps/api/node_modules)
COPY --from=deps /app ./
COPY apps/api apps/api

# `pnpm build` runs `prisma generate && tsc -p tsconfig.build.json`
RUN pnpm --filter @p4/api build

# Flatten the workspace into a self-contained, prod-only directory. pnpm's
# node_modules is a tree of symlinks into the root .pnpm store, which cannot be
# COPY'd into another stage as-is; `pnpm deploy` materializes real files.
# --legacy: required since pnpm 10 for workspaces without inject-workspace-packages.
# --no-optional: `prisma` (the CLI) and `typescript` are *optional peer*
# dependencies of @prisma/client 7, so --prod alone does not prune them — the
# runtime tree would carry the Prisma CLI, Prisma Studio, pglite, effect and
# tsc (~250 MB of build tooling). Only the client itself is needed at runtime.
RUN pnpm deploy --legacy --filter @p4/api --prod --no-optional /out

# Production stage
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 backend

COPY --from=builder --chown=backend:nodejs /out ./

USER backend

EXPOSE 3000

# Start the backend
CMD ["node", "./dist/app.js"]
