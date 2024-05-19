import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Chart from 'chart.js/auto';
import './qs.css';

const QuestionClassification = () => {
  const [questionpaperCodes, setQuestionpaperCodes] = useState([]);
  const [selectedQuestionpaperCode, setSelectedQuestionpaperCode] = useState('');
  const [questionData, setQuestionData] = useState([]);
  const [marksDistribution, setMarksDistribution] = useState({});
  const [isClassifying, setIsClassifying] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showQuestionData, setShowQuestionData] = useState(false);
  const [showMarksDistribution, setShowMarksDistribution] = useState(false);
  const [marksChart, setMarksChart] = useState(null);
  const marksChartRef = useRef(null);

  useEffect(() => {
    axios.get('http://localhost:5000/question_paper_codes')
      .then(response => {
        setQuestionpaperCodes(response.data);
      })
      .catch(error => {
        console.error('Error fetching question paper codes:', error);
      });

      return () => {
        destroyChart();
      };
  }, []);

  const destroyChart = () => {
  if (marksChartRef.current) {
    marksChartRef.current.destroy(); // Destroy the previous Chart instance
    marksChartRef.current = null; // Set the ref to null after destruction
  }
};


  const handleQuestionpaperCodeChange = (event) => {
    setSelectedQuestionpaperCode(event.target.value);
  };

  const classifyQuestions = () => {
    setIsClassifying(true);
    setShowQuestionData(true); // Show question data section
    setShowMarksDistribution(false); // Hide marks distribution section
    axios.post('http://localhost:5000/classify_questions', { questionpaper_code: selectedQuestionpaperCode })
      .then(response => {
        setQuestionData(response.data);
        setIsClassifying(false);
      })
      .catch(error => {
        console.error('Error classifying questions:', error);
        setIsClassifying(false);
      });
  };

  const analyzeMarks = () => {
    setIsAnalyzing(true);
    setShowQuestionData(false); // Hide question data section
    setShowMarksDistribution(true); 
    console.log("MarkChart",marksChartRef)
    if (marksChartRef.current) {
      
      marksChartRef.current.destroy();
    }// Show marks distribution section
    axios.get(`http://localhost:5000/question_data/${selectedQuestionpaperCode}`)
      .then(response => {
        const questionData = response.data[0].questions;
        const formattedResults = questionData.map(question => [
          question.question_number,
          question.options,
          question.question,
          question.mark,
          question.bt_level
        ]);
        const allClassified = formattedResults.every(result => result[4]);
        console.log(allClassified);
        console.log(formattedResults);
        if (!allClassified) {
          alert("Some questions are not classified. Please classify all questions before analyzing.");
          setIsAnalyzing(false);
        } else {
          axios.post('http://localhost:5000/analyze_marks', { results: formattedResults })
            .then(response => {
              setMarksDistribution(response.data);
              
              console.log("MarkChart after",marksChartRef)
              setIsAnalyzing(false);
            })
            .catch(error => {
              console.error('Error analyzing marks:', error);
              setIsAnalyzing(false);
            });
        }
      })
      .catch(error => {
        console.error('Error fetching question data:', error);
        setIsAnalyzing(false);
      });
  };

  useEffect(() => {
    
    if (Object.keys(marksDistribution).length !== 0) {
      const ctx = document.getElementById('marksChart');
      new Chart(ctx, {
        type: 'pie',
        data: {
          labels: Object.keys(marksDistribution),
          datasets: [{
            label: 'Marks Distribution',
            data: Object.values(marksDistribution),
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                color: 'white' // Set y-axis tick text color to white
              }
            }
          },
          plugins: {
            legend: {
              labels: {
                color: 'white' // Set label text color to white
              }
            }
          }
        }
      });
    }
  }, [marksDistribution]);

  return (
    <div className="container">
      <div className="card">
        <h1>Question Classification</h1>
        <div className="select-container">
          <label>Select Question Paper Code:</label>
          <select value={selectedQuestionpaperCode} onChange={handleQuestionpaperCodeChange}>
            {questionpaperCodes.map(code => (
              <option key={code} value={code}>{code}</option>
            ))}
          </select>
        </div>
        <div className="button-container">
          <button onClick={classifyQuestions} className={isClassifying ? 'button loading' : 'button'} disabled={isClassifying}>
            {isClassifying ? 'Classifying...' : 'Classify Questions'}
          </button>
          <button onClick={analyzeMarks} className={isAnalyzing ? 'button loading' : 'button'} disabled={isAnalyzing}>
            {isAnalyzing ? 'Analyzing...' : 'Analyze Marks'}
          </button>
        </div>
        {showQuestionData && questionData.length > 0 &&
          <div className="table-container">
            <h2>Question Data:</h2>
            <table className="table">
              <thead>
                <tr>
                  <th>Question Number</th>
                  <th>Option</th>
                  <th>Question</th>
                  <th>Mark</th>
                  <th>Label</th>
                </tr>
              </thead>
              <tbody>
                {questionData.map((question, index) => (
                  <tr key={index}>
                    <td>{question[0]}</td>
                    <td>{question[1]}</td>
                    <td>{question[2]}</td>
                    <td>{question[3]}</td>
                    <td>{question[4]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        }
        {showMarksDistribution && Object.keys(marksDistribution).length > 0 &&
          <div className="chart-container">
            <h2>Marks Distribution by BT_Level:</h2>
            <canvas id="marksChart" width="400" height="400"></canvas>
          </div>
        }
      </div>
    </div>
  );
};

export default QuestionClassification;
