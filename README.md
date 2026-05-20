# WebUni MERN Book Library

Simple MERN stack application that supports registration, login, and user-specific book management.

## Project structure
- `src/`: React + Vite front-end
- `backend/`: Express + MongoDB API

## Local setup
1. **Front-end**
   - `npm install`
   - `npm run dev`
   - Optional: create `.env` with `VITE_API_URL=http://localhost:4000`

2. **Back-end**
   - `cd backend`
   - `cp .env.example .env` and update values
   - `npm install`
   - `npm run dev`

## API routes
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `GET /api/books`
- `POST /api/books`
- `PUT /api/books/:id`
- `DELETE /api/books/:id`
