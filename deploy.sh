#!/bin/bash

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_info() {
    echo -e "${YELLOW}ℹ${NC} $1"
}

check_env() {
    if [ ! -f .env ]; then
        print_info "File .env not found, creating from env.example"
    else
        print_success "File .env found"
    fi
}

print_info "Starting application P4..."
check_env

docker compose up -d

print_success "Application started"
print_info "⚠️  Init db : docker compose exec backend npx prisma db push"


