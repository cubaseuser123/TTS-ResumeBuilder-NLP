"""
Schemas for agent input/output
"""

from pydantic import BaseModel
from typing import Dict, List, Any, Optional


class AgentInput(BaseModel):
    """Input to any agent"""
    prompt: str
    context: Optional[Dict[str, Any]] = {}
    previous_results: Optional[Dict[str, Any]] = {}


class AgentOutput(BaseModel):
    """Output from any agent"""
    success: bool
    data: Dict[str, Any]
    next_agent: Optional[str] = None
    errors: List[str] = []