import pandas as pd

def preprocess_data(input_file, output_file):
    # Load raw data
    data = pd.read_csv(input_file)

    # Example: Normalize columns
    data["user_trust_score"] = data["user_trust_score"] / 5.0
    data["seller_rating"] = data["seller_rating"] / 5.0
    data["product_avg_rating"] = data["product_avg_rating"] / 5.0

    # Save processed data
    data.to_csv(output_file, index=False)

if __name__ == "__main__":
    preprocess_data("data/raw/sample_reviews.csv", "data/processed/preprocessed_reviews.csv")
