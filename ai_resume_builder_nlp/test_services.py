"""
Quick test to verify Gemini service imports correctly
"""

import os
from dotenv import load_dotenv

load_dotenv()

def test_imports():
    print("=" * 60)
    print("Testing Gemini Service Setup")
    print("=" * 60)
    
    # Test 1: Check API key
    api_key = os.getenv("GEMINI_API_KEY")
    if api_key and api_key != "your_gemini_api_key_here":
        print("✓ Gemini API key loaded")
    else:
        print("✗ Gemini API key not configured")
        return False
    
    # Test 2: Import google.generativeai
    try:
        import google.generativeai as genai
        print("✓ google.generativeai module imported")
    except ImportError as e:
        print(f"✗ Failed to import google.generativeai: {e}")
        return False
    
    # Test 3: Import our services
    try:
        from app.services.data_loader import get_data_loader
        print("✓ data_loader service imported")
        
        from app.services.gemini_service import GeminiService
        print("✓ gemini_service imported")
    except ImportError as e:
        print(f"✗ Failed to import services: {e}")
        return False
    
    # Test 4: Initialize services
    try:
        loader = get_data_loader()
        print(f"✓ DataLoader initialized ({len(loader.get_all_data())} data files)")
        
        gemini = GeminiService()
        print(f"✓ GeminiService initialized")
    except Exception as e:
        print(f"✗ Failed to initialize services: {e}")
        return False
    
    print("\n" + "=" * 60)
    print("✅ All services ready!")
    print("=" * 60)
    return True

if __name__ == "__main__":
    test_imports()
