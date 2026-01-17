"""
Test and Compare Both Backend Implementations
Tests both your Gemini backend and co-developer's NLP backend
"""

import requests
import json
from datetime import datetime

# Test prompts
TEST_PROMPTS = [
    "Software Engineer with 5 years at Google, expert in Python and React, built systems serving 1M+ users",
    "Data Scientist at Meta, PhD in Machine Learning, 3 years experience with TensorFlow and PyTorch",
    "Senior DevOps Engineer, AWS certified, 7 years experience with Kubernetes and Docker"
]

def test_backend(url: str, backend_name: str, prompt: str):
    """Test a single backend with a prompt"""
    print(f"\n{'='*70}")
    print(f"Testing: {backend_name}")
    print(f"{'='*70}")
    print(f"Prompt: {prompt[:60]}...")
    
    try:
        start_time = datetime.now()
        response = requests.post(
            f"{url}/api/generate-resume",
            json={"prompt": prompt},
            timeout=30
        )
        end_time = datetime.now()
        duration = (end_time - start_time).total_seconds()
        
        if response.status_code == 200:
            data = response.json()
            
            print(f"✅ Success (took {duration:.2f}s)")
            print(f"Status: {data.get('status', 'N/A')}")
            
            # Extract key information
            resume_data = data.get('resumeData', {})
            if resume_data:
                print(f"\n📋 Generated Resume:")
                print(f"  Name: {resume_data.get('name', 'N/A')}")
                print(f"  Title: {resume_data.get('title', 'N/A')}")
                print(f"  Summary: {resume_data.get('summary', 'N/A')[:100]}...")
                
                # Skills
                skills = resume_data.get('skills', {})
                if skills:
                    print(f"  Skills: {list(skills.keys())[:5]}")
                
                # Experience
                experience = resume_data.get('experience', [])
                if experience:
                    print(f"  Experience entries: {len(experience)}")
                    if experience:
                        first_exp = experience[0]
                        print(f"    - {first_exp.get('company', 'N/A')} - {first_exp.get('title', 'N/A')}")
                        bullets = first_exp.get('bullets', [])
                        if bullets:
                            print(f"    - Bullets: {len(bullets)}")
            
            # Validation
            validation = data.get('validation', {})
            if validation:
                print(f"\n📊 Scores:")
                print(f"  ATS Score: {validation.get('atsScore', 'N/A')}/100")
                print(f"  Completeness: {validation.get('completenessScore', 'N/A')}/100")
            
            # Questions (if any)
            if data.get('needsMoreInfo'):
                print(f"\n❓ Needs More Info:")
                for q in data.get('questions', []):
                    print(f"  - {q}")
            
            return {
                'success': True,
                'duration': duration,
                'data': data
            }
        else:
            print(f"❌ Failed with status code: {response.status_code}")
            print(f"Response: {response.text[:200]}")
            return {
                'success': False,
                'error': response.text
            }
    
    except requests.exceptions.ConnectionError:
        print(f"❌ Connection Error - Is the server running?")
        return {'success': False, 'error': 'Connection refused'}
    except requests.exceptions.Timeout:
        print(f"❌ Timeout - Server took too long to respond")
        return {'success': False, 'error': 'Timeout'}
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return {'success': False, 'error': str(e)}

def compare_backends():
    """Compare both backend implementations"""
    print("\n" + "="*70)
    print("🔬 BACKEND COMPARISON TEST")
    print("="*70)
    print("\nTesting both backends with the same prompts...")
    print("\nBackends:")
    print("  1. Your Gemini Backend     → http://localhost:8000")
    print("  2. Co-Dev's NLP Backend    → http://localhost:8001")
    
    results = {
        'gemini': [],
        'nlp': []
    }
    
    for i, prompt in enumerate(TEST_PROMPTS, 1):
        print(f"\n\n{'#'*70}")
        print(f"TEST {i}/{len(TEST_PROMPTS)}")
        print(f"{'#'*70}")
        
        # Test Gemini backend
        gemini_result = test_backend(
            "http://localhost:8000",
            "Your Gemini AI Backend",
            prompt
        )
        results['gemini'].append(gemini_result)
        
        # Test NLP backend
        nlp_result = test_backend(
            "http://localhost:8001",
            "Co-Developer's NLP Backend",
            prompt
        )
        results['nlp'].append(nlp_result)
        
        # Quick comparison
        print(f"\n{'─'*70}")
        print("COMPARISON:")
        print(f"{'─'*70}")
        if gemini_result['success'] and nlp_result['success']:
            print(f"✅ Both succeeded")
            print(f"⏱️  Gemini: {gemini_result['duration']:.2f}s")
            print(f"⏱️  NLP:    {nlp_result['duration']:.2f}s")
            
            # Compare scores
            gem_validation = gemini_result.get('data', {}).get('validation', {})
            nlp_validation = nlp_result.get('data', {}).get('validation', {})
            
            if gem_validation and nlp_validation:
                print(f"📊 ATS Scores:")
                print(f"   Gemini: {gem_validation.get('atsScore', 'N/A')}/100")
                print(f"   NLP:    {nlp_validation.get('atsScore', 'N/A')}/100")
        elif gemini_result['success']:
            print(f"✅ Gemini succeeded, ❌ NLP failed")
        elif nlp_result['success']:
            print(f"❌ Gemini failed, ✅ NLP succeeded")
        else:
            print(f"❌ Both failed")
    
    # Final summary
    print(f"\n\n{'='*70}")
    print("📊 FINAL SUMMARY")
    print(f"{'='*70}")
    
    gemini_success = sum(1 for r in results['gemini'] if r['success'])
    nlp_success = sum(1 for r in results['nlp'] if r['success'])
    
    gemini_avg_time = sum(r.get('duration', 0) for r in results['gemini'] if r['success']) / max(gemini_success, 1)
    nlp_avg_time = sum(r.get('duration', 0) for r in results['nlp'] if r['success']) / max(nlp_success, 1)
    
    print(f"\nSuccess Rate:")
    print(f"  Gemini: {gemini_success}/{len(TEST_PROMPTS)} ({gemini_success/len(TEST_PROMPTS)*100:.0f}%)")
    print(f"  NLP:    {nlp_success}/{len(TEST_PROMPTS)} ({nlp_success/len(TEST_PROMPTS)*100:.0f}%)")
    
    print(f"\nAverage Response Time:")
    print(f"  Gemini: {gemini_avg_time:.2f}s")
    print(f"  NLP:    {nlp_avg_time:.2f}s")
    
    print(f"\n{'='*70}")
    print("RECOMMENDATION:")
    print(f"{'='*70}")
    
    if gemini_success > nlp_success:
        print("✅ Your Gemini backend performed better!")
        print("   Consider using it as primary or merge the best features.")
    elif nlp_success > gemini_success:
        print("✅ Co-developer's NLP backend performed better!")
        print("   Consider using it as primary or learn from their approach.")
    else:
        print("🤝 Both performed equally well!")
        print("   Consider offering both options or creating a hybrid.")
    
    if gemini_avg_time < nlp_avg_time:
        print(f"\n⚡ Your Gemini backend is faster ({gemini_avg_time:.2f}s vs {nlp_avg_time:.2f}s)")
    elif nlp_avg_time < gemini_avg_time:
        print(f"\n⚡ NLP backend is faster ({nlp_avg_time:.2f}s vs {gemini_avg_time:.2f}s)")
    
    print(f"\n{'='*70}\n")

if __name__ == "__main__":
    print("\n🚀 Starting Backend Comparison Test...")
    print("\nMake sure both servers are running:")
    print("  Terminal 1: python -m uvicorn app.main:app --reload --port 8000")
    print("  Terminal 2: python -m uvicorn main:app --reload --port 8001")
    print("\nPress Enter to continue or Ctrl+C to cancel...")
    input()
    
    compare_backends()
