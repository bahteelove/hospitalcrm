import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Patient() {
    const [timeSlots, setTimeSlots] = useState([]);
    const [newTimeSlotData, setNewTimeSlotData] = useState({
      doctor_id: '',
      time: '',
      status: '',
      patient_id: ''
    });
  
    const [patients, setPatients] = useState([]);
    const [newPatientData, setNewPatientData] = useState({
      patient_name: '',
      notes: ''
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

  const isTimeSlotWithPatientExist = (patient_id) => {
    return timeSlots.some(timeSlot => timeSlot.patient_id === patient_id);
  };

  const addNewPatient = async () => {
    try {
      // Check if any required field is empty
      if (!newPatientData.patient_name) {
        alert('Patient name is required');
        return;
      }
  
      // Send POST request to add a new patient
      await axios.post('http://localhost:3080/addnewpatient', newPatientData);
  
      // Fetch updated list of patients after adding new patient
      fetchPatients();
  
      // Reset the form fields
      setNewPatientData({
        patient_name: '',
        notes: ''
      });
  
      console.log('New patient added successfully');
    } catch (error) {
      console.error('Error adding new patient:', error);
    }
  };

  const deletePatient = async(patient_id) => {
    if (isTimeSlotWithPatientExist(patient_id)) {
      alert("cannot delete this patient, coz this patient had booked an appointment, so if you want to delete this patient so badly you need first delete slot with this patient (patient_id)")
    } else {
      try {
        await axios.delete(`http://localhost:3080/deletepatient/${(patient_id)}`);
        fetchPatients(); // Refresh data
        console.log(`Time Slot with ID ${patient_id} has been deleted`);
      } catch (error) {
        console.error('Error:', error);
      }
    }
  }

  return (
    <div>
      <h1>Patients</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Notes</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {patients.map(patient => (
            <tr key={patient.patient_id}>
              <td>{patient.patient_id}</td>
              <td>{patient.patient_name}</td>
              <td>{patient.notes}</td>
              <td><button onClick={() => deletePatient(patient.patient_id)}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Add New Patient</h2>
      <form onSubmit={addNewPatient}>
        <label>
          Name:
          <input type="text" name="patient_name" value={newPatientData.patient_name} onChange={handleInputChangePatient} />
        </label>
        <label>
          Notes:
          <textarea name="notes" value={newPatientData.notes} onChange={handleInputChangePatient} />
        </label>
        <button type="submit">Add Patient</button>
      </form>
    </div>
  );
}

export default Patient;
