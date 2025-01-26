import torch
from model_class import ConvolutionalNetwork
import torchvision.transforms as transforms
from PIL import Image
import base64
from flask import Flask, request, jsonify
from flask_cors import CORS
from io import BytesIO

import google.generativeai as genai

YOUR_API_KEY = "AIzaSyBSlzAb4SzjUmEKJxpX6GPPtN3z_ND18fY"


def call_ai(result: str):
    genai.configure(api_key=YOUR_API_KEY)

    model=genai.GenerativeModel(
    model_name="gemini-1.5-flash",
    system_instruction="Keep output to a maximum of 5 sentences")

    chat = model.start_chat(
        # Set history of conversation based on diagnosis.

        # Not accessable object
        history=[
            {"role": "user", "parts": "N/A"},
            {"role": "model", "parts": "N/A"},
        ]
    )

    # Given information based on diagnosis                 
    d_info = chat.send_message(f"I have been diagnosed with {result}. Can you give me more information about this?")
    print(d_info.text)
    chat.history.append({"role": "model", "parts": d_info.text}) 

    # Prompt User for Questions
    user_response = input("Enter any questions you have concerning your diagnosis?")
    while True:
        if user_response == '':
            break
        response = chat.send_message(user_response)

        # Add chat bot response and user question to history
        chat.history.append({"role": "user", "parts": user_response})
        chat.history.append({"role": "model", "parts": response.text})
    return chat.history


app = Flask(__name__)
CORS(app)

category = ['Basal Cell Carcinoma',
            'Squamous Cell Carcinoma',
            'Actinic Keratosis',
            'Seborrheic Keratosis',
            'Bowen\'s Disease',
            'Melanoma',
            'Nevus']

transformations = transforms.Compose([
    transforms.Resize((400, 400)),
    transforms.ToTensor()
])

network = ConvolutionalNetwork()
network.load_state_dict(torch.load("c:/Users/Siddharth/Code/IrvineHacksApp/irvinehacksapp/trained_model.pth"))
network.eval()

def load_image(image):
    img = Image.open(BytesIO(image))
    img = transformations(img)
    if len(img) == 4:
        img = img[0:3]
    norm_image = transforms.Normalize((0.5, 0.5, 0.5), (0.5, 0.5, 0.5))
    img = norm_image(img)
    img = img.unsqueeze(0)
    return img

@app.route('/process-image', methods=['POST'])
def process_image():
    if request.is_json:
        try:
            data = request.get_json()
            base64_string = data['image']
            decoded = base64.b64decode(base64_string)
            img_tensor = load_image(decoded)

            with torch.no_grad():
                output = network(img_tensor)
                _, prediction = torch.max(output, 1)
                result =  category[prediction.item()]

            return call_ai(result)
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    else:
        return jsonify({'error': 'Invalid Content-Type, expected application/json'})
    
if __name__ == "__main__":
    app.run(debug=True)
