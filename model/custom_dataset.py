import torch
import torchvision.transforms as transforms
from torch.utils.data import Dataset
import torchvision.io as io
import pandas as pd
import pathlib
from PIL import Image

# categories = ['BCC', 'SCC', 'ACK', 'SEK', 'BOD', 'MEL', 'NEV']
dict = {'BCC' : 0, 'SCC' : 1, 'ACK' : 2, 'SEK' : 3, 'BOD' : 4, 'MEL' : 5, 'NEV' : 6}

class SkinData(Dataset):
    # This loads the data and converts it, make data rdy
    def __init__(self):
        # load data
        self.df=pd.read_csv(r"C:\Users\maxdu\.cache\kagglehub\datasets\mahdavi1202\skin-cancer\versions\1\metadata.csv")
        # extract labels
        self.df_labels=self.df['diagnostic']

        self.labels_list = []
        for row in self.df_labels:
            self.labels_list.append(dict[row])

        self.labels = torch.tensor(self.labels_list)

        to_tensor = transforms.ToTensor()
        self.arr = []
        base_path = pathlib.Path(r"C:\Users\maxdu\.cache\kagglehub\datasets\mahdavi1202\skin-cancer\versions\1\images")
        for img in self.df['img_id']:
            img_path = pathlib.Path(img)
            pil_img = Image.open(base_path / img_path)
            img_tensor = to_tensor(pil_img)

            if len(img_tensor) == 4:
                img_tensor = img_tensor[0:3]
            self.arr.append(img_tensor)

        self.dataset = torch.stack(self.arr, dim=0)

    
    # This returns the total amount of samples in your Dataset
    def __len__(self):
        return len(self.dataset)
    
    # This returns given an index the i-th sample and label
    def __getitem__(self, idx):
        return self.dataset[idx],self.labels[idx]
    
def main():
    data = SkinData()

if __name__ == "__main__":
    main()