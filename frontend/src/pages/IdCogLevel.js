import React, { useState } from 'react';
import axios from 'axios';

function IdCogLevel() {
  const [query, setQuery] = useState('');
  const [answer, setAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Set loading state to true
    try {
      const response = await axios.post('http://localhost:5000/api/query', { query });
      const answer = response.data;
      setAnswer(answer);
    } catch (error) {
      console.error('Error:', error);
    }
    setIsLoading(false); // Reset loading state
  };

  const cardStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    maxWidth: '400px',
    margin: 'auto',
    marginTop: '50px',
  };

  const inputStyle = {
    padding: '10px',
    borderRadius: '5px',
    marginRight: '10px',
    border: '1px solid #ccc',
    fontSize: '16px',
    width: 'calc(100% - 80px)', // Adjusted width to accommodate button
    boxSizing: 'border-box',
  };

  const buttonStyle = {
    padding: '10px 20px',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: '#007bff',
    color: '#fff',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  };

  const buttonLoadingStyle = {
    ...buttonStyle,
    backgroundColor: '#ccc',
    cursor: 'not-allowed',
  };

  return (
    <div style={cardStyle}>
      <h1 style={{ textAlign: 'center' }}>Bloom's Taxonomy Question Answering</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter your question"
            style={inputStyle}
            required // Make the input mandatory
          />
          <button type="submit" style={isLoading ? buttonLoadingStyle : buttonStyle} disabled={isLoading}>
            {isLoading ? 'Loading...' : 'Submit'}
          </button>
        </div>
      </form>
      {answer && (
        <div>
          <h2>Answer:</h2>
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
}

export default IdCogLevel;
