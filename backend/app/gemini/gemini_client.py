import os
from google.genai import Client
from dotenv import load_dotenv

load_dotenv()

def generate_text(prompt):
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("Missing GEMINI_API_KEY")

    client = Client(api_key=api_key)

    response = client.models.generate_content(
        model="models/gemini-2.5-flash",
        contents=[prompt]
    )

    return response.text
