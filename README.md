# FastAPI + React TypeScript Monorepo

A monorepo template using FastAPI (Python) for the backend and React + TypeScript (Vite) for the frontend. Configured for deployment on Render.

## Project Structure

```
cursor_monorepo/
├── backend/                # FastAPI application
│   ├── app/                # Application logic
│   ├── main.py             # Entry point
│   ├── pyproject.toml      # Dependencies (managed by uv)
│   └── ...
├── frontend/               # React application
│   ├── src/                # Frontend source
│   ├── vite.config.ts      # Vite configuration
│   └── ...
└── ...
```

## Local Development

### Prerequisites

- Python 3.13+ and `uv` installed (`pip install uv` or `curl -LsSf https://astral.sh/uv/install.sh | sh`)
- Node.js 18+ and `npm`

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a `.env` file (copy from example):
   ```bash
   cp env.example .env
   ```

3. Install dependencies:
   ```bash
   uv sync
   ```

4. Run the development server:
   ```bash
   uv run uvicorn main:app --reload
   ```
   The API will be available at `http://localhost:8000`.

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:5173`.

   Note: `vite.config.ts` is configured to proxy `/api` requests to `http://localhost:8000` during development.

## Deployment on Render

This repository is set up to be deployed as two separate services on [Render](https://render.com).

### Backend Service (Web Service)

1. Create a new **Web Service**.
2. Connect your repository.
3. Configure the following settings:
   - **Name**: `your-app-backend`
   - **Runtime**: Python 3
   - **Root Directory**: `backend`
   - **Build Command**: `uv sync`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
4. Add Environment Variables:
   - `PYTHON_VERSION`: `3.13` (or your preferred version)
   - `CORS_ORIGINS`: The URL of your deployed frontend (e.g., `https://your-app-frontend.onrender.com`)
   - `PORT`: (Render sets this automatically, but ensure your app reads it)

### Frontend Service (Static Site)

1. Create a new **Static Site**.
2. Connect your repository.
3. Configure the following settings:
   - **Name**: `your-app-frontend`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
4. Add Environment Variables:
   - `VITE_API_URL`: The URL of your deployed backend (e.g., `https://your-app-backend.onrender.com`)

### Build Filters (Monorepo Support)

To avoid unnecessary builds, configure **Build Filters** in the settings of each service:

- **Backend Service**:
  - **Root Directory**: `backend`
  - **Build Filter**:
    - Include: `backend/**`
    - Ignore: `frontend/**`

- **Frontend Service**:
  - **Root Directory**: `frontend`
  - **Build Filter**:
    - Include: `frontend/**`
    - Ignore: `backend/**`

## API Integration

- **Development**: Requests to `/api/...` are proxied to `http://localhost:8000/api/...` by Vite.
- **Production**: The frontend uses the `VITE_API_URL` environment variable to make absolute requests to the backend (e.g., `https://your-backend.onrender.com/api/...`). CORS is configured on the backend to allow this.
