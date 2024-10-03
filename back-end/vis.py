import numpy as np
import pandas as pd
from sklearn.linear_model import ElasticNet
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error
import joblib

# Sample dataset (replace with actual data from SQL)
data = pd.read_csv('student_marks.csv')

# Features: Internal exam marks
X = data[['cie1', 'cie2', 'cie3', 'semester_exam']]
# Target: Final semester marks
y = data['final_marks']

# Split into training and test sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train ElasticNet model
model = ElasticNet(alpha=0.1, l1_ratio=0.5)
model.fit(X_train, y_train)

# Evaluate the model
y_pred = model.predict(X_test)
print(f"RMSE: {np.sqrt(mean_squared_error(y_test, y_pred))}")

# Save the model to a file
joblib.dump(model, 'student_marks_predictor.pkl')
