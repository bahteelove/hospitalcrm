import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Doctor() {
  const [doctors, setDoctors] = useState([]);
  const [newDoctorData, setNewDoctorData] = useState({
    doctor_name: '',
    specialization: '',
    avatar: ''
  });

  const [timeSlots, setTimeSlots] = useState([]);
  const [newTimeSlotData, setNewTimeSlotData] = useState({
    doctor_id: '',
    time: '',
    status: '',
    patient_id: ''
  });

  useEffect(() => {
    fetchDoctors();
    fetchTimeSlots();
  }, []);

  const fetchDoctors = () => {
    axios.get('http://localhost:3080/getdoctorstable')
      .then(response => {
        setDoctors(response.data);
      })
      .catch(error => {
        console.error('Error fetching doctors:', error);
      });
  };

  const fetchTimeSlots = () => {
    axios.get('http://localhost:3080/gettimeslotstable')
      .then(response => {
        setTimeSlots(response.data);
      })
      .catch(error => {
        console.error('Error fetching time slots:', error);
      });
  };

  const isTimeSlotWithDoctorExist = (doctor_id) => {
    return timeSlots.some(timeSlot => timeSlot.doctor_id === doctor_id);
  };

  const handleInputChangeDoctor = (event) => {
    const { name, value } = event.target;
    setNewDoctorData({ ...newDoctorData, [name]: value });
  };

  const addNewDoctor = async () => {
    try {
      // Check if any required field is empty
      if (!newDoctorData.doctor_name || !newDoctorData.specialization || !newDoctorData.avatar) {
        alert('All fields are required');
        return;
      }
  
      // Check if the doctor name already exists
      const doctorExists = doctors.some(doctor => doctor.doctor_name === newDoctorData.doctor_name);
  
      if (doctorExists) {
        alert('Doctor name is already taken');
        return;
      }
  
      // Send POST request to add a new doctor
      await axios.post('http://localhost:3080/submitform', newDoctorData);
  
      // Fetch updated list of doctors after adding new doctor
      fetchDoctors();
  
      // Reset the form fields
      setNewDoctorData({
        doctor_name: '',
        specialization: '',
        avatar: ''
      });
  
      console.log('New doctor added successfully');
    } catch (error) {
      console.error('Error adding new doctor:', error);
    }
  };

  const deleteDoctor = async (doctor_id, doctor_name) => {
    if (isTimeSlotWithDoctorExist(doctor_id)) {
      alert("cannot delete this doctor, coz this doctor already has a booken appointment, so if you want to delete this doctor so badly you need first delete slot with this doctor (doctor_id)")
    } else {
        try {
          await axios.delete(`http://localhost:3080/deletedoctor/${doctor_name}`);
          fetchDoctors(); // Refresh data
          console.log(`Doctor with ID ${doctor_name} has been deleted`);
        } catch (error) {
          console.error('Error:', error);
        }
    }
  };

  return (
    <div>
      <h1>Doctors</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Specialization</th>
            <th>Avatar</th>
            <th>Action</th> {/* New column for delete button */}
          </tr>
        </thead>
        <tbody>
          {doctors.map(doctor => (
            <tr key={doctor.doctor_id}>
              <td>{doctor.doctor_id}</td>
              <td>{doctor.doctor_name}</td>
              <td>{doctor.specialization}</td>
              <td>{doctor.avatar}</td>
              <td>
                <button onClick={() => deleteDoctor(doctor.doctor_id, doctor.doctor_name)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Add New Doctor</h2>
      <form onSubmit={addNewDoctor}>
        <label>
          Name:
          <input type="text" name="doctor_name" value={newDoctorData.doctor_name} onChange={handleInputChangeDoctor} />
        </label>
        <label>
          Specialization:
          <input type="text" name="specialization" value={newDoctorData.specialization} onChange={handleInputChangeDoctor} />
        </label>
        <label>
          Avatar:
          <input type="text" name="avatar" value={newDoctorData.avatar} onChange={handleInputChangeDoctor} />
        </label>
        <button type="submit">Add Doctor</button>
      </form>
    </div>
  );
}

export default Doctor;