from typing import Literal, Optional, Dict, Any
from pydantic import BaseModel, Field, UUID4

# --- Chat Schemas ---

class ChatRequest(BaseModel):
    content: str = Field(..., min_length=1, max_length=2000, description="The user's chat message.")
    session_id: UUID4 = Field(..., description="A unique identifier for the user's session.")

class ChatResponse(BaseModel):
    """
    Represents a chunk of a streaming response.
    This is not directly used for validation but for documentation.
    The actual SSE format is `data: {"chunk": "..."}`.
    """
    chunk: str

# --- Assessment Schemas ---

class AssessmentCreate(BaseModel):
    """
    Represents the data required to create a new footprint assessment.
    This would be populated by the AI after the onboarding conversation.
    """
    user_id: str # Or UUID, depending on your user management
    lifestyle_data: Dict[str, Any] = Field(..., description="Key-value pairs of lifestyle info from onboarding.")

class AssessmentResponse(BaseModel):
    id: str
    created_at: str
    total_kg_co2e: float
    breakdown: Dict[str, float]

# --- Action Schemas ---

class ActionResponse(BaseModel):
    id: str
    title: str
    description: str
    potential_savings_kg_co2e: float
    assigned_at: str
    status: Literal["assigned", "completed", "skipped"]

class UserActionUpdate(BaseModel):
    """
    Schema for updating the status of a user's action.
    """
    status: Literal["completed", "skipped"] = Field(..., description="The new status of the action.")
