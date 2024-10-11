// Import dependencies
const express = require("express");
const app = express();
const mysql = require('mysql2');
const dotenv = require('dotenv');

// Configure environment variables
dotenv.config();

// Create connection object
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Test the connection
db.connect((err) => {
    if (err) {
        console.log("Error connecting to database: ", err);
        return;
    }
    console.log("Successfully connected to MySQL: ", db.threadId);
});

// Start and listen to the server
app.listen(3300, () => {
    console.log("Server is running on port 3300");
});



/*
//saying hello James
app.get('', (req, res) => {
    res.send("Hello James you are doing well")
})
*/

//retrieve all patients
app.get('', (req, res) => {
    const getPatients = "SELECT * FROM patients"
    db.query(getPatients, (err, data) => {
        if(err) {
            return res.status(400).send("Failed to get Patients Data") // Send a 500 error if the query fails
        }
        res.status(200).send(data) // Send a 200 response with the data
    })
})


// Retrieve all patients
app.get('/api/patients', (req, res) => {
    const getPatients = "SELECT patient_id, first_name, last_name, date_of_birth FROM patients";
    
    db.query(getPatients, (err, data) => {
        if (err) {
            console.error("Database query error: ", err);
            return res.status(500).send("Failed to get Patients Data");
        }
        
        res.status(200).json(data); // Respond with the JSON data of patients
    });
});


// Retrieve all providers
app.get('/api/providers', (req, res) => {
    const getProviders = "SELECT first_name, last_name, provider_specialty FROM providers";

    db.query(getProviders, (err, data) => {
        if (err) {
            console.error("Database query error: ", err);
            return res.status(500).send("Failed to get Providers Data");
        }
        
        res.status(200).json(data); // Respond with the JSON data of providers
    });
});


// Filter patients by First Name
app.get('/api/patients/filter', (req, res) => {
    const firstName = req.query.first_name; // Get first name from query parameters
    if (!firstName) {
        return res.status(400).send("First name query parameter is required");
    }

    const getPatientsByFirstName = "SELECT patient_id, first_name, last_name, date_of_birth FROM patients WHERE first_name = ?"; // Use parameterized query

    db.query(getPatientsByFirstName, [firstName], (err, data) => {
        if (err) {
            console.error("Database query error: ", err);
            return res.status(500).send("Failed to get Patients Data");
        }
        
        res.status(200).json(data); // Respond with the JSON data of patients
    });
});


// Retrieve all providers by their specialty
app.get('/api/providers/filter', (req, res) => {
    const specialty = req.query.specialty; // Get specialty from query parameters
    if (!specialty) {
        return res.status(400).send("Specialty query parameter is required");
    }

    const getProvidersBySpecialty = "SELECT first_name, last_name, provider_specialty FROM providers WHERE provider_specialty = ?"; // Use parameterized query

    db.query(getProvidersBySpecialty, [specialty], (err, data) => {
        if (err) {
            console.error("Database query error: ", err);
            return res.status(500).send("Failed to get Providers Data");
        }
        
        res.status(200).json(data); // Respond with the JSON data of providers
    });
});


