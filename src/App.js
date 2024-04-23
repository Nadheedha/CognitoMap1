import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import UploadQuestionPaper from './pages/UploadQuestionPaper';
import DashboardPage from './pages/Dashboard';
import HomePage from './pages/homePage'; // Corrected import with uppercase 'H'
import './App.css'; // Import CSS file for styling
import QuestionClassification from './pages/question_classification';
import EnterMarks from './pages/EnterMarks';
import StudentStat from './pages/StudentStat';
import IdCogLevel from './pages/IdCogLevel';

// Home page component
function Home() {
  return (
    <div className="home-container">
      <h1 style={{ fontSize: '36px', fontWeight: 'bold', color: '#ffffff', textAlign: 'center' }}>Welcome to COGNITOMAP!</h1>

      <div className="section">
        <h1>About COGNITOMAP</h1>
        <hr />
        <p>This Application provides an AI-based automatic BT-Level classification of question paper based on blooms Taxonomy thereby elevating the supervised term weighting (STW) schemes for Bloom’s Taxonomy. In addition to this students can analyze their performance in each BT_Level and improvise their learning skills </p>
      </div>
      <div className="section">
        <h1>Blooms Taxonomy</h1>
        <hr />
        <h5>Bloom's taxonomy is a set of three hierarchical models used for classification of educational learning objectives into levels of complexity and specificity. The three lists cover the learning objectives in cognitive, affective and psychomotor domains. </h5>
      </div>
      <div className="section">
        <h2>Cognitive domain</h2>
        <hr />
        <h5>In the 1956 original version of the taxonomy, the cognitive domain is broken into the six levels of objectives listed below.[10] In the 2001 revised edition of Bloom's taxonomy, the levels have slightly different names and their order is revised: Remember, Understand, Apply, Analyze, Evaluate, and Create (rather than Synthesize).</h5>
      </div>
      <div className="button-container">
        <Link to="/register?type=student">
          <button className="register-button">Student Registration</button>
        </Link>
        &nbsp;&nbsp;&nbsp;&nbsp;
        <Link to="/register?type=faculty">
          <button className="register-button">Faculty Registration</button>
        </Link><br /><br />
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/upload" element={<UploadQuestionPaper />} />
          <Route path="/Home" element={<HomePage />} /> 
          <Route path="/qc" element={<QuestionClassification />} />
          <Route path="/EnterMark" element ={<EnterMarks/>}/>
          <Route path="/studentstat" element ={<StudentStat/>}/>
          <Route path="/icl" element ={<IdCogLevel/>}/>
          
          {/* Add more routes for other pages */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
