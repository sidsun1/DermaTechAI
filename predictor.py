import torch
from model_class import ConvolutionalNetwork
import torchvision.transforms as transforms
from PIL import Image
import base64
from flask import Flask, request, jsonify
from flask_cors import CORS
from io import BytesIO

app = Flask(__name__)
CORS(app)

@app.route('/process-image', methods=['POST'])
def process_image():
    if request.is_json:
        try:
            data = request.get_json()
            image_base64 = data['image']
            print(f"Received image data: {image_base64[:30]}...")
            return jsonify({'image': image_base64})

        except Exception as e:
            return jsonify({'error': str(e)}), 500
    else:
        return jsonify({'error': 'Invalid Content-Type, expected application/json'}), 415

category = ['BCC', 'SCC', 'ACK', 'SEK', 'BOD', 'MEL', 'NEV']

transformations = transforms.Compose([
    transforms.Resize((400, 400)),
    transforms.ToTensor(),
    transforms.Normalize((0.5, 0.5, 0.5), (0.5, 0.5, 0.5))
])

def load_image(image):
    img = transformations(image)
    img = img.unsqueeze(0)
    return img

def tester(image):
    image = load_image(image)

    network = ConvolutionalNetwork()
    network.load_state_dict(torch.load("trained_model.pth"))
    network.eval()

    with torch.no_grad():
        output = network(image)
        _, prediction = torch.max(output, 1)
        return category[prediction.item()]

if __name__ == "__main__":
    app.run(debug=True)
