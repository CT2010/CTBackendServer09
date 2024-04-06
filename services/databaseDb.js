// services/databaseDb.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const Account = require('../models/userModel');
 
const uri = String;
uri = string(process.env.MONGO_URI_VIS);

// Function to establish a connection to MongoDB Atlas
const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('MongoDB Atlas connected');
  } catch (error) {
    console.error(error);
    process.exit(1); // Exit process with failure
  }
};
 
module.exports = connectDatabase;
 