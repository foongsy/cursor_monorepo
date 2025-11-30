"""
FastAPI application entry point.
"""
from fastapi import FastAPI
from fastapi.middleware.gzip import GZipMiddleware
from pydantic import BaseModel

from app.config import settings
from app.cors import init_cors
from app.middleware import configure_error_handlers
from app.routes import api

# Create FastAPI application
app = FastAPI(
    title="Monorepo API",
    description="API for the cursor monorepo project",
    version="0.1.0",
    debug=settings.DEBUG,
)

# Configure middleware (order matters!)
# 1. CORS - must be first to handle preflight requests
init_cors(app)

# 2. Compression - compress responses before sending
if settings.ENABLE_COMPRESSION:
    app.add_middleware(
        GZipMiddleware,
        minimum_size=settings.COMPRESSION_MINIMUM_SIZE,
    )

# 3. Error handlers - catch and format exceptions
configure_error_handlers(app)

# Include API routes
app.include_router(api.router, prefix="/api")


# Response models
class MessageResponse(BaseModel):
    """Response model for simple message endpoints."""

    message: str


class HealthResponse(BaseModel):
    """Response model for health check endpoint."""

    status: str
    environment: str


@app.get("/", response_model=MessageResponse)
async def root() -> MessageResponse:
    """
    Root endpoint returning a welcome message.
    
    Returns:
        MessageResponse with welcome message.
    """
    return MessageResponse(message="Welcome to the Monorepo API")


@app.get("/health", response_model=HealthResponse)
async def health() -> HealthResponse:
    """
    Health check endpoint for monitoring.
    
    Returns:
        HealthResponse with status and environment information.
    """
    return HealthResponse(status="ok", environment=settings.ENV)


if __name__ == "__main__":
    import uvicorn

    reload_flag = settings.ENV != "production"
    uvicorn.run(
        "main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=reload_flag,
        log_level=settings.LOG_LEVEL.lower(),
    )
