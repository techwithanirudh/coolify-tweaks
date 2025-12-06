ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_DOCS_URL
ARG OPENAI_API_KEY

FROM node:24-alpine AS base

# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk update \
  && apk add --no-cache bash curl libc6-compat

ENV PNPM_HOME="/pnpm"
ENV BUN_INSTALL="/root/.bun"
ENV PATH="$BUN_INSTALL/bin:$PNPM_HOME:$PATH"
RUN corepack enable
RUN curl -fsSL https://bun.sh/install | bash

# Set working directory
WORKDIR /app

# ---
FROM base AS prepare
COPY . .
RUN pnpm add turbo --global
RUN turbo prune @repo/docs --docker

# ---
FROM base AS builder
# Propagate build-time env so Next.js and scripts have the correct values.
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_DOCS_URL
ARG OPENAI_API_KEY
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV NEXT_PUBLIC_DOCS_URL=${NEXT_PUBLIC_DOCS_URL}
ENV OPENAI_API_KEY=${OPENAI_API_KEY}
ENV NODE_ENV=production
# First install the dependencies (as they change less often)
COPY --from=prepare /app/out/json/ .
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
# Build the project
COPY --from=prepare /app/out/full/ .

# Uncomment and use build args to enable remote caching
# ARG TURBO_TEAM
# ENV TURBO_TEAM=$TURBO_TEAM

# ARG TURBO_TOKEN
# ENV TURBO_TOKEN=$TURBO_TOKEN

RUN pnpm turbo build

# ---
FROM base AS runner
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_DOCS_URL
ARG OPENAI_API_KEY
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV NEXT_PUBLIC_DOCS_URL=${NEXT_PUBLIC_DOCS_URL}
ENV OPENAI_API_KEY=${OPENAI_API_KEY}
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
# Don't run production as root for security reasons
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/apps/docs/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/docs/.next/static ./apps/docs/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/apps/docs/public ./apps/docs/public

CMD node apps/docs/server.js