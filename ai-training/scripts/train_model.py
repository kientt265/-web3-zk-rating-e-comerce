import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
import pickle

def train_model(input_file, output_model):
    # Load data
    data = pd.read_csv(input_file)
    X = data[["user_rating", "user_trust_score", "seller_rating", "product_avg_rating"]]
    y = data["is_suspicious"]

    # Split data
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # Train model
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)

    # Save model
    with open(output_model, "wb") as file:
        pickle.dump(model, file)

    print("Model trained and saved at:", output_model)

if __name__ == "__main__":
    train_model("data/processed/preprocessed_reviews.csv", "models/trained_model.pkl")
