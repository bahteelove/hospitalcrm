import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import './style/authorization.css';

const Authorization = () => {
    const navigate = useNavigate();

    const [userId, setUsertId] = useState('');

    const [activeTab, setActiveTab] = useState('sing in')

    const [userEmail, setUserEmail] = useState('')
    const [userPassword, setUserPassword] = useState('')

    const [error, setError] = useState('');

    const handleInputChange = (event) => {
        setUsertId(event.target.value);
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = localStorage.getItem('data');
        if (data) {
            const parsedData = JSON.parse(data);
            const patients = parsedData.patients;
            const doctors = parsedData.doctors;

            const patientExists = patients.some(patient => patient.patient_id.toString() === userId);
            const doctorExists = doctors.some(doctor => doctor.doctor_id.toString() === userId);

            if (patientExists) {
                navigate(`/patientin/${userId}`);
            } else if (doctorExists) {
                navigate(`/doctorin/${userId}`);
            } else if (userId === "333") {
                navigate(`/admin`);
            } else {
                setError('User is not found. Please enter a valid ID.');
            }
        } else {
            setError('Data not found. Please contact your administrator.');
        }
    };

    return (
        <>
            <div className="auth-container">
                { activeTab === "sing in" ?
                    <>
                        <h1>Authorization</h1>
                        <form onSubmit={handleSubmit}>
                            <input
                                className='auth-input'
                                type="email"
                                placeholder="user e-mail"
                                required
                            />
                            <input
                                className='auth-input'
                                type="password"
                                placeholder="user password"
                                required
                            />
                            <button className='auth-button' type="submit">Sing In</button>
                            <a onClick={() => setActiveTab("registration")}> Don't have an account? </a>
                            {error && <p className="error">{error}</p>}
                        </form>
                    </>
                :
                <>
                    <h1>Registration</h1>
                    <form onSubmit={handleSubmit}>
                        <input
                            className='auth-input'
                            type="text"
                            placeholder="Enter your full name"
                            required
                        />
                        <input
                            className='auth-input'
                            type="email"
                            placeholder="e-mail"
                            required
                        />
                        <input
                            className='auth-input'
                            type="text"
                            placeholder="password"
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