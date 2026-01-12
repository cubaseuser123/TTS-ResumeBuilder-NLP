# AI Resume Builder

A **production-grade AI resume builder** that converts natural language input into a structured, high-quality resume using a **strict, deterministic AI pipeline** and a **flexible React frontend**.

This project is designed with **clear separation of concerns**, strong quality gates, and an interactive clarification flow — not “prompt in, magic out”.

---

## 🚀 Project Overview

The AI Resume Builder helps users:

* Start with **natural language** (“I’m a frontend developer with 2 years experience…”)
* Deterministically **extract factual information**
* Interactively **fill missing details**
* Generate a **complete resume schema**
* Improve wording using AI (language only, no facts invented)
* Enforce **quality checks**
* Render the same resume across **multiple templates**

---

## 🧠 Core Philosophy

This project follows a few non-negotiable principles:

* **Extraction ≠ Inference**
* **Clarification ≠ Error**
* **Generation ≠ Guessing**
* **LLMs are used for language, not logic**
* **User data always has precedence**
* **Backend is strict, frontend is flexible**

---

## 🏗️ Architecture Overview

The system is split into **two clearly isolated parts**:

### 1. Backend (AI Pipeline)

Located in:

```
ai_resume_builder_nlp/
```

Responsible for:

* Understanding user input
* Asking clarification questions
* Generating resume structure
* Enhancing wording
* Enforcing quality gates
* Returning frontend-safe JSON

### 2. Frontend (React UI)

Located in:

```
my-resume-app/
```

Responsible for:

* Collecting user input
* Handling clarification UX
* Managing multi-step state
* Rendering resumes
* Template switching
* Error display

---

## 🔁 AI Pipeline (Backend)

The pipeline runs **top-to-bottom** and is intentionally strict.

```
FastAPI
  ↓
pipeline.run_async(state)
  ↓
Understanding Agent (deterministic)
  ↓
Clarification Agent (deterministic)
  ↓
Generation Agent (schema only)
  ↓
Enhancement Agent (Gemini – wording only)
  ↓
QA Agent (quality gates)
  ↓
Formatting Agent (frontend contract)
```

### Key Guarantees

* No agent overwrites another agent’s responsibility
* No facts are invented
* User-provided data always wins
* QA failures are intentional, not bugs

---

## 🤖 Agent Responsibilities (Locked)

### Understanding Agent

* Extracts facts only
* Writes:

  * entities
  * extracted_skills
  * metrics
  * missing_fields
* Never overwrites user-provided skills

### Clarification Agent

* Detects missing required information
* Returns clarification questions
* Clarification is a **normal UX step**, not an error

### Generation Agent

* Creates the full resume schema
* Overlays user input verbatim
* Does not infer or synthesize data

### Enhancement Agent (Gemini)

* Improves wording and clarity only
* Never changes structure
* Never invents facts

### QA Agent

* Enforces minimum quality:

  * summary present
  * experience present
  * minimum skills
  * measurable impact
* Failing QA is expected behavior

### Formatting Agent

* Normalizes schema
* Outputs frontend-safe JSON
* Templates are handled **only** on the frontend

---

## 🖥️ Frontend UI

The UI is organized into **three panes**:

* **Left Pane**

  * Manual input fields
  * Preferences
  * AI Prompt box (natural language input)
* **Center Pane**

  * Resume preview (read-only)
* **Right Pane**

  * Template selector

### Frontend Guarantees

* No backend inference
* No live editing of generated output
* Resume data persists across templates
* Template switching never re-runs the pipeline

---

## 🔄 Clarification Flow (UX)

1. User enters an initial prompt
2. Backend may return clarification questions
3. Frontend renders questions dynamically
4. User answers missing info
5. Frontend resends accumulated data
6. Backend completes pipeline and returns final resume

---

## ❌ Non-Goals

This project intentionally does **not** include:

* Authentication
* Database / persistence
* Autosave
* Inline AI rewriting
* Frontend inference
* “Magic” resume guessing

---

## 🧩 Tech Stack

### Backend

* Python
* FastAPI
* Google ADK
* Gemini (Enhancement Agent only)

### Frontend

* React
* CSS
* Component-driven UI

---

## 📌 Current Status

* ✅ Backend pipeline complete and proven correct
* ✅ Clarification logic stable
* ✅ QA gates enforced
* 🚧 Frontend UI under active development
---

## 📄 License

This project is currently under active development.
License to be added.

