import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    MYSQL_HOST = os.getenv('MYSQL_HOST', 'mysql')
    MYSQL_USER = os.getenv('MYSQL_USER', 'user')
    MYSQL_PASSWORD = os.getenv('MYSQL_PASSWORD', 'user123')
    MYSQL_DB = os.getenv('MYSQL_DB', 'web_system')
    SECRET_KEY = os.getenv('SECRET_KEY', 'your-secret-key')