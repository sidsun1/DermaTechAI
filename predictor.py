import torch
from model_class import ConvolutionalNetwork
import torchvision.transforms as transforms
from PIL import Image

import base64
from flask import Flask, request, jsonify
from flask_cors import CORS
from io import BytesIO
import os

import google.generativeai as genai

YOUR_API_KEY = "AIzaSyBSlzAb4SzjUmEKJxpX6GPPtN3z_ND18fY"


def call_ai(result: str):
    genai.configure(api_key=YOUR_API_KEY)

    model=genai.GenerativeModel(
    model_name="gemini-1.5-flash",
    system_instruction="Keep output to a maximum of 10 sentences. Explain to the user like they are not a medical professional.")

    chat = model.start_chat(
        # Set history of conversation based on diagnosis.

        history=[
            {"role": "user", "parts": "N/A"},
            {"role": "model", "parts": "N/A"},
        ]
    )
    # Given information based on diagnosis                 
    d_info = chat.send_message(f"I have been diagnosed with {result}. Can you give me more information about this?")
    
    response = {
        "diagnosis": result,
        "information": d_info.text
    }
    return response


app = Flask(__name__)
CORS(app, resources={r"/process-image": {"origins": "*"}})

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
model_path = os.path.join(os.path.dirname(__file__), "model", "trained_model.pth")
network.load_state_dict(torch.load(model_path))
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

            return jsonify({'history': call_ai(result)})
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    else:
        return jsonify({'error': 'Invalid Content-Type, expected application/json'})

if __name__ == "__main__":
    app.run(debug=True)
