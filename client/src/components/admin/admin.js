import React, { useState, useEffect } from 'react';
import axios from 'axios';

import "../style/admin.css"

import Doctor from './doctorsData';
import Patient from './patientsData';
import TimeSlots from './timeSlotsData';
import PatientHistory from './patientsHistoriesData';

function Admin() {

  return (
    <div>
      <Doctor />

      <TimeSlots />

      <Patient />

      <PatientHistory />
    </div>
    
  );
}

export default Admin;
