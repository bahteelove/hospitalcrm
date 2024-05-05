import React, { useState, useEffect } from 'react';
import axios from 'axios';

function TimeSlots() {
  const [timeSlots, setTimeSlots] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [newTimeSlotData, setNewTimeSlotData] = useState({
    doctor_id: '',
    doctor_name: '',
    patient_id: '',
    patient_name: '',
    time: '',
    status: '',
    status_time: ''
  });

  useEffect(() => {
    fetchTimeSlots();
    fetchDoctors();
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

  const fetchDoctors = () => {
    axios.get('http://localhost:3080/getdoctorstable')
      .then(response => {
        setDoctors(response.data);
      })
      .catch(error => {
        console.error('Error fetching doctors:', error);
      });
  };

  const handleInputChangeTimeSlot = (event) => {
    const { name, value } = event.target;
    setNewTimeSlotData({ ...newTimeSlotData, [name]: value });
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

  const addNewTimeSlot = async () => {
    try {
      // Check if any required field is empty
      if (!newTimeSlotData.doctor_id || !newTimeSlotData.time) {
        alert('Doctor ID and time are required fields');
        return;
      }

      if (!newTimeSlotData.status || !newTimeSlotData.patient_id) {
        newTimeSlotData.patient_id = 0;
        newTimeSlotData.status = 'not taken'
      }

      newTimeSlotData.status_time = getCurrentDateTime()
  
      // Send POST request to add a new time slot
      await axios.post('http://localhost:3080/addnewtimeslot', newTimeSlotData);

      // Fetch updated list of time slots after adding new time slot
      fetchTimeSlots();

      // Reset the form fields
      setNewTimeSlotData({
        doctor_id: '',
        doctor_name: '',
        patient_id: '',
        patient_name: '',
        time: '',
        status: '',
        status_time: ''
      });
  
      console.log('New time slot added successfully');
    } catch (error) {
      console.error('Error adding new time slot:', error);
    }
  };

  const deleteTimeSlot = async (id) => {
    try {
      await axios.delete(`http://localhost:3080/deletetimeslots/${id}`);
      fetchTimeSlots(); // Refresh data
      console.log(`Time Slot with ID ${id} has been deleted`);
    } catch (error) {
      console.error('Error:', error);
    }
  }

  return (
    <div>
      <h1>Time Slots</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Doctor ID</th>
            <th>Doctor Name</th>
            <th>Patient ID</th>
            <th>Patient Name</th>
            <th>Time</th>
            <th>Status</th>
            <th>Status Time</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {timeSlots.map(slot => (
            <tr key={slot.id}>
              <td>{slot.id}</td>
              <td>{slot.doctor_id}</td>
              <td>{slot.doctor_name}</td>
              <td>{slot.patient_id}</td>
              <td>{slot.patient_name}</td>
              <td>{slot.time}</td>
              <td>{slot.status}</td>
              <td>{slot.status_time}</td>
              <td><button onClick={() => deleteTimeSlot(slot.id)}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Add New Time Slot</h2>
      <form onSubmit={addNewTimeSlot}>
      <label>
          Doctor Name:
          <select name="doctor_name" value={newTimeSlotData.doctor_name} onChange={handleInputChangeTimeSlot}>
            <option value="">Select Doctor</option>
            {doctors.map(doctor => (
              <option key={doctor.doctor_name} value={doctor.doctor_name}>
                {doctor.doctor_name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Doctor ID:
          <select name="doctor_id" value={newTimeSlotData.doctor_id} onChange={handleInputChangeTimeSlot}>
            <option value="">Select Doctor</option>
            {doctors.map(doctor => (
              <option key={doctor.doctor_id} value={doctor.doctor_id}>
                {doctor.doctor_id}
              </option>
            ))}
          </select>
        </label>
        <label>
          Time:
          <input type="text" name="time" value={newTimeSlotData.time} onChange={handleInputChangeTimeSlot} />
        </label>
        <button type="submit">Add Time Slot</button>
      </form>
    </div>
  );
}

export default TimeSlots;
