import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import './style/authorization.css';

const Authorization = () => {
    const navigate = useNavigate();

    const [newPatientData, setNewPatientData] = useState({
        patient_name: '',
        phone_number: '',
        birthday: '',
        avatar: '',
        email: '',
        password: ''
      });

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [userType, setUserType] = useState('patient');
    const [error, setError] = useState('');

    const [activeTab, setActiveTab] = useState('sing in')

    const handleInputPatient = (event) => {
        const { name, value } = event.target;
        setNewPatientData({ ...newPatientData, [name]: value });
      };

    const handleLogin = async () => {
        try {
          const response = await axios.post('http://localhost:3080/login', {
            email,
            password,
            userType
          });
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('userType', response.data.userType); // Save user type
          console.log('User logged in successfully');
          
          // Redirect to the doctor dashboard
          if (response.data.userType === 'doctor') {
            console.log("data", response.data)
            navigate(`/welcome/${response.data.token}`);
            //window.location.href = '/admin'; // Redirect to doctor dashboard
          } else if (response.data.userType === 'patient') {
            console.log("data", response.data)
            navigate(`/user/${response.data.token}`);
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
      

    const handleRegister = async() => { 
        try {
          // Check if any required field is empty
          if (!newPatientData.patient_name || !newPatientData.email || !newPatientData.password) {
            alert('Name, Email and Password are required');
            return;
          }
      
          // Send POST request to add a new patient
          await axios.post('http://localhost:3080/addnewpatient', newPatientData);
      
          // Reset the form fields
          setNewPatientData({
            patient_name: '',
            phone_number: '',
            birthday: '',
            avatar: '',
            email: '',
            password: ''
          });
      
          alert('You have been registered successfully');
        } catch (error) {
          console.error('Error regestering user:', error);
        }
      };

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
                            <select 
                                className="auth-input" 
                                value={userType} 
                                onChange={(e) => setUserType(e.target.value)}
                            >
                                <option value="doctor">I'm a Doctor</option>
                                <option value="patient">I'm a Patient</option>
                            </select>
                            <button className='auth-button' onClick={handleLogin} >Log In</button>
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
                            name="patient_name"
                            value={newPatientData.patient_name}
                            onChange={handleInputPatient}
                        />
                        <input
                            className='auth-input'
                            type="email"
                            placeholder="Enter your e-mail"
                            name="email"
                            value={newPatientData.email}
                            onChange={handleInputPatient}
                        />
                        <input
                            className='auth-input'
                            type="text"
                            placeholder="Enter your password"
                            name="password"
                            value={newPatientData.password}
                            onChange={handleInputPatient}
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