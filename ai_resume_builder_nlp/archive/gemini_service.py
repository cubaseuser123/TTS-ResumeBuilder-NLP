"""
Gemini AI Service
This service handles communication with Google's Gemini AI to generate resume content.
"""

import os
import json
import logging
from typing import Dict, Any, Optional
import google.generativeai as genai
from app.schemas.resume_schema import ResumeData, ContactInfo, Experience, Education

logger = logging.getLogger(__name__)

# Configure Gemini API
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    logger.warning("⚠️  GEMINI_API_KEY not found in environment variables")
else:
    genai.configure(api_key=GEMINI_API_KEY)
    logger.info("✓ Gemini API configured")


class GeminiService:
    """Service for interacting with Google's Gemini AI"""
    
    def __init__(self, model_name: str = "gemini-1.5-flash"):
        """
        Initialize the Gemini service
        
        Args:
            model_name: Which Gemini model to use (default: gemini-1.5-flash)
        """
        self.model = genai.GenerativeModel(model_name)
        logger.info(f"✓ Initialized Gemini model: {model_name}")
    
    def _create_resume_prompt(self, user_prompt: str, context: str) -> str:
        """
        Create a detailed prompt for Gemini to generate a resume
        
        Args:
            user_prompt: The user's input (e.g., "Software Engineer with 5 years at Google")
            context: Available skills, action verbs, etc. from our JSON files
            
        Returns:
            Formatted prompt for Gemini
        """
        prompt = f"""You are an expert resume writer and career counselor. Generate a professional, ATS-optimized resume based on the user's input.

USER INPUT:
{user_prompt}

AVAILABLE DATA TO USE:
{context}

INSTRUCTIONS:
1. Extract key information from the user's input (name, job titles, companies, skills, experience)
2. Use ONLY the skills and action verbs from the AVAILABLE DATA above
3. Create compelling, quantifiable bullet points for work experience
4. Format the output as a valid JSON object matching this exact structure:

{{
  "name": "Full Name",
  "title": "Professional Title",
  "contact": {{
    "email": "email@example.com or null",
    "phone": "phone number or null",
    "location": "City, State or null",
    "linkedin": "LinkedIn URL or null",
    "github": "GitHub URL or null"
  }},
  "summary": "Professional summary (2-3 sentences highlighting expertise)",
  "experience": [
    {{
      "company": "Company Name",
      "title": "Job Title",
      "location": "City, State or null",
      "start_date": "Month Year",
      "end_date": "Month Year or Present",
      "bullets": [
        "Achievement-focused bullet point using action verbs",
        "Include metrics and impact where possible"
      ]
    }}
  ],
  "education": [
    {{
      "institution": "University Name",
      "degree": "Degree Type",
      "major": "Major or null",
      "graduation_date": "Month Year or null",
      "gpa": 3.5 or null
    }}
  ],
  "skills": {{
    "Technical": ["skill1", "skill2"],
    "Tools": ["tool1", "tool2"]
  }}
}}

IMPORTANT RULES:
- Use action verbs from the available data (Led, Developed, Achieved, etc.)
- Include specific metrics and achievements in bullet points
- Make bullet points results-oriented and quantifiable
- Keep summaries concise but impactful
- Use null for any missing information (don't make up data)
- Return ONLY valid JSON, no extra text or markdown

Generate the resume now:"""
        
        return prompt
    
    async def generate_resume_data(
        self, 
        user_prompt: str, 
        context: str,
        answers: Optional[Dict[str, Any]] = None
    ) -> ResumeData:
        """
        Generate resume data using Gemini AI
        
        Args:
            user_prompt: User's resume prompt
            context: Available skills/verbs from JSON files
            answers: Optional additional information from user
            
        Returns:
            ResumeData object with structured resume information
        """
        try:
            # Create the prompt
            prompt = self._create_resume_prompt(user_prompt, context)
            
            # Add any additional answers from user
            if answers:
                prompt += f"\n\nADDITIONAL USER INFORMATION:\n{json.dumps(answers, indent=2)}"
            
            logger.info("Sending request to Gemini...")
            
            # Call Gemini API
            response = self.model.generate_content(prompt)
            
            # Extract the response text
            response_text = response.text.strip()
            
            # If response is wrapped in markdown code blocks, extract JSON
            if response_text.startswith("```"):
                # Remove markdown code blocks
                response_text = response_text.replace("```json", "").replace("```", "").strip()
            
            logger.info("✓ Received response from Gemini")
            logger.debug(f"Response: {response_text[:200]}...")
            
            # Parse JSON response
            resume_dict = json.loads(response_text)
            
            # Convert to Pydantic model
            resume_data = self._dict_to_resume_data(resume_dict)
            
            logger.info("✓ Successfully generated resume data")
            return resume_data
            
        except json.JSONDecodeError as e:
            logger.error(f"✗ Failed to parse Gemini response as JSON: {e}")
            logger.error(f"Response was: {response_text}")
            raise ValueError(f"AI returned invalid JSON: {str(e)}")
        
        except Exception as e:
            logger.error(f"✗ Error generating resume: {str(e)}")
            raise
    
    def _dict_to_resume_data(self, data: Dict[str, Any]) -> ResumeData:
        """
        Convert a dictionary to a ResumeData Pydantic model
        
        Args:
            data: Dictionary with resume data from Gemini
            
        Returns:
            ResumeData object
        """
        # Parse contact info
        contact_dict = data.get('contact', {})
        contact = ContactInfo(
            email=contact_dict.get('email'),
            phone=contact_dict.get('phone'),
            location=contact_dict.get('location'),
            linkedin=contact_dict.get('linkedin'),
            github=contact_dict.get('github')
        )
        
        # Parse experience
        experience_list = []
        for exp in data.get('experience', []):
            experience_list.append(Experience(
                company=exp.get('company', ''),
                title=exp.get('title', ''),
                location=exp.get('location'),
                start_date=exp.get('start_date'),
                end_date=exp.get('end_date'),
                bullets=exp.get('bullets', [])
            ))
        
        # Parse education
        education_list = []
        for edu in data.get('education', []):
            education_list.append(Education(
                institution=edu.get('institution', ''),
                degree=edu.get('degree', ''),
                major=edu.get('major'),
                graduation_date=edu.get('graduation_date'),
                gpa=edu.get('gpa')
            ))
        
        # Create ResumeData object
        resume_data = ResumeData(
            name=data.get('name', 'Unknown'),
            title=data.get('title', 'Professional'),
            contact=contact,
            summary=data.get('summary'),
            experience=experience_list,
            education=education_list,
            skills=data.get('skills', {})
        )
        
        return resume_data


# For testing
if __name__ == "__main__":
    import asyncio
    from app.services.data_loader import get_data_loader
    
    async def test_gemini():
        print("\n" + "=" * 60)
        print("GEMINI SERVICE TEST")
        print("=" * 60)
        
        # Load context data
        loader = get_data_loader()
        context = loader.get_context_for_ai()
        
        # Initialize Gemini service
        gemini = GeminiService()
        
        # Test prompt
        test_prompt = "Software Engineer with 3 years at Microsoft, expert in Python and React, built scalable web applications"
        
        print(f"\nTest Prompt: {test_prompt}")
        print("\nGenerating resume...")
        
        try:
            resume_data = await gemini.generate_resume_data(test_prompt, context)
            
            print("\n✓ Resume generated successfully!")
            print(f"\nName: {resume_data.name}")
            print(f"Title: {resume_data.title}")
            print(f"Summary: {resume_data.summary}")
            print(f"Experience entries: {len(resume_data.experience)}")
            print(f"Education entries: {len(resume_data.education)}")
            print(f"Skills categories: {list(resume_data.skills.keys())}")
            
        except Exception as e:
            print(f"\n✗ Error: {str(e)}")
    
    # Run the async test
    asyncio.run(test_gemini())
