"""
Quick test to verify environment variables are loaded correctly
"""
import os
from dotenv import load_dotenv

load_dotenv()

def test_env():
    api_key = os.getenv("GEMINI_API_KEY")
    environment = os.getenv("ENVIRONMENT")
    
    print("=" * 50)
    print("Environment Configuration Test")
    print("=" * 50)
    
    if api_key:
        # Don't print the full key for security
        masked_key = api_key[:10] + "..." + api_key[-4:] if len(api_key) > 14 else "***"
        print(f"✓ GEMINI_API_KEY loaded: {masked_key}")
    else:
        print("✗ GEMINI_API_KEY not found!")
        print("  → Please add your API key to .env file")
    
    print(f"✓ ENVIRONMENT: {environment or 'Not set'}")
    print("=" * 50)
    
    if api_key and api_key != "your_gemini_api_key_here":
        print("\n✅ Environment setup complete!")
        return True
    else:
        print("\n⚠️  Please update your .env file with a real API key")
        return False

if __name__ == "__main__":
    test_env()
