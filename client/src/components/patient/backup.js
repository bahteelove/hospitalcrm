<div>
    <h2>Patient Info</h2>

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
        
    </tbody>
    </table>

    <button className="submit-btn" >Change Data</button>
</div>