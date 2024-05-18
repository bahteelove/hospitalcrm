import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import App from "./App";

import Admin from "./components/admin/admin";

import PatientIn from "./components/patient/patientin";
import DoctorIn from "./components/doctor/doctorin";


const RouteSwitch = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />

        <Route path="/user/:patientId" element={ <PatientIn /> } />
        <Route path="/welcome/:doctorId" element={ <DoctorIn /> } />

        <Route path="/admin" element={ <Admin /> } />
        
      </Routes>
    </BrowserRouter>
  );
};

export default RouteSwitch;