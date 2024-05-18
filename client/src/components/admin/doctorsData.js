import React, { useState, useEffect } from 'react';
import axios from 'axios';

import "../style/adminTables.css"


function Doctor() {
  const [activeTab, setActiveTab] = useState('new')

  const [doctors, setDoctors] = useState([]);
  const [newDoctorData, setNewDoctorData] = useState({
    doctor_name: '',
    specialization: '',
    avatar: '',
    email: '',
    password: ''
  });

  const [lastDoctorData, setLastDoctorData] = useState({
    id: '',
    doctor_name: '',
    specialization: '',
    avatar: '',
    email: '',
    password: ''
  });

  const [changeDoctorData, setChnageDoctorData] = useState({
    doctor_name: '',
    specialization: '',
    avatar: '',
    email: '',
    password: ''
  });

  const [timeSlots, setTimeSlots] = useState([]);
  const [newTimeSlotData, setNewTimeSlotData] = useState({
    id: '',
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

  const isTimeSlotWithDoctorExist = (id) => {
    return timeSlots.some(timeSlot => timeSlot.doctor_id === id);
  };

  const handleInputChangeDoctor = (event) => {
    const { name, value } = event.target;
    setChnageDoctorData({ ...changeDoctorData, [name]: value });
  };

  const handleInputNewDoctor = (event) => {
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
      await axios.post('http://localhost:3080/addnewdoctor', newDoctorData);
  
      // Fetch updated list of doctors after adding new doctor
      fetchDoctors();
  
      // Reset the form fields
      setNewDoctorData({
        doctor_name: '',
        specialization: '',
        avatar: '',
        email: '',
        password: ''
      });
  
      console.log('New doctor added successfully');
    } catch (error) {
      console.error('Error adding new doctor:', error);
    }
  };

  const deleteDoctor = async (id) => {
    if (isTimeSlotWithDoctorExist(id)) {
      alert("cannot delete this doctor, coz this doctor already has a booken appointment, so if you want to delete this doctor so badly you need first delete slot with this doctor (id)")
    } else {
        try {
          await axios.get(`http://localhost:3080/deletedoctor/${id}`);
          fetchDoctors(); // Refresh data
          console.log(`Doctor with ID ${id} has been deleted`);
        } catch (error) {
          console.error('Error:', error);
        }
    }
  };

  const changeButton = (id, doctor_name, specialization, avatar, email, password) => {
    lastDoctorData.id = id;
    lastDoctorData.doctor_name = doctor_name;
    lastDoctorData.specialization = specialization;
    lastDoctorData.avatar = avatar;
    lastDoctorData.email = email;
    lastDoctorData.password = password;

    alert(lastDoctorData.doctor_name);

    setActiveTab("")
  }

  const handleChange = async(id, e) => {
    e.preventDefault(); // Prevent default form submission
    try {
      await axios.post(`http://localhost:3080/changeDoctorInfo/${id}`, changeDoctorData);
      fetchDoctors(); // Refresh data
      setActiveTab('new')
      console.log(`Doctor with ID ${id} has been changed`);
    } catch (error) {
      console.error('Error:', error);
    }
  }

  return (
    <div className="doctor-container">
      <h1>Doctors</h1>
      <table className="doctor-table">
        <thead>
          <tr>
            <th className="table-heading">ID</th>
            <th className="table-heading">Name</th>
            <th className="table-heading">Specialization</th>
            <th className="table-heading">Avatar</th>
            <th className="table-heading">E-mail</th>
            <th className="table-heading">Password</th>
            <th className="table-heading">Action</th> {/* New column for delete button */}
            <th className="table-heading">Action</th> {/* New column for delete button */}
          </tr>
        </thead>
        <tbody>
          {doctors.map(doctor => (
            <tr key={doctor.id}>
              <td className="table-data">{doctor.id}</td>
              <td className="table-data">{doctor.doctor_name}</td>
              <td className="table-data">{doctor.specialization}</td>
              <td className="table-data">{doctor.avatar}</td>
              <td className="table-data">{doctor.email}</td>
              <td className="table-data">{doctor.password}</td>
              <td className="table-data">
                <button className="delete-btn" onClick={() => deleteDoctor(doctor.id)}>Delete</button>
              </td>
              <td className="table-data">
                <button className="delete-btn" onClick={() => changeButton(doctor.id, doctor.doctor_name, doctor.specialization, doctor.avatar, doctor.email, doctor.password)}>change</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {activeTab === "new" ?
      <>
        <h2>Add New Doctor</h2>
        <form className="add-doctor-form" onSubmit={addNewDoctor}>
          <table className="add-doctor-table">
            <tbody>
              <tr>
                <td className="form-label">Name:</td>
                <td><input className="form-input" type="text" name="doctor_name" value={newDoctorData.doctor_name} onChange={handleInputNewDoctor} /></td>
              </tr>
              <tr>
                <td className="form-label">Specialization:</td>
                <td><input className="form-input" type="text" name="specialization" value={newDoctorData.specialization} onChange={handleInputNewDoctor} /></td>
              </tr>
              <tr>
                <td className="form-label">Avatar:</td>
                <td><input className="form-input" type="text" name="avatar" value={newDoctorData.avatar} onChange={handleInputNewDoctor} /></td>
              </tr>
              <tr>
                <td className="form-label">E-mail:</td>
                <td><input className="form-input" type="email" name="email" value={newDoctorData.email} onChange={handleInputNewDoctor} /></td>
              </tr>
              <tr>
                <td className="form-label">Password:</td>
                <td><input className="form-input" type="text" name="password" value={newDoctorData.password} onChange={handleInputNewDoctor} /></td>
              </tr>
            </tbody>
          </table>
          <button className="submit-btn" type="submit">Add Doctor</button>
        </form>  
      </> :
      <>
        <h2>Change Doctor's Info</h2>
        <form className="add-doctor-form" onSubmit={(e) => handleChange(lastDoctorData.id, e)}>
          <table className="add-doctor-table">
            <tbody>
              <tr>
                <td className="form-label">Name:</td>
                <td><input className="form-input" type="text" name="doctor_name" value={changeDoctorData.doctor_name} onChange={handleInputChangeDoctor} /></td>
              </tr>
              <tr>
                <td className="form-label">Specialization:</td>
                <td><input className="form-input" type="text" name="specialization" value={changeDoctorData.specialization} onChange={handleInputChangeDoctor} /></td>
              </tr>
              <tr>
                <td className="form-label">Avatar:</td>
                <td><input className="form-input" type="text" name="avatar" value={changeDoctorData.avatar} onChange={handleInputChangeDoctor} /></td>
              </tr>
              <tr>
                <td className="form-label">E-mail:</td>
                <td><input className="form-input" type="email" name="email" value={changeDoctorData.email} onChange={handleInputChangeDoctor} /></td>
              </tr>
              <tr>
                <td className="form-label">Password:</td>
                <td><input className="form-input" type="text" name="password" value={changeDoctorData.password} onChange={handleInputChangeDoctor} /></td>
              </tr>
            </tbody>
          </table>
          <button className="submit-btn" type="submit">Changer</button>
        </form>
      </>
      }

    </div>
  );
}

export default Doctor;
