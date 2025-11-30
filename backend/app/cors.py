"""
CORS (Cross-Origin Resource Sharing) configuration for the API.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import settings


def init_cors(app: FastAPI) -> None:
    """
    Initialize CORS middleware with configured origins.
    
    Allows requests from configured frontend domains and supports:
    - Credentials (cookies, authorization headers)
    - All HTTP methods
    - All headers
    
    Args:
        app: The FastAPI application instance.
    """
    # Get CORS origins from settings
    origins = settings.CORS_ORIGINS
    
    # In development, allow localhost with any port
    if settings.ENV == "development":
        # Add common development ports if not already present
        dev_origins = [
            "http://localhost:3000",
            "http://localhost:5173",
            "http://localhost:8080",
            "http://127.0.0.1:3000",
            "http://127.0.0.1:5173",
            "http://127.0.0.1:8080",
        ]
        for origin in dev_origins:
            if origin not in origins:
                origins.append(origin)
    
    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],  # Allows all methods: GET, POST, PUT, DELETE, etc.
        allow_headers=["*"],  # Allows all headers
        expose_headers=["*"],  # Expose all headers to the client
        max_age=600,  # Cache preflight requests for 10 minutes
    )

