"""
Schemas for validation results
"""

from pydantic import BaseModel
from typing import List, Dict, Optional


class ValidationResult(BaseModel):
    """Result of data validation"""
    is_valid: bool
    errors: List[str] = []
    warnings: List[str] = []
    score: Optional[int] = None 