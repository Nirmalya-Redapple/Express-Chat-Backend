const mongoose = require('mongoose');
const config = require('config');
const db = config.get('mongoURI');

const connectDB = async () =>{
    try{
        console.log("Connecting to Database ...");
        await mongoose.connect(db,{
            useNewUrlParser:true,
            useCreateIndex:true
        });
        console.log("Database is now connected!");
    }
    catch(err){
        console.log("Failed to connect to database "+err.message);        
        //Exit process with a failure
        process.exit(1);
    }
}

module.exports = connectDB;