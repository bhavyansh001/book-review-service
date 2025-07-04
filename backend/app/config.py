import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    # Database
    DATABASE_URL = os.getenv("DATABASE_URL")
    
    API_V1_STR = "/api/v1"
    PROJECT_NAME = "Book Review Service"
    
    # Environment
    DEBUG = os.getenv("DEBUG", "False").lower() == "true"

settings = Settings()