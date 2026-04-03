const express = require('express');
const db = require('./config/db')

const app = express();
app.use(express.json());

app.post('/cars', (req, res) => {
  const { plate_number, type, model, year, driver_phone, mechanic_phone } = req.body;
  const sql = "INSERT INTO car (plate_number, type, model, manufacturing_year, driver_phone, mechanic_phone) VALUES (?, ?, ?, ?, ?, ?)";
  db.query(sql, [plate_number, type, model, year, driver_phone, mechanic_phone], (err, result) => {
    if (err) return res.status(500).send(err);
    res.send({ message: "Car added", id: result.insertId });
  });
});

// Add this to handle the "VIP List" (Drivers)
app.post('/drivers', (req, res) => {
  const { driver_name, driver_phone } = req.body;
  
  const sql = "INSERT INTO driver (driver_name, driver_phone) VALUES (?, ?)";
  
  db.query(sql, [driver_name, driver_phone], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Database error", details: err.message });
    }
    res.status(201).json({ message: "Driver registered successfully!", driver_phone });
  });
});

// Do the same for Mechanics if you haven't yet
app.post('/mechanics', (req, res) => {
  const { mechanic_name, mechanic_phone } = req.body;
  const sql = "INSERT INTO mechanic (mechanic_name, mechanic_phone) VALUES (?, ?)";
  db.query(sql, [mechanic_name, mechanic_phone], (err, result) => {
    if (err) return res.status(500).json(err);
    res.status(201).json({ message: "Mechanic added!" });
  });
});

app.get('/cars', (req, res) => {
  const sql = "SELECT * FROM car";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

//read data
app.get('/cars', (req, res) => {
  // We use a JOIN if you want to see the driver/mechanic details too
  const sql = "SELECT * FROM car"; 
  
  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to fetch cars" });
    }
    res.json(results);
  });
});

//delete
app.delete('/cars/:id', (req, res) => {
  const carId = req.params.id;
  const sql = "DELETE FROM car WHERE plate_id = ?";

  db.query(sql, [carId], (err, result) => {
    if (err) {
      // This will trigger if the car is linked to a ServiceRecord (FK Constraint)
      console.error(err);
      return res.status(500).json({ error: "Cannot delete car: It has active service records." });
    }
    res.json({ message: "Car deleted successfully" });
  });
});

app.listen(5000, () => console.log('Server running on port 5000'));