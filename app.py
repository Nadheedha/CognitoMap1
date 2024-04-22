from flask import Flask, request, jsonify
from pymongo import MongoClient
import bcrypt
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from pdfminer.high_level import extract_text
import re
import google.generativeai as palm
import random
import string
from io import BytesIO
from flask_cors import CORS



GOOGLE_API_KEY = 'AIzaSyC8xdLGqLiXKPA_tmcf7c0G7DF4WmyF_HU'

# Configure API KEY 
palm.configure(api_key=GOOGLE_API_KEY)
model_id = palm.GenerativeModel('gemini-1.0-pro')

app = Flask(__name__)
CORS(app, methods=['POST'])

# MongoDB connection
client = MongoClient("mongodb://localhost:27017")
db = client["blooms"]
students_collection = db['students']
faculty_collection = db['faculty']

# SMTP configuration
smtp_server = 'smtp.gmail.com'  # SMTP server address
smtp_port = 587  # SMTP server port
smtp_username = 'nadheedha31@gmail.com'  # SMTP server username
smtp_password = 'ewdh vlcl yqrf qmht'  # SMTP server password

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    name = data.get('name')
    user_id = data.get('id')
    userType = data.get('userType')
    print(userType)
    # Check if email already exists
    if userType == 'student':
        if students_collection.find_one({"email": email}):
            return jsonify({'error': 'Email already registered'}), 400
    elif userType == 'faculty':
        if faculty_collection.find_one({"email": email}):
            return jsonify({'error': 'Email already registered'}), 400
    else:
        return jsonify({'error': 'Invalid user type'}), 400

    # Generate OTP
    otp = generate_otp()

    # Store user data in MongoDB
    user = {
        'email': email,
        'password': hash_password(password),
        'name': name,
        'id': user_id,
        'otp': otp,
        'verified': False
    }
    
    if userType == 'student':
        students_collection.insert_one(user)
    elif userType == 'faculty':
        faculty_collection.insert_one(user)
    else:
        return jsonify({'error': 'Invalid user type'}), 400

    # Send OTP to user's email
    send_verification_email(email, otp)

    return jsonify({'message': 'User registered. OTP sent to your email'}), 200

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    userType = data.get('userType')

    if userType == 'student':
        user = students_collection.find_one({"email": email})
    elif userType == 'faculty':
        user = faculty_collection.find_one({"email": email})
    else:
        return jsonify({'error': 'Invalid user type'}), 400

    if user and bcrypt.checkpw(password.encode('utf-8'), user['password']):
        return jsonify({'message': 'Login successful'}), 200
    else:
        return jsonify({'error': 'Invalid email or password'}), 401

@app.route('/verify-otp', methods=['POST'])
def verify_otp():
    data = request.get_json()
    email = data.get('email')
    otp = data.get('otp')
    userType = data.get('userType')

    if userType == 'student':
        user = students_collection.find_one({"email": email})
    elif userType == 'faculty':
        user = faculty_collection.find_one({"email": email})
    else:
        return jsonify({'error': 'Invalid user type'}), 400

    if user and user['otp'] == otp:
        if userType == 'student':
            students_collection.update_one({"email": email}, {"$set": {"verified": True}})
        elif userType == 'faculty':
            faculty_collection.update_one({"email": email}, {"$set": {"verified": True}})
        return jsonify({'message': 'OTP verification successful', 'redirect': '/login'}), 200
    else:
        # If OTP verification fails, delete the created user data
        if userType == 'student' and user:
            students_collection.delete_one({"email": email})
        elif userType == 'faculty' and user:
            faculty_collection.delete_one({"email": email})
        
        return jsonify({'error': 'Invalid OTP', 'deleteData': True}), 400
    




def hash_password(password):
    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed_password

def generate_otp(length=6):
    return ''.join(random.choices(string.digits, k=length))

def send_verification_email(email, otp):
    global smtp_server, smtp_port, smtp_username, smtp_password
    try:
        smtp_server = smtplib.SMTP(smtp_server, smtp_port)
        smtp_server.starttls()
        smtp_server.login(smtp_username, smtp_password)

        message = MIMEMultipart()
        message['From'] = smtp_username
        message['To'] = email
        message['Subject'] = 'Email Verification'
        body = f'Your OTP for verification is: {otp}'
        message.attach(MIMEText(body, 'plain'))

        smtp_server.sendmail(smtp_username, email, message.as_string())
        smtp_server.quit()
    except Exception as e:
        print("Error occurred while sending email:", e)


class SessionState:
    def __init__(self, **kwargs):
        for key, val in kwargs.items():
            setattr(self, key, val)

def get_session_state():
    if not hasattr(app, '_session_state'):
        app._session_state = SessionState()
    return app._session_state

def extract_text_from_pdf(pdf_file):
    pdf_bytes = pdf_file.read()  # Read the file contents as bytes
    memory_file = BytesIO(pdf_bytes)  # Create a BytesIO object from the bytes
    text = extract_text(memory_file)  # Extract text from the BytesIO object
    return text   

def extract_questions_and_marks(text):
    prompt = """
    Extract all questions, including question numbers, options (for question 11 to 16), question texts, and marks. Format each question as follows:
    
    (1. Calculate the total RF power delivered. (2 marks)) or (1.(a) Calculate the total RF power delivered. (2 marks))
    
    Ensure that each question is formatted with the following components:
    - Question number followed by a period (.)
    - Options in parentheses (for question 11 to 16)   
    - Question text
    - Marks in parentheses
    
    Example:
    1. Calculate the total RF power delivered. (2 marks)
    1.(a) Calculate the total RF power delivered. (2 marks)
    
    {text}
    """.format(text=text)

    response = model_id.generate_content(prompt)
    result = response.text.strip().splitlines()
    
    return result

@app.route('/process-responses', methods=['POST'])
def process_responses():
    data = request.get_json()
    editedLines = data.get('editedLines')

    questions = []
    options = []
    marks = []
    question_numbers = []
    last_question_number = None
    
    for line in editedLines.split('\n'):
        match_question = re.match(r'^(\d+)\.?\s*(?:\((\w+)\))?\s*(.+)\s*\((\d+)\s*marks\)$', line)

        if match_question:
            question_numbers.append(match_question.group(1))
            options.append(match_question.group(2))
            questions.append(match_question.group(3))
            marks.append(match_question.group(4))
            last_question_number = match_question.group(1)
        elif last_question_number:
            # If an option (b) is found without a question number, assign it the last question number encountered
            match_option_b = re.match(r'^\((b)\)\s*(.+)\s*\((\d+)\s*marks\)$', line)
            if match_option_b:
                question_numbers.append(last_question_number)
                options.append(match_option_b.group(1))
                questions.append(match_option_b.group(2))
                marks.append(match_option_b.group(3))
    
    return jsonify({
        'questionNumbers': question_numbers,
        'questions': questions,
        'options': options,
        'marks': marks
    })


@app.route('/store-in-mongodb', methods=['POST'])
def store_in_mongodb():
    data = request.get_json()
    question_numbers = data.get('questionNumbers')
    questions = data.get('questions')
    options = data.get('options')
    marks = data.get('marks')
    questionpaper_code = data.get('questionPaperCode')

    client = MongoClient("mongodb://localhost:27017/")
    db = client["blooms"]
    collection = db["qnpaper2"]
    
    question_data = []
    for q_num, q, opts, m in zip(question_numbers, questions, options, marks):
        question_data.append({
            "question_number": q_num,
            "question": q,
            "options": opts,
            "mark": m
        })
    
    collection.insert_one({"questionpaper_code": questionpaper_code, "questions": question_data})
    
    client.close()

    return jsonify({'message': 'Questions stored in MongoDB successfully'}), 200


@app.route('/upload-qspaper', methods=['POST'])
def upload_qspaper():
    questionpaper_code = request.form['questionPaperCode']
    file = request.files['file']
    print("Enteredd")
    text = extract_text_from_pdf(file)
    print("Text extracted")
    responses = extract_questions_and_marks(text)
    print("Question and mark extracted")
    if not responses:
        return jsonify({'error': 'No questions or marks extracted from the PDF'}), 400

    return jsonify({'message': 'Question paper uploaded successfully', 'responses': responses}), 200


if __name__ == '__main__':
    app.run(port=5000)
