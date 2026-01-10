# Nika Project - Frontend

React frontend application for Nika Shikhlianskaya's portfolio website.

## Features

- React 18 with TypeScript
- Vite build tool
- Tailwind CSS for styling
- Radix UI components
- Responsive design
- Admin panel integration

## Development

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
cd frontend
npm install
```

### Running

```bash
# Development server
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Type checking
npm run check
```

### Environment Variables

The frontend proxies API requests to the backend server. Make sure the backend is running on `http://localhost:3001`.

## Project Structure

```
frontend/
├── src/
│   ├── assets/          # Static assets (images)
│   ├── components/      # React components
│   ├── data/           # Static data and content
│   ├── hooks/          # Custom React hooks
│   ├── lib/            # Utilities and configurations
│   ├── pages/          # Page components
│   ├── App.tsx         # Main app component
│   └── main.tsx        # Entry point
├── public/             # Public assets
├── index.html          # HTML template
└── package.json        # Dependencies and scripts
```