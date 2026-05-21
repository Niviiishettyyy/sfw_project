# Bug Bounty Tracker

A full-stack bug bounty tracking app with React frontend and Express/MongoDB backend.

## Project Structure

- `backend/` - Express API server
- `frontend/` - Vite + React client
- `backend/.env` - local environment variables for backend

## Features

- User registration and login
- Role-based UI for reporters and admins
- Report submission and listing
- Leaderboard and report management
- JWT authentication
- File upload support for report attachments

## Tech Stack

- Backend: Node.js, Express, MongoDB, Mongoose, JWT, bcrypt, multer
- Frontend: React, React Router, Vite, Axios

## Prerequisites

- Node.js 18+ installed
- npm installed
- MongoDB running locally or accessible via URI

## Backend Setup

1. Open a terminal and go to the backend folder:
   ```powershell
   cd "c:\Users\Nivedita v shetty\Desktop\sfw_project\backend"
   ```
2. Install dependencies:
   ```powershell
   npm install
   ```
3. Ensure `.env` exists with at least:
   ```dotenv
   MONGO_URI=mongodb://localhost:27017/bugbounty
   JWT_SECRET=your_jwt_secret
   CLIENT_URL=http://localhost:5173
   ```
4. Start the backend:
   ```powershell
   npm run start
   ```

The backend runs on `http://localhost:5000`.

## Frontend Setup

1. Open a terminal and go to the frontend folder:
   ```powershell
   cd "c:\Users\Nivedita v shetty\Desktop\sfw_project\frontend"
   ```
2. Install dependencies:
   ```powershell
   npm install
   ```
3. Start the Vite dev server:
   ```powershell
   npm run dev
   ```

The frontend runs on:

- `http://localhost:5173/sfw_project/`

> Note: the project is configured with `base: '/sfw_project/'` in `frontend/vite.config.js`, so the app is served from that path.

## Usage

- Open `http://localhost:5173/sfw_project/`
- Register a new user or login if credentials already exist
- Use the dashboard, reports, and leaderboard pages after authentication

## Important Notes

- The root backend endpoint `http://localhost:5000/` returns a simple status response and is not the frontend app.
- If you want to serve the frontend at the root path (`/`), update `frontend/vite.config.js` to use `base: '/'` and adjust `frontend/src/main.jsx` if necessary.

## Troubleshooting

- If the frontend shows route errors, make sure the dev server is accessed at `http://localhost:5173/sfw_project/`
- If the backend cannot connect to MongoDB, verify the `MONGO_URI` in `backend/.env` and that MongoDB is running

## Run Summary

- Backend: `backend/npm run start`
- Frontend: `frontend/npm run dev`
