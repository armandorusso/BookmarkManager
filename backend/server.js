import express, { application } from "express"
import cors from "cors"
import websites from "./api/websitesurls.route.js"

// http://localhost:5000/api/v1/websites

const app = express()

// Use cors module
app.use(cors())

// Server can accept a JSON in the body of the server
app.use(express.json())

// Specify certain routes
app.use("/api/v1/websites", websites)

// If someone goes to somewhere where it doesn't exist
// * is a wild card symbol meaning anything that isn't in our route file
app.use("*", (req, res) => res.status(404).json({ error: "Endpoint not found" }))


export default app 










/*const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

require('dotenv').config(); // Configures our environment variables

// Creates our express server
const app = express();
const port = process.env.PORT || 5000; 

// Middleware (Cors middleware which allows us to parse in JSON since it sends and receives JSON)
app.use(cors());
app.use(express.json());

// Connect to MongoDB
const uri = process.env.ATLAS_URI; // Database URI from MongoDB Atlas dashboard
mongoose.connect(uri, { useNewUrlParser: true }
);

const connection = mongoose.connection;
connection.once('open', () => {
    console.log("MongoDB database connection established succesfully");
})

// Starts the server
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
})*/