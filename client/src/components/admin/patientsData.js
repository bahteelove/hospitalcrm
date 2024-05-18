import React, { useState, useEffect } from 'react';
import axios from 'axios';

import "../style/adminTables.css"

function Patient() {
    const [timeSlots, setTimeSlots] = useState([]);
  
    const [patients, setPatients] = useState([]);
    const [newPatientData, setNewPatientData] = useState({
      patient_name: '',
      email: '',
      phone_number: '',
      birthday: '',
      avatar: '',
      password: ''
    });
  
    useEffect(() => {
      fetchTimeSlots();
      fetchPatients();
    }, []);

    const fetchTimeSlots = () => {
        axios.get('http://localhost:3080/gettimeslotstable')
          .then(response => {
            setTimeSlots(response.data);
          })
          .catch(error => {
            console.error('Error fetching time slots:', error);
          });
      };
    
    const fetchPatients = () => {
    axios.get('http://localhost:3080/getpatientstable')
        .then(response => {
        setPatients(response.data);
        })
        .catch(error => {
        console.error('Error fetching patients:', error);
        });
    };

  const handleInputChangePatient = (event) => {
    const { name, value } = event.target;
    setNewPatientData({ ...newPatientData, [name]: value });
  };

  const isTimeSlotWithPatientExist = (id) => {
    return timeSlots.some(timeSlot => timeSlot.id === id);
  };

  const addNewPatient = async () => {
    try {
      // Check if any required field is empty
      if (!newPatientData.patient_name || !newPatientData.email || !newPatientData.phone_number) {
        alert('Name, Email and Phone Number are required');
        return;
      }
  
      // Send POST request to add a new patient
      await axios.post('http://localhost:3080/addnewpatient', newPatientData);
  
      // Fetch updated list of patients after adding new patient
      fetchPatients();
  
      // Reset the form fields
      setNewPatientData({
        patient_name: '',
        email: '',
        phone_number: '',
        birthday: '',
        avatar: ''
      });
  
      alert('New patient added successfully');
    } catch (error) {
      console.error('Error adding new patient:', error);
    }
  };

  const deletePatient = async(id) => {
    if (isTimeSlotWithPatientExist(id)) {
      alert("cannot delete this patient, coz this patient had booked an appointment, so if you want to delete this patient so badly you need first delete slot with this patient (id)")
    } else {
      try {
        await axios.delete(`http://localhost:3080/deletepatient/${(id)}`);
        fetchPatients(); // Refresh data
        console.log(`Time Slot with ID ${id} has been deleted`);
      } catch (error) {
        console.error('Error:', error);
      }
    }
  }

  return (
    
    <div className="doctor-container">
      <h1>Patients</h1>
      <table className="doctor-table">
        <thead>
          <tr>
            <th className="table-heading">ID</th>
            <th className="table-heading">Name</th>
            <th className="table-heading">Email</th>
            <th className="table-heading">Phone Number</th>
            <th className="table-heading">Birthday</th>
            <th className="table-heading">Avatar</th>
            <th className="table-heading">Action</th>
          </tr>
        </thead>
        <tbody>
          {patients.map(patient => (
            <tr key={patient.id}>
              <td className="table-data">{patient.id}</td>
              <td className="table-data">{patient.patient_name}</td>
              <td className="table-data">{patient.email}</td>
              <td className="table-data">{patient.phone_number}</td>
              <td className="table-data">{patient.birthday}</td>
              <td className="table-data">{patient.avatar}</td>
              <td className="table-data"><button className="delete-btn" onClick={() => deletePatient(patient.id)}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Add New Patient</h2>
      <form className="add-doctor-form" onSubmit={addNewPatient}>

        <table className="add-doctor-table">
          <tbody>
            <tr>
              <td className="form-label">Name</td>
              <td><input className="form-input" type="text" name="patient_name" value={newPatientData.patient_name} onChange={handleInputChangePatient} /></td>
            </tr>
            <tr>
              <td className="form-label">Email</td>
              <td><input className="form-input" type="email" name="email" value={newPatientData.email} onChange={handleInputChangePatient} /></td>
            </tr>
            <tr>
              <td className="form-label">Phone Number</td>
              <td><input className="form-input" type="number" name="phone_number" value={newPatientData.phone_number} onChange={handleInputChangePatient} /></td>
            </tr>
            <tr>
              <td className="form-label">Birthday</td>
              <td><input className="form-input" type="date" name="birthday" value={newPatientData.birthday} onChange={handleInputChangePatient} /></td>
            </tr>
            <tr>
              <td className="form-label">Avatar</td>
              <td><input className="form-input" type="text" name="avatar" value={newPatientData.avatar} onChange={handleInputChangePatient} /></td>
            </tr>
          </tbody>
        </table>
        
        <button className="submit-btn" type="submit">Add Patient</button>
      </form>
    </div>

  );
}

export default Patient;
