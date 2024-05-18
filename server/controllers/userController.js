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
  console.log("MySQL [userController] is connected");
});

const login = (req, res) => {
    const { email, password, userType } = req.body;

    let tableName;
    if (userType === 'doctor') {
        tableName = 'doctors';
    } else if (userType === 'patient') {
        tableName = 'patients';
    } else if (userType === 'admin') {
        tableName = 'admins';
    } else {
        return res.status(400).send('Invalid user type');
    }
  
    db.query(`SELECT * FROM ${tableName} WHERE email = ?`, [email], (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send('Server error');
      } else {
        if (results.length > 0) {
          const user = results[0];
          if (bcrypt.compareSync(password, user.password)) {
            const token = jwt.sign({ userId: user.id, userType: userType }, 'secret', { expiresIn: '1h' });
            res.status(200).send({ token, userType: userType });
          } else {
            res.status(401).send('Invalid email or password');
          }
        } else {
          res.status(401).send('Invalid email or password');
        }
      }
    });
  };

module.exports = {
  login,
};
