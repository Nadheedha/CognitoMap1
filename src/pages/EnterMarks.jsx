import React, { useState } from 'react';
import axios from 'axios';
import './EnterMarks.css';

function EnterMarks() {
  const [questionpaperCode, setQuestionpaperCode] = useState('');
  const [questions, setQuestions] = useState([]);
  const [studentName, setStudentName] = useState('');
  const [studentRegNo, setStudentRegNo] = useState('');
  const [marks, setMarks] = useState({});

  const retrieveQuestions = async () => {
    try {
      const response = await axios.post('http://localhost:5000/questionpaper', {
        action: 'retrieve_questions',
        questionpaper_code: questionpaperCode
      });
      setQuestions(response.data);
    } catch (error) {
      console.error('Error retrieving questions:', error);
    }
  };

  const submitMarks = async () => {
    try {
      const marksData = Object.entries(marks).map(([index, mark]) => ({
        question_number: questions[index].QuestionNumber,
        marks: mark.Marks,
        question: questions[index].Question,
        options: questions[index].Options,
        bt_level: questions[index].btlevel,
        score: questions[index].mark
      }));
  
      console.log('marksData:', marksData); // Log marksData before sending the request
    
      const response = await axios.post('http://localhost:5000/questionpaper', {
        action: 'submit_marks',
        questionpaper_code: questionpaperCode,
        data: marksData,
        student_name: studentName,
        student_reg: studentRegNo,

      });
  
      console.log(response.data); // Log response from the backend
    } catch (error) {
      console.error('Error submitting marks:', error);
    }
  };
  
  const handleMarkChange = (e, index) => {
    const { name, value } = e.target;
    setMarks(prevState => ({
      ...prevState,
      [index]: { ...prevState[index], Marks: value } // Update the 'Marks' property of the mark object
    }));
  };

  return (
    <div className="qn-paper-manager">
       <h1>UPLOAD MARKS</h1>
      <input type="text" value={questionpaperCode} onChange={(e) => setQuestionpaperCode(e.target.value)} placeholder="QnPaper Code" />
      <button onClick={retrieveQuestions}>Upload Marks</button>
      
      {questions.length > 0 && (
        <div>
          <form className="form-container">
            <div className="input-wrapper">
              <input type="text" value={studentName} onChange={(e) => setStudentName(e.target.value)} placeholder="Student Name" style={{ marginRight: '10px' }} />
            </div>
            <div className="input-wrapper">
              <input type="text" value={studentRegNo} onChange={(e) => setStudentRegNo(e.target.value)} placeholder="Reg No" style={{ marginLeft: '10px' }} />
            </div>
          </form>
          <div className="student-info">
            <p>Student Name: {studentName}</p>
            <p>Registration No: {studentRegNo}</p>
          </div>
          <table className="questions-table">
            <thead>
              <tr>
                <th>Q.NO</th>
                <th>Question</th>
                <th>Options</th>
                <th>btlevel</th>
                <th>Scored Marks</th>
                <th>Marks</th>
              </tr>
            </thead>
            <tbody>
              {questions.map((question, index) => (
                <tr key={index}>
                  <td>{question['QuestionNumber']}</td>
                  <td>{question['Question']}</td>
                  <td>{Array.isArray(question['Options']) ? question['Options'].join(', ') : question['Options']}</td>
                  <td>{question["btlevel"]}</td>
                  <td>{question["mark"]}</td>
                  <td>
                  <input
                    type="text"
                    name={`marks_${index}`}
                    value={marks[index] ? marks[index].Marks : ''}
                    onChange={(e) => handleMarkChange(e, index)}
                    />

                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ marginTop: '20px' }}></div> {/* Gap between table and button */}
          <button onClick={submitMarks}>Submit Marks</button>
        </div>
      )}
    </div>
  );
}

export default EnterMarks;