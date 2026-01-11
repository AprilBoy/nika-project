# Nika Project

Full-stack portfolio website for Nika Shikhlianskaya - a systemic operational partner.

## Project Structure

This project is split into multiple independent applications:

- **`frontend/`** - React SPA with TypeScript
- **`server/`** - Node.js API server with SQLite database
- **`deployment/`** - Docker configuration and deployment files

## Quick Start

### Prerequisites

- Node.js 18+
- npm

### Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd nika-project
   ```

2. **Setup Frontend**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   Frontend will be available at `http://localhost:4200`

3. **Setup Backend** (in a separate terminal)
   ```bash
   # From project root
   npm install
   npm run migrate  # Setup database
   npm run dev
   ```
   Backend API will be available at `http://localhost:3001`

### Production Deployment

```bash
# Full deployment with Docker (recommended)
cd deployment
chmod +x deploy.sh  # Make script executable (first time only)
./deploy.sh [environment]

# Or use Docker Compose directly
cd deployment && docker-compose up --build -d

# Or build manually
cd frontend && npm run build
cd ..
npm run migrate
npm run server
```

### Troubleshooting Docker Issues

If you encounter container name conflicts:

```bash
# Clean up existing containers and volumes
cd deployment && ./clean.sh

# Then try deployment again
```

If you see warnings when stopping services:

```bash
# Use proper cleanup commands:
cd deployment && docker-compose down --remove-orphans  # Safe stop
cd deployment && ./clean.sh                            # Complete cleanup
```

**Note**: Warnings about missing networks when running `docker-compose down` are normal and can be ignored. They occur when the network was already removed or created with a different project name.
./deploy.sh [environment]
```

Or manually:

```bash
# Stop all containers
docker-compose down

# Remove specific containers
docker rm -f nika-project-frontend nika-project-server

# Remove volumes
docker volume rm nika-project_db-data

# Then deploy
docker-compose up --build -d
```

## Features

- **Frontend**: Responsive React application with modern UI
- **Backend**: RESTful API with SQLite database
- **Admin Panel**: Content management system
- **Docker Support**: Containerized deployment
- **Database Migrations**: Automated schema updates

## Technology Stack

### Frontend
- React 18 + TypeScript
- Vite
- Tailwind CSS
- Radix UI
- React Query
- Wouter (routing)

### Backend
- Node.js + Express
- SQLite + Better SQLite3
- CORS
- File upload handling

## Scripts

### Root Level (Backend)
- `npm run dev` - Start development server
- `npm run server` - Start production server
- `npm run migrate` - Run database migrations

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Environment Variables

### Frontend
- Automatically proxies API requests to `http://localhost:3001`

### Backend
- `PORT` - Server port (default: 3001)
- `NODE_ENV` - Environment mode

## Database

The application uses SQLite database stored in `data/app.db`. Database schema is managed through migration scripts in the `scripts/` directory.

## Docker Deployment

The project includes Docker Compose configuration for production deployment:

```bash
docker-compose -f deployment/docker-compose.yml up --build -d
```

This starts:
- Frontend (Nginx) on port 80
- Backend API on port 3001
- Persistent SQLite database

## Contributing

1. Frontend changes: Work in `frontend/` directory
2. Backend changes: Work in root directory
3. Database changes: Update migration scripts in `scripts/`

## License

MIT