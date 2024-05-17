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
    const { email, password } = req.body;
  
    db.query('SELECT * FROM doctors WHERE email = ?', [email], (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send('Server error');
      } else {
        if (results.length > 0) {
          const user = results[0];
          if (bcrypt.compareSync(password, user.password)) {
            const token = jwt.sign({ userId: user.doctor_id, userType: 'doctor' }, 'secret', { expiresIn: '1h' });
            res.status(200).send({ token, userType: "doctor" });
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
