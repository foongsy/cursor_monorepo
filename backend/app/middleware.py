"""
Middleware configuration for the FastAPI application.
"""
import logging
from typing import Any, Dict

from fastapi import FastAPI, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException

logger = logging.getLogger(__name__)


def configure_error_handlers(app: FastAPI) -> None:
    """
    Configure custom error handlers for the application.
    
    Args:
        app: The FastAPI application instance.
    """

    @app.exception_handler(StarletteHTTPException)
    async def http_exception_handler(
        request: Request, exc: StarletteHTTPException
    ) -> JSONResponse:
        """
        Handle HTTP exceptions with a consistent JSON response format.
        
        Args:
            request: The incoming request.
            exc: The HTTP exception.
            
        Returns:
            JSONResponse with error details.
        """
        return JSONResponse(
            status_code=exc.status_code,
            content={
                "error": {
                    "message": exc.detail,
                    "status_code": exc.status_code,
                    "path": str(request.url),
                }
            },
        )

    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(
        request: Request, exc: RequestValidationError
    ) -> JSONResponse:
        """
        Handle request validation errors with detailed error information.
        
        Args:
            request: The incoming request.
            exc: The validation error.
            
        Returns:
            JSONResponse with validation error details.
        """
        errors = []
        for error in exc.errors():
            errors.append(
                {
                    "field": " -> ".join(str(loc) for loc in error["loc"]),
                    "message": error["msg"],
                    "type": error["type"],
                }
            )

        return JSONResponse(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            content={
                "error": {
                    "message": "Validation error",
                    "status_code": status.HTTP_422_UNPROCESSABLE_ENTITY,
                    "path": str(request.url),
                    "details": errors,
                }
            },
        )

    @app.exception_handler(Exception)
    async def general_exception_handler(
        request: Request, exc: Exception
    ) -> JSONResponse:
        """
        Handle unexpected exceptions with a generic error response.
        Logs the full exception for debugging.
        
        Args:
            request: The incoming request.
            exc: The exception.
            
        Returns:
            JSONResponse with generic error message.
        """
        logger.error(
            f"Unhandled exception: {exc}",
            exc_info=True,
            extra={
                "path": str(request.url),
                "method": request.method,
            },
        )

        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={
                "error": {
                    "message": "Internal server error",
                    "status_code": status.HTTP_500_INTERNAL_SERVER_ERROR,
                    "path": str(request.url),
                }
            },
        )

