import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import './style/authorization.css';

const Authorization = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const [activeTab, setActiveTab] = useState('sing in')

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
            console.log("data", response.data)
            navigate(`/doctorin/${response.data.token}`);
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
      

    const handleRegister = () => { alert("maintaining...") }

    return (
        <>
            <div className="auth-container">
                { activeTab === "sing in" ?
                    <>
                        <h1>Authorization</h1>
                            <input
                                className='auth-input'
                                type="email"
                                placeholder="Email"
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <input
                                className='auth-input'
                                type="password"
                                placeholder="Password" 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button className='auth-button' onClick={handleLogin} >Sing In</button>
                            <a onClick={() => setActiveTab("registration")}> Don't have an account? </a>
                            {error && <p className="error">{error}</p>}
                        
                    </>
                :
                <>
                    <h1>Registration</h1>
                    <form onSubmit={handleRegister}>
                        <input
                            className='auth-input'
                            type="text"
                            placeholder="Enter your full name"
                            required
                        />
                        <input
                            className='auth-input'
                            type="email"
                            placeholder="Enter your e-mail"
                            required
                        />
                        <input
                            className='auth-input'
                            type="text"
                            placeholder="Enter your password"
                            required
                        />
                        <button className='auth-button' type="submit">Sing In</button>
                        <a onClick={() => setActiveTab("sing in")}> I hava an account </a>
                        {error && <p className="error">{error}</p>}
                    </form>
                </>
                }
            </div>
        </>
    );
}

export default Authorization;