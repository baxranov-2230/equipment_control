from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.api.v1 import auth, employees, suppliers, inventory, assignments, repair_requests, dashboard, upload
from app.core.config import get_settings
from app.db.init_db import init_db

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    await init_db()
    yield
    # Shutdown


app = FastAPI(
    title=settings.APP_NAME,
    version="1.0.0",
    description="Tashkilot Jihozlari Aylanmasi Tizimi — REST API",
    lifespan=lifespan,
    docs_url="/rest/docs",
    redoc_url="/rest/redoc",
    openapi_url="/rest/openapi.json",
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static files (uploads)
import os
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")

# API Routers
API_PREFIX = "/rest"
app.include_router(auth.router, prefix=API_PREFIX)
app.include_router(employees.router, prefix=API_PREFIX)
app.include_router(suppliers.router, prefix=API_PREFIX)
app.include_router(inventory.router, prefix=API_PREFIX)
app.include_router(assignments.router, prefix=API_PREFIX)
app.include_router(repair_requests.router, prefix=API_PREFIX)
app.include_router(dashboard.router, prefix=API_PREFIX)
app.include_router(upload.router, prefix=API_PREFIX)


@app.get("/rest", tags=["Health"])
async def root():
    return {
        "app": settings.APP_NAME,
        "version": "1.0.0",
        "status": "running",
    }


@app.get("/rest/health", tags=["Health"])
async def health():
    return {"status": "ok"}
