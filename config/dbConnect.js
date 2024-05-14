// Import the mongoose library
const mongoose = require("mongoose");

// Define an asynchronous function named dbConnect
async function dbConnect() {
    try {
        // Attempt to connect to MongoDB using the MONGO_URI environment variable
        await mongoose.connect(process.env.MONGO_URI);
        
        // If connection is successful, log a success message to the console
        console.log("Database connected");
    } catch (error) {
        // If an error occurs during connection, log the error to the console
        console.log(error);
    }
}

// Export the dbConnect function so it can be used by other parts of the application
module.exports = dbConnect;
