#!/bin/bash

set -euo pipefail

# Copy env file
if [[ -f ".env" ]]; then
  echo ".env already exists; skipping copy"
else
  cp .env.example .env
fi

# Install turbo
pnpm add -g turbo

# Install ni
pnpm add -g @antfu/ni

# Install dependencies
pnpm install
