import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded

from .config import get_settings
from .routers import actions, assessment, chat
from .services.footprint_service import load_emission_factors_from_json
from .security import SecurityHeadersMiddleware

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

from .limiter import limiter

# In-memory cache for data loaded at startup
app_state = {}

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup event
    logger.info("Starting up CarbonCoach backend...")
    limiter.enabled = get_settings().rate_limit_enabled
    try:
        app_state["emission_factors"] = load_emission_factors_from_json()
        logger.info("Successfully loaded emission factors into memory.")
    except Exception as e:
        logger.error(f"Failed to load emission factors: {e}")
        # Decide if the app should fail to start if factors don't load
        # For now, we log the error and continue
    yield
    # Shutdown event
    logger.info("Shutting down CarbonCoach backend...")
    app_state.clear()

app = FastAPI(
    title="CarbonCoach API",
    version="1.0.0",
    description="AI coach for real carbon reductions.",
    lifespan=lifespan
)

# Apply rate limiting and exception handling
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

@app.exception_handler(ValueError)
async def value_error_exception_handler(request: Request, exc: ValueError):
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={"detail": [{"loc": ["body", "content"], "msg": str(exc), "type": "value_error"}]},
    )

# CORS Middleware
settings = get_settings()
origins = [
    settings.frontend_url,
    "http://localhost",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(SecurityHeadersMiddleware)

# Register routers
app.include_router(chat.router, prefix="/api", tags=["Chat"])
app.include_router(assessment.router, prefix="/api", tags=["Assessment"])
app.include_router(actions.router, prefix="/api", tags=["Actions"])

@app.get("/health", tags=["Health"])
async def health_check():
    """
    Health check endpoint to verify service is running.
    """
    return {"status": "ok"}

# Function to access emission factors from other modules
def get_emission_factors():
    return app_state.get("emission_factors", {})
