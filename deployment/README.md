# Nika Project - Deployment

Docker configuration and deployment scripts for the Nika Project.

## Files

- `docker-compose.yml` - Docker Compose configuration for production deployment
- `Dockerfile.frontend` - Docker image build configuration for React frontend
- `Dockerfile.server` - Docker image build configuration for Node.js API server
- `nginx.conf` - Nginx configuration for serving the frontend
- `deploy.sh` - Automated deployment script

## Quick Deployment

### Prerequisites

- Docker and Docker Compose installed
- Node.js 18+ (for building frontend)

### Deploy

```bash
# From deployment directory
./deploy.sh [environment]

# Or manually with Docker Compose
docker-compose up --build -d
```

### Services

After deployment, the following services will be available:

- **Frontend**: http://localhost:80 (Nginx serving React app)
- **Backend API**: http://localhost:3001 (Node.js Express server)

### Useful Commands

```bash
# View logs
docker-compose logs -f frontend
docker-compose logs -f server

# Check container status
docker-compose ps

# Restart services
docker-compose restart

# Stop services
docker-compose down

# Run database migrations manually
cd .. && npm run migrate
```

## Project Structure

This deployment configuration assumes the following project structure:

```
project-root/
├── frontend/          # React application
├── server/            # API server code
├── scripts/           # Database migrations
├── data/              # SQLite database
├── deployment/        # This directory
│   ├── docker-compose.yml
│   ├── Dockerfile.frontend
│   ├── Dockerfile.server
│   ├── nginx.conf
│   └── deploy.sh
└── package.json       # Backend dependencies
```

## Environment Variables

### Frontend Container
- `NODE_ENV=production`

### Backend Container
- `NODE_ENV=production`
- `PORT=3001`

## Volumes

- `db-data` - Persistent volume for SQLite database
- `./frontend/src/assets/` - Mounted assets for hot reloading during development