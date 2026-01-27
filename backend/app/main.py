from fastapi import FastAPI
from .api.v1.endpoints import verification
from .api.errors import AppBaseException, app_exception_handler

app = FastAPI(title="Fact Verification AI")

# Menyambungkan router verification
app.include_router(verification.router, prefix="/api/v1", tags=["Verification"])

app.add_exception_handler(AppBaseException, app_exception_handler)

@app.get("/")
async def root():
    return {"message": "Backend Verifikasi Fakta Aktif"}