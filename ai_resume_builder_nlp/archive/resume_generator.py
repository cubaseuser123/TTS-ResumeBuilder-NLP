"""
Resume Generator Service
This is the main orchestrator that combines the Data Loader and Gemini Service
to generate complete resumes from user prompts.
"""

import logging
from typing import Dict, Any, Optional
from app.services.data_loader import get_data_loader
from app.services.gemini_service import GeminiService
from app.schemas.resume_schema import ResumeData, ValidationInfo

logger = logging.getLogger(__name__)


class ResumeGenerator:
    """
    Main service that orchestrates resume generation.
    Combines data loading and AI generation.
    """
    
    def __init__(self):
        """Initialize the resume generator with required services"""
        self.data_loader = get_data_loader()
        self.gemini_service = GeminiService()
        logger.info("✓ ResumeGenerator initialized")
    
    async def generate_from_prompt(
        self,
        prompt: str,
        answers: Optional[Dict[str, Any]] = None
    ) -> ResumeData:
        """
        Generate a complete resume from a user prompt
        
        This is the main function that:
        1. Loads available skills/verbs/companies from JSON files
        2. Sends prompt + context to Gemini AI
        3. Receives structured resume data
        4. Validates and returns it
        
        Args:
            prompt: User's resume prompt (e.g., "Software Engineer at Google...")
            answers: Optional dict with additional user answers
            
        Returns:
            ResumeData object with complete resume information
        """
        logger.info(f"Generating resume from prompt: {prompt[:100]}...")
        
        try:
            # Step 1: Load context from JSON files
            context = self.data_loader.get_context_for_ai()
            logger.info("✓ Loaded context data for AI")
            
            # Step 2: Generate resume using Gemini
            resume_data = await self.gemini_service.generate_resume_data(
                user_prompt=prompt,
                context=context,
                answers=answers
            )
            
            logger.info("✓ Resume generated successfully")
            return resume_data
            
        except Exception as e:
            logger.error(f"✗ Failed to generate resume: {str(e)}")
            raise
    
    def validate_resume(self, resume_data: ResumeData) -> ValidationInfo:
        """
        Validate a resume and calculate scores
        
        Args:
            resume_data: Resume to validate
            
        Returns:
            ValidationInfo with scores and issues
        """
        issues = []
        
        # Check completeness
        if not resume_data.contact.email:
            issues.append("Missing email address")
        if not resume_data.contact.phone:
            issues.append("Missing phone number")
        if not resume_data.summary:
            issues.append("Missing professional summary")
        if not resume_data.experience:
            issues.append("No work experience listed")
        if not resume_data.education:
            issues.append("No education listed")
        if not resume_data.skills:
            issues.append("No skills listed")
        
        # Calculate completeness score (out of 100)
        max_score = 100
        deductions = len(issues) * 15  # 15 points per issue
        completeness_score = max(0, max_score - deductions)
        
        # Calculate ATS score (simplified)
        ats_score = 70  # Base score
        
        # Bonus for good formatting
        if resume_data.summary and len(resume_data.summary) > 50:
            ats_score += 10
        
        # Bonus for quantifiable bullets
        for exp in resume_data.experience:
            for bullet in exp.bullets:
                # Check for numbers (metrics)
                if any(char.isdigit() for char in bullet):
                    ats_score += 2
                    break
        
        ats_score = min(100, ats_score)  # Cap at 100
        
        return ValidationInfo(
            atsScore=ats_score,
            completenessScore=completeness_score,
            issues=issues
        )


# Singleton instance
_generator_instance = None

def get_resume_generator() -> ResumeGenerator:
    """
    Get the singleton ResumeGenerator instance
    
    Returns:
        ResumeGenerator instance
    """
    global _generator_instance
    if _generator_instance is None:
        _generator_instance = ResumeGenerator()
    return _generator_instance


# Main function for easy import
async def generate_resume_from_prompt(
    prompt: str,
    answers: Optional[Dict[str, Any]] = None
) -> ResumeData:
    """
    Convenience function to generate a resume from a prompt
    
    Args:
        prompt: User's resume prompt
        answers: Optional additional information
        
    Returns:
        ResumeData object
    """
    generator = get_resume_generator()
    return await generator.generate_from_prompt(prompt, answers)


# For testing
if __name__ == "__main__":
    import asyncio
    
    async def test_generator():
        print("\n" + "=" * 60)
        print("RESUME GENERATOR TEST")
        print("=" * 60)
        
        generator = get_resume_generator()
        
        test_prompt = "John Doe, Software Engineer with 3 years at Google. Expert in Python, React, and cloud infrastructure. Built systems serving 1M+ users."
        
        print(f"\nPrompt: {test_prompt}")
        print("\n🤖 Generating resume with AI...")
        
        try:
            resume_data = await generator.generate_from_prompt(test_prompt)
            
            print("\n✅ Resume Generated!")
            print("=" * 60)
            print(f"Name: {resume_data.name}")
            print(f"Title: {resume_data.title}")
            print(f"Email: {resume_data.contact.email}")
            print(f"\nSummary:\n{resume_data.summary}")
            print(f"\nExperience entries: {len(resume_data.experience)}")
            
            if resume_data.experience:
                print(f"\nFirst job:")
                print(f"  - Company: {resume_data.experience[0].company}")
                print(f"  - Title: {resume_data.experience[0].title}")
                print(f"  - Bullets: {len(resume_data.experience[0].bullets)}")
            
            print(f"\nSkills: {list(resume_data.skills.keys())}")
            
            # Validate
            validation = generator.validate_resume(resume_data)
            print(f"\n📊 Validation Scores:")
            print(f"  - ATS Score: {validation.atsScore}/100")
            print(f"  - Completeness: {validation.completenessScore}/100")
            if validation.issues:
                print(f"  - Issues: {', '.join(validation.issues)}")
            
        except Exception as e:
            print(f"\n✗ Error: {str(e)}")
            import traceback
            traceback.print_exc()
    
    asyncio.run(test_generator())
