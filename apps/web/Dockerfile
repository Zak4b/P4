# Frontend Dockerfile
FROM node:22-alpine AS base
# corepack is no longer bundled in recent Node majors, so pin pnpm explicitly.
# Keep this version in sync with "packageManager" in package.json.
RUN npm install -g pnpm@11.20.0

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/web/package.json apps/web/
COPY apps/api/package.json apps/api/
COPY packages/schemas/package.json packages/schemas/
COPY packages/leveling/package.json packages/leveling/
# "..." pulls in @p4/web's workspace dependencies (@p4/schemas, @p4/leveling)
# — a plain `--filter @p4/web` only installs @p4/web itself.
RUN pnpm install --frozen-lockfile --filter @p4/web...

# Builder stage
FROM base AS builder
WORKDIR /app

COPY --from=deps /app ./
COPY apps/web apps/web
COPY packages/schemas packages/schemas
COPY packages/leveling packages/leveling

# Set environment variables for build
ARG NEXT_PUBLIC_BACKEND_URL
ARG NEXT_PUBLIC_WS_URL
ENV NEXT_PUBLIC_BACKEND_URL=${NEXT_PUBLIC_BACKEND_URL}
ENV NEXT_PUBLIC_WS_URL=${NEXT_PUBLIC_WS_URL}

# "..." builds @p4/schemas and @p4/leveling first (topological order), then @p4/web
RUN pnpm --filter @p4/web... build

# Production stage
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary files from builder
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/public ./apps/web/public

USER nextjs

EXPOSE 3001

ENV PORT=3001
ENV HOSTNAME="0.0.0.0"

# Start the frontend
CMD ["node", "apps/web/server.js"]
