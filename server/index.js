import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const app = express();

app.use(express.json());
app.use(cors())

const PORT = process.env.PORT || 5001;

const connectDB = async () => {
    const conn = await mongoose.connect(process.env.MONGO_URL);

    if(conn){
        console.log("MongoDB Connected");
    }else{
        console.log("MongoDB Connection Failed");
    }
}

app.get('/health', (req, res)=>{
    res.status(200).json({
        success: true,
        message: "server is running"
    });
});

app.listen(PORT, () => {
    console.log(`server is running on PORT ${PORT}`);
    connectDB();
})