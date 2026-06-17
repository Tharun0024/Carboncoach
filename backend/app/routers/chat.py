from fastapi import APIRouter, Request, Depends
from fastapi.responses import StreamingResponse
from ..models.schemas import ChatRequest
from ..services.chat_service import stream_response
from ..limiter import limiter

router = APIRouter()

@router.post("/chat")
@limiter.limit("10/minute")
async def handle_chat(request: Request, chat_request: ChatRequest):
    """
    Handles incoming chat messages, determines intent, and streams a response.
    This endpoint is rate-limited to 10 requests per minute per IP.
    """
    # No business logic here. The router's job is to:
    # 1. Validate the incoming request against ChatRequest schema (done by FastAPI).
    # 2. Apply rate limiting (done by the decorator).
    # 3. Pass the request to the service layer.
    # 4. Return a StreamingResponse.
    
    # The service layer function `stream_response` is called here.
    # We await it to run sanitization/validation and obtain the async generator stream.
    response_stream = await stream_response(chat_request.content, str(chat_request.session_id))
    return StreamingResponse(
        response_stream,
        media_type="text/event-stream"
    )
