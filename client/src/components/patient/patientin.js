import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import "../style/patientin.css"

import PatientHistory from './patientHistory';
import PatientBooking from './patientBooking';
import PatientInfo from './patientInfo';

const PatientIn = () => {
    
    const navigate = useNavigate();    
    const [activeTab, setActiveTab] = useState('booking'); // active status "booking"

    // Function to handle tab change
    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    const getQuit = () => { navigate(`/`); }

    return (
        <div class="container">
            <div class="nav-bar">
                <button className={ activeTab === 'info' ? 'active' : '' } onClick={() => handleTabChange('info')}>Info</button>
                <button className={ activeTab === 'booking' ? 'active' : '' } onClick={() => handleTabChange('booking')}>Booking</button>
                <button className={ activeTab === 'history' ? 'active' : '' } onClick={() => handleTabChange('history')}>History</button>
                <button className="tab-button" onClick={() => getQuit()}>Quit</button>
            </div>
            <div class="content">
                { activeTab === 'info' ? (<PatientInfo />) : (activeTab === 'booking' ? (<PatientBooking />) : (<PatientHistory />)) }
            </div>
        </div>


    );
}

export default PatientIn;
