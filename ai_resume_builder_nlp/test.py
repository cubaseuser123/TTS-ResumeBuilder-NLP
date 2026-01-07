from app.nlp.extractors.entity_extractor import extract_entities

text = "I am a software engineer with 5 years of experience at Amazon. Contact me at test@gmail.com."

print(extract_entities(text))
