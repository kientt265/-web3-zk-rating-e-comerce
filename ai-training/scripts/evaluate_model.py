import torch
import pandas as pd
from sklearn.metrics import classification_report
from train_model import ReviewModel

def evaluate_model(data_file, model_path):
    # Load dataset
    data = pd.read_csv(data_file)
    X = torch.tensor(data[["user_rating", "user_trust_score", "seller_rating", "product_avg_rating"]].values, dtype=torch.float32)
    y = data["is_suspicious"].values

    # Load model
    model = ReviewModel()
    model.load_state_dict(torch.load(model_path))
    model.eval()

    # Predict
    with torch.no_grad():
        y_pred = model(X).squeeze().round().numpy()

    # Evaluate
    print(classification_report(y, y_pred))

if __name__ == "__main__":
    evaluate_model("data/processed/preprocessed_reviews.csv", "models/trained_model.pth")
