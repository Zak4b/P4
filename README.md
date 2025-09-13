# P4 Game

A Connect Four game with real-time multiplayer functionality, now split into separate backend and frontend repositories.

## Architecture

This project is now organized into two independent subrepos:

- **`backend/`** - Node.js/Express API server with WebSocket support
- **`frontend/`** - Modern Vite-based frontend with TypeScript

## Quick Start

### Install all dependencies:
```bash
npm run install:all
```

### Build everything:
```bash
npm run build:all
```

### Development (run in separate terminals):
```bash
# Terminal 1 - Backend API server
npm run dev:backend

# Terminal 2 - Frontend development server
npm run dev:frontend
```

### Production:
```bash
# Build everything first
npm run build:all

# Start backend server
npm run start:backend

# Serve frontend (optional - can be served by backend)
npm run start:frontend
```

## Backend (`/backend/`)

- **Port**: 3000 (configurable via `.env`)
- **API Endpoints**: All routes under `/P4`
- **WebSocket**: Available at `/P4` endpoint
- **Database**: SQLite database for game persistence
- **CORS**: Configured to accept requests from frontend

### Backend Development:
```bash
cd backend
npm install
npm run dev    # Watch mode with auto-reload
npm run build  # Compile TypeScript
npm start      # Production mode
```

## Frontend (`/frontend/`)

- **Port**: 5173 (Vite dev server)
- **Build Tool**: Vite with TypeScript
- **Styling**: Bootstrap 5 with custom CSS
- **Assets**: Canvas-based game interface, real-time chat

### Frontend Development:
```bash
cd frontend
npm install
npm run dev      # Development server with HMR
npm run build    # Production build
npm run preview  # Preview production build
```

## Environment Configuration

### Backend (`.env` in `/backend/`):
```env
PORT=3000
IP=localhost
FRONTEND_URL=http://localhost:5173
```

### Frontend (`.env` in `/frontend/`):
```env
VITE_BACKEND_URL=http://localhost:3000
```

## Features

- **Real-time multiplayer**: WebSocket-based game state synchronization
- **Room system**: Create and join game rooms
- **Chat system**: In-game messaging with spectator voting
- **Game persistence**: SQLite database for game history
- **Responsive UI**: Bootstrap-based responsive interface
- **Modern development**: Vite with Hot Module Replacement

## Original Files

The original monolithic structure has been split:
- Server-side code moved to `backend/`
- Client-side assets converted to modern Vite structure in `frontend/`
- Original `public/` and `views/` preserved in backend for fallback compatibility