import torch
import torch.nn as nn
import torch.nn.functional as F


# class
class ConvolutionalNetwork(nn.Module):
    def __init__(self):
        super().__init__()
        self.conv1 = nn.Conv2d(3, 12, 10) # (12, 391, 391)
        self.pool = nn.MaxPool2d(5, 5) # (12, 78, 78)
        self.conv2 = nn.Conv2d(12, 24, 10) # (24, 69, 69) -> (24, 13, 13) -> Flatten (24*13*13)

        # Fully Connected Layers
        self.fc1 = nn.Linear(24*13*13, 120)
        self.fc2 = nn.Linear(120, 84)
        self.fc3 = nn.Linear(84, 7)
    
    def forward(self, X):
        X = F.relu(self.conv1(X))
        X = self.pool(X)
        # Second pass
        X = F.relu(self.conv2(X))
        X = self.pool(X)
        
        # Flatten
        X = torch.flatten(X, 1)

        # Fully connected layers
        X = F.relu(self.fc1(X))
        X = F.relu(self.fc2(X))
        X = self.fc3(X)

        # return
        return F.log_softmax(X, dim=1)