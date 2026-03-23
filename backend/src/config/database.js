import mongoose from "mongoose";

async function connectDB (req,res) {
    mongoose.connect(process.env.MONGO_URI)
    .then(()=>{
        console.log("database connected");
        
    })
    
} 

export default connectDB