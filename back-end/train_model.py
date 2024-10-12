import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error
import joblib

# Step 1: Generating synthetic dataset
def generate_synthetic_data(num_students=100):
    np.random.seed(0)
    data = []
    for student_id in range(1, num_students + 1):
        for semester in range(1, 3):  # Assume 2 semesters for simplicity
            for subject in ['Math', 'Physics', 'Chemistry']:
                cie1 = np.random.randint(10, 25)
                cie2 = np.random.randint(10, 25)
                cie3 = np.random.randint(10, 25)
                end_sem = int(0.3 * cie1 + 0.3 * cie2 + 0.4 * cie3 + np.random.randint(40, 81))
                data.append([student_id, semester, subject, cie1, cie2, cie3, end_sem])
    return pd.DataFrame(data, columns=['StudentID', 'Semester', 'Subject', 'CIE1', 'CIE2', 'CIE3', 'EndSemester'])

# Step 2: Create synthetic data
df = generate_synthetic_data()

# Step 3: Preparing the data
X = df[['CIE1', 'CIE2', 'CIE3']]
y = df['EndSemester']

# Splitting the dataset
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Step 4: Model training using RandomForestRegressor
model = RandomForestRegressor(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Saving the trained model
joblib.dump(model, 'model.pkl')

# Model evaluation (optional)
y_pred = model.predict(X_test)
mse = mean_squared_error(y_test, y_pred)
rmse = np.sqrt(mse)

print(f"Root Mean Squared Error (RMSE): {rmse:.2f}")
