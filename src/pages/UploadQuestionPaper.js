import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UploadQuestionPaper.css'; // Import CSS file for styling

function UploadQuestionPaper() {
  const [file, setFile] = useState(null);
  const [questionPaperCode, setQuestionPaperCode] = useState('');
  const [uploaded, setUploaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [responses, setResponses] = useState([]);
  const [editedLines, setEditedLines] = useState('');
  const [editedResponses, setEditedResponses] = useState([]);

  useEffect(() => {
    setEditedLines(responses.join('\n'));
  }, [responses]);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const uploadQuestionPaper = async () => {
    setLoading(true); // Set loading state to true
    const formData = new FormData();
    formData.append('file', file);
    formData.append('questionPaperCode', questionPaperCode);
  
    try {
      const response = await axios.post('http://localhost:5000/upload-qspaper', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log(response.data); // Log the response data
      setUploaded(true);
      setResponses(response.data.responses);
    } catch (error) {
      console.error('Error uploading question paper:', error);
    } finally {
      setLoading(false); // Set loading state to false after uploading
    }
  };
  

  const handleSave = async () => {
    setEditedResponses(editedLines.split('\n'));
    try {
      const response = await axios.post('http://localhost:5000/process-responses', {
        editedLines: editedLines
      });
      const { questionNumbers, questions, options, marks } = response.data;
      setEditedResponses(responses); // Update editedResponses with the response data
      await axios.post('http://localhost:5000/store-in-mongodb', {
        questionNumbers,
        questions,
        options,
        marks,
        questionPaperCode
      });
      // Show saved successfully message
      alert('Questions saved successfully!');
      // Refresh the page
      window.location.reload();
    } catch (error) {
      console.error('Error processing or storing responses:', error);
    }
  };
  

  return (
    <div className="upload-container">
      <div className="input-container">
        <label htmlFor="questionPaperCode">Question Paper Code:</label>
        <input
          type="text"
          id="questionPaperCode"
          value={questionPaperCode}
          onChange={(e) => setQuestionPaperCode(e.target.value)}
          placeholder="Enter Question Paper Code"
        />
      </div>
      <div className="input-container">
        <label htmlFor="file">Choose PDF file:</label>
        <input type="file" id="file" onChange={handleFileChange} />
      </div>
      <button className="upload-button" onClick={uploadQuestionPaper}>Upload</button>
      {loading && <p>Loading...</p>} {/* Show loading indicator */}
      {uploaded && (
        <div>
          <p style={{fontWeight: 'bold',color: '#ede1e1',fontSize: '18px' }}>Question paper Extracted successfully!</p>
          <p style={{fontWeight: 'bold',color: '#ede1e1',fontSize: '18px' }}>Processing Lines (Editable):</p>
          <textarea
            value={editedLines}
            onChange={(e) => setEditedLines(e.target.value)}
            rows={20}
            cols={120}
            style={{ fontFamily: 'Times New Roman', fontWeight: 'bold', fontSize: '18px' }}
            />

          <button className="save-button" onClick={handleSave}>Save</button>
        </div>
      )}
      {editedResponses.length > 0 && (
        <div>
          <p>Edited Response:</p>
          <textarea
            value={editedResponses.join('\n')}
            rows={20}
            cols={50}
            style={{ fontFamily: 'Times New Roman', fontWeight: 'bold' }}
            readOnly
          />
        </div>
      )}
    </div>
  );
}

export default UploadQuestionPaper;