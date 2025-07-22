ARG VARIANT=latest
FROM oven/bun:${VARIANT}

RUN apt-get update \
    && apt-get -y install --no-install-recommends \
    ca-certificates \
    git \
    nano \
    vim-tiny \
    && apt-get auto-remove -y \
    && apt-get clean -y \
    && chsh -s $(which bash) bun

USER bun