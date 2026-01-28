import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from typing import Optional, Dict, List, Any
import logging
from datetime import datetime
import json
from pathlib import Path

# ------------------------------------------------------------------
# LOGGING
# ------------------------------------------------------------------
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

# ------------------------------------------------------------------
# FASTAPI APP (MUST EXIST AT TOP LEVEL)
# ------------------------------------------------------------------
app = FastAPI(
    title="AI Resume Engine API",
    description="AI-powered resume generation using NLP (Enhanced)",
    version="1.1.0",
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
    prompt: str = Field(..., min_length=10)
    answers: Optional[Dict[str, Any]] = Field(default={})


class ResumeResponse(BaseModel):
    success: bool = True
    status: str = "success"
    resumeData: Optional[Dict[str, Any]] = None
    needsMoreInfo: bool = False
    questions: List[str] = []
    validation: Optional[Dict[str, Any]] = None
    error: Optional[str] = None


# ------------------------------------------------------------------
# GLOBAL ERROR HANDLER
# ------------------------------------------------------------------
@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    logger.error(str(exc), exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"success": False, "error": str(exc)},
    )


# ------------------------------------------------------------------
# BASIC ENDPOINTS
# ------------------------------------------------------------------
@app.get("/")
async def root():
    return {
        "name": "AI Resume Engine API (Integrated)",
        "status": "running",
        "timestamp": datetime.utcnow().isoformat(),
        "backend": "nlp-agents",
    }


@app.get("/health")
async def health_check():
    try:
        # Check critical services
        from app.services.data_loader import get_data_loader
        get_data_loader()
        return {"status": "healthy"}
    except Exception as e:
        return JSONResponse(
            status_code=503,
            content={"status": "unhealthy", "error": str(e)},
        )


# ------------------------------------------------------------------
# MAIN RESUME GENERATION
# ------------------------------------------------------------------
@app.post("/api/generate-resume", response_model=ResumeResponse)
async def generate_resume(request: ResumeRequest):
    try:
        # 🔥 LAZY IMPORTS (CRITICAL)
        # Using the existing NLP pipeline
        from app.nlp.extractors.entity_extractor import EntityExtractor
        from app.nlp.extractors.skill_matcher import SkillMatcher
        from app.nlp.enhancers.text_enhancer import enhance_bullet
        from app.nlp.generators.content_generator import generate_resume_structure

        extractor = EntityExtractor()
        matcher = SkillMatcher()

        # 1. Understanding & Extraction
        extracted = extractor.extract(request.prompt)

        # 2. Skill Matching
        skills = matcher.match_skills(request.prompt)
        extracted["skills"] = list(set(extracted.get("skills", []) + skills))

        if request.answers:
            extracted.update(request.answers)

        # 3. Validation Check
        required_fields = ["role", "years", "education", "contact"]
        missing = [f for f in required_fields if not extracted.get(f)]

        if len(extracted.get("skills", [])) < 3:
            missing.append("skills")

        # 4. Clarification Loop
        if missing:
            questions_map = {
                "role": "What is your job title?",
                "years": "How many years of experience do you have?",
                "education": "What is your education?",
                "contact": "What is your email?",
                "skills": "List your key skills",
            }

            return ResumeResponse(
                status="needs_more_info",
                needsMoreInfo=True,
                questions=[questions_map[m] for m in missing],
                validation={
                    "completenessScore": int(
                        ((4 - len(missing)) / 4) * 100
                    )
                },
            )

        # 5. Generation
        structure = generate_resume_structure(extracted)

        bullets = [
            "developed scalable backend systems",
            "improved system performance",
            "collaborated with cross-functional teams",
        ]
        
        # 6. Enhancement
        enhanced_bullets = [enhance_bullet(b) for b in bullets]

        resume_data = {
            "name": extracted.get("name", "Your Name"),
            "title": extracted.get("role"),
            "summary": f"{extracted.get('role')} with {extracted.get('years')} years of experience",
            "skills": matcher.categorize_skills(extracted.get("skills", [])),
            "experience": [
                {
                    "company": extracted.get("company", "Company"),
                    "bullets": enhanced_bullets,
                }
            ],
            "projects": structure.get("projects", []),
            "certificates": structure.get("certificates", []),
        }

        return ResumeResponse(
            success=True,
            resumeData=resume_data,
            validation={"atsScore": 85, "completenessScore": 100},
        )

    except Exception as e:
        logger.error(str(e), exc_info=True)
        return ResumeResponse(
            success=False,
            status="error",
            error=str(e),
        )


# ------------------------------------------------------------------
# DATA ENDPOINTS (Using Shared DataLoader Service)
# ------------------------------------------------------------------
@app.get("/api/data/skills")
async def get_skills():
    """Get all available skills"""
    from app.services.data_loader import get_data_loader
    loader = get_data_loader()
    return loader.get_skills()


@app.get("/api/data/companies")
async def get_companies():
    """Get all available companies"""
    from app.services.data_loader import get_data_loader
    loader = get_data_loader()
    return loader.get_companies()


@app.get("/api/data/action-verbs")
async def get_action_verbs():
    """Get all available action verbs"""
    from app.services.data_loader import get_data_loader
    loader = get_data_loader()
    return loader.get_action_verbs()

