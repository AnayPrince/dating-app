from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import ollama

app = FastAPI()

# 🔥 CORS FIX
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # ⚠️ production me specific domain dena
    # allow_origins=["http://localhost:3000"] #for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/ai-message")
async def ai_message(data: dict):
    interests = data.get("interests", "")
    name = data.get("name", "there")

    response = ollama.chat(
        model="llama3",
        messages=[
            {
                "role": "user",
                "content": f"""
                Generate a SHORT dating message for {name}.
                Interests: {interests}
                Keep it under 2 lines.
                """
            }
        ]
    )

    return {
        "message": response["message"]["content"]
    }