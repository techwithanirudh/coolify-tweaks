FROM node:24-alpine AS base

# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk update 
RUN apk add --no-cache libc6-compat

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /app

# The web Dockerfile is copy-pasted into our main docs at /docs/handbook/deploying-with-docker.
# Make sure you update this Dockerfile, the Dockerfile in the web workspace and copy that over to Dockerfile in the docs.

FROM base AS builder
COPY . .
RUN pnpm add turbo --global
RUN turbo prune @repo/api --docker

# Add lockfile and package.json's of isolated subworkspace
FROM base AS installer

# First install dependencies (as they change less often)
COPY --from=builder /app/out/json/ .
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# Build the project and its dependencies
COPY --from=builder /app/out/full/ .

# Uncomment and use build args to enable remote caching
# ARG TURBO_TEAM
# ENV TURBO_TEAM=$TURBO_TEAM

# ARG TURBO_TOKEN
# ENV TURBO_TOKEN=$TURBO_TOKEN

RUN pnpm turbo build

FROM base AS runner
WORKDIR /app

# Don't run production as root
RUN addgroup --system --gid 1001 nitro
RUN adduser --system --uid 1001 nitro
USER nitro
COPY --from=installer /app .

CMD pnpm srvx --prod .output/ --port 3001