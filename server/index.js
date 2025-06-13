import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { postSignup, postLogin } from "./controllers/user.js";
dotenv.config();
import jwt from "jsonwebtoken";

const app = express();

app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5001;

const connectDB = async () => {
  const conn = await mongoose.connect(process.env.MONGO_URL);

  if (conn) {
    console.log("MongoDB Connected");
  } else {
    console.log("MongoDB Connection Failed");
  }
};

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "server is running",
  });
});

app.post("/signup", postSignup);
app.post("/login", postLogin);
app.get("/blogs", async (req, res) => {
    const { authorization } = req.headers;
    try{
    const jwtToken = authorization.split(" ")[1];
    console.log(jwtToken);
    const decodedToken = jwt.verify(jwtToken, process.env.JWT_SECRET)
    console.log(decodedToken)
    }catch(e){
        return res.status(401).json({
            success: false,
            data: null,
            message: e.message
        })
    }

  const Blogs = [
    {
      title: "blog 1",
      content: "this is blog 1",
    },
    {
      title: "blog 2",
      content: "this is blog 2",
    },
  ];

  return res.status(200).json({
    success: true,
    data: Blogs,
    message: "blog fetched successfully"
  })
});

app.listen(PORT, () => {
  console.log(`server is running on PORT ${PORT}`);
  connectDB();
});
