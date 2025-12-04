#!/bin/bash

# Nika Project Deployment Script
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
    print_status "Performing health check..."

    # Wait a bit for the application to fully start
    sleep 5

    # Check if nginx is responding
    if curl -f -s http://localhost/health > /dev/null 2>&1; then
        print_success "Health check passed"
    else
        print_warning "Health check failed - application may not be fully ready yet"
    fi
}

# Show deployment info
show_info() {
    echo ""
    print_success "Deployment Summary:"
    echo "📁 Project: $PROJECT_NAME"
    echo "🌍 Environment: $ENVIRONMENT"
    echo "⏰ Deployed at: $TIMESTAMP"
    echo "🌐 URL: http://localhost"
    echo "🏥 Health check: http://localhost/health"
    echo ""
    echo "Useful commands:"
    echo "  docker-compose logs -f          # View logs"
    echo "  docker-compose ps              # Check container status"
    echo "  docker-compose restart         # Restart services"
    echo "  docker-compose down            # Stop services"
}

# Main deployment flow
main() {
    print_status "Starting deployment process..."

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
        echo "Nika Project Deployment Script"
        echo ""
        echo "Usage: $0 [environment]"
        echo ""
        echo "Arguments:"
        echo "  environment    Deployment environment (default: production)"
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
