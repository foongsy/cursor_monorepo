# API Contract Documentation

This document explains how the API contract is communicated between the frontend and backend in this monorepo.

## Overview

We use **OpenAPI/Swagger** with **automatic TypeScript generation** to maintain type safety between the FastAPI backend and TypeScript frontend.

## How It Works

### Backend (FastAPI)
- FastAPI automatically generates OpenAPI specifications from Pydantic models
- All API endpoints use Pydantic `BaseModel` classes as `response_model`
- OpenAPI spec is available at: `http://localhost:8000/openapi.json`
- Interactive API docs at: `http://localhost:8000/docs`

### Frontend (TypeScript)
- TypeScript types are auto-generated from the OpenAPI spec using `openapi-typescript`
- Generated types are stored in `frontend/src/api/types.ts`
- API client functions use these types for complete type safety

## Workflow

### 1. Define API Endpoints (Backend)

When creating new API endpoints, always define Pydantic response models:

```python
from pydantic import BaseModel
from fastapi import APIRouter

router = APIRouter()

class HelloResponse(BaseModel):
    message: str

@router.get("/hello", response_model=HelloResponse)
async def hello() -> HelloResponse:
    return HelloResponse(message="Hello from FastAPI!")
```

### 2. Generate TypeScript Types (Frontend)

After making backend changes:

```bash
# Make sure backend is running on port 8000
cd backend
uv run python main.py

# In another terminal, generate types
cd frontend
npm run generate-api-types
```

This generates `frontend/src/api/types.ts` with type-safe interfaces.

### 3. Use Types in Frontend

Import and use the generated types:

```typescript
import type { components } from './types';

type HelloResponse = components['schemas']['HelloResponse'];

export const fetchHello = async (): Promise<HelloResponse> => {
  const response = await fetch(`${API_URL}/api/hello`);
  return response.json();
};
```

## Type Safety Benefits

✅ **Compile-time type checking** - TypeScript will error if response structure doesn't match  
✅ **IntelliSense/autocomplete** - IDE provides suggestions for API response properties  
✅ **Refactoring safety** - Renaming fields in backend will cause TypeScript errors in frontend  
✅ **Documentation** - Types serve as living documentation of the API contract  

## Adding New Endpoints

1. **Backend**: Add endpoint with Pydantic response model
2. **Generate**: Run `npm run generate-api-types` in frontend
3. **Frontend**: Create typed API client function using generated types
4. **Commit**: Commit both backend changes and generated `types.ts`

## Example: Adding a New Endpoint

### Backend (`backend/app/routes/api.py`)
```python
class UserResponse(BaseModel):
    id: int
    name: str
    email: str

@router.get("/users/{user_id}", response_model=UserResponse)
async def get_user(user_id: int) -> UserResponse:
    return UserResponse(id=user_id, name="John", email="john@example.com")
```

### Regenerate Types
```bash
cd frontend
npm run generate-api-types
```

### Frontend (`frontend/src/api/client.ts`)
```typescript
type UserResponse = components['schemas']['UserResponse'];

export const fetchUser = async (userId: number): Promise<UserResponse> => {
  const response = await fetch(`${API_URL}/api/users/${userId}`);
  if (!response.ok) throw new Error('Failed to fetch user');
  return response.json();
};
```

## CI/CD Recommendations

Consider adding to your CI pipeline:

1. **Type generation check**: Verify `types.ts` is up-to-date
2. **Type checking**: Run `tsc --noEmit` to catch type errors
3. **OpenAPI validation**: Validate OpenAPI spec structure

## Tools Used

- **FastAPI**: Auto-generates OpenAPI 3.1 specification
- **Pydantic**: Defines request/response schemas with validation
- **openapi-typescript**: Generates TypeScript types from OpenAPI spec

## Troubleshooting

**Types not updating?**
- Ensure backend is running before generating types
- Check that `response_model` is set on all endpoints

**Type mismatches?**
- Regenerate types after backend changes
- Ensure you're importing from the correct generated types file

**Backend not starting?**
- Run `uv sync` in backend directory to install dependencies
- Check environment variables are set correctly

