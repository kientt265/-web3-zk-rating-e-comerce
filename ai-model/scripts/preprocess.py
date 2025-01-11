import pandas as pd
import torch

def preprocess_data(input_file, output_file):
    # Đọc dữ liệu
    data = pd.read_csv(input_file)

    # Chuẩn hóa các cột
    data["user_trust_score"] = data["user_trust_score"] / 5.0
    data["seller_rating"] = data["seller_rating"] / 5.0
    data["product_avg_rating"] = data["product_avg_rating"] / 5.0
    data["user_rating"] = data["user_rating"] / 5.0

    # Lưu dữ liệu đã xử lý
    data.to_csv(output_file, index=False)
    print(f"Dữ liệu đã được lưu tại {output_file}")

if __name__ == "__main__":
    preprocess_data("../dataset/raw/sample_reviews.csv", "../dataset/processed/preprocessed_reviews.csv")
