from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api.v1.endpoints import verification
from .api.errors import AppBaseException, app_exception_handler

app = FastAPI(title="Fact Verification AI")

# Menyambungkan router verification
app.include_router(verification.router, prefix="/api/v1", tags=["Verification"])

app.add_exception_handler(AppBaseException, app_exception_handler)

# Daftar origin frontend; "*" tidak boleh dipakai bila allow_credentials=True
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:8000",   # Swagger UI
    "http://127.0.0.1:8000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Backend Verifikasi Fakta Aktif"}