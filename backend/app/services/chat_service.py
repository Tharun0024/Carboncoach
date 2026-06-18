import json
import logging
from typing import AsyncGenerator
from anthropic import AsyncAnthropic

from ..config import get_settings
from ..security import sanitize_input, validate_chat_input
from .chat_utils import SUPPORTED_INTENTS, route_intent, load_prompt, get_prompt_path

# Configure logging
logger = logging.getLogger(__name__)

# Re-export utility functions to maintain full backward-compatible public API
__all__ = [
    "SUPPORTED_INTENTS",
    "route_intent",
    "load_prompt",
    "get_prompt_path",
    "stream_response"
]

async def stream_response(user_message: str, session_id: str) -> AsyncGenerator[str, None]:
    """Generates and streams a coaching response using the Anthropic API.

    This function coordinates sanitizing input, identifying intent, loading prompt 
    templates, and streaming server-sent events (SSE) back to the caller.

    Args:
        user_message (str): The raw text message sent by the user.
        session_id (str): The active session/user identifier.

    Returns:
        AsyncGenerator[str, None]: An async generator yielding SSE-formatted text chunks.
    """
    sanitized_message = sanitize_input(user_message)
    validate_chat_input(sanitized_message)

    async def _stream_generator() -> AsyncGenerator[str, None]:
        from .assessment_service import get_user_assessments_from_db
        from ..database import get_supabase_client
        
        supabase = get_supabase_client()
        has_assessment = False
        try:
            assessments = await get_user_assessments_from_db(session_id, supabase)
            if assessments and len(assessments) > 0:
                has_assessment = True
        except Exception as e:
            logger.error(f"Error checking user assessments: {e}")
        
        intent = route_intent(sanitized_message, has_assessment=has_assessment)
        logger.info(f"Routed intent: {intent} for session: {session_id}")
        
        system_prompt = load_prompt(intent, context={"user_data": "..."})

        client = AsyncAnthropic(api_key=get_settings().anthropic_api_key)
        
        try:
            async with client.messages.stream(
                model="claude-3-haiku-20240307",
                max_tokens=1024,
                system=system_prompt,
                messages=[{"role": "user", "content": sanitized_message}]
            ) as stream:
                async for text in stream.text_stream:
                    response_chunk = {"chunk": text}
                    yield f"data: {json.dumps(response_chunk)}\n\n"

        except Exception as e:
            logger.error(f"Error streaming response from Anthropic: {e}")
            fallback_msg = "I had trouble connecting, but here's an estimate based on what you shared."
            yield f"data: {json.dumps({'chunk': fallback_msg})}\n\n"
            
            # If connection fails during onboarding, compute and persist fallback footprint
            if intent == "extraction":
                try:
                    from .footprint_service import calculate_fallback_footprint
                    fallback_data = calculate_fallback_footprint(sanitized_message)
                    
                    insert_payload = {
                        "user_id": session_id,
                        "total_kg_co2e": fallback_data["total_kg_co2e"],
                        "breakdown": fallback_data["breakdown"],
                        "raw_data": fallback_data["raw_data"]
                    }
                    await supabase.table("assessments").insert(insert_payload).execute()
                    yield f"data: {json.dumps({'chunk': '', 'assessment': {**insert_payload, 'fallback': True}})}\n\n"
                except Exception as fb_err:
                    logger.error(f"Failed to generate/store fallback assessment: {fb_err}")
        
        finally:
            yield "data: [DONE]\n\n"

    return _stream_generator()
