# Chronicle Blog

Modern blog app built with Vite + React + TypeScript + Tailwind + shadcn-ui, and a Dockerized Express + MongoDB backend with JWT auth.

This guide explains how to clone, configure, and run everything locally on Windows (PowerShell), with step‑by‑step details including Docker image downloads, containers, environment keys, and common troubleshooting.

## Prerequisites

- Git
- Node.js 18+ (LTS recommended) and npm
- Docker Desktop (Windows) with WSL 2 backend enabled
  - Start Docker Desktop and keep it running while using containers
  - First run will download images (MongoDB, build base) — this can take several minutes

Optional (CLI checks):

```powershell
node -v
npm -v
docker --version
docker compose version
```

## 1) Clone the repository

```powershell
# Replace the URL with your repo
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_FOLDER>
```

Repo layout (key parts):

- `src/` — Frontend app (Vite + React + TS)
- `server/` — Backend API (Express + TS + MongoDB)
- `docker-compose.yml` — Orchestrates API + MongoDB

## 2) Frontend: run locally (no backend required)

```powershell
# From repo root
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

The frontend can run without a backend (uses local storage fallback). To connect it to the API, see “Connect frontend to API” below.

## 3) Backend API + DB via Docker (recommended)

1. Ensure Docker Desktop is running.

2. Create `server/.env` from the example:

```powershell
Copy-Item server/.env.example server/.env
```

Edit `server/.env` and set at least:

```env
PORT=3000
MONGO_URI=mongodb://mongo:27017/chronicle_blog
JWT_SECRET=change_me
```

3. Start containers from the repo root:

```powershell
docker compose up --build -d
```

What this does:

- Builds the API Docker image (TypeScript → JS)
- Pulls the MongoDB image (first time may take a while)
- Starts two containers: `api` (port 3000) and `mongo` (port 27017)

4. Verify the API is healthy:

Open http://localhost:3000/health

or view logs:

```powershell
docker compose logs -f api
```

Stop containers when you’re done:

```powershell
docker compose down
```

Reset DB data (danger: deletes data):

```powershell
docker compose down -v
```

## 4) Connect frontend to API

Create a `.env` file in the repo root for Vite and add:

```env
VITE_API_BASE_URL=http://localhost:3000
```

Restart the dev server to pick up changes:

```powershell
npm run dev
```

Now the app will call the Dockerized API for auth and blogs.

## 5) Alternative: run API without Docker (Node only)

```powershell
# From repo root
cd server
npm install
Copy-Item .env.example .env
# Edit .env and ensure MONGO_URI points to a running MongoDB
npm run dev
```

Default dev server listens on http://localhost:3000.

## 6) First‑run walkthrough

1. Start backend (Docker) and verify http://localhost:3000/health
2. Start frontend: `npm run dev` → open http://localhost:5173
3. Sign up (email + password) → login
4. Create, edit, or delete your own blogs in the editor; ownership is enforced

Useful URLs:

- Frontend: http://localhost:5173
- API health: http://localhost:3000/health
- Blogs (API): http://localhost:3000/blogs
- Auth endpoints: `/auth/signup`, `/auth/login`, `/auth/me`

## 7) Environment keys (recap)

Frontend (.env at repo root):

- `VITE_API_BASE_URL` — Base URL of the API, e.g. `http://localhost:3000`

Backend (`server/.env`):

- `PORT` — API port (default 3000)
- `MONGO_URI` — MongoDB connection string (Docker: `mongodb://mongo:27017/chronicle_blog`)
- `JWT_SECRET` — Secret key for signing JWTs (change this in non-dev environments)

## 8) Scripts reference

Frontend (repo root):

- `npm run dev` — Start Vite dev server
- `npm run build` — Production build
- `npm run preview` — Preview the production build
- `npm run lint` — Lint the codebase

Backend (`server/`):

- `npm run dev` — Run API in watch mode (ts-node-dev)
- `npm run build` — Compile TypeScript to `dist/`
- `npm start` — Run compiled API

Docker (repo root):

- `docker compose up --build -d` — Build and start API + Mongo in background
- `docker compose logs -f api` — Tail API logs
- `docker compose down` — Stop and remove containers
- `docker compose down -v` — Stop and remove containers + volumes (reset DB)

## 9) Troubleshooting

- Docker Desktop isn’t running
  - Start Docker Desktop; wait until the whale icon shows “Running”
- First run is slow / images download
  - This is normal the first time. Images are cached for subsequent runs
- Port already in use
  - Frontend 5173: close other Vite instances or change the port
  - API 3000 or Mongo 27017: stop conflicting services or edit ports in `docker-compose.yml`
- API health shows error
  - Check API logs: `docker compose logs -f api`
  - Confirm `server/.env` values; ensure `JWT_SECRET` is set; verify `MONGO_URI`
- Frontend can’t reach API (CORS/network)
  - Ensure `VITE_API_BASE_URL` is exactly `http://localhost:3000`
  - Restart `npm run dev` after editing `.env`
- Windows PowerShell env var for one‑off run
  - Prefer `.env` files. For temporary override: `$env:VITE_API_BASE_URL = 'http://localhost:3000'; npm run dev`

## 10) Tech stack

- Frontend: Vite, React 18, TypeScript, Tailwind CSS, shadcn‑ui, Radix UI, React Router, TanStack Query
- Backend: Express, TypeScript, Mongoose, JWT, bcrypt, Docker, MongoDB

## 11) Security notes

- Do not commit real secrets. `.env` files are environment‑specific
- Change `JWT_SECRET` in any non‑development environment
- Consider enabling HTTPS and CORS restrictions for deployments

---

Happy hacking! If you run into issues, check the logs and the troubleshooting section above, or file an issue with exact commands and output.
