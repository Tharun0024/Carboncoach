import re

def contains_prompt_injection(text: str) -> bool:
    """
    Checks if the given text contains any of the known prompt injection variants
    (case-insensitive).
    """
    if not text:
        return False
    normalized = text.lower()
    variants = [
        "ignore previous instructions",
        "system:",
        "you are now",
        "act as",
        "forget previous instructions"
    ]
    return any(variant in normalized for variant in variants)

def sanitize_input(text: str) -> str:
    """
    Sanitizes user input by trimming spaces, collapsing multiple spaces,
    and removing control characters (ASCII 0-31 and 127-159) except for newlines/tabs.
    """
    if not text:
        return ""
    # Remove control characters except tab, newline, and carriage return
    cleaned = re.sub(r'[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]', '', text)
    # Collapse multiple spaces/tabs into a single space
    cleaned = re.sub(r'[ \t]+', ' ', cleaned)
    return cleaned.strip()

def validate_chat_input(text: str) -> None:
    """
    Validates user chat input. Raises ValueError if:
    - The input is empty or contains only whitespace.
    - The input is longer than 2000 characters.
    - The input matches prompt injection signatures.
    """
    if not text or len(text.strip()) == 0:
        raise ValueError("Content must not be empty.")
    
    if len(text) > 2000:
        raise ValueError("Content must be at most 2000 characters.")
        
    if contains_prompt_injection(text):
        raise ValueError("Potential prompt injection detected.")
