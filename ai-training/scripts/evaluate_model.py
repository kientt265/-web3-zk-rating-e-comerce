import pandas as pd
import pickle
from sklearn.metrics import classification_report

def evaluate_model(input_file, model_file):
    # Load data
    data = pd.read_csv(input_file)
    X = data[["user_rating", "user_trust_score", "seller_rating", "product_avg_rating"]]
    y = data["is_suspicious"]

    # Load model
    with open(model_file, "rb") as file:
        model = pickle.load(file)

    # Predict and evaluate
    y_pred = model.predict(X)
    print(classification_report(y, y_pred))

if __name__ == "__main__":
    evaluate_model("data/processed/preprocessed_reviews.csv", "models/trained_model.pkl")
