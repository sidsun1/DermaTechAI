import torch
import torch.nn as nn
import torch.nn.functional as F
from torch.utils.data import Dataset
from torch.utils.data import DataLoader
from torchvision import datasets, transforms
from torchvision.utils import make_grid
from torchvision.io import read_image
import torchvision.io as io
import torch.optim as optim
from PIL import Image
import pathlib
from model_class import ConvolutionalNetwork
from custom_dataset import SkinData
from torch.utils.data.sampler import SubsetRandomSampler


import numpy as np


def main():

    dataset = SkinData()
    validation_split = .2
    random_seed= 42

    # Creating data indices for training and validation splits:
    dataset_size = len(dataset)
    indices = list(range(dataset_size))
    split = int(np.floor(validation_split * dataset_size))
    np.random.seed(random_seed)
    np.random.shuffle(indices)
    train_indices, val_indices = indices[split:], indices[:split]

    # Creating PT data samplers and loaders:
    train_sampler = SubsetRandomSampler(train_indices)
    test_sampler = SubsetRandomSampler(val_indices)

    # create batches
    train_loader = DataLoader(dataset, batch_size=10, sampler=train_sampler)
    test_loader = DataLoader(dataset, batch_size=10, sampler=test_sampler)

        
    # Defining model
    model = ConvolutionalNetwork()

    # Loss Function Optimizer
    criterion = nn.CrossEntropyLoss()
    optimizer = torch.optim.Adam(model.parameters(), lr=0.001) # lr = learning rate

    # training
    for epoch in range(10):
        print(f'Training epoch {epoch}...')

        running_loss = 0.0

        for i, data in enumerate(train_loader):
            inputs, labels = data

            optimizer.zero_grad()

            outputs = model(inputs)

            loss = criterion(outputs, labels)
            loss.backward()
            optimizer.step()

            running_loss += loss.item()
        
        print(f'Loss: {running_loss / len(train_loader):.4f}')

    torch.save(model.state_dict(), 'trained_model.pth')

    test_model = ConvolutionalNetwork()
    test_model.load_state_dict(torch.load('trained_model.pth'))

    correct = 0
    total = 0

    model.eval()

    with torch.no_grad():
        for data in test_loader:
            images, labels = data
            outputs = test_model(images)
            _, predicted = torch.max(outputs, 1)
            total += labels.size(0)
            correct += (predicted == labels).sum().item()
    
    accuracy = 100 * (correct / total)
    print(f'Accuracy: {accuracy}%')
    

if __name__ == "__main__":
    main()
