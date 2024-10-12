from flask import Flask, request, jsonify, redirect, url_for
from flask_cors import CORS
import random
import string
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import smtplib
import mysql.connector
import os
import bcrypt
import datetime
import joblib
import numpy as np
from flask import Flask, request, jsonify
from sklearn.ensemble import RandomForestRegressor
import joblib
import numpy as np
from sklearn.metrics import mean_squared_error

from sklearn.model_selection import train_test_split

app = Flask(__name__)

CORS(app)

def preprocess_data_for_prediction(subjects):
    features = []
    for subject, cie_values in subjects.items():
        try:
            cie1 = int(cie_values.get('CIE 1', 0))
            cie2 = int(cie_values.get('CIE 2', 0))
            cie3 = int(cie_values.get('CIE 3', 0))
            features.append([cie1, cie2, cie3])  # Append the CIE marks for this subject to features
        except (ValueError, TypeError) as e:
            print(f"Error converting CIE values for {subject}: {e}")
            return []  # Return an empty list if there's a conversion error

    return features  # Return a 2D array of features

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Load the trained model
        model = joblib.load('model.pkl')
        print("Model loaded")

        # Get data from the request
        request_data = request.get_json()
        print("Received data for prediction:", request_data)

        # Validate input
        if 'semester' not in request_data or 'subjects' not in request_data:
            return jsonify({"error": "Invalid input: 'semester' and 'subjects' are required"}), 400

        semester = request_data['semester']
        subjects = request_data['subjects']

        if not isinstance(subjects, dict) or not subjects:
            return jsonify({"error": "Invalid input: 'subjects' should be a non-empty dictionary"}), 400

        # Prepare features for prediction
        features = preprocess_data_for_prediction(subjects)

        # Check if features are valid
        if not features or len(features) == 0:
            return jsonify({"error": "No valid features for prediction"}), 400

        # Predict using the loaded model for all subjects
        predicted_marks = model.predict(features)  # This will return an array of predictions

        # Construct a response with subject-wise predictions
        predictions = {}
        for idx, subject in enumerate(subjects.keys()):
            predictions[subject] = predicted_marks[idx]  # Map each subject to its predicted mark
        print(predictions)
        # Return the predictions as a response
        return jsonify({"predicted_end_sem_marks": predictions})

    except Exception as e:
        print(f"Error occurred during prediction: {str(e)}")  # Print the error for debugging
        return jsonify({"error": str(e)}), 500


@app.route('/train', methods=['POST'])
def train():
    try:
        # Get data from the request
        request_data = request.get_json()
        print("Received data for training:", request_data)
        
        # Extract CIE marks and end semester marks for each semester
        features, labels = [], []
        
        for semester, data in request_data.items():
            subjects = data.get('subjects', 0)
            cie_marks = data.get('cieMarks', [])
            end_sem_marks = data.get('endSemMarks', [])

            # Ensure we have the expected number of subjects
            if len(cie_marks) != subjects or len(end_sem_marks) != subjects:
                return jsonify({"error": f"Expected {subjects} subjects for {semester}, got {len(cie_marks)} CIE marks or {len(end_sem_marks)} end semester marks"}), 400

            # Flatten CIE marks into feature vectors and capture end semester marks as labels
            for i in range(subjects):
                cie = cie_marks[i]
                features.append([
                    float(cie.get('cie1', 0)),
                    float(cie.get('cie2', 0)),
                    float(cie.get('cie3', 0))
                ])
                # Append corresponding end semester mark
                labels.append(float(end_sem_marks[i]))

        # Convert to numpy arrays
        X = np.array(features)
        y = np.array(labels)

        print("Training model...")
        model = RandomForestRegressor(n_estimators=100, random_state=42)
        model.fit(X, y)

        # Save the model
        joblib.dump(model, 'model.pkl')

        # Model evaluation (optional)
        y_pred = model.predict(X)
        mse = mean_squared_error(y, y_pred)
        print(f"Mean Squared Error (MSE): {mse:.2f}")

        return jsonify({"message": "Model trained successfully!", "mse": mse}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Load email credentials from environment variables
EMAIL = os.getenv('EMAIL')
PASSWORD = os.getenv('PASSWORD')
import numpy as np


def predict_grade(final_marks):
    if final_marks >= 90:
        return 'O'
    elif final_marks >= 80:
        return 'A+'
    elif final_marks >= 70:
        return 'A'
    elif final_marks >= 60:
        return 'B+'
    elif final_marks >= 50:
        return 'B'
    elif final_marks >= 40:
        return 'C'
    else:
        return 'U'


# Database connection
try:
    mydb = mysql.connector.connect(
        host="localhost",
        user="root",
        password="",
        database="cb"
    )
    mycursor = mydb.cursor()
    print("Database connected")
except mysql.connector.Error as err:
    print(f"Database connection error: {err}")

# Function to send OTP via email
def mail_send(otp, mail):
    try:
        s = smtplib.SMTP('smtp.office365.com', 587)
        s.starttls()
        s.login(EMAIL, PASSWORD)
        
        msg = MIMEMultipart()
        msg['From'] = EMAIL
        msg['To'] = mail
        msg['Subject'] = "Registration Confirmation"
        html = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <title>OTP Verification</title>
        </head>
        <body>
            <p>Your OTP for registration is:</p>
            <h1 style="font-size: 50px;">{otp}</h1>
            <p>This OTP is valid for 5 minutes.</p>
        </body>
        </html>
        """
        msg.attach(MIMEText(html, 'html'))
        s.send_message(msg)
        s.quit()
        print("Email sent successfully")
        return "Success"
    except Exception as e:
        print(f"Error sending email: {e}")
        return "Failed"

# Function to generate OTP
def otp_gen():
    otp = ''.join(random.choices(string.digits, k=6))
    print(f"Generated OTP: {otp}")
    return otp
@app.route('/otp',methods=["GET"])
def otpverify():
    try:
        otp=otp_gen()
        return otp
    except:
        return "Error generating OTP"
# Endpoint for predicting student marks using ML model
@app.route('/predict_marks', methods=["POST"])
def predict_marks():
    try:
        data = request.json
        student_id = data['student_id']

        # Fetch student data from the database
        query = """
            SELECT cie1, cie2, cie3, semester_exam
            FROM student_performance
            WHERE student_id = %s
        """
        mycursor.execute(query, (student_id,))
        result = mycursor.fetchone()

        if not result:
            return jsonify({'error': 'No data found for the given student'}), 404

        cie1, cie2, cie3, semester_exam = result

        # Prepare input data for the model
        input_data = np.array([[cie1, cie2, cie3, semester_exam]])

        # Predict final marks using the model
        predicted_marks = model.predict(input_data)[0]

        return jsonify({
            'student_id': student_id,
            'predicted_final_marks': predicted_marks
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
def check_password(stored_password: bytes, provided_password: str) -> bool:
    # bcrypt expects both the stored_password and provided_password to be bytes
    return bcrypt.checkpw(provided_password.encode('utf-8'), stored_password)

def hash_password(password: str) -> bytes:
    
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode('utf-8'), salt)


@app.route('/')
def status():
    return "Flask server is running!"

@app.route('/register', methods=["POST"])
def register():
    try:
        data = request.json
        mail = data['umail']
        pwd = data['upwd']
        role = data['role']  # Expecting 'stu' or 'sta'
        iden = data.get('uid', '')  # Optional identification for staff

        # Hash the password
        hashed_pwd = hash_password(pwd)

        # Check if email already exists in the database
        sql_check = "SELECT * FROM users WHERE user_mail = %s"
        mycursor.execute(sql_check, (mail,))
        existing_user = mycursor.fetchone()

        if existing_user:
            return jsonify({'error': 'Email already exists'}), 400

        # Insert user into the database without OTP
        sql = """
            INSERT INTO users (user_mail, user_password, user_role, is_verified)
            VALUES (%s, %s, %s, %s)
        """
        values = (mail, hashed_pwd, role, True)  # Directly mark as verified
        mycursor.execute(sql, values)
        mydb.commit()
        otp=otp_gen()
        mail_send(otp,mail)
        return jsonify({'message': 'Registration successful'}), 200

    except mysql.connector.Error as err:
        print(f"MySQL error: {err}")
        return jsonify({'error': 'Database error', 'message': str(err)}), 500
    except Exception as e:
        print(f"Error in register: {e}")
        return jsonify({'error': 'Server error', 'message': str(e)}), 500

# OTP verification route
@app.route('/verify_otp', methods=["POST"])
def verify_otp():
    try:
        data = request.json
        mail = data['umail']
        otp_provided = data['otp']

        # Retrieve OTP and expiry from the database
        sql = "SELECT otp, otp_expiry FROM users WHERE user_mail = %s AND is_verified = %s"
        mycursor.execute(sql, (mail, False))
        result = mycursor.fetchone()

        if result:
            otp_stored, otp_expiry = result
            current_time = datetime.datetime.now()

            if current_time > otp_expiry:
                return jsonify({'status': 'Failed', 'message': 'OTP has expired'}), 400

            if otp_provided == otp_stored:
                # Update user verification status
                sql_update = "UPDATE users SET is_verified = %s, otp = NULL, otp_expiry = NULL WHERE user_mail = %s"
                mycursor.execute(sql_update, (True, mail))
                mydb.commit()
                return jsonify({'status': 'Success', 'message': 'Account verified successfully'})
            else:
                return jsonify({'status': 'Failed', 'message': 'Invalid OTP'}), 400
        else:
            return jsonify({'status': 'Failed', 'message': 'User not found or already verified'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500
# Configure logging

import logging

logging.basicConfig(level=logging.DEBUG)
@app.route('/login', methods=["POST"])
def login():
    try:
        data = request.json
        mail = data['umail']
        pwd = data['upwd']

        # Query user from the database
        sql = "SELECT user_password, user_role FROM users WHERE user_mail = %s"
        mycursor.execute(sql, (mail,))
        result = mycursor.fetchone()

        if result:
            stored_password, role = result

            # Ensure the stored password is of bytes type
            if isinstance(stored_password, str):
                stored_password = stored_password.encode('utf-8')  # Encode the password from the database if it's a string

            # Verify password
            if check_password(stored_password, pwd):
                print(f"User logged in: {mail}")

                # Redirect based on role
                if role == 'stu':
                    return "Success"
                elif role == 'sta':
                    return "Success"
            else:
                return jsonify({'status': 'Failed', 'message': 'Invalid password'}), 401
        else:
            return jsonify({'status': 'Failed', 'message': 'User not found'}), 404

    except Exception as e:
        logging.error(f"Error occurred: {str(e)}")  # Log the error message
        return jsonify({'error': str(e)}), 500
if __name__ == '__main__':
    if not os.path.exists('model.pkl'):
        model = RandomForestRegressor(n_estimators=100, random_state=42)
        joblib.dump(model, 'model.pkl')  # Create an empty model for training later
    app.run(debug=True)
