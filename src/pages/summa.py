

import requests

API_KEY = "AIzaSyCm6p86KCmaxJpZqbVzZYOk38YxG6Vbfy0"

url = f"https://generativelanguage.googleapis.com/v1/models?key={API_KEY}"

response = requests.get(url)
data = response.json()

print("\n✅ AVAILABLE GEMINI MODELS:\n")

for model in data.get("models", []):
    print(f"🔹 Name       : {model['name']}")
    print(f"   Methods    : {', '.join(model.get('supportedGenerationMethods', []))}")
    print("-" * 40)
