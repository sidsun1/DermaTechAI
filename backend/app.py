from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
from TESTING_NN import diagnosis

app = Flask(__name__)
CORS(app)

@app.route('/process-image')
def chatbot():
    YOUR_API_KEY = ""

    genai.configure(api_key=YOUR_API_KEY)

    model=genai.GenerativeModel(
    model_name="gemini-1.5-flash",
    system_instruction="Keep output to a maximum of 5 sentences")

    chat = model.start_chat(
        history=[
            {"role": "user", "parts": "N/A"},
            {"role": "model", "parts": "N/A"},
        ]
    )
                
    d_info = chat.send_message("I have been diagnosed with {diagnosis}. Can you give me more information about this?")
    chat.history.append({"role": "model", "parts": d_info.text}) 

    return chat.history

if __name__ == '__main__':
    app.run(debug=True)