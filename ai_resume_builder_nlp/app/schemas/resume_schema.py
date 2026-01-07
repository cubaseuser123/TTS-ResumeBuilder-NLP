"""
Pydantic schemas for resume-related data
"""

from pydantic import BaseModel, Field, EmailStr
from typing import Optional, List, Dict, Any


class ResumeRequest(BaseModel):
    """Request model for resume generation"""
    prompt: str = Field(..., min_length=10, description="User's resume prompt")
    answers: Optional[Dict[str, Any]] = Field(default={}, description="Answers to clarification questions")
    
    class Config:
        schema_extra = {
            "example": {
                "prompt": "Software Engineer with 5 years at Google, Python expert",
                "answers": {}
            }
        }


class ContactInfo(BaseModel):
    """Contact information"""
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    location: Optional[str] = None
    linkedin: Optional[str] = None
    github: Optional[str] = None


class Experience(BaseModel):
    """Work experience entry"""
    company: str
    title: str
    location: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    bullets: List[str] = []


class Education(BaseModel):
    """Education entry"""
    institution: str
    degree: str
    major: Optional[str] = None
    graduation_date: Optional[str] = None
    gpa: Optional[float] = None


class ResumeData(BaseModel):
    """Complete resume data"""
    name: str
    title: str
    contact: ContactInfo
    summary: Optional[str] = None
    experience: List[Experience] = []
    education: List[Education] = []
    skills: Dict[str, List[str]] = {}


class ValidationInfo(BaseModel):
    """Validation and scoring information"""
    atsScore: int = Field(ge=0, le=100)
    completenessScore: int = Field(ge=0, le=100)
    issues: List[str] = []


class ResumeResponse(BaseModel):
    """Response model for resume generation"""
    success: bool = True
    status: str = "success"
    resumeData: Optional[ResumeData] = None
    needsMoreInfo: bool = False
    questions: List[str] = []
    validation: Optional[ValidationInfo] = None
    error: Optional[str] = None