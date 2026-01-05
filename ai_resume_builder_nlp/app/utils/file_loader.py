
import os

def load_instructions_file(filename: str, default: str = "") -> str:
    try:
        # Attempt to open the file in read mode with UTF-8 encoding.
        # This ensures support for non-ASCII characters in prompt files.
        with open(filename, "r", encoding="utf-8") as f:
            return f.read()

    except FileNotFoundError:
        # If the file doesn't exist, log a warning and fall back to the default value.
        print(f"[WARNING] File not found: {filename}. Using default.")

    except Exception as e:
        print(f"[ERROR] Failed to load {filename}: {e}")

    return default
