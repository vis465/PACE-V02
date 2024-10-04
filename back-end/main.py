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

app = Flask(__name__)
CORS(app)

# Load email credentials from environment variables
EMAIL = os.getenv('EMAIL')
PASSWORD = os.getenv('PASSWORD')

# Load the trained ML model
# model = joblib.load('student_marks_predictor.pkl')

# Database connection
try:
    mydb = mysql.connector.connect(
        host="localhost",
        user="root",
        password="",
        database="cbb"
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

# Helper function to hash password
def hash_password(password):
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

# Helper function to check password
def check_password(stored_password, provided_password):
    return bcrypt.checkpw(provided_password.encode('utf-8'), stored_password)

# Status check route
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

# Login route
@app.route('/login', methods=["POST"])
def login():
    try:
        data = request.json
        mail = data['umail']
        pwd = data['upwd']

        # Query user from the database
        sql = "SELECT user_password, user_role, is_verified FROM users WHERE user_mail = %s"
        mycursor.execute(sql, (mail,))
        result = mycursor.fetchone()

        if result:
            stored_password, role, is_verified = result

            if not is_verified:
                return jsonify({'status': 'Failed', 'message': 'Account not verified. Please verify your email.'}), 403

            # Verify password
            if check_password(stored_password, pwd):
                print(f"User logged in: {mail}")

                # Redirect based on role
                if role == 'stu':
                    return redirect(url_for('student_home'))
                elif role == 'sta':
                    return redirect(url_for('staff_home'))
            else:
                return jsonify({'status': 'Failed', 'message': 'Invalid password'}), 401
        else:
            return jsonify({'status': 'Failed', 'message': 'User not found'}), 404

    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Routes for student and staff homepages
@app.route('/student_home')
def student_home():
    return "Welcome to the Student Home Page!"

@app.route('/staff_home')
def staff_home():
    return "Welcome to the Staff Home Page!"

if __name__ == '__main__':
    app.run(debug=True)
