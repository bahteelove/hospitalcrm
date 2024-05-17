import React, { useState } from 'react';
import axios from 'axios';

import { useNavigate } from 'react-router-dom';

function Login() {
    const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:3080/login', {
        email,
        password
      });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userType', response.data.userType); // Save user type
      console.log('User logged in successfully');
      
      // Redirect to the doctor dashboard
      if (response.data.userType === 'doctor') {
        navigate(`/admin`);
        //window.location.href = '/admin'; // Redirect to doctor dashboard
      }
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code that falls out of the range of 2xx
        console.error('Server responded with an error:', error.response.data);
        setError(error.response.data); // Display server error message
      } else if (error.request) {
        // The request was made but no response was received
        console.error('No response received:', error.request);
        setError('No response from server. Please try again later.');
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error in setting up request:', error.message);
        setError('Error in setting up request. Please try again.');
      }
    }
  };

  return (
    <div>
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Login</button>
      {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display error message */}
    </div>
  );
}

export default Login;
