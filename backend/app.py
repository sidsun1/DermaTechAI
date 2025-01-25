from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai

app = Flask(__name__)
CORS(app)

YOUR_API_KEY = "AIzaSyBSlzAb4SzjUmEKJxpX6GPPtN3z_ND18fY"
genai.configure(api_key=YOUR_API_KEY)

model = genai.GenerativeModel(
    model_name="gemini-1.5-flash",
    system_instruction="Keep output to a maximum of 5 sentences"
)

chat = model.start_chat(
    history=[
        {"role": "user", "parts": "N/A"},
        {"role": "model", "parts": "N/A"},
    ]
)

@app.route('/chat', methods=['POST'])
def chat():
    data = request.get_json()
    message = data.get('message')
    user_id = data.get('userId')

    response = chat.send_message(message)

    chat.history.append({"role": "user", "parts": message})
    chat.history.append({"role": "model", "parts": response.text})

    reply = response.text

    return jsonify({'reply': reply})

if __name__ == '__main__':
    app.run(debug = True)