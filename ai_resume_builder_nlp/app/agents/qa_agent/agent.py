import sys
from os.path import dirname, join, abspath
sys.path.append(abspath(join(dirname(__file__),"..","..")))
from utils.file_loader import load_instructions_file
from google.adk.agents import Agent 

MIN_SKILLS = 3
MIN_EXP_ITEMS= 1 

def qa_passthrough(state: dict) -> dict:
    issues = []

    resume = state.get("final_resume")

    if not resume:
        return {
            "qa_passed": False,
            "issues": ["final_resume missing"]
        }

    # ---- REQUIRED SECTIONS ----
    required_sections = [
        "profile",
        "summary",
        "experience",
        "education",
        "skills"
    ]

    for section in required_sections:
        value = resume.get(section)
        if not value or (isinstance(value, list) and len(value) == 0):
            issues.append(f"missing or empty section: {section}")

    # ---- EXPERIENCE SANITY ----
    experience = resume.get("experience", [])
    if experience:
        valid_exp = any(
            exp.get("role") and exp.get("company")
            for exp in experience
            if isinstance(exp, dict)
        )
        if not valid_exp:
            issues.append("experience entries missing role/company")

    # ---- SKILLS SANITY ----
    skills = resume.get("skills", [])

    if not isinstance(skills, list) or len(skills) < MIN_SKILLS:
        issues.append("too few skills listed")

    # ---- METRICS SANITY ----
    metrics_found = False

    # 1️⃣ explicit metrics list
    if resume.get("metrics"):
        metrics_found = True

    # 2️⃣ metrics embedded in achievements
    if not metrics_found:
        for exp in experience:
            for ach in exp.get("achievements", []):
                if any(char.isdigit() for char in ach):
                    metrics_found = True
                    break

    if not metrics_found:
        issues.append("no measurable impact found")

    return {
        "qa_passed": len(issues) == 0,
        "issues": issues
    }


qa_agent = Agent(
    name="qa_agent",
    description=load_instructions_file("agents/qa_agent/description.txt"),
    tools=[qa_passthrough]
)