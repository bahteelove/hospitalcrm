import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import './style/authorization.css';

const Authorization = () => {
    const navigate = useNavigate();
    const [userId, setUsertId] = useState('');
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
            <h1>Welcome to the online hospital system</h1>
            <div className="container">
                <h1>Enter ID</h1>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Enter ID"
                        value={userId}
                        onChange={handleInputChange}
                        required
                    />
                    <button type="submit">Submit</button>
                    {error && <p className="error">{error}</p>}
                </form>
            </div>
        </>
    );
}

export default Authorization;