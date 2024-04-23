import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';

function StudentStat() {
  const [studentName, setStudentName] = useState('');
  const [questionPaperCode, setQuestionPaperCode] = useState('');
  const [performanceData, setPerformanceData] = useState(null);
  const [studentNames, setStudentNames] = useState([]); // State to hold student names
  const [subjectCodes, setSubjectCodes] = useState([]); // State to hold subject codes

  useEffect(() => {
    // Fetch student names and subject codes when component mounts
    const fetchStudentData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/students'); // Assuming endpoint for fetching students
        setStudentNames(response.data.studentNames);
        setSubjectCodes(response.data.subjectCodes);
      } catch (error) {
        console.error('Error fetching student data:', error);
      }
    };

    fetchStudentData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/performance', {
        student_name: studentName,
        questionpaper_code: questionPaperCode,
      });
      setPerformanceData(response.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const data = {
    labels: performanceData ? Object.keys(performanceData) : [],
    datasets: [
      {
        label: 'Performance Analysis',
        backgroundColor: 'skyblue',
        borderColor: 'rgba(0,0,0,1)',
        borderWidth: 2,
        data: performanceData ? Object.values(performanceData).map(item => item.total_scored_mark / item.Maximum_total_mark * 100) : [],
        barThickness: 30, // Adjust the bar thickness as needed for the y-axis
      },
    ],
  };

  return (
    <div>
      <h1>Student Analysis</h1>
      <form onSubmit={handleSubmit}>
        <select value={studentName} onChange={(e) => setStudentName(e.target.value)}>
          <option value="">Select Student Name</option>
          {studentNames.map((name, index) => (
            <option key={index} value={name}>{name}</option>
          ))}
        </select>
        <select value={questionPaperCode} onChange={(e) => setQuestionPaperCode(e.target.value)}>
          <option value="">Select Question Paper Code</option>
          {subjectCodes.map((code, index) => (
            <option key={index} value={code}>{code}</option>
          ))}
        </select>
        <button type="submit">Submit</button>
      </form>
      <div style={{ height: '600px' }}>
        <h2>Performance Analysis</h2>
        <Bar
          data={data}
          options={{
            scales: {
              x: {
                beginAtZero: true,
                max: 100,
              },
              y: {
                beginAtZero: true,
              },
            },
          }}
        />
      </div>
    </div>
  );
}

export default StudentStat;
