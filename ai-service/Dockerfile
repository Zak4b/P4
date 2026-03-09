# AI Service Dockerfile
FROM node:20-alpine AS base
WORKDIR /app

# Install all dependencies (including devDeps needed for TypeScript build)
FROM base AS deps
COPY package.json ./
RUN npm install

# ── Dev stage (used by docker-compose.dev.yml) ───────────────────────────────
FROM deps AS dev
# Source code is mounted as a volume at runtime — copy only for image fallback
COPY . .
EXPOSE 4000
CMD ["npm", "run", "dev"]

# Build TypeScript
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY package.json tsconfig.json ./
COPY src ./src
RUN node_modules/.bin/tsc

# Production image — install only production deps
FROM base AS runner

ENV NODE_ENV=production

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 aiservice

COPY package.json ./
RUN npm install --omit=dev

COPY --from=builder /app/dist ./dist

RUN chown -R aiservice:nodejs /app
USER aiservice

EXPOSE 4000

CMD ["node", "dist/index.js"]
