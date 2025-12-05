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
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is installed
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

# Create backup of current deployment
create_backup() {
    if [ -d "dist" ]; then
        print_status "Creating backup of current deployment..."
        mkdir -p backups
        tar -czf "backups/${PROJECT_NAME}_backup_${TIMESTAMP}.tar.gz" dist/ 2>/dev/null || true
        print_success "Backup created: backups/${PROJECT_NAME}_backup_${TIMESTAMP}.tar.gz"
    fi
}

# Build the application
build_app() {
    print_status "Building application for $ENVIRONMENT..."

    # Set environment variables
    export NODE_ENV=$ENVIRONMENT

    # Clean previous build
    rm -rf dist/

    # Install dependencies
    print_status "Installing dependencies..."
    npm ci

    # Run database migrations before building
    print_status "Running database migrations..."
    npm run migrate

    # Build application
    print_status "Building application..."
    npm run build

    if [ ! -d "dist" ]; then
        print_error "Build failed - dist directory not found"
        exit 1
    fi

    print_success "Application built successfully"
}

# Deploy with Docker
deploy_docker() {
    print_status "Deploying with Docker..."

    # Stop existing containers
    print_status "Stopping existing containers..."
    docker-compose down || true

    # Remove old images (optional, for clean deployment)
    print_status "Cleaning up old Docker images..."
    docker image prune -f || true

    # Build and start containers
    print_status "Building and starting containers..."
    docker-compose up --build -d

    # Wait for containers to be healthy
    print_status "Waiting for containers to start..."
    sleep 10

    # Check if containers are running
    if docker-compose ps | grep -q "Up"; then
        print_success "Deployment completed successfully!"
        print_status "Application is running at http://localhost"
    else
        print_error "Deployment failed - containers are not running"
        docker-compose logs
        exit 1
    fi
}

# Health check
health_check() {
    print_status "Performing health checks..."

    # Wait a bit for the application to fully start
    sleep 10

    # Check if frontend (nginx) is responding
    if curl -f -s http://localhost > /dev/null 2>&1; then
        print_success "Frontend health check passed"
    else
        print_warning "Frontend health check failed - application may not be fully ready yet"
    fi

    # Check if server API is responding
    if curl -f -s http://localhost:3001/api/hero > /dev/null 2>&1; then
        print_success "Server API health check passed"
    else
        print_warning "Server API health check failed - backend may not be fully ready yet"
    fi
}

# Show deployment info
show_info() {
    echo ""
    print_success "Deployment Summary:"
    echo "📁 Project: $PROJECT_NAME"
    echo "🌍 Environment: $ENVIRONMENT"
    echo "⏰ Deployed at: $TIMESTAMP"
    echo ""
    echo "🌐 Services:"
    echo "  Frontend (React + Nginx): http://localhost"
    echo "  Backend API (Node.js): http://localhost:3001"
    echo "  Database: SQLite (persistent volume)"
    echo ""
    echo "🔍 API Endpoints:"
    echo "  GET  /api/hero          - Hero section data"
    echo "  GET  /api/about         - About section data"
    echo "  GET  /api/process-steps - Process steps data"
    echo "  GET  /api/services      - Services data"
    echo "  GET  /api/testimonials  - Testimonials data"
    echo "  GET  /api/projects      - Projects data"
    echo "  GET  /api/inquiries     - Contact form submissions"
    echo ""
    echo "Useful commands:"
    echo "  docker-compose logs -f frontend    # View frontend logs"
    echo "  docker-compose logs -f server      # View server logs"
    echo "  docker-compose ps                  # Check container status"
    echo "  docker-compose restart             # Restart all services"
    echo "  docker-compose down                # Stop all services"
    echo "  npm run migrate                    # Run database migrations manually"
}

# Main deployment flow
main() {
    print_status "Starting full stack deployment process..."

    check_docker
    create_backup
    build_app
    deploy_docker
    health_check
    show_info

    print_success "🎉 Deployment completed successfully!"
}

# Handle command line arguments
case "$1" in
    --help|-h)
        echo "Nika Project Full Stack Deployment Script"
        echo "Deploys React frontend, Node.js API server, and SQLite database"
        echo ""
        echo "Usage: $0 [environment]"
        echo ""
        echo "Arguments:"
        echo "  environment    Deployment environment (default: production)"
        echo ""
        echo "Services deployed:"
        echo "  - Frontend: React app served by Nginx on port 80"
        echo "  - Backend: Node.js Express API server on port 3001"
        echo "  - Database: SQLite with persistent volume"
        echo ""
        echo "Examples:"
        echo "  $0                    # Deploy to production"
        echo "  $0 staging           # Deploy to staging"
        echo "  $0 --help            # Show this help"
        exit 0
        ;;
    *)
        main "$@"
        ;;
esac
