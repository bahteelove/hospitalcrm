import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

import '../style/patientInfo.css';

const PatientInfo = () => {
    const { patientId } = useParams();

    const [status, setStatus] = useState('info');

    const [timeSlotsData, setTimeSlotsData] = useState([]);

    const [newPatientData, setNewPatientData] = useState({
        patient_name: '',
        email: '',
        phone_number: '',
        birthday: '',
        avatar: ''
    });

    const [patient, setPatient] = useState([]);

    useEffect(() => {
        fetchPatient();
        fetchTimeSlots();
    }, []);

    const fetchTimeSlots = () => {
        axios.get(`http://localhost:3080/getTimeSlotsForSelectedPatient/${patientId}`)
          .then(response => {
            setTimeSlotsData(response.data);
          })
          .catch(error => {
            console.error('Error fetching time slots:', error);
          });
    };  

    const fetchPatient = () => {
        axios.get(`http://localhost:3080/getselectedpatient/${patientId}`)
            .then(response => {
                setPatient(response.data);
            })
            .catch(error => {
                console.error('Error fetching doctors:', error);
            });
    }; 

    const getCurrentDateTime = () => {
        const now = new Date();
      
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0'); // Month starts from 0
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
      
        const formattedDateTime = `${year}-${month}-${day}, ${hours}:${minutes}:${seconds}`;
      
        return formattedDateTime;
    }

    const isUpcoming = (statusTime) => {
        const currentTime = new Date();
        const appointmentTime = new Date(statusTime);
        return appointmentTime > currentTime;
    };

    
    const handleInputChangePatient = (event) => {
        const { name, value } = event.target;
        setNewPatientData({ ...newPatientData, [name]: value });
    };
    
    const handlePatientChanges = async () => {
        try {
          // Check if any required field is empty
          if (!newPatientData.patient_name || !newPatientData.email || !newPatientData.phone_number || !newPatientData.birthday) {
            alert('All fields are required!!');
            return;
          }
      
          // Send POST request to add a new patient
          await axios.post(`http://localhost:3080/changepatientinfo/${patientId}`, newPatientData);
      
          // Reset the form fields
          setNewPatientData({
            patient_name: '',
            email: '',
            phone_number: '',
            birthday: '',
            avatar: ''
          });
      
          alert('Patient Info has been changed successfully');
          setStatus('info')
          fetchPatient();
        } catch (error) {
          console.error('Error changing patient info:', error);
        }
    };
    
    return (
        <>
            <div>
                <br/>
                {patient && status === "info" ?
                    <div className="patient-information">
                        <h2>Patient Information</h2>

                        <table>
                            <tbody>
                                <tr>
                                    <td><strong>Full Name:</strong></td>
                                    <td>{patient.patient_name}</td>
                                </tr>
                                <tr>
                                    <td><strong>Birth Date:</strong></td>
                                    <td>{patient.birthday}</td>
                                </tr>
                                <tr>
                                    <td><strong>Email:</strong></td>
                                    <td>{patient.email}</td>
                                </tr>
                                <tr>
                                    <td><strong>Phone:</strong></td>
                                    <td>{patient.phone_number}</td>
                                </tr>
                            </tbody>
                        </table>
                        <button className='patient-information-button' onClick={ () => setStatus('') }>Change Info</button>
                    </div>
                    :
                    <div className="patient-information">
                        <h2>Patient Information</h2>
                        <table className="add-doctor-table">
                            <tbody>
                                <tr>
                                    <td>Name</td>
                                    <td><input className='patient-information-change-input' type="text" name="patient_name" placeholder={patient.patient_name} value={newPatientData.patient_name} onChange={handleInputChangePatient} /></td>
                                </tr>
                                <tr>
                                    <td>Email</td>
                                    <td><input className='patient-information-change-input' type="email" name="email" placeholder={patient.email} value={newPatientData.email} onChange={handleInputChangePatient} /></td>
                                </tr>
                                <tr>
                                    <td >Phone Number</td>
                                    <td><input className='patient-information-change-input' type="number" name="phone_number" placeholder={patient.phone_number} value={newPatientData.phone_number} onChange={handleInputChangePatient} /></td>
                                </tr>
                                <tr>
                                    <td >Birthday</td>
                                    <td><input className='patient-information-change-input' type="date" name="birthday" placeholder={patient.birthday} value={newPatientData.birthday} onChange={handleInputChangePatient} /></td>
                                </tr>
                            </tbody>
                        </table>
                        
                        <button className='patient-information-button' onClick={ handlePatientChanges }>Save</button>
                        <button className='patient-information-button' onClick={ () => setStatus('info') }>Cancel</button>
                    </div>
                }
            </div>
            <div className="upcoming-appointments-panel">
                <h2>Upcoming Appointments</h2>
                <div className="appointments-list">
                    {timeSlotsData.map(slot => (
                        <div key={slot.id} className="appointment-item">
                            <div className="doctor-info">
                                <span className="doctor-name">{slot.doctor_name}</span>
                                <span className="time">{slot.time}</span>
                            </div>
                            <span className={`status ${slot.status}`}>{slot.status}</span>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );

    
}

export default PatientInfo;
