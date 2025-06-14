import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { postSignup, postLogin } from "./controllers/user.js";
dotenv.config();
import jwt from "jsonwebtoken";
import { postBlogs, getBlogs } from "./controllers/blog.js";

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

const verifyJwt = async (req, res, next) => {
  const {authorization} = req.headers;

  try{
    const jwtToken = authorization.split(" ")[1];
    const decodedToken = jwt.verify(jwtToken, process.env.JWT_SECRET)
    console.log(decodedToken);

    req.user = decodedToken;

    next();
  }catch(e){
    return res.status(401).json({
      success: false,
      data: null,
      message: e.message
    })
  }
}

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "server is running",
  });
});

app.post("/signup", postSignup);
app.post("/login", postLogin);
app.get("/blogs", getBlogs);

app.post('/blogs', verifyJwt, postBlogs);

app.listen(PORT, () => {
  console.log(`server is running on PORT ${PORT}`);
  connectDB();
});
