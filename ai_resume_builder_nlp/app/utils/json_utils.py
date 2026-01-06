
import json

def safe_json(data: any) -> str:
    try:
        return json.dumps(data, indent=2)
    except Exception:
        return str(data)
