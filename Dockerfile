FROM node:20-alpine3.17 AS base

# Stage 1: Install dependencies
FROM base AS deps

RUN apk add --no-cache libc6-compat
RUN apk add --no-cache openssl


WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps

# Stage 2: Build the application
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# copy env file
COPY .env .env

# prisma initialize
RUN npx prisma generate
RUN npm run build

# Stage 3: Production server
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs


COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Ensure correct permissions for the nextjs user
RUN chown -R nextjs:nodejs /app/.next

USER nextjs

EXPOSE 3000

ENV HOSTNAME="0.0.0.0"
ENV NETWORK="host"

CMD ["node", "server.js"]