from slowapi import Limiter
from slowapi.util import get_remote_address
from .config import get_settings

# Initialize the global rate limiter instance statically. It will be configured dynamically in main.py.
limiter = Limiter(key_func=get_remote_address, enabled=True)
