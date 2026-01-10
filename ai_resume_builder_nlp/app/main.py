from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from typing import Dict, Any, Optional
from datetime import datetime
import logging

# ------------------------------------------------------------------
# LOGGING
# ------------------------------------------------------------------
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

# ------------------------------------------------------------------
# FASTAPI APP (MUST BE TOP-LEVEL)
# ------------------------------------------------------------------
app = FastAPI(
    title="AI Resume Engine API",
    description="AI-powered resume generation system",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# ------------------------------------------------------------------
# CORS
# ------------------------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# SCHEMAS

class ResumeRequest(BaseModel):
    prompt: str = Field(..., min_length=10)
    answers: Optional[Dict[str, Any]] = None


class ResumeResponse(BaseModel):
    success: bool = True
    status: str = "success"
    data: Optional[Dict[str, Any]] = None
    error: Optional[str] = None



# GLOBAL ERROR HANDLER

@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    logger.error(str(exc), exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"success": False, "error": str(exc)},
    )


# ------------------------------------------------------------------
# BASIC ENDPOINTS
# ------------------------------------------------------------------
@app.get("/")
async def root():
    return {
        "name": "AI Resume Engine API",
        "status": "running",
        "timestamp": datetime.utcnow().isoformat(),
    }


@app.get("/health")
async def health():
    return {"status": "healthy"}


# ------------------------------------------------------------------
# MAIN API (LOGIC WILL BE ADDED LATER)
# ------------------------------------------------------------------
@app.post("/api/generate-resume", response_model=ResumeResponse)
async def generate_resume(request: ResumeRequest):
    """
    Main resume generation endpoint.
    NLP / Agents will be plugged in later (lazy imports).
    """
    logger.info("Received resume generation request")

    # Placeholder response (safe)
    return ResumeResponse(
        success=True,
        data={
            "message": "Resume generation pipeline connected successfully",
            "prompt": request.prompt,
        },
    )
