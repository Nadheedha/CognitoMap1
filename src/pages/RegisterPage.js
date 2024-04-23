import React, { useState } from 'react';
import { Link } from 'react-router-dom'; 
import './App.css';

function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [id, setId] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const registerEndpoint = 'http://localhost:5000/register';
  const verifyOTPEndpoint = 'http://localhost:5000/verify-otp';

  
  const queryParams = new URLSearchParams(window.location.search);
  const defaultUserType = queryParams.get('type') || 'faculty';
  const [userType, setUserType] = useState(defaultUserType);

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch(registerEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password, name, id, userType }) // Include userType in the request body
      });
      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        setShowOtpForm(true);
        setIsRegistered(true);
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


const handleVerifyOTP = async (e) => {
  e.preventDefault();
  setIsLoading(true);
  try {
    const response = await fetch(verifyOTPEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, otp, userType })
    });
    const data = await response.json();
    if (response.ok) {
      setIsRegistered(true); // Mark as verified
      alert(data.message);
      window.location.href = (data.redirect || '/login') + `?type=${userType}`;
// Redirect to login page
    } else {
      setErrorMessage(data.error);
      if (data.deleteData) {
        // Reload the page if user data needs to be deleted
        alert('Invalid OTP. Please try again.');
        window.location.reload();
      }
    }
  } catch (error) {
    console.error('Error:', error);
    setErrorMessage('Something went wrong. Please try again.');
  } finally {
    setIsLoading(false);
  }
};

  
  return (
    <div className="card">
      <div className="card-header">
        User Registration
      </div>
      <div className="card-body">
        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              className="form-control"
              id="name"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
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
          <div className="form-group">
            <label htmlFor="id">ID</label>
            <input
              type="text"
              className="form-control"
              id="id"
              placeholder="Enter your ID"
              value={id}
              onChange={(e) => setId(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={isLoading}>
            {isLoading ? 'Loading...' : 'Register'}
          </button>
          {errorMessage && <p className="text-danger">{errorMessage}</p>}
          {showOtpForm && (
            <div>
              <h3>OTP Verification</h3>
              <div className="form-group">
                <label htmlFor="otp">Enter OTP</label>
                <input
                  type="text"
                  className="form-control"
                  id="otp"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary" onClick={handleVerifyOTP} disabled={isLoading}>
                {isLoading ? 'Loading...' : 'Verify OTP'}
              </button>
            </div>
          )}
        </form>
      </div>
      <div className="card-footer">
        {userType === 'student' ? (
          <p>Already have an account? <Link to={{ pathname: "/login", search: "?type=student" }}>Login as Student</Link></p>
        ) : userType === 'faculty' ? (
          <p>Already have an account? <Link to={{ pathname: "/login", search: "?type=faculty" }}>Login as Faculty</Link></p>
        ) : null}
      </div>
    </div>
  );
}

export default RegisterPage;
