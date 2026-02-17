#!/usr/bin/env bash
#
# Pesky Markdown Writer — Docker Environment Setup
#
# This script downloads the official Supabase Docker configuration
# and sets up the complete local development environment.
#
# Usage: bash setup-docker.sh
#

set -euo pipefail

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SUPABASE_DOCKER_DIR="$PROJECT_DIR/supabase-docker"

echo ""
echo "╔══════════════════════════════════════════════════════╗"
echo "║   🐝 Pesky Markdown Writer — Docker Setup           ║"
echo "╚══════════════════════════════════════════════════════╝"
echo ""

# ─── Step 1: Download Supabase Docker config ───────────────
if [ ! -d "$SUPABASE_DOCKER_DIR/docker" ]; then
  echo "📦 Downloading Supabase Docker configuration..."
  echo "   (sparse checkout of supabase/supabase → docker/ only)"
  echo ""

  rm -rf "$SUPABASE_DOCKER_DIR"
  mkdir -p "$SUPABASE_DOCKER_DIR"
  cd "$SUPABASE_DOCKER_DIR"

  git init -q
  git remote add origin https://github.com/supabase/supabase.git
  git sparse-checkout init --cone
  git sparse-checkout set docker
  git pull --depth=1 origin master -q 2>/dev/null || git pull --depth=1 origin main -q

  echo "✅ Supabase Docker configuration downloaded."
  echo ""
else
  echo "✅ Supabase Docker configuration already exists."
  echo "   To re-download, delete supabase-docker/ and re-run this script."
  echo ""
fi

# ─── Step 2: Create .env if it doesn't exist ───────────────
if [ ! -f "$SUPABASE_DOCKER_DIR/docker/.env" ]; then
  echo "📝 Creating .env from Supabase example defaults..."
  cp "$SUPABASE_DOCKER_DIR/docker/.env.example" "$SUPABASE_DOCKER_DIR/docker/.env"

  # Patch SITE_URL to point to the Nuxt app
  sed -i 's|SITE_URL=http://localhost:3000|SITE_URL=http://localhost:3000|' "$SUPABASE_DOCKER_DIR/docker/.env"

  # Enable email auto-confirm for local development
  sed -i 's|ENABLE_EMAIL_AUTOCONFIRM=false|ENABLE_EMAIL_AUTOCONFIRM=true|' "$SUPABASE_DOCKER_DIR/docker/.env"

  echo "✅ .env created with development defaults."
  echo ""
else
  echo "✅ .env already exists."
  echo ""
fi

# ─── Step 3: Copy our docker-compose.override.yml ──────────
echo "📋 Installing docker-compose.override.yml for Nuxt app..."
cp "$PROJECT_DIR/docker-compose.override.yml" "$SUPABASE_DOCKER_DIR/docker/docker-compose.override.yml"
echo "✅ Override installed."
echo ""

# ─── Step 4: Create Nuxt .env file ────────────────────────
NUXT_ENV_FILE="$PROJECT_DIR/.env"
if [ ! -f "$NUXT_ENV_FILE" ]; then
  echo "📝 Creating Nuxt .env file..."
  cat > "$NUXT_ENV_FILE" << 'EOF'
# Supabase connection for the Nuxt app
# These match the default Supabase Docker development keys
SUPABASE_URL=http://localhost:8000
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJhbm9uIiwKICAgICJpc3MiOiAic3VwYWJhc2UtZGVtbyIsCiAgICAiaWF0IjogMTY0MTc2OTIwMCwKICAgICJleHAiOiAxNzk5NTM1NjAwCn0.dc_X5iR_VP_qT0zsiyj_I_OZ2T9FtRU2BBNWN8Bu4GE
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJzZXJ2aWNlX3JvbGUiLAogICAgImlzcyI6ICJzdXBhYmFzZS1kZW1vIiwKICAgICJpYXQiOiAxNjQxNzY5MjAwLAogICAgImV4cCI6IDE3OTk1MzU2MDAKfQ.DaYlNEoUrrEn2Ig7tqibS-PHK5vgusbcbo7X36XVt4Q
EOF
  echo "✅ Nuxt .env created."
  echo ""
else
  echo "✅ Nuxt .env already exists."
  echo ""
fi

# ─── Done ──────────────────────────────────────────────────
echo "╔══════════════════════════════════════════════════════╗"
echo "║   ✅ Setup complete!                                ║"
echo "╚══════════════════════════════════════════════════════╝"
echo ""
echo "🚀 To start everything:"
echo ""
echo "   cd supabase-docker/docker"
echo "   docker compose up -d"
echo ""
echo "📍 Services will be available at:"
echo "   • Nuxt App:         http://localhost:3000"
echo "   • Supabase API:     http://localhost:8000"
echo "   • Supabase Studio:  http://localhost:8000 (login: supabase / this_password_is_insecure_and_should_be_updated)"
echo ""
echo "🛑 To stop everything:"
echo ""
echo "   cd supabase-docker/docker"
echo "   docker compose down"
echo ""
