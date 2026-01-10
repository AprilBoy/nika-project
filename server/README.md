# Nika Project - Backend

Node.js API server for Nika Shikhlianskaya's portfolio website.

## Features

- Express.js API server
- SQLite database with Better SQLite3
- Database migrations
- Image upload handling
- CORS support
- Admin authentication

## Development

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
npm install
```

### Database Setup

```bash
# Run migrations
npm run migrate

# Run image migration (if needed)
npm run migrate:image
```

### Running

```bash
# Development server with auto-restart
npm run dev

# Production server
npm run server
```

### API Endpoints

- `GET /api/hero` - Hero section data
- `GET /api/about` - About section data
- `GET /api/services` - Services data
- `GET /api/testimonials` - Testimonials data
- `POST /api/inquiries` - Contact form submissions

## Project Structure

```
├── server/             # API server code
│   ├── index.js        # Main server file
│   └── src/           # Server modules
├── scripts/           # Database migration scripts
├── data/              # SQLite database files
└── package.json       # Dependencies and scripts
```

## Environment Variables

- `PORT` - Server port (default: 3001)
- `NODE_ENV` - Environment (development/production)

## Admin Panel

The admin panel is accessible at `/admin/` and requires authentication.

## Deployment

Use the `deploy.sh` script for full-stack deployment with Docker.