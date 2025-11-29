from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

class HelloResponse(BaseModel):
    message: str

@router.get("/hello", response_model=HelloResponse)
async def hello() -> HelloResponse:
    return HelloResponse(message="Hello from FastAPI!")

