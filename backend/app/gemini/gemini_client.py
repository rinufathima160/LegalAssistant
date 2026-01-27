import os
from dotenv import load_dotenv
from google.genai import Client
import time
load_dotenv()  # 👈 THIS IS REQUIRED


client = Client(api_key=os.getenv("GEMINI_API_KEY"))

def generate_text(prompt: str) -> str:
    for attempt in range(3):
        try:
            response = client.models.generate_content(
                model="models/gemini-2.5-flash",
                contents=[prompt]
            )
            return response.text.strip()
        except Exception as e:
            print(f"Gemini attempt {attempt+1} failed:", e)
            time.sleep(2)

    return "⚠️ AI service is currently busy. Showing relevant legal information instead."
