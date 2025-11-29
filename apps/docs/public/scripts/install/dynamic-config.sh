#!/bin/bash
## Coolify Tweaks Installer
## Do not modify this file. You will lose the ability to install!
##
## Environment variables that can be set:
## APP_PORT_DEFAULT       - Default bind address for Coolify dashboard (default: 0.0.0.0:3000)
## COOLIFY_TWEAKS_CSS_URL - Override the Tweaks CSS URL
## SKIP_BACKUP            - Set to "true" to skip backup of docker-compose, and .env

set -e          # Exit immediately if a command exits with a non-zero status
## $1 could be empty, so we need to disable this check
#set -u         # Treat unset variables as an error and exit
set -o pipefail # Cause a pipeline to return the status of the last command that exited with a non-zero status

CDN="https://cdn.coollabs.io/coolify"
DATE=$(date +"%Y%m%d-%H%M%S")

SOURCE_DIR="/data/coolify/source"
ENV_FILE="$SOURCE_DIR/.env"
PROXY_DIR="/data/coolify/proxy"
DYNAMIC_DIR="$PROXY_DIR/dynamic"
COMPOSE_FILE="$PROXY_DIR/docker-compose.yml"
CURRENT_USER=$USER

APP_PORT_DEFAULT="${APP_PORT_DEFAULT:-0.0.0.0:3000}"
SKIP_BACKUP="${SKIP_BACKUP:-${1:-false}}"

COOLIFY_TWEAKS_DEFAULT_CSS_URL="https://coolify-tweaks-api.techwithanirudh.com/release/latest/?asset=main.css"
COOLIFY_TWEAKS_CSS_URL="${COOLIFY_TWEAKS_CSS_URL:-$COOLIFY_TWEAKS_DEFAULT_CSS_URL}"

LOGFILE="/data/coolify/source/coolify-tweaks-install-${DATE}.log"

# Colors
PURPLE="\033[0;35m"
GREEN="\033[0;32m"
YELLOW="\033[0;33m"
CYAN="\033[0;36m"
RED="\033[0;31m"
BOLD="\033[1m"
RESET="\033[0m"

# yq
YQ_VERSION="v4.49.2"
YQ_BIN="/tmp/yq"

install_yq() {
  if [ -x "$YQ_BIN" ]; then
    return 0
  fi

  echo " - Downloading yq $YQ_VERSION to $YQ_BIN"

  ARCH=$(uname -m)
  YQ_ARCH="amd64"

  case "$ARCH" in
    x86_64)        YQ_ARCH="amd64" ;;
    aarch64|arm64) YQ_ARCH="arm64" ;;
    armv7l)        YQ_ARCH="arm" ;;
    *)
      echo "   Unknown architecture '$ARCH', defaulting to amd64."
      YQ_ARCH="amd64"
      ;;
  esac

  curl -sL "https://github.com/mikefarah/yq/releases/download/${YQ_VERSION}/yq_linux_${YQ_ARCH}" \
    -o "$YQ_BIN"

  chmod +x "$YQ_BIN" || true

  if ! "$YQ_BIN" --version >/dev/null 2>&1; then
    echo -e "${RED}Failed to download yq. Please check network or install yq manually and re-run the installer.${RESET}"
    rm -f "$YQ_BIN" 2>/dev/null || true
    exit 1
  fi

  echo " - $("$YQ_BIN" --version 2>/dev/null || echo '') downloaded successfully"
}

# Helpers
getAJoke() {
  JOKES=$(curl -s --max-time 2 "https://v2.jokeapi.dev/joke/Programming?blacklistFlags=nsfw,religious,political,racist,sexist,explicit&format=txt&type=single" || true)
  if [ "$JOKES" != "" ]; then
    echo -e " - While Docker is thinking, here's a joke:\n"
    echo -e "$JOKES\n"
  fi
}

update_env_var() {
  local key="$1"
  local value="$2"

  if [ ! -f "$ENV_FILE" ]; then
    echo -e "${RED} - ${RESET} $ENV_FILE not found. Is Coolify installed?"
    exit 1
  fi

  if grep -q "^${key}=$" "$ENV_FILE"; then
    sed -i "s|^${key}=$|${key}=${value}|" "$ENV_FILE"
    echo " - Updated value of ${key} (it was empty)"
  elif ! grep -q "^${key}=" "$ENV_FILE"; then
    printf '%s=%s\n' "$key" "$value" >>"$ENV_FILE"
    echo " - Added ${key} (it was missing)"
  else
    sed -i "s|^${key}=.*|${key}=${value}|" "$ENV_FILE"
    echo " - Updated ${key}"
  fi
}

print_step_header() {
  local num="$1"
  local title="$2"
  echo -e "\n${BOLD}${CYAN}${num}. ${title}${RESET}"
  echo "---------------------------------------------"
}

# Pre-flight checks

if [ "$EUID" -ne 0 ]; then
  echo -e "${RED}Please run this script as root or with sudo.${RESET}"
  exit 1
fi

if [ ! -d "/data/coolify" ]; then
  echo -e "${RED}This does not look like a Coolify host (/data/coolify missing).${RESET}"
  exit 1
fi

if ! command -v docker >/dev/null 2>&1; then
  echo -e "${RED}Docker is required but not found in PATH.${RESET}"
  exit 1
fi

mkdir -p "$PROXY_DIR" "$DYNAMIC_DIR" "$SOURCE_DIR"

# Redirect all output to logfile + stdout
exec > >(tee -a "$LOGFILE") 2>&1

echo -e "${BOLD}${PURPLE}Welcome to Coolify Tweaks Installer!${RESET}"
echo -e "This script will install ${BOLD}Coolify Tweaks${RESET} to your dashboard through Traefik. Sit back and relax."

# Step 1: Validate environment & .env

print_step_header "1" "Validating environment"

if [ ! -d "$SOURCE_DIR" ]; then
  echo -e "${RED} - $SOURCE_DIR not found. Coolify source is missing.${RESET}"
  exit 1
fi

if [ ! -f "$ENV_FILE" ]; then
  echo -e "${RED} - $ENV_FILE not found. Is Coolify installed?${RESET}"
  exit 1
fi

if [ ! -f "$COMPOSE_FILE" ]; then
  echo -e "${RED} - $COMPOSE_FILE not found. Is the Coolify proxy installed?${RESET}"
  exit 1
fi

echo " - Environment looks good."
echo " - Logging to: $LOGFILE"

# Step 2: Backup .env and update APP_PORT

print_step_header "2" "Configuring Coolify dashboard port (APP_PORT)"

if [ "$SKIP_BACKUP" != "true" ]; then
  if [ -f "$ENV_FILE" ]; then
    echo " - Creating backup of existing .env file -> .env-$DATE"
    cp "$ENV_FILE" "$ENV_FILE-$DATE"
  else
    echo " - No existing .env file found to backup"
  fi
else
  echo " - Skipping .env backup (SKIP_BACKUP=true)"
fi

read -r -p " - APP_PORT [${APP_PORT_DEFAULT}] = " NEW_APP_PORT
NEW_APP_PORT="${NEW_APP_PORT:-$APP_PORT_DEFAULT}"
update_env_var "APP_PORT" "$NEW_APP_PORT"

# Step 3: Patch Traefik configuration

print_step_header "3" "Patching Traefik configuration"

if [ "$SKIP_BACKUP" != "true" ]; then
  echo " - Backing up $COMPOSE_FILE -> $COMPOSE_FILE.bak-$DATE"
  cp "$COMPOSE_FILE" "$COMPOSE_FILE.bak-$DATE"
else
  echo " - Skipping docker-compose.yml backup"
fi

install_yq

echo " - Ensuring Traefik is configured for Coolify Tweaks"

if ! "$YQ_BIN" '.services.traefik' "$COMPOSE_FILE" >/dev/null 2>&1; then
  echo -e "${RED}   Traefik service (services.traefik) not found in $COMPOSE_FILE.${RESET}"
  exit 1
fi

"$YQ_BIN" -i '
  .services.traefik.ports = (
    (.services.traefik.ports // [])
    + ["8000:8000"]
    | unique
  )
  |
  .services.traefik.command = (
    (.services.traefik.command // [])
    + [
      "--experimental.plugins.rewritebody.modulename=github.com/traefik/plugin-rewritebody",
      "--experimental.plugins.rewritebody.version=v0.3.1",
      "--entrypoints.coolify_dashboard.address=:8000"
    ]
    | unique
  )
' "$COMPOSE_FILE"

echo " - Traefik configuration updated."

# Step 4: Create dynamic config for Coolify Tweaks

print_step_header "4" "Creating Coolify Tweaks dynamic config"

DYNAMIC_FILE="$DYNAMIC_DIR/coolify-tweaks.yml"
echo " - Writing dynamic config to: $DYNAMIC_FILE"
echo " - Using CSS URL: $COOLIFY_TWEAKS_CSS_URL"

cat >"$DYNAMIC_FILE" <<EOF
http:
  middlewares:
    rb-buffer:
      buffering:
        maxRequestBodyBytes: 0
        maxResponseBodyBytes: 0
        memResponseBodyBytes: 0
    rb-force-identity:
      headers:
        customRequestHeaders:
          Accept-Encoding: identity
    rb-inject-css:
      plugin:
        rewritebody:
          lastModified: true
          rewrites:
            - regex: "(?is)</head>"
              replacement: '<link rel="stylesheet" href="${COOLIFY_TWEAKS_CSS_URL}" referrerpolicy="no-referrer" crossorigin="anonymous"></head>'
          monitoring:
            methods: [GET]
            types: ["text/html"]
    coolify-tweaks:
      chain:
        middlewares:
          - rb-buffer
          - rb-force-identity
          - rb-inject-css

  services:
    coolify:
      loadBalancer:
        servers:
          - url: "http://coolify:8080"

  routers:
    coolify-dashboard:
      entryPoints: [coolify_dashboard]
      rule: PathPrefix(\`/\`)
      service: coolify
      middlewares: [coolify-tweaks]
      priority: 1000
EOF

echo " - Dynamic config written."

# Step 5: Restart Coolify & Traefik
print_step_header "5" "Restarting Coolify"

cd "$SOURCE_DIR"
if [ -f /data/coolify/source/docker-compose.custom.yml ]; then
  docker compose \
    --env-file .env \
    -f docker-compose.yml \
    -f docker-compose.prod.yml \
    -f docker-compose.custom.yml \
    up -d --remove-orphans --force-recreate --wait --wait-timeout 60
else
  docker compose \
    --env-file .env \
    -f docker-compose.yml \
    -f docker-compose.prod.yml \
    up -d --remove-orphans --force-recreate --wait --wait-timeout 60
fi

echo -e "${GREEN} - Coolify restarted successfully.${RESET}"

print_step_header "6" "Restarting Traefik"

cd "$PROXY_DIR"
echo " - Running: docker compose -f docker-compose.yml up -d --force-recreate --wait"
getAJoke
docker compose \
  -f docker-compose.yml \
  up -d --force-recreate --wait --wait-timeout 60

echo -e "${GREEN} - Traefik restarted successfully.${RESET}"

# Optional: clean up temp yq
rm -f "$YQ_BIN" 2>/dev/null || true

# Step 7: Final info

print_step_header "7" "All done! Coolify Tweaks is now installed."
echo -e "${PURPLE}
   ____                            _         _       _   _                 _
  / ___|___  _ __   __ _ _ __ __ _| |_ _   _| | __ _| |_(_) ___  _ __  ___| |
 | |   / _ \\| '_ \\ / _\` | '__/ _\` | __| | | | |/ _\` | __| |/ _ \\| '_ \\/ __| |
 | |__| (_) | | | | (_| | | | (_| | |_| |_| | | (_| | |_| | (_) | | | \\__ \\_|
  \\____\\___/|_| |_|\\__, |_|  \\__,_|\\__|\\__,_|_|\\__,_|\\__|_|\\___/|_| |_|___(_)
                   |___/
${RESET}"

IPV4_PUBLIC_IP=$(curl -4s https://ifconfig.io || true)
IPV6_PUBLIC_IP=$(curl -6s https://ifconfig.io || true)

echo -e "\n${BOLD}Your instance is ready to use with Coolify Tweaks enabled!${RESET}\n"
if [ -n "$IPV4_PUBLIC_IP" ]; then
  echo -e " - Public IPv4 dashboard: ${GREEN}http://$IPV4_PUBLIC_IP:8000${RESET}"
fi
if [ -n "$IPV6_PUBLIC_IP" ]; then
  echo -e " - Public IPv6 dashboard: ${GREEN}http://[$IPV6_PUBLIC_IP]:8000${RESET}"
fi

set +e
DEFAULT_PRIVATE_IP=$(ip route get 1 2>/dev/null | sed -n 's/^.*src \([0-9.]*\) .*$/\1/p')
PRIVATE_IPS=$(hostname -I 2>/dev/null || ip -o addr show scope global | awk '{print $4}' | cut -d/ -f1)
set -e

if [ -n "$PRIVATE_IPS" ]; then
  echo -e "\nIf your public IP is not accessible, you can use these private IPs inside your network:\n"
  for IP in $PRIVATE_IPS; do
    if [ "$IP" != "$DEFAULT_PRIVATE_IP" ]; then
      echo -e " - ${GREEN}http://$IP:8000${RESET}"
    fi
  done
fi

echo -e "${GREEN}Coolify Tweaks installed successfully. Enjoy your shiny dashboard.${RESET}"
