const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mysql = require('mysql');

// Create a database connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "123456",
    database: "hospital_db"
});

// Connect to the database
db.connect((err) => {
    if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
    }
    console.log("MySQL [doctorController] is connected");
});
// -------------------------------------------------------------------------------

// to crate doctors table
// GET /createdoctorstable
const createDoctorsTable = (req, res) => {
    let sql = 'CREATE TABLE doctors (doctor_id INT AUTO_INCREMENT, doctor_name VARCHAR(255), specialization VARCHAR(255), avatar VARCHAR(255), PRIMARY KEY (doctor_id))';
    db.query(sql, (err, result) => {
      if (err) {
        console.error("Error creating <doctors> table:", err.code, "-", err.message);
        res.status(500).send('<doctors> table creation has failed');
        return;
      }
      console.log("<doctors> table has created:", result);
      res.send("<doctors> table has created");
    });
  };
  
  // to get <doctors> data
  // GET /getdoctorstable
  const getDoctorsData = (req, res) => {
    let sql = 'SELECT * FROM doctors';
    db.query(sql, (err, result) => {
        if (err) {
        console.error("Error fetching <doctors> info:", err.code, "-", err.message);
        res.status(500).send('Failed to fetch <doctors> info');
        return;
        }
        console.log("<doctors> info:", result);
        res.send(result);
    });
  };

  // Alter Doctor Table to add a column
  // GET /alterDoctorTable
  const alterDoctorTable = (req, res) => {
    let sql = 'ALTER TABLE doctors ADD COLUMN password VARCHAR(255)';
    db.query(sql, (err, result) => {
        if (err) {
            console.error("Error altering <doctors> table:", err.code, "-", err.message);
            res.status(500).send('<doctors> table alteration has failed');
            return;
        }
        console.log("<doctors> table has been altered");
        res.send("<doctors> table has been altered");
    });
  };
  
  /*
  // to get a selected doctor
  // GET /getselecteddoctor/:doctor_id
  const getSelectedDoctor = (req, res) => {
    const { doctor_id } = req.params;
  
    const sql = 'SELECT * FROM doctors WHERE doctor_id = ?';
    db.query(sql, [doctor_id], (err, result) => {
      if (err) {
        console.error(`Error fetching doctor (${doctor_id}) info:`, err.code, "-", err.message);
        res.status(500).send(`Failed to fetch doctor (${doctor_id}) info`);
        return;
      }
      if (result.length === 0) {
        console.log(`Doctor with ID ${doctor_id} not found`);
        res.status(404).send(`Doctor with ID ${doctor_id} not found`);
        return;
      }
      console.log(`Doctor (${doctor_id}) info:`, result[0]);
      res.status(200).json(result[0]); // Return only the first row (assuming doctor_id is unique)
    });
  };
  */
  // GET /getselecteddoctor/:token
  const getSelectedDoctor = (req, res) => {
    const { token } = req.params;
  
    // Verify the token and extract the doctor_id
    jwt.verify(token, 'secret', (err, decoded) => {
      if (err) {
        return res.status(500).send('Failed to authenticate token');
      }
  
      const doctor_id = decoded.userId; // Extract doctor_id from decoded token
  
      // Fetch the selected doctor's information from the database using the doctor_id
      db.query('SELECT * FROM doctors WHERE doctor_id = ?', [doctor_id], (err, result) => {
        if (err) {
          console.error(`Error fetching doctor (${doctor_id}) info:`, err.code, "-", err.message);
          res.status(500).send(`Failed to fetch doctor (${doctor_id}) info`);
          return;
        }
        if (result.length === 0) {
          console.log(`Doctor with ID ${doctor_id} not found`);
          res.status(404).send(`Doctor with ID ${doctor_id} not found`);
          return;
        }
        console.log(`Doctor (${doctor_id}) info:`, result[0]);
        res.status(200).json(result[0]);
      });
    });
  };
  
  
    
  
  // to add an empty doctor
  // POST /addemptydoctor
  const addEmptyDoctor = (req, res) => {
    let post = { doctor_name: "", specialization: "", avatar: "" };
    let sql = 'INSERT INTO doctors SET ?';
    let query = db.query(sql, post, (err, result) => {
      if (err) throw err;
      console.log(result);
      res.send("Users has added...")
    })
  };
  
  // endpoint
  // POST /addnewdoctor
  const addNewDoctor = (req, res) => {
    const { doctor_name, specialization, avatar, email, password } = req.body;

    const hashedPassword = bcrypt.hashSync(password, 10);
    const user = { doctor_name, specialization, avatar, email, password: hashedPassword };

    db.query('INSERT INTO doctors SET ?', user, (err, result) => {
      if (err) {
        console.error('Error registering user:', err);
        res.status(500).send('Error registering user');
        return;
      }
      console.log('User registered successfully');
      res.send('User registered successfully');
    });
  
  };

  // change doctor info
  // POST /changeDoctorInfo/:doctor_id
  const changeDoctorInfo = (req, res) => {
    const { doctor_id } = req.params;
    const { doctor_name, specialization, avatar, email, password } = req.body;
    
    const hashedPassword = bcrypt.hashSync(password, 10);
  
    const sql = 'UPDATE doctors SET doctor_name = ?, specialization = ?, avatar = ?, email = ?, password = ? WHERE doctor_id = ?';
    db.query(sql, [doctor_name, specialization, avatar, email, hashedPassword, doctor_id], (err, result) => {
      if (err) {
        console.error(`Error changing the doctor (${doctor_name}) with ID ${doctor_id}:`, err);
        res.status(500).send(`Error changing the doctor (${doctor_name}) with ID ${doctor_id}`);
        return;
      }
      console.log(`new doctor (${doctor_name}) with ID ${doctor_id} added successfully`);
      res.send(`new doctor (${doctor_name}) with ID ${doctor_id} added successfully`);
    });
  };
  
  // to delete a doctor
  // DELETE deletedoctor/:doctor_name
  const deleteDoctor = (req, res) => {
      const doctor_name = req.params.doctor_name;
      let sql = 'DELETE FROM doctors WHERE doctor_name = ?';
      db.query(sql, [doctor_name], (err, result) => {
          if (err) {
          console.error(`Error deleting doctor (${doctor_name}):`, err.code, "-", err.message);
          res.status(500).send('Failed to delete doctor');
          return;
          }
          console.log("doctor deleted successfully");
          res.send(`doctor (${doctor_name}) deleted successfully`);
      });
  };
  
  // to delete empty doctors
  // DELETE /deleteemptydoctors
  const deleteNullDoctors = (req, res) => {
    let sql = `DELETE FROM doctors WHERE doctor_name = '' OR doctor_name IS NULL OR doctor_name = ' ';`;
    db.query(sql, (err, result) => {
        if (err) {
        console.error(`Error deleting doctor:`, err.code, "-", err.message);
        res.status(500).send(`Failed to delete doctor`);
        return;
        }
        console.log(`doctor deleted successfully`);
        res.send(`doctor deleted successfully`);
    });
  };

  
module.exports = { 
    createDoctorsTable,
  getDoctorsData,
  addEmptyDoctor,
  addNewDoctor,
  deleteDoctor,
  deleteNullDoctors,
  getSelectedDoctor,

  alterDoctorTable,
  changeDoctorInfo
 }
