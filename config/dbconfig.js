const mongoose = require("mongoose"); 
const dbconnect = async (req,res) => {
    try {
        await mongoose.connect(process.env.MongoUrl); 
        console.log("Data Base Connected Successfully");
    } 
    catch (error)
    {
        console.log("Database connection Failed",error.message);  
    }
    
}

dbconnect() ; 