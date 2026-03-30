# Multi-stage build for Medusa backend
FROM node:20-alpine AS dependencies
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy pnpm-lock.yaml first for better caching
COPY pnpm-lock.yaml ./

# Install dependencies
COPY package.json ./
RUN pnpm install --frozen-lockfile --shamefully-hoist

# Build stage
FROM node:20-alpine AS builder
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy dependencies from dependencies stage
COPY --from=dependencies /app/node_modules ./node_modules

# Copy source code
COPY . .

# Build the application
RUN pnpm build

# Runtime stage
FROM node:20-alpine
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Set NODE_ENV to production
ENV NODE_ENV=production

# Install dumb-init to handle signals properly
RUN apk add --no-cache dumb-init

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install production dependencies only
RUN pnpm install --prod --frozen-lockfile --shamefully-hoist

# ts-node is required by @medusajs/cli for loading TypeScript config/modules at runtime
RUN pnpm add -P ts-node

# Copy built application from builder stage
COPY --from=builder /app/.medusa ./.medusa
COPY --from=builder /app/src ./src
COPY --from=builder /app/medusa-config.ts ./
COPY --from=builder /app/tsconfig.json ./

# Expose the default Medusa port
EXPOSE 9000

# Use dumb-init to run the application
ENTRYPOINT ["dumb-init", "--"]

# Start the application
CMD ["pnpm", "start"]
