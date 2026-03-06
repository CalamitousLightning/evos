from dotenv import load_dotenv
import os

load_dotenv()

class Settings:
    STELLA_API_KEY = os.getenv("STELLA_API_KEY")
    STELLA_API_SECRET = os.getenv("STELLA_API_SECRET")
    PAYSTACK_SECRET_KEY = os.getenv("PAYSTACK_SECRET_KEY")

    EVOS_MARGIN = float(os.getenv("EVOS_MARGIN", 0.50))
    AGENT_MIN_MARGIN = float(os.getenv("AGENT_MIN_MARGIN", 0.20))
    AGENT_MAX_MARGIN = float(os.getenv("AGENT_MAX_MARGIN", 5.00))

settings = Settings()
