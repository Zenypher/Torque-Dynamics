FROM node:20-alpine AS base
RUN corepack enable && corepack prepare pnpm@latest --activate
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

WORKDIR /app

# Stage 1: Dependencies
FROM base AS deps
COPY pnpm-lock.yaml package.json ./
# Uses a cache mount for faster pnpm installs
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# Stage 2: Build
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm run build

# Stage 3: Runner
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./app/medusa-config.js ./

EXPOSE 9000
# Runs migrations then starts the backend
CMD ["sh", "-c", "pnpm exec medusa migrations run && pnpm start"]