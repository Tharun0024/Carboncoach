import os
import json
import logging
from typing import AsyncGenerator
from anthropic import AsyncAnthropic

from ..config import get_settings
from ..security import sanitize_input, validate_chat_input

# Configure logging
logger = logging.getLogger(__name__)

# --- Intent Routing ---

SUPPORTED_INTENTS = ["extraction", "checkin", "question", "excuse"]

def route_intent(user_message: str, has_assessment: bool = False) -> str:
    """
    Determines the user's intent based on their message.
    
    Strategy:
    1. If user has no completed assessment, force extraction intent (onboarding).
    2. Simple keyword-based heuristic for speed and cost-efficiency.
    3. Fallback to a small LLM call if heuristic is not confident.
    """
    if not has_assessment:
        return "extraction"

    # 2. Keyword Heuristic
    lower_message = user_message.lower()
    if any(keyword in lower_message for keyword in ["completed", "finished", "did it"]):
        return "checkin"
    if any(keyword in lower_message for keyword in ["couldn't", "didn't", "was too hard"]):
        return "excuse"
    if "?" in lower_message or any(keyword in lower_message for keyword in ["how", "what", "why"]):
        return "question"
    
    # 3. LLM Fallback (placeholder)
    logger.info(f"Intent not clear for message: '{user_message}'. Defaulting to 'question'.")
    return "question"


# --- Prompt Loading ---

def get_prompt_path(intent: str) -> str:
    """Constructs the full path to a prompt file."""
    base_dir = os.path.dirname(__file__)
    file_name = "onboarding" if intent == "extraction" else intent
    return os.path.join(base_dir, '..', 'prompts', f"{file_name}.txt")

def load_prompt(intent: str, context: dict = None) -> str:
    """Loads a prompt from a file and injects context."""
    if intent not in SUPPORTED_INTENTS:
        raise ValueError(f"Unsupported intent: {intent}")
    
    try:
        with open(get_prompt_path(intent), 'r') as f:
            prompt_template = f.read()
        
        # Basic templating (can be replaced with a more robust engine)
        if context:
            for key, value in context.items():
                prompt_template = prompt_template.replace(f"{{{key}}}", str(value))
        
        return prompt_template
    except FileNotFoundError:
        logger.error(f"Prompt file not found for intent: {intent}")
        return "You are a helpful assistant. Please answer the user's question."


# --- Streaming Response ---

async def stream_response(user_message: str, session_id: str) -> AsyncGenerator[str, None]:
    """
    Main service function to generate and stream a response.
    
    1. Sanitizes and validates the user message.
    2. Determines intent.
    3. Loads the appropriate prompt.
    4. Calls the Claude API with streaming enabled.
    5. Yields formatted chunks for Server-Sent Events (SSE).
    """
    # Sanitize and validate before returning the generator
    sanitized_message = sanitize_input(user_message)
    validate_chat_input(sanitized_message)

    async def _stream_generator() -> AsyncGenerator[str, None]:
        from .assessment_service import get_user_assessments_from_db
        from ..database import get_supabase_client
        
        supabase = get_supabase_client()
        has_assessment = False
        try:
            # Check if user has assessments. If this raises an exception (e.g. from mock), it falls back to False
            assessments = await get_user_assessments_from_db(session_id, supabase)
            if assessments and len(assessments) > 0:
                has_assessment = True
        except Exception as e:
            logger.error(f"Error checking user assessments: {e}")
        
        intent = route_intent(sanitized_message, has_assessment=has_assessment)
        logger.info(f"Routed intent: {intent} for session: {session_id}")
        
        # Load the prompt with relevant context
        system_prompt = load_prompt(intent, context={"user_data": "..."})

        client = AsyncAnthropic(api_key=get_settings().anthropic_api_key)
        
        try:
            async with client.messages.stream(
                model="claude-3-haiku-20240307", # Use a fast, cheap model
                max_tokens=1024,
                system=system_prompt,
                messages=[{"role": "user", "content": sanitized_message}]
            ) as stream:
                async for text in stream.text_stream:
                    # Format for SSE
                    response_chunk = {"chunk": text}
                    yield f"data: {json.dumps(response_chunk)}\n\n"

        except Exception as e:
            logger.error(f"Error streaming response from Anthropic: {e}")
            error_chunk = {"error": "Sorry, I encountered a problem."}
            yield f"data: {json.dumps(error_chunk)}\n\n"
        
        finally:
            # Signal the end of the stream
            yield "data: [DONE]\n\n"

    return _stream_generator()
