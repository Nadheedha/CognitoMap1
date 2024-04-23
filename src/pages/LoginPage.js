import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './App.css';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const defaultUserType = queryParams.get('type') || 'faculty';
  const [userType, setUserType] = useState(defaultUserType);

  const loginEndpoint = 'http://localhost:5000/login';

  const navigateToHomePage = (type) => {
    window.location.href = `/home?type=${type}`;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch(loginEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password, userType })
      });
      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        navigateToHomePage(userType);  
      } else {
        setErrorMessage(data.error);
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  

  return (
    <div className="container">
      <div className="card login-card">
        <div className="card-header">
          User Login
        </div>
        <div className="card-body">
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                className="form-control"
                id="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                className="form-control"
                id="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={isLoading}>
              {isLoading ? 'Loading...' : 'Login'}
            </button>
            {errorMessage && <p className="text-danger">{errorMessage}</p>}
          </form>
        </div>
        <div className="card-footer">
        {userType === 'student' ? (
          <p>Don't have an account? <Link to={{ pathname: "/register", search: "?type=student" }}>Register as Student</Link></p>
        ) : userType === 'faculty' ? (
          <p>Don't have an account? <Link to={{ pathname: "/register", search: "?type=faculty" }}>Register as Faculty</Link></p>
        ) : null}
      </div>
      </div>
    </div>
  );
}

export default LoginPage;
