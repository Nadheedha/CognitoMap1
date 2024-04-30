// src/App.js

import React, { useState } from 'react';
import axios from 'axios';

function IdCogLevel() {
  const [query, setQuery] = useState('');
  const [answer, setAnswer] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/query', { query });
      console.log(response)
      const answer = response.data;
      console.log(response)
      setAnswer(answer);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <h1>Bloom's Taxonomy Question Answering</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter your question"
        />
        <button type="submit">Submit</button>
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
