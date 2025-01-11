import random
import pandas as pd
import os

# Define the ranges for each category
ranges = {
    'user': {'t': (1, 2.4), 'tb': (2.5, 3.7), 'c': (3.8, 5)},
    'seller': {'t': (1, 2.4), 'tb': (2.5, 3.7), 'c': (3.8, 5)},
    'avg_product': {'t': (1, 2.4), 'tb': (2.5, 3.7), 'c': (3.8, 5)},
    'rating_user': {'t': [1, 2], 'tb': [3], 'c': [4, 5]}
}

# Define the rules for is_suspicious
rules = {
    ('t', 't', 't', 't'): 0,
    ('c', 'c', 'c', 'c'): 0,
    ('tb', 'tb', 'tb', 'tb'): 0,
    ('c', 't/tb', 't', 't'): 0,
    ('t', 't/tb', 't', 'c'): 1,
    ('t', 'c/tb', 'c', 't'): 1,
    ('c', 'tb/c', 'c', 'tb'): 0,
    ('t', 'tb/t', 't', 'tb'): 0,
    ('tb', 't/tb', 't', 'c'): 1,
    ('tb', 'tb/c', 'c', 't'): 1,
    ('c', 't/tb/c', 'tb', 'tb'): 0,
    ('c', 't/tb/c', 'tb', 'c'): 0,
    ('c', 'c', 'c', 't'): 1,
    ('tb', 't/tb/c', 'tb', 'c'): 0,
    ('tb', 'tb/c', 'c', 'tb'): 0,
    ('tb', 'tb/t', 't', 'tb'): 0,
    ('tb', 'tb/t/c', 'tb', 't'): 0,
    ('c', 't', 'c', 'tb'): 0,
    ('c', 'tb', 'c', 'c'): 0,
    # New cases
    ('t', 't/tb', 't/tb', 'c'): 1,
    ('c', 'c/tb', 'c/tb', 't'): 1,
    ('t', 'c', 'c', 't'): 1,
    ('t', 't', 'c', 'c'): 0,
    ('tb', 'tb/c', 'tb/c', 't'): 1,
    ('c', 'c/tb/t', 't', 'c'): 1,
    ('tb', 't/tb/c', 't', 'tb'): 0
}

# Generate a random value within a range or list
def random_value(category, level):
    if category == 'rating_user':
        return random.choice(ranges[category][level])
    else:
        return round(random.uniform(*ranges[category][level]), 2)

# Generate sample data
data = []
for _ in range(2000):
    user_level = random.choice(['t', 'tb', 'c'])
    seller_level = random.choice(['t', 'tb', 'c'])
    avg_product_level = random.choice(['t', 'tb', 'c'])
    rating_user_level = random.choice(['t', 'tb', 'c'])

    # Determine is_suspicious based on rules
    key = (user_level, seller_level, avg_product_level, rating_user_level)
    is_suspicious = rules.get(key, 0)  # Default to 0 if not found

    data.append({
        'user': random_value('user', user_level),
        'seller': random_value('seller', seller_level),
        'avg_product': random_value('avg_product', avg_product_level),
        'rating_user': random_value('rating_user', rating_user_level),
        'is_suspicious': is_suspicious
    })

# Convert to DataFrame for easy viewing
df = pd.DataFrame(data)

# Define the file path
file_path = '../dataset/draw/sample_reviews.csv'

# Ensure the directory exists
os.makedirs(os.path.dirname(file_path), exist_ok=True)

# Save the DataFrame to the specified path
df.to_csv(file_path, index=False)

print(f"File saved to: {file_path}")
