# AI Resume Builder - Backend API

An AI-powered resume generation system built with FastAPI and Google Gemini AI.

## 🚀 Features

- **AI-Powered Resume Generation**: Uses Google Gemini to convert natural language prompts into structured, ATS-optimized resumes
- **Smart Data Loading**: Leverages curated JSON databases of skills, action verbs, and companies
- **Resume Validation**: Automatic ATS scoring and completeness checking
- **RESTful API**: Clean, well-documented endpoints for integration
- **Real-time Processing**: Async/await support for fast response times

## 📋 Prerequisites

- Python 3.11+
- Google Gemini API Key ([Get one here](https://aistudio.google.com/app/apikey))

## 🔧 Installation

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd ai_resume_builder_nlp
```

### 2. Create and configure `.env` file

```bash
cp .env.example .env
```

Then edit `.env` and add your Gemini API key:

```env
GEMINI_API_KEY=your_actual_api_key_here
ENVIRONMENT=development
```

### 3. Install dependencies

```bash
pip install python-dotenv google-generativeai fastapi uvicorn pydantic email-validator
```

Or if using `pyproject.toml`:

```bash
pip install -e .
```

## 🎯 Quick Start

### Start the server

```bash
python -m uvicorn app.main:app --reload --port 8000
```

The server will start at: `http://localhost:8000`

### Access the API docs

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 📚 API Endpoints

### Core Endpoints

#### `POST /api/generate-resume`
Generate a complete resume from a natural language prompt.

**Request:**
```json
{
  "prompt": "Software Engineer with 3 years at Google, expert in Python and React",
  "answers": {}
}
```

**Response:**
```json
{
  "success": true,
  "status": "success",
  "resumeData": {
    "name": "John Doe",
    "title": "Software Engineer",
    "contact": { ... },
    "summary": "Experienced software engineer...",
    "experience": [ ... ],
    "education": [ ... ],
    "skills": { ... }
  },
  "validation": {
    "atsScore": 85,
    "completenessScore": 90,
    "issues": []
  }
}
```

#### `GET /api/skills`
Get all available skills (for autocomplete).

#### `GET /api/action-verbs`
Get categorized action verbs for resume writing.

#### `POST /api/validate-resume`
Validate a resume and get ATS and completeness scores.

### Health Checks

- `GET /` - API information
- `GET /health` - Health check endpoint

## 🏗️ Project Structure

```
ai_resume_builder_nlp/
├── app/
│   ├── main.py                    # FastAPI application
│   ├── data/                      # JSON data files
│   │   ├── skills.json
│   │   ├── action_verbs.json
│   │   ├── companies.json
│   │   └── role_keywords.json
│   ├── schemas/                   # Pydantic models
│   │   └── resume_schema.py
│   ├── services/                  # Business logic
│   │   ├── data_loader.py         # Loads JSON data
│   │   ├── gemini_service.py      # AI integration
│   │   └── resume_generator.py    # Main orchestrator
│   └── utils/                     # Utility functions
├── tests/                         # Test files
├── .env                          # Environment variables (not in git)
├── .env.example                  # Environment template
├── pyproject.toml                # Dependencies
└── README.md                     # This file
```

## 🧪 Testing

### Test Environment Setup
```bash
python test_env.py
```

### Test Services
```bash
python test_services.py
```

### Test Data Loader
```bash
python -m app.services.data_loader
```

## 🔌 Integration with NLP Module

Your teammate working on the NLP/Agent module can:

1. **Replace the Gemini Service**: Create a custom implementation in `app/services/`
2. **Use the same interfaces**: Input = `ResumeRequest`, Output = `ResumeData`
3. **Access data files**: Use `get_data_loader()` to access skills, verbs, etc.
4. **Plug into main.py**: Import and use in the `/api/generate-resume` endpoint

Example integration:
```python
# In their NLP module
from app.schemas.resume_schema import ResumeData
from app.services.data_loader import get_data_loader

async def their_nlp_function(prompt: str) -> ResumeData:
    # Their implementation
    ...
    return resume_data

# In main.py
from their_module import their_nlp_function
resume_data = await their_nlp_function(request.prompt)
```

## 🤝 Collaboration Workflow

### For Backend Developer (You)
- ✅ API structure and endpoints
- ✅ Data loading and management
- ✅ Request/response validation
- ✅ Error handling
- ✅ Server configuration

### For NLP Developer (Teammate)
- 🔄 NLP processing logic
- 🔄 Agent implementation
- 🔄 Advanced prompt engineering
- 🔄 Custom AI models

### Shared
- Schemas (`resume_schema.py`)
- Data files (`app/data/*.json`)
- Integration tests

## 📝 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GEMINI_API_KEY` | Google Gemini API key | Yes |
| `ENVIRONMENT` | Environment (development/production) | No |
| `API_HOST` | Server host | No |
| `API_PORT` | Server port | No |
| `CORS_ORIGINS` | Allowed CORS origins | No |
| `LOG_LEVEL` | Logging level | No |

## 🐛 Troubleshooting

### Common Issues

**1. "GEMINI_API_KEY not found"**
- Make sure `.env` file exists
- Check the API key is correct
- Restart the server after editing `.env`

**2. "Module not found" errors**
- Install dependencies: `pip install google-generativeai email-validator`
- Check you're in the correct directory

**3. CORS errors from frontend**
- Update `CORS_ORIGINS` in `.env`
- Or modify `main.py` CORS configuration

**4. Server won't start**
- Check port 8000 is not in use
- Try a different port: `--port 8001`

## 📊 Example Usage

### Using curl
```bash
curl -X POST http://localhost:8000/api/generate-resume \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Data Scientist with PhD, 5 years at Meta, expert in ML and Python"
  }'
```

### Using Python
```python
import requests

response = requests.post(
    "http://localhost:8000/api/generate-resume",
    json={
        "prompt": "Senior DevOps Engineer, AWS certified, Kubernetes expert"
    }
)

resume = response.json()
print(f"Generated resume for: {resume['resumeData']['name']}")
```

## 🚢 Deployment

### Development
```bash
python -m uvicorn app.main:app --reload --port 8000
```

### Production
```bash
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

## 📄 License

[Your License Here]

## 👥 Contributors

- **Backend Developer**: [Your Name]
- **NLP/Agent Developer**: [Teammate Name]

## 🔗 Links

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Google Gemini API](https://ai.google.dev/gemini-api/docs)
- [Pydantic Documentation](https://docs.pydantic.dev/)

---

**Need help?** Check the `/docs` endpoint at http://localhost:8000/docs for interactive API documentation.
