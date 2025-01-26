import torch
from model_class import ConvolutionalNetwork
import torchvision.transforms as transforms
from PIL import Image

category = ['BCC', 'SCC', 'ACK', 'SEK', 'BOD', 'MEL', 'NEV']

transformations = transforms.Compose([
    transforms.Resize((400, 400)),
    transforms.ToTensor(),
    transforms.Normalize((0.5, 0.5, 0.5), (0.5, 0.5, 0.5))
])

def load_image(filepath):
    img = Image.open(filepath)
    img = transformations(img)
    img = img.unsqueeze(0)
    return img


def tester(filepath):
    image = load_image(filepath)

    network = ConvolutionalNetwork()
    network.load_state_dict(torch.load("trained_model.pth"))

    network.eval()

    with torch.no_grad():
        output = network(image)
        _, prediction = torch.max(output, 1)
        print(f'Prediction: {category[prediction.item()]}')


def main():
    str_path = input("Enter the path to the image you would like analyzed: ")
    tester(str_path)

if __name__ == "__main__":
    main()
