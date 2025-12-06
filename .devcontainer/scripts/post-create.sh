#!/bin/bash

set -e

# Copy env file
cp .env.example .env

# Install turbo
pnpm add -g turbo

# Install ni
pnpm add @antfu/ni --global

# Install dependencies
pnpm install