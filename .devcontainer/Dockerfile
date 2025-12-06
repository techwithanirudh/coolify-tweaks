#-------------------------------------------------------------------------------------------------------------
# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See https://go.microsoft.com/fwlink/?linkid=2090316 for license information.
#-------------------------------------------------------------------------------------------------------------

FROM ubuntu:noble

RUN if id "ubuntu" &>/dev/null; then \
            echo "Deleting user 'ubuntu' for noble" && userdel -f -r ubuntu || echo "Failed to delete ubuntu user for noble"; \
        else \
            echo "User 'ubuntu' does not exist for noble"; \
    fi

ENV LANG="C.UTF-8"

# Install packages from apt repositories
ARG DEBIAN_FRONTEND="noninteractive"

# Merging the mutiple layers to reduce the size of the image slightly
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    # Restore man command
    && yes | unminimize 2>&1 \
    # Install basic build tools
    && apt-get upgrade -y \
    && DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends \
        make \
        unzip \
        build-essential \
        swig3.0 \
        libpq-dev \
        rsync \
        zip \
        jq \
        python3-pip \
        curl \
        gettext \
        inotify-tools \
    && rm -rf /var/lib/apt/lists/* \
    # This is the folder containing 'links' to benv and build script generator
    && apt-get update \
    && apt-get upgrade -y \
    && add-apt-repository universe \
    && rm -rf /var/lib/apt/lists/* \
    # Verify expected build and debug tools are present
    && apt-get update \
    && apt-get -y install build-essential cmake cppcheck valgrind clang lldb llvm gdb python3-dev \
    # Install tools and shells not in common script
    && apt-get install -yq vim-tiny software-properties-common libsecret-1-dev \
    # Clean up
    && apt-get autoremove -y && apt-get clean -y

# Default to bash shell
ENV SHELL=/bin/bash \
    DOCKER_BUILDKIT=1

# Increase memory allocation to NodeJS 
ENV NODE_OPTIONS="--max-old-space-size=8192"
