import torch
import torch.nn as nn
import torch.optim as optim
import pandas as pd
from torch.utils.data import Dataset, DataLoader

# Cấu hình mô hình
class ReviewDataset(Dataset):
    def __init__(self, file_path):
        data = pd.read_csv(file_path)
        self.X = data[["user_rating", "user_trust_score", "seller_rating", "product_avg_rating"]].values
        self.y = data["is_suspicious"].values

    def __len__(self):
        return len(self.y)

    def __getitem__(self, idx):
        return torch.tensor(self.X[idx], dtype=torch.float32), torch.tensor(self.y[idx], dtype=torch.float32)

class ReviewModel(nn.Module):
    def __init__(self):
        super(ReviewModel, self).__init__()
        self.fc1 = nn.Linear(4, 16)
        self.fc2 = nn.Linear(16, 8)
        self.fc3 = nn.Linear(8, 1)
        self.sigmoid = nn.Sigmoid()

    def forward(self, x):
        x = torch.relu(self.fc1(x))
        x = torch.relu(self.fc2(x))
        x = self.sigmoid(self.fc3(x))
        return x

def train_model(data_file, model_path, epochs=20, batch_size=32, learning_rate=0.001):
    # Load dataset
    dataset = ReviewDataset(data_file)
    dataloader = DataLoader(dataset, batch_size=batch_size, shuffle=True)

    # Khởi tạo model, loss function và optimizer
    model = ReviewModel()
    criterion = nn.BCELoss()
    optimizer = optim.Adam(model.parameters(), lr=learning_rate)

    # Training loop
    for epoch in range(epochs):
        total_loss = 0
        for X_batch, y_batch in dataloader:
            optimizer.zero_grad()
            outputs = model(X_batch).squeeze()
            loss = criterion(outputs, y_batch)
            loss.backward()
            optimizer.step()
            total_loss += loss.item()

        print(f"Epoch {epoch + 1}/{epochs}, Loss: {total_loss:.4f}")

    # Lưu model
    torch.save(model.state_dict(), model_path)
    print(f"Model saved to {model_path}")

if __name__ == "__main__":
    train_model("../dataset/processed/preprocessed_reviews.csv", "../models/trained_model.pth")
