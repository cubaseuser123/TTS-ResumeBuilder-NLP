
import os
from pathlib import Path

# Base directory is the 'app' folder (parent of utils)
BASE_DIR = Path(__file__).resolve().parent.parent

def load_instructions_file(filename: str, default: str = "") -> str:
    try:
        # Resolve path relative to app directory
        filepath = BASE_DIR / filename
        with open(filepath, "r", encoding="utf-8") as f:
            return f.read()

    except FileNotFoundError:
        # If the file doesn't exist, log a warning and fall back to the default value.
        print(f"[WARNING] File not found: {filename}. Using default.")

    except Exception as e:
        print(f"[ERROR] Failed to load {filename}: {e}")

    return default

load_description_file = load_instructions_file
