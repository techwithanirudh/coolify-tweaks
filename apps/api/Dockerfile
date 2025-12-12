FROM node:24-alpine AS base

RUN apk update 
RUN apk add --no-cache libc6-compat

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /app

FROM base AS builder
COPY . .
RUN pnpm add turbo --global
RUN turbo prune @repo/api --docker

FROM base AS installer

COPY --from=builder /app/out/json/ .
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

COPY --from=builder /app/out/full/ .

RUN pnpm turbo build

FROM base AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 nitro
RUN adduser --system --uid 1001 nitro
USER nitro
COPY --from=installer /app .

CMD pnpm srvx --prod .output/ --port 3001