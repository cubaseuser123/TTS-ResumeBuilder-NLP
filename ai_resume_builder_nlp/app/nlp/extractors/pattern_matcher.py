import re 

METRIC_REGEX = re.compile(
     r"(\d+%|\d+\s+(?:bugs?|features?|issues?|clients?|users?))",
    re.IGNORECASE
)   

def extract_metrics(text: str) -> list:
    return METRIC_REGEX.findall(text)