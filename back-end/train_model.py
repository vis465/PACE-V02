import pickle
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from tensorflow.keras.models import Model
from tensorflow.keras.layers import Input, LSTM, Dense, TimeDistributed, Masking
from tensorflow.keras.optimizers import Adam
import tensorflow as tf
import joblib

# Load the data
with open('student_data.pkl', 'rb') as f:
    dataset = pickle.load(f)

# Prepare the data
max_semesters = max(len(student_data) for _, student_data in dataset)
max_subjects = max(len(semester_data) for _, student_data in dataset for semester_data in student_data)

X = np.zeros((len(dataset), max_semesters, max_subjects, 3))
y = np.zeros((len(dataset), max_semesters, max_subjects, 1))  # Make y have a last dimension of 1

for i, (_, student_data) in enumerate(dataset):
    for j, semester_data in enumerate(student_data):
        for k, subject_data in enumerate(semester_data):
            X[i, j, k, :] = subject_data[:3]  # CIE marks
            y[i, j, k, 0] = subject_data[3]  # Final marks (keeping last dimension as 1)

# Create mask
mask = (X.sum(axis=-1) != 0).astype(float)

# Split the data
X_train, X_test, y_train, y_test, mask_train, mask_test = train_test_split(X, y, mask, test_size=0.2, random_state=42)

# Scale the data
scaler_X = StandardScaler()
X_train_scaled = scaler_X.fit_transform(X_train.reshape(-1, 3)).reshape(X_train.shape)
X_test_scaled = scaler_X.transform(X_test.reshape(-1, 3)).reshape(X_test.shape)

scaler_y = StandardScaler()
y_train_scaled = scaler_y.fit_transform(y_train.reshape(-1, 1)).reshape(y_train.shape)
y_test_scaled = scaler_y.transform(y_test.reshape(-1, 1)).reshape(y_test.shape)

# Create the model
input_shape = (max_semesters, max_subjects, 3)
inputs = Input(shape=input_shape)
masked = Masking(mask_value=0.)(inputs)
lstm1 = TimeDistributed(LSTM(64, return_sequences=True))(masked)
lstm2 = TimeDistributed(LSTM(32))(lstm1)
dense1 = TimeDistributed(Dense(16, activation='relu'))(lstm2)
outputs = TimeDistributed(Dense(1))(dense1)  # Output 1 value per subject

model = Model(inputs=inputs, outputs=outputs)

# Custom loss function to handle masking
def masked_mse(y_true, y_pred):
    # Ensure y_true and y_pred have the correct dimensions for masking
    mask = tf.not_equal(y_true, 0)
    y_true_masked = tf.boolean_mask(y_true, mask)
    y_pred_masked = tf.boolean_mask(y_pred, mask)
    return tf.reduce_mean(tf.square(y_true_masked - y_pred_masked))

model.compile(optimizer=Adam(learning_rate=0.001), loss=masked_mse)

# Train the model
model.fit(X_train_scaled, y_train_scaled, 
          epochs=50, 
          batch_size=32, 
          validation_split=0.2, 
          verbose=1)

# Evaluate the model
mse = model.evaluate(X_test_scaled, y_test_scaled)
print(f"Mean Squared Error on test set: {mse}")

# Save the model and scalers
model.save('student_performance_model.h5')
joblib.dump(scaler_X, 'scaler_X.joblib')
joblib.dump(scaler_y, 'scaler_y.joblib')

print("Model and scalers saved successfully.")
