FROM node:24-alpine AS base

RUN apk update \
  && apk add --no-cache bash curl libc6-compat

ENV PNPM_HOME="/pnpm"
ENV BUN_INSTALL="/root/.bun"
ENV PATH="$BUN_INSTALL/bin:$PNPM_HOME:$PATH"
RUN corepack enable
RUN curl -fsSL https://bun.sh/install | bash

WORKDIR /app

FROM base AS prepare
COPY . .
RUN pnpm add turbo --global
RUN turbo prune @repo/docs --docker

FROM base AS builder
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_DOCS_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV NEXT_PUBLIC_DOCS_URL=${NEXT_PUBLIC_DOCS_URL}
ENV NODE_ENV=production

COPY --from=prepare /app/out/json/ .
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
COPY --from=prepare /app/out/full/ .

RUN pnpm turbo build

FROM base AS runner
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

COPY --from=builder --chown=nextjs:nodejs /app/apps/docs/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/docs/.next/static ./apps/docs/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/apps/docs/public ./apps/docs/public

CMD node apps/docs/server.js