from fastapi import FastAPI
from app.cors import init_cors
from app.routes import api

app = FastAPI()

# Initialize CORS
init_cors(app)

# Include routes
app.include_router(api.router, prefix="/api")

@app.get("/")
async def root():
    return {"message": "Welcome to the Monorepo API"}

@app.get("/health")
async def health():
    return {"status": "ok"}

if __name__ == "__main__":
    import uvicorn
    from app.config import settings
    reload_flag = settings.ENV != "production"
    uvicorn.run("main:app", host="0.0.0.0", port=settings.PORT, reload=reload_flag)
