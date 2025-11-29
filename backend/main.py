from fastapi import FastAPI
from pydantic import BaseModel
from app.cors import init_cors
from app.routes import api

app = FastAPI(
    title="Monorepo API",
    description="API for the cursor monorepo project",
    version="0.1.0"
)

# Initialize CORS
init_cors(app)

# Include routes
app.include_router(api.router, prefix="/api")

class MessageResponse(BaseModel):
    message: str

class HealthResponse(BaseModel):
    status: str

@app.get("/", response_model=MessageResponse)
async def root() -> MessageResponse:
    return MessageResponse(message="Welcome to the Monorepo API")

@app.get("/health", response_model=HealthResponse)
async def health() -> HealthResponse:
    return HealthResponse(status="ok")

if __name__ == "__main__":
    import uvicorn
    from app.config import settings
    reload_flag = settings.ENV != "production"
    uvicorn.run("main:app", host="0.0.0.0", port=settings.PORT, reload=reload_flag)
