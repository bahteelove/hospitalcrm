import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

import '../style/doctorReport.css'; // Import CSS file for styling 
import jsPDF from 'jspdf';

const DoctorReport = () => {
    const { doctorId } = useParams();

    const [selectedDoctor, setSelectedDoctor] = useState('');
    const [timeSlots, setTimeSlots] = useState([]);

    // fetching datas

    useEffect(() => {
        fetchSelectedDoctor();
        fetchTimeSlotsBySelectedDoctor();
    }, []);

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

    const fetchSelectedDoctor = () => {
        axios.get(`http://localhost:3080/getselecteddoctor/${doctorId}`)
            .then(response => {
                setSelectedDoctor(response.data);
            })
            .catch(error => {
                console.error('Error fetching selected doctor:', error);
            });
    };

    const fetchTimeSlotsBySelectedDoctor = () => {
        axios.get(`http://localhost:3080/gettimeslotsforselecteddoctor/${doctorId}`)
          .then(response => {
            setTimeSlots(response.data);
          })
          .catch(error => {
            console.error('Error fetching time slots:', error);
          });
    }; 

    
    const handleDownloadReport = async() => {
        const doc = new jsPDF();
        doc.text("Appointment Report", 10, 10);
    
        timeSlots.forEach((slot, index) => {
            const yPos = 20 + (index * 30);
    
            if (slot.status === "done" || slot.status === "taken") {
                doc.text(`Patient Name: ${slot.patient_name}`, 10, yPos);
                doc.text(`Time: ${slot.time}`, 10, yPos + 10);
                doc.text(`Status: ${slot.status}`, 10, yPos + 20);
                doc.text(`Status Time: ${slot.status_time}`, 10, yPos + 30);
            }
            else {
                doc.text(`Patient Name: -`, 10, yPos);
                doc.text(`Time: ${slot.time}`, 10, yPos + 10);
                doc.text(`Status: ${slot.status}`, 10, yPos + 20);
                doc.text(`Status Time: -`, 10, yPos + 30);
            }

            axios.post(`http://localhost:3080/changeslotstatus/${slot.id}`, {patient_id: 0, patient_name: "", status: "not taken", status_time: getCurrentDateTime()})

    
            if (index !== timeSlots.length - 1) {
                doc.addPage(); // Add a new page for the next appointment
            }
        });
    
        doc.save("appointment_report.pdf");
        window.location.reload()
    };

    return (
        <div className="doctor-report-container">
            <h1>Daily Report</h1>
            {selectedDoctor && (
                <div className="doctor-info">
                    
                    <div className="time-slots">
                        <h4>Schedule</h4>
                        <ul>
                            {timeSlots.map((slot, index) => (
                                <li key={index}>
                                    <span>{slot.time}</span>
                                    <p> {slot.patient_name ? `Waiting ${slot.patient_name}` : slot.status} </p>
                                    <p> {slot.status === "done" ? 'Appoitment has been finished' : ''} </p>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
            <button className='down' onClick={ handleDownloadReport }> End the Shift </button>
        </div>
    );
};

export default DoctorReport;
