from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from typing import Dict, Any, Optional
from datetime import datetime
import logging
import json
from app.agents.root_coordinator.agent import root_coordinator_agent
from app.pipeline_runner import pipeline


# ------------------------------------------------------------------
# HELPER FUNCTIONS
# ------------------------------------------------------------------
def sanitize_result(data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Convert result dict to JSON-safe format by filtering non-serializable values.
    """
    try:
        # Try direct JSON round-trip for simple cases
        return json.loads(json.dumps(data, default=str))
    except (TypeError, ValueError):
        # Fallback: manually filter non-serializable items
        clean = {}
        for key, value in data.items():
            try:
                json.dumps(value, default=str)
                clean[key] = value if not isinstance(value, (bytes, type)) else str(value)
            except (TypeError, ValueError):
                clean[key] = str(value)
        return clean

# ------------------------------------------------------------------
# LOGGING
# ------------------------------------------------------------------
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

# ------------------------------------------------------------------
# FASTAPI APP
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

# ------------------------------------------------------------------
# SCHEMAS
# ------------------------------------------------------------------
class ResumeRequest(BaseModel):
    prompt: str = Field(...,) #min_length=10
    answers: Optional[Dict[str, Any]] = None
    test_mode : Optional[bool] = False


class ResumeResponse(BaseModel):
    success: bool = True
    status: str = "success"
    data: Optional[Dict[str, Any]] = None
    error: Optional[str] = None


# ------------------------------------------------------------------
# GLOBAL ERROR HANDLER
# ------------------------------------------------------------------
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
# MAIN API - RESUME GENERATION
# ------------------------------------------------------------------

@app.post("/api/generate-resume")
async def generate_resume(request: ResumeRequest):
    try:
        # 1️⃣ Build initial state
        state = {
            "raw_text": request.prompt,
            "test_mode": request.test_mode
        }

        if getattr(request, "test_mode", False):
            state["test_mode"] = True

        # 2️⃣ Merge answers BEFORE pipeline runs (CRITICAL)
        if request.answers:
            for key, value in request.answers.items():
                state[key] = value

        result = await pipeline.run_async(state)

        # 4️⃣ Clarification stop
        if result.get("needs_more_information"):
            return {
                "success": True,
                "status": "needs_clarification",
                "data": {
                    "questions": result.get("questions", [])
                },
                "error": None
            }

        # 5️⃣ QA failure
        if result.get("qa_passed") is False:
            return {
                "success": False,
                "status": "qa_failed",
                "data": {
                    "issues": result.get("issues", [])
                },
                "error": "quality_assurance failed"
            }

        # 6️⃣ Success
        return {
            "success": True,
            "status": "success",
            "data": result,
            "error": None
        }

    except Exception as e:
        return {
            "success": False,
            "status": "error",
            "data": None,
            "error": str(e)
        }

    