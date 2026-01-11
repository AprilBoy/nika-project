#!/bin/bash

# Nika Project - Docker Cleanup Script
# Removes existing containers and volumes to allow fresh deployment

set -e

echo "🧹 Cleaning up Docker containers and volumes..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() { echo -e "${BLUE}[INFO]${NC} $1"; }
print_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
print_warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }
print_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# Stop and remove containers
print_status "Stopping and removing existing containers..."
docker-compose down --remove-orphans 2>/dev/null || true

# Remove specific containers if they exist
if docker ps -a --format 'table {{.Names}}' | grep -q "^nika-project-frontend$"; then
    print_status "Removing nika-project-frontend container..."
    docker rm -f nika-project-frontend 2>/dev/null || true
fi

if docker ps -a --format 'table {{.Names}}' | grep -q "^nika-project-server$"; then
    print_status "Removing nika-project-server container..."
    docker rm -f nika-project-server 2>/dev/null || true
fi

# Remove volumes
print_status "Removing Docker volumes..."
docker volume rm deployment_db-data 2>/dev/null || true
docker volume rm nika-project_db-data 2>/dev/null || true  # Legacy name

# Remove dangling images
print_status "Cleaning up dangling Docker images..."
docker image prune -f 2>/dev/null || true

print_success "Docker cleanup completed!"
echo ""
echo "You can now run: docker-compose up --build -d"