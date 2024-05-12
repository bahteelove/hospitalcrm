import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

import '../style/patientInfo.css';

const PatientInfo = () => {
    const { patientId } = useParams();

    const [status, setStatus] = useState('info');

    const [newFullName, setNewFullName] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [newPhone, setNewPhone] = useState('');
    const [newBirthDate, setNewBirthDate] = useState('');

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
    }, []);

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
            <h2>Patient Information</h2>
            {patient && status === "info" ?
                <div className="patient-information">
                    <br></br>
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
                    <button onClick={ () => setStatus('') }>Change Info</button>
                </div>
                :
                <div className="patient-information">
                    <table className="add-doctor-table">
                        <tbody>
                            <tr>
                                <td>Name</td>
                                <td><input type="text" name="patient_name" placeholder={patient.patient_name} value={newPatientData.patient_name} onChange={handleInputChangePatient} /></td>
                            </tr>
                            <tr>
                                <td>Email</td>
                                <td><input type="email" name="email" placeholder={patient.email} value={newPatientData.email} onChange={handleInputChangePatient} /></td>
                            </tr>
                            <tr>
                                <td >Phone Number</td>
                                <td><input type="number" name="phone_number" placeholder={patient.phone_number} value={newPatientData.phone_number} onChange={handleInputChangePatient} /></td>
                            </tr>
                            <tr>
                                <td >Birthday</td>
                                <td><input type="date" name="birthday" placeholder={patient.birthday} value={newPatientData.birthday} onChange={handleInputChangePatient} /></td>
                            </tr>
                        </tbody>
                    </table>
                    
                    <button onClick={ handlePatientChanges }>Save</button>
                    <button onClick={ () => setStatus('info') }>Cancel</button>
                </div>
            }
        </>
    );

    
}

export default PatientInfo;
