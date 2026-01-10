#!/bin/bash

# Nika Project Full Stack Deployment Script
# Deploys React frontend, Node.js API server, and SQLite database
# Usage: ./deploy.sh [environment]
# Default environment: production

set -e

ENVIRONMENT=${1:-production}
PROJECT_NAME="nika-project"
TIMESTAMP=$(date +%d.%m.%Y_%H:%M:%S)

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
# Check if we're in the correct project directory
# --------------------------------------------------------
check_project_directory() {
    # Check if we're in deployment directory
    if [ ! -f "docker-compose.yml" ]; then
        print_error "docker-compose.yml not found. Please run this script from the deployment directory."
        exit 1
    fi

    # Check if we're in project root (parent directory should have package.json)
    if [ ! -f "../server/package.json" ]; then
        print_error "package.json not found in parent directory. Please run this script from the deployment subdirectory."
        exit 1
    fi

        # Check if we're in project root (parent directory should have package.json)
    if [ ! -f "../frontend/package.json" ]; then
        print_error "package.json not found in parent directory. Please run this script from the deployment subdirectory."
        exit 1
    fi

    print_success "Project directory validated"
}

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

    if [ -d "../frontend/dist" ] && [ -f "../frontend/dist/index.html" ]; then
        print_status "Using existing frontend build in ../frontend/dist/"
        # Copy frontend build to root dist for nginx
        rm -rf ../dist/
        cp -r ../frontend/dist ../dist/
    else
        print_status "Building frontend..."
        cd ../frontend
        rm -rf dist/
        npm ci
        npm run build
        cd ../deployment
        if [ ! -d "../frontend/dist" ]; then
            print_error "Frontend build failed: ../frontend/dist/ not found"
            exit 1
        fi
        # Copy frontend build to root dist for nginx
        rm -rf ../dist/
        cp -r ../frontend/dist ../dist/
        print_success "Frontend built successfully"
    fi
}

# --------------------------------------------------------
# Run database migrations (backend)
# --------------------------------------------------------
run_migrations() {
    print_status "Running database migrations..."
    if cd ../server && npm run migrate; then
        cd ../deployment
        print_success "Database migrations completed successfully"
    else
        cd ../deployment
        print_error "Database migrations failed"
        exit 1
    fi
}

# --------------------------------------------------------
# Check if required ports are available
# --------------------------------------------------------
check_ports() {
    print_status "Checking port availability..."

    local ports=(80 3001)
    local port_in_use=false

    for port in "${ports[@]}"; do
        if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
            print_warning "Port $port is already in use"
            port_in_use=true
        else
            print_success "Port $port is available"
        fi
    done

    if [ "$port_in_use" = true ]; then
        print_warning "Some ports are in use. Docker containers may fail to start if ports are not available."
        print_status "Continuing with deployment anyway..."
    fi
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

    # Services will be checked in health_check function
}

# --------------------------------------------------------
# Health check frontend and backend with retries
# --------------------------------------------------------
health_check() {
    print_status "Performing health checks..."

    # Function to check service with retries
    check_service() {
        local url=$1
        local service_name=$2
        local max_attempts=5
        local attempt=1

        while [ $attempt -le $max_attempts ]; do
            print_status "Checking $service_name (attempt $attempt/$max_attempts)..."

            if curl -f --max-time 10 -s "$url" > /dev/null 2>&1; then
                print_success "$service_name health check passed ($url)"
                return 0
            fi

            if [ $attempt -lt $max_attempts ]; then
                print_warning "$service_name not ready, waiting 5 seconds..."
                sleep 5
            fi

            attempt=$((attempt + 1))
        done

        print_error "$service_name health check failed after $max_attempts attempts"
        return 1
    }

    local all_healthy=true

    # Frontend check (nginx)
    if ! check_service "http://localhost:80" "Frontend"; then
        all_healthy=false
    fi

    # Backend API checks - test all main endpoints
    local api_endpoints=(
        "api/hero:Hero Data"
        "api/about:About Section"
        "api/process-steps:Process Steps"
        "api/client-segments:Client Segments"
        "api/services:Services"
        "api/testimonials:Testimonials"
        "api/projects:Projects"
        "api/inquiries:Inquiries"
    )

    for endpoint_info in "${api_endpoints[@]}"; do
        IFS=':' read -r endpoint name <<< "$endpoint_info"
        if ! check_service "http://localhost:3001/$endpoint" "$name API"; then
            all_healthy=false
        fi
    done

    if [ "$all_healthy" = true ]; then
        print_success "All services are healthy"
    else
        print_warning "Some services failed health checks but deployment continues"
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
    echo "  Frontend (React + Nginx): http://localhost:80"
    echo "  Backend API (Node.js): http://localhost:3001"
    echo "  Database: SQLite (persistent volume)"
    echo ""
    echo "Useful commands:"
    echo "  docker-compose logs -f frontend    # View frontend logs"
    echo "  docker-compose logs -f server      # View backend logs"
    echo "  docker-compose ps                  # Check container status"
    echo "  docker-compose restart             # Restart all services"
    echo "  docker-compose down                # Stop all services"
    echo "  cd .. && npm run migrate           # Run database migrations manually"
}

# --------------------------------------------------------
# Main deployment flow
# --------------------------------------------------------
main() {
    print_status "Starting full stack deployment process..."

    check_project_directory
    check_docker
    check_ports
    create_backup
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
