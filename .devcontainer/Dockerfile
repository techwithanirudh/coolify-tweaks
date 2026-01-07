#-------------------------------------------------------------------------------------------------------------
# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See https://go.microsoft.com/fwlink/?linkid=2090316 for license information.
#-------------------------------------------------------------------------------------------------------------

FROM ubuntu:noble

# Remove default 'ubuntu' user if it exists (harmless noop if it doesn't)
RUN if id "ubuntu" &>/dev/null; then \
        echo "Deleting user 'ubuntu' for noble" && userdel -f -r ubuntu || echo "Failed to delete ubuntu user for noble"; \
    else \
        echo "User 'ubuntu' does not exist for noble"; \
    fi

ENV LANG="C.UTF-8"

# Install packages from apt repositories
ARG DEBIAN_FRONTEND="noninteractive"

# Merging the mutiple layers to reduce the size of the image slightly
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        ca-certificates \
        curl \
        make \
        unzip \
        build-essential \
        rsync \
        zip \
        jq \
        python3 \
        python3-pip \
        inotify-tools \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get autoremove -y \
    && apt-get clean -y

# Default to bash shell
ENV SHELL=/bin/bash \
    DOCKER_BUILDKIT=1

# Increase memory allocation to NodeJS
ENV NODE_OPTIONS="--max-old-space-size=8192"
