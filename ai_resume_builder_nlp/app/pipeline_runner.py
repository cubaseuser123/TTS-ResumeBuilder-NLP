"""
Custom Pipeline Runner for Non-LLM Agents
This module provides a sequential executor that calls agent tool functions directly,
respecting the user's design of having non-LLM agents with custom functions.
"""
import logging
from typing import Dict, Any, List, Callable

logger = logging.getLogger(__name__)


class ResumePipeline:
    """
    Executes the resume generation pipeline by calling agent tool functions in sequence.
    Each agent's tool function receives the accumulated state and returns updates.
    """
    
    def __init__(self):
        # Import tool functions from each agent
        from app.agents.understanding_agent.agent import understand_text
        from app.agents.clarification_agent.clarification_agent import clarification_questions
        from app.agents.generation_agent.agent import generate_resume
        from app.agents.enhancer_agent.agent import pre_enhance
        from app.agents.qa_agent.agent import qa_passthrough
        from app.agents.formatting_agent.agent import formatting_passthrough
        
        # Define pipeline stages with their functions and names
        self.stages: List[tuple[str, Callable]] = [
            ("understanding", understand_text),
            ("clarification", clarification_questions),
            ("generation", generate_resume),
            ("enhancement", pre_enhance),
            ("qa", qa_passthrough),
            ("formatting", formatting_passthrough),
        ]
    
    def run(self, initial_state: Dict[str, Any]) -> Dict[str, Any]:
        """
        Execute the pipeline synchronously.
        
        Args:
            initial_state: Dict containing 'raw_text' and optionally 'answers'
            
        Returns:
            Dict containing the final pipeline state with all accumulated results
        """
        state = dict(initial_state)
        
        # Merge user answers into state immediately so they are available to agents
        # This addresses the user requirement: "Before Clarification runs, user answers must be merged into state"
        answers = state.get("answers", {})
        if isinstance(answers, dict):
            state.update(answers)
            if answers:
                logger.info(f"Merged user answers into state: {list(answers.keys())}")

        logger.info("Starting resume pipeline execution")
        
        for stage_name, stage_func in self.stages:
            # Smart stage skipping: skip if output already exists in state
            if stage_name == "understanding" and state.get("entities"):
                logger.info("Skipping understanding: already has extracted data")
                continue
                
            if stage_name == "clarification":
                # Skip clarification ONLY if all required fields have values in state
                required_fields = [
                    "profile", "summary", "experience", "education", "skills",
                    "projects", "certificates", "publications", "interests",
                    "volunteering", "references"
                ]
                all_present = all(state.get(field) for field in required_fields)
                if all_present:
                    logger.info("Skipping clarification: all required fields present")
                    continue
            
            logger.info(f"Executing stage: {stage_name}")
            
            try:
                # Call the stage function with appropriate input
                if stage_name == "understanding":
                    # Understanding stage takes raw text as input
                    result = stage_func(state.get("raw_text", ""))
                else:
                    # Other stages take the accumulated state
                    result = stage_func(state)
                
                # Merge result into state
                if isinstance(result, dict):
                    state.update(result)
                    logger.info(f"Stage {stage_name} completed. Keys added: {list(result.keys())}")
                
                # Early exit conditions
                if stage_name == "clarification" and state.get("needs_more_information"):
                    logger.info("Pipeline paused: clarification needed")
                    return state
                    
                if stage_name == "qa" and not state.get("qa_passed", True):
                    logger.info("Pipeline stopped: QA failed")
                    return state
                    
            except Exception as e:
                logger.error(f"Error in stage {stage_name}: {e}", exc_info=True)
                state["error"] = str(e)
                state["failed_stage"] = stage_name
                return state
        
        logger.info("Pipeline execution completed successfully")
        return state
    
    async def run_async(self, initial_state: Dict[str, Any]) -> Dict[str, Any]:
        """
        Async wrapper for the pipeline (for FastAPI compatibility).
        Currently runs synchronously but can be extended for async stages.
        """
        return self.run(initial_state)


# Singleton instance
pipeline = ResumePipeline()
