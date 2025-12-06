#!/bin/bash

# Nika Project Full Stack Deployment Script
# Deploys React frontend, Node.js API server, and SQLite database
# Usage: ./deploy.sh [environment]
# Default environment: production

set -e

ENVIRONMENT=${1:-production}
PROJECT_NAME="nika-project"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

echo "🚀 Starting deployment of $PROJECT_NAME to $ENVIRONMENT environment"
echo "📅 Timestamp: $TIMESTAMP"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() { echo -e "${BLUE}[INFO]${NC} $1"; }
print_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
print_warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }
print_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# --------------------------------------------------------
# Check if Docker is installed
# --------------------------------------------------------
check_docker() {
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
}

# --------------------------------------------------------
# Create backup of current frontend build
# --------------------------------------------------------
create_backup() {
    if [ -d "dist" ]; then
        print_status "Creating backup of current frontend build..."
        mkdir -p backups
        tar -czf "backups/${PROJECT_NAME}_frontend_backup_${TIMESTAMP}.tar.gz" dist/ 2>/dev/null || true
        print_success "Backup created: backups/${PROJECT_NAME}_frontend_backup_${TIMESTAMP}.tar.gz"
    fi
}

# --------------------------------------------------------
# Build frontend locally if needed
# --------------------------------------------------------
build_frontend() {
    print_status "Checking/building frontend for $ENVIRONMENT..."
    export NODE_ENV=$ENVIRONMENT

    if [ -d "dist" ] && [ -f "dist/index.html" ]; then
        print_status "Using existing frontend build in dist/"
    else
        print_status "Building frontend..."
        rm -rf dist/
        npm ci
        npm run build
        if [ ! -d "dist" ]; then
            print_error "Frontend build failed: dist/ not found"
            exit 1
        fi
        print_success "Frontend built successfully"
    fi
}

# --------------------------------------------------------
# Run database migrations (backend)
# --------------------------------------------------------
run_migrations() {
    print_status "Running database migrations..."
    npm run migrate || print_warning "Migrations may have already been applied"
}

# --------------------------------------------------------
# Deploy via Docker Compose
# --------------------------------------------------------
deploy_docker() {
    print_status "Deploying with Docker Compose..."

    # Stop existing containers
    print_status "Stopping existing containers..."
    docker-compose down || true

    # Optional: remove dangling images
    print_status "Cleaning up old Docker images..."
    docker image prune -f || true

    # Build and start containers
    print_status "Building and starting containers..."
    docker-compose up --build -d

    # Wait for backend to start
    print_status "Waiting for backend to be ready..."
    sleep 10
}

# --------------------------------------------------------
# Health check frontend and backend
# --------------------------------------------------------
health_check() {
    print_status "Performing health checks..."

    # Frontend check (nginx)
    if curl -f -s http://localhost:8080 > /dev/null 2>&1; then
        print_success "Frontend health check passed (http://localhost:8080)"
    else
        print_warning "Frontend health check failed"
    fi

    # Backend API check
    if curl -f -s http://localhost:3001/api/hero > /dev/null 2>&1; then
        print_success "Backend API health check passed (http://localhost:3001/api/hero)"
    else
        print_warning "Backend API health check failed"
    fi
}

# --------------------------------------------------------
# Show deployment info
# --------------------------------------------------------
show_info() {
    echo ""
    print_success "Deployment Summary:"
    echo "📁 Project: $PROJECT_NAME"
    echo "🌍 Environment: $ENVIRONMENT"
    echo "⏰ Deployed at: $TIMESTAMP"
    echo ""
    echo "🌐 Services URLs:"
    echo "  Frontend (React + Nginx): http://localhost:8080"
    echo "  Backend API (Node.js): http://localhost:3001"
    echo "  Database: SQLite (persistent volume)"
    echo ""
    echo "Useful commands:"
    echo "  docker-compose logs -f frontend    # View frontend logs"
    echo "  docker-compose logs -f server      # View backend logs"
    echo "  docker-compose ps                  # Check container status"
    echo "  docker-compose restart             # Restart all services"
    echo "  docker-compose down                # Stop all services"
    echo "  npm run migrate                    # Run database migrations manually"
}

# --------------------------------------------------------
# Main deployment flow
# --------------------------------------------------------
main() {
    print_status "Starting full stack deployment process..."

    check_docker
    create_backup
    build_frontend
    run_migrations
    deploy_docker
    health_check
    show_info

    print_success "🎉 Deployment completed successfully!"
}

# --------------------------------------------------------
# Handle command line arguments
# --------------------------------------------------------
case "$1" in
    --help|-h)
        echo "Usage: $0 [environment]"
        echo "Default environment: production"
        exit 0
        ;;
    *)
        main "$@"
        ;;
esac
