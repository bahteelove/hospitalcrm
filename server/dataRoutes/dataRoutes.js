const express = require("express");
const router = express.Router();

const { createDB, deleteHistoryTable } = require("../controllers/dataController")
const {
    createDoctorsTable,
    getDoctorsData,
    addEmptyDoctor,
    addNewDoctor,
    deleteDoctor,
    deleteNullDoctors,
    getSelectedDoctor,
    alterDoctorTable,
    changeDoctorInfo
} = require("../controllers/doctorController") 
const {
    createTimeSlotsTable,
    getTimeSlotsData,
    addTimeSlot,
    deleteTimeSlot,
    deleteNullTimeSlots,
    deleteTimeSlotsTable,
    changeStatusTaken,
    changeStatusNotTaken,
    getTimeSlotsForSelectedDoctor,
    DropTimeSlotsTable,
    getTimeSlotsByID,
    changeStatus,
    getTimeSlotByDateTime,
    getTimeSlotsForSelectedPatient
} = require("../controllers/timeSlotController")
const {
    createPatientsTable,
    getPatientsData,
    addNewPatient,
    addEmptyPatient,
    deletePatient,
    deleteNullPatients,
    getSelectedPatient,
    alterPatientTable,
    deletePatientColumn,

    changePatientInfo
} = require("../controllers/patientController") 
const {
    createPatientHistoryTable,
    getPatientHistoryData,
    addNewPatientHistory,
    addEmptyPatientHistory,
    deletePatientHistory,
    deleteNullPatientHistory,
    getSelectedPatientHistory,
    DropHistoryTable,
    changeDateColumnType,
    alterPatientHistoryTable
} = require("../controllers/patientHistoryController") 

const { login } = require("../controllers/userController")

// ---------------------------------------------------------------------

router.route('/createdatabase').get(createDB)

// ---------------------------------------------------------------------

// POST /login
router.route('/login').post(login)

// ---------------------------------------------------------------------

// to crate doctors table
// GET /createdoctorstable
router.route('/createdoctorstable').get(createDoctorsTable)

// to get <doctors> data
// GET /getdoctorstable
router.route('/getdoctorstable').get(getDoctorsData);

// Alter Doctor Table to add a column
// GET /alterDoctorTable
router.route('/alterDoctorTable').get(alterDoctorTable);

// POST /changeDoctorInfo/:doctor_id
router.route('/changeDoctorInfo/:doctor_id').post(changeDoctorInfo);


// to get a selected doctor
// GET /getselecteddoctor/:doctor_id
//router.route('/getselecteddoctor/:doctor_id').get(getSelectedDoctor);
router.route('/getselecteddoctor/:token').get(getSelectedDoctor);

// to add an empty doctor
// POST /addemptydoctor
router.route('/addemptydoctor').post(addEmptyDoctor)

// endpoint
// POST /addnewdoctor
router.route('/addnewdoctor').post(addNewDoctor)

// to delete a doctor
// GET /deletedoctor/:id
router.route('/deletedoctor/:id').get(deleteDoctor);

// to delete empty doctors
// DELETE /deleteemptydoctors
router.route('/deleteemptydoctors').delete(deleteNullDoctors);

// ---------------------------------------------------------------------

// Create Time Slots Table
// GET /createtimeslotstable
router.route('/createtimeslotstable').get(createTimeSlotsTable);

// DROP THE TABLE
router.route('/droptimeslottable').get(DropTimeSlotsTable);

// Get Time Slots Data
// GET /gettimeslotstable
router.route('/gettimeslotstable').get(getTimeSlotsData);

// to get timeSlots by 
// GET /gettimeslotbyid/:id
router.route('/gettimeslotbyid/:id').get(getTimeSlotsByID);

// to get timeSlots for a selected doctor
// GET /gettimeslotsforselecteddoctor/:token
router.route('/gettimeslotsforselecteddoctor/:token').get(getTimeSlotsForSelectedDoctor);

// to chnage the status
// POST /changestatustaken/:id
router.route('/changestatustaken/:id').post(changeStatusTaken);

//getTimeSlotByDateTime
// to get timeSlots by DateTime
// GET /gettimeslotbydatetime
router.route('/gettimeslotbydatetime').post(getTimeSlotByDateTime);

// to change status and status_time
// POST /changeslotstatus/:id
router.route('/changeslotstatus/:id').post(changeStatus);

// GET /changestatusnottaken/:id
router.route('/changestatusnottaken/:id').get(changeStatusNotTaken);

// to get timeSlots for a selected patient
// GET /getTimeSlotsForSelectedPatient/:token
router.route('/getTimeSlotsForSelectedPatient/:token').get(getTimeSlotsForSelectedPatient);

// Add Time Slot
// POST /addnewtimeslot
router.route('/addnewtimeslot').post(addTimeSlot)

// Delete Time Slot
// DELETE /deletetimeslots/:id
router.route('/deletetimeslots/:id').delete(deleteTimeSlot);

// Delete Null Time Slots
// DELETE /deletenulltimeslots
router.route('/deletenulltimeslots').delete(deleteNullTimeSlots);

// Delete Time Slots
// GET /deletetimeslotstable
router.route('/deletetimeslotstable').get(deleteTimeSlotsTable);

// ---------------------------------------------------------------------

// Create Patients Table
// GET /createpatientstable
router.route('/createpatientstable').get(createPatientsTable);

// Alter Patient Table to add a column
// GET /alterpatienttable
router.route('/alterpatienttable').get(alterPatientTable);

// Delete a column from the patient table
// GET /deletepatientcolum
router.route('/deletepatientcolum').get(deletePatientColumn);

// Get Patients Data
// GET /getpatientstable
router.route('/getpatientstable').get(getPatientsData);

// get selected patient
// GET /getselectedpatient/:token
router.route('/getselectedpatient/:token').get(getSelectedPatient);

// Add New Patient
// POST /addnewpatient
router.route('/addnewpatient').post(addNewPatient)

// change patient info
  // POST /changepatientinfo/:patient_id
router.route('/changepatientinfo/:patient_id').post(changePatientInfo)

// Add Empty Patient
// POST //addemptypatient
router.route('/addemptypatient').post(addEmptyPatient)

// Delete Patient
// DELETE /deletepatient/:patient_id
router.route('/deletepatient/:patient_id').delete(deletePatient);

// Delete Null Patients
// DELETE /deletenullpatients
router.route('/deletenullpatients').delete(deleteNullPatients);


// ---------------------------------------------------------------------

// Create Patient History Table
// GET /createpatienthistorytable
router.route('/createpatienthistorytable').get(createPatientHistoryTable);

// Alter Patient History Table to add doctor_name column
// GET /alterpatienthistorytable
router.route('/alterpatienthistorytable').get(alterPatientHistoryTable);

// DROP TABLE
//router.route('/drophistorytable').get(DropHistoryTable);

router.route('/changetype').get(changeDateColumnType);

// Get Patient History Data
// GET /getpatienthistorytable
router.route('/getpatienthistorytable').get(getPatientHistoryData);

// get selected patient
// GET /getselectedpatienthistory/:patient_id
router.route('/getselectedpatienthistory/:patient_id').get(getSelectedPatientHistory);

// Add New Patient History
// POST //addnewpatienthistory
router.route('/addnewpatienthistory').post(addNewPatientHistory)

// Add Empty Patient History
// POST /addemptypatienthistory
router.route('/addemptypatienthistory').post(addEmptyPatientHistory)

// Delete Patient History
// DELETE /deletepatienthistory/:id
router.route('/deletepatienthistory/:id').delete(deletePatientHistory);

// Delete Null Patient History
// DELETE /deletenullpatientshistory
router.route('/deletenullpatientshistory').delete(deleteNullPatientHistory);


// ---------------------------------------------------------------------

module.exports = router;