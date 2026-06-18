import os
import logging
from typing import Dict, Any

# Configure logging
logger = logging.getLogger(__name__)

# --- Intent Routing ---
SUPPORTED_INTENTS = ["extraction", "checkin", "question", "excuse"]

def route_intent(user_message: str, has_assessment: bool = False) -> str:
    """Determines the user's intent based on their message.

    Args:
        user_message (str): The text message sent by the user.
        has_assessment (bool, optional): Whether the user has completed a footprint assessment. Defaults to False.

    Returns:
        str: The identified intent string (e.g. "extraction", "checkin", "question", "excuse").
    """
    if not has_assessment:
        return "extraction"

    # Keyword Heuristic
    lower_message = user_message.lower()
    if any(keyword in lower_message for keyword in ["completed", "finished", "did it"]):
        return "checkin"
    if any(keyword in lower_message for keyword in ["couldn't", "didn't", "was too hard"]):
        return "excuse"
    if "?" in lower_message or any(keyword in lower_message for keyword in ["how", "what", "why"]):
        return "question"
    
    logger.info(f"Intent not clear for message: '{user_message}'. Defaulting to 'question'.")
    return "question"

def get_prompt_path(intent: str) -> str:
    """Constructs the full path to a prompt template file.

    Args:
        intent (str): The routed user intent.

    Returns:
        str: The absolute path to the corresponding prompt txt file.
    """
    base_dir = os.path.dirname(__file__)
    file_name = "onboarding" if intent == "extraction" else intent
    return os.path.join(base_dir, '..', 'prompts', f"{file_name}.txt")

def load_prompt(intent: str, context: dict = None) -> str:
    """Loads a prompt template from a file and injects context variables.

    Args:
        intent (str): The target user intent.
        context (dict, optional): Key-value pairs to substitute in the template. Defaults to None.

    Returns:
        str: The loaded and formatted prompt string.
    """
    if intent not in SUPPORTED_INTENTS:
        raise ValueError(f"Unsupported intent: {intent}")
    
    try:
        with open(get_prompt_path(intent), 'r') as f:
            prompt_template = f.read()
        
        if context:
            for key, value in context.items():
                prompt_template = prompt_template.replace(f"{{{key}}}", str(value))
        
        return prompt_template
    except FileNotFoundError:
        logger.error(f"Prompt file not found for intent: {intent}")
        return "You are a helpful assistant. Please answer the user's question."
