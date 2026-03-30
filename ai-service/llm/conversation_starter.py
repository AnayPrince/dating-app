# from langchain_openai import ChatOpenAI

# llm = ChatOpenAI(model="gpt-4o-mini")

# def generate_message(interests):

#     prompt = f"""
#     Generate a friendly dating message.

#     Interests: {interests}
#     """

#     response = llm.invoke(prompt)

#     return response.content


import requests

def generate_message(interests):

    prompt = f"Generate a friendly dating message based on interests: {interests}"

    response = requests.post(
        "http://localhost:11434/api/generate",
        json={
            "model": "llama3",
            "prompt": prompt,
            "stream": False
        }
    )

    data = response.json()

    return data["response"]

