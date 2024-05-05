import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import App from "./App";

import Admin from "./components/admin/admin";

import PatientIn from "./components/patient/patientin";
import DoctorIn from "./components/doctor/doctorin";

import NewBooking from "./components/patient/newBooking";

const RouteSwitch = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />

        <Route path="/patientin/:patientId" element={ <PatientIn /> } />
        <Route path="/doctorin/:doctorId" element={ <DoctorIn /> } />

        <Route path="/admin" element={ <Admin /> } />

        
        <Route path="/calendar" element={ <NewBooking /> } />
        
      </Routes>
    </BrowserRouter>
  );
};

export default RouteSwitch;