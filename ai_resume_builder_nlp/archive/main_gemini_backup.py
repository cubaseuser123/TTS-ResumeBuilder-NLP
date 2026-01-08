from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from typing import Dict, Any, Optional
from datetime import datetime
import logging
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

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

# ------------------------------------------------------------------
# IMPORTS FROM OUR SCHEMAS
# ------------------------------------------------------------------
from app.schemas.resume_schema import (
    ResumeRequest,
    ResumeResponse,
    ResumeData,
    ValidationInfo
)



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
@app.post("/api/generate-resume", response_model=ResumeResponse)
async def generate_resume(request: ResumeRequest):
    """
    Main resume generation endpoint.
    Takes a user prompt and generates a complete, ATS-optimized resume.
    
    Args:
        request: ResumeRequest with prompt and optional answers
        
    Returns:
        ResumeResponse with generated resume data or error
    """
    logger.info(f"📝 Received resume generation request: {request.prompt[:100]}...")
    
    try:
        # Import the resume generator (lazy import to avoid startup overhead)
        from app.services.resume_generator import generate_resume_from_prompt, get_resume_generator
        
        # Generate the resume using AI
        logger.info("🤖 Generating resume with AI...")
        resume_data = await generate_resume_from_prompt(
            prompt=request.prompt,
            answers=request.answers
        )
        
        # Validate the generated resume
        generator = get_resume_generator()
        validation = generator.validate_resume(resume_data)
        
        logger.info(f"✅ Resume generated successfully! ATS Score: {validation.atsScore}")
        
        # Return successful response
        return ResumeResponse(
            success=True,
            status="success",
            resumeData=resume_data,
            needsMoreInfo=False,
            questions=[],
            validation=validation
        )
        
    except ValueError as e:
        # Handle validation errors
        logger.error(f"❌ Validation error: {str(e)}")
        return ResumeResponse(
            success=False,
            status="error",
            error=f"Invalid input: {str(e)}"
        )
        
    except Exception as e:
        # Handle unexpected errors
        logger.error(f"❌ Unexpected error: {str(e)}", exc_info=True)
        return ResumeResponse(
            success=False,
            status="error",
            error=f"Failed to generate resume: {str(e)}"
        )


# ------------------------------------------------------------------
# ADDITIONAL HELPER ENDPOINTS
# ------------------------------------------------------------------
@app.get("/api/skills")
async def get_available_skills():
    """
    Get all available skills from the database.
    Useful for frontend autocomplete/suggestions.
    """
    try:
        from app.services.data_loader import get_data_loader
        
        loader = get_data_loader()
        skills = loader.get_skills()
        
        return {
            "success": True,
            "data": skills
        }
    except Exception as e:
        logger.error(f"Error loading skills: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/action-verbs")
async def get_action_verbs():
    """Get all available action verbs categorized by type"""
    try:
        from app.services.data_loader import get_data_loader
        
        loader = get_data_loader()
        action_verbs = loader.get_action_verbs()
        
        return {
            "success": True,
            "data": action_verbs
        }
    except Exception as e:
        logger.error(f"Error loading action verbs: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/validate-resume")
async def validate_resume_endpoint(resume_data: ResumeData):
    """
    Validate a resume and return ATS score and completeness score.
    
    Args:
        resume_data: Complete resume data to validate
        
    Returns:
        Validation info with scores and issues
    """
    try:
        from app.services.resume_generator import get_resume_generator
        
        generator = get_resume_generator()
        validation = generator.validate_resume(resume_data)
        
        return {
            "success": True,
            "validation": validation
        }
    except Exception as e:
        logger.error(f"Error validating resume: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


