from app.nlp.extractors.entity_extractor import extract_entities
from app.nlp.extractors.skill_matcher import extract_material
from app.nlp.extractors.pattern_matcher import extract_metrics

text = "I am a software engineer with 5 years of experience at Amazon. Contact me at test@gmail.com."

print(extract_entities(text)) 


text = "I use Python, React, Git and Docker for backend development."

print(extract_material(text))


text = "Improved performance by 20% and fixed 50 bugs for 10 clients"

print(extract_metrics(text))


# Test the understanding agent's understand_text function
from app.agents.understanding_agent.agent import understand_text

text = """I am a software engineer with 5 years of experience at Amazon. 
I use Python, React, Git and Docker for backend development.
Improved performance by 20% and fixed 50 bugs for 10 clients.
Contact me at test@gmail.com."""

result = understand_text(text)
print("Understanding Agent Result:")
print(result)


# Test the clarification agent
from app.agents.clarification_agent.clarification_agent import clarification_questions

# Simulate a state with missing fields
test_state = {
    "missing_feilds": ["education", "skills", "certifications"]
}

clarification_result = clarification_questions(test_state)
print("\nClarification Agent Result:")
print(clarification_result)