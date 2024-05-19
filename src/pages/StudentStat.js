import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';

function StudentStat() {
  const [studentName, setStudentName] = useState('');
  const [questionPaperCode, setQuestionPaperCode] = useState('');
  const [performanceData, setPerformanceData] = useState(null);
  const [studentNames, setStudentNames] = useState([]); // State to hold student names
  const [subjectCodes, setSubjectCodes] = useState([]); // State to hold subject codes
  const [isLoading, setIsLoading] = useState(false); // State to indicate loading

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
    setIsLoading(true); // Set loading state to true
    try {
      const response = await axios.post('http://localhost:5000/performance', {
        student_name: studentName,
        questionpaper_code: questionPaperCode,
      });
      setPerformanceData(response.data);
    } catch (error) {
      console.error('Error:', error);
    }
    setIsLoading(false); // Reset loading state
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
    <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', maxWidth: '800px', margin: 'auto', marginTop: '50px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px', fontSize: '24px', fontWeight: 'bold' }}>Student Performance Analysis</h1>
      <form onSubmit={handleSubmit} style={{ textAlign: 'center', marginBottom: '20px' }}>
        <select value={studentName} onChange={(e) => setStudentName(e.target.value)} style={{ marginRight: '10px', fontSize: '16px', padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}>
          <option value="">Select Student Name</option>
          {studentNames.map((name, index) => (
            <option key={index} value={name}>{name}</option>
          ))}
        </select>
        <select value={questionPaperCode} onChange={(e) => setQuestionPaperCode(e.target.value)} style={{ marginRight: '10px', fontSize: '16px', padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}>
          <option value="">Select Question Paper Code</option>
          {subjectCodes.map((code, index) => (
            <option key={index} value={code}>{code}</option>
          ))}
        </select>
        <button type="submit" style={{ padding: '10px 20px', borderRadius: '5px', border: 'none', backgroundColor: '#007bff', color: '#fff', fontSize: '16px', cursor: 'pointer', transition: 'background-color 0.3s ease', opacity: isLoading ? 0.5 : 1 }} disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Submit'}
        </button>
      </form>
      <div style={{ textAlign: 'center', height: 'auto' }}>
        
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <Bar
            data={data}
            options={{
              scales: {
                x: {
                  beginAtZero: true,
                  max: 100,
                  ticks: {
                    font: {
                      size: 16, // Increase font size for x-axis labels
                      weight: 'bold', // Make x-axis labels even more bold
                    },
                  },
                },
                y: {
                  beginAtZero: true,
                  ticks: {
                    font: {
                      size: 16, // Increase font size for y-axis labels
                      weight: 'bold', // Make y-axis labels even more bold
                    },
                  },
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default StudentStat;
