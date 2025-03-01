import pandas as pd

# Load the CSV file
file_path = '../data/processed/9-stop_locations.csv'
df = pd.read_csv(file_path, header=None)

# Replace all occurrences of "24:" with "00:"
df[1] = df[1].str.replace('24:', '00:', regex=False)

# Save the modified DataFrame back to the CSV file
df.to_csv(file_path, header=False, index=False)