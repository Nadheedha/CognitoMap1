# CognitoMap: Automating Question Classification Using Bloom's Taxonomy

---

## Table of Contents

1. [Introduction](#introduction)  
2. [Features](#features)  
3. [Technologies Used](#technologies-used)  
4. [System Architecture](#system-architecture)  
5. [Installation and Setup](#installation-and-setup)  
6. [Usage](#usage)  
7. [Performance Evaluation](#performance-evaluation)  
8. [Conclusion](#conclusion)  

---

## Introduction

**CognitoMap** is a system designed to automate question classification based on Bloom's Taxonomy (BT) to improve educational assessments. By leveraging supervised and unsupervised term weighting methods, this project provides an efficient, scalable, and accurate solution for categorizing exam questions into cognitive levels.

### Purpose
- Automate BT-based question classification for enhanced accuracy and efficiency.
- Provide educators and students with performance analysis tools.

---

## Features

1. **Authentication Module**:
   - Email-based OTP verification for secure login.
   - Dual login functionality for students and teachers.

2. **Question Classification Module**:
   - Classifies questions into Bloom’s Taxonomy levels using AI models.
   - Enables analysis of question distribution.

3. **Upload Question Paper Module**:
   - Extracts content from uploaded PDFs for classification and editing.

4. **Student Performance Analysis**:
   - Visualizes cognitive-level performance using dashboards and graphs.

5. **Marks Upload Module**:
   - Teachers upload marks for analysis and generate performance reports.

---

## Technologies Used

### Backend
- **MongoDB**: NoSQL database for storing data.
- **Flask**: Lightweight Python web framework for APIs.
- **Hugging Face Models**: For text processing and classification.

### Frontend
- **React.js**: For creating dynamic user interfaces.
- **Chart.js**: For visualizing student performance.

### Tools and Libraries
- **Google Colab**: For training AI models.
- **Sentence Transformer**: For text embedding and semantic analysis.

---

## System Architecture

The system includes:  
- **Frontend**: React.js for user interactions.  
- **Backend**: Flask and MongoDB for data processing and storage.  
- **AI Models**: Implements supervised and unsupervised methods for Bloom’s Taxonomy classification.

---

## Installation and Setup

### Prerequisites
- Python 3.7 or higher.
- Node.js and npm for frontend development.

### Steps
1. Clone the repository:  
   ```bash
   git clone <repository-url>

2. Install backend dependencies:  
   ```bash
   pip install -r requirements.txt

3. Install frontend dependencies:  
   ```bash
   cd frontend
   npm install
4. Run the application:
   - Backend:
   ```bash
     python app.py
   ```
   - Frontend :
     ```bash
     npm start
--- 
## Usage
### Teachers
- Upload question papers and marks.
- Analyze question distribution and student performance.
### Students:
- View personalized performance reports.
- Identify strengths and weaknesses across cognitive levels.
---
## Performance Evaluation
The system achieved:
- Classification Accuracy: 78.94% using Sentence Transformer models.
- Response Time: Processes 100+ questions in under 5 seconds.
- Concurrent Users: Supports 100+ simultaneous users efficiently.
--- 
## Conclusion
- CognitoMap enhances automated question classification and provides actionable insights into student performance. The comparative analysis of supervised and unsupervised term weighting methods improves educational assessment accuracy.
