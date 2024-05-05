import React, { useState, useEffect } from 'react';
import axios from 'axios';

function PatientHistory() {
  const [patientHistory, setPatientHistory] = useState([]);
  const [newHistoryData, setNewHistoryData] = useState({
    patient_id: '',
    date: '',
    issue: '',
    advice: '',
    recipe: '',
    doctor_id: ''
  });

  useEffect(() => {
    fetchPatientHistory();
  }, []);

  const fetchPatientHistory = () => {
    axios.get('http://localhost:3080/getpatienthistorytable')
      .then(response => {
        setPatientHistory(response.data);
      })
      .catch(error => {
        console.error('Error fetching patient history:', error);
      });
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewHistoryData({ ...newHistoryData, [name]: value });
  };

  const addNewHistory = async () => {
    try {
      // Check if any required field is empty
      if (!newHistoryData.patient_id || !newHistoryData.date || !newHistoryData.issue || !newHistoryData.advice || !newHistoryData.recipe || !newHistoryData.doctor_id) {
        alert('All fields are required');
        return;
      }

      // Send POST request to add new patient history
      await axios.post('http://localhost:3080/addnewpatienthistory', newHistoryData);

      // Fetch updated list of patient history after adding new data
      fetchPatientHistory();

      // Reset the form fields
      setNewHistoryData({
        patient_id: '',
        date: '',
        issue: '',
        advice: '',
        recipe: '',
        doctor_id: ''
      });

      console.log('New patient history added successfully');
    } catch (error) {
      console.error('Error adding new patient history:', error);
    }
  };

  return (
    <div>
      <h1>Patient History</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Patient ID</th>
            <th>Date</th>
            <th>Issue</th>
            <th>Advice</th>
            <th>Recipe</th>
            <th>Doctor ID</th>
          </tr>
        </thead>
        <tbody>
          {patientHistory.map(history => (
            <tr key={history.id}>
              <td>{history.id}</td>
              <td>{history.patient_id}</td>
              <td>{history.date}</td>
              <td>{history.issue}</td>
              <td>{history.advice}</td>
              <td>{history.recipe}</td>
              <td>{history.doctor_id}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Add New Patient History</h2>
      <form onSubmit={addNewHistory}>
        <label>
          Patient ID:
          <input type="number" name="patient_id" value={newHistoryData.patient_id} onChange={handleInputChange} />
        </label>
        <label>
          Date:
          <input type="datetime-local" name="date" value={newHistoryData.date} onChange={handleInputChange} />
        </label>
        <label>
          Issue:
          <input type="text" name="issue" value={newHistoryData.issue} onChange={handleInputChange} />
        </label>
        <label>
          Advice:
          <textarea name="advice" value={newHistoryData.advice} onChange={handleInputChange} />
        </label>
        <label>
          Recipe:
          <textarea name="recipe" value={newHistoryData.recipe} onChange={handleInputChange} />
        </label>
        <label>
          Doctor ID:
          <input type="number" name="doctor_id" value={newHistoryData.doctor_id} onChange={handleInputChange} />
        </label>
        <button type="submit">Add History</button>
      </form>
    </div>
  );
}

export default PatientHistory;
