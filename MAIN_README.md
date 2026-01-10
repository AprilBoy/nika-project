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
# Full deployment with Docker
cd deployment && ./deploy.sh [environment]

# Or build manually
cd frontend && npm run build
cd ..
npm run migrate
npm run server

# Or use Docker Compose directly
cd deployment && docker-compose up --build -d
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