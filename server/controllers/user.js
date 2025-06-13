import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';

const postSignup = async (req, res) => {
  const { name, email, password, city } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      data: null,
      message: "All fields are required",
    });
  }

  const encryptedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({
    name,
    email,
    password: encryptedPassword,
    city,
  });

  try {
    const savedUser = await newUser.save();

    return res.status(201).json({
      success: true,
      data: savedUser,
      message: "SignUp Successfull",
    });
  } catch (e) {
    res.status(400).json({
      success: false,
      data: null,
      message: e.message,
    });
  }
};

const postLogin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      data: null,
      message: "email and password are required",
    });
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).json({
      success: false,
      data: null,
      message: "Invalid email or password",
    });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(400).json({
      success: false,
      data: null,
      message: "Invalid email or password",
    });
  }

  user.password = undefined; //remove pass from response

  const jwtToken = jwt.sign({
    _id: user._id,
    name: user.name,
    email: user.email
  },
 process.env.JWT_SECRET,
 { expiresIn: 60 * 60 * 24 }
); 

  return res.status(200).json({
    success: true,
    data: user,
    jwtToken: jwtToken,
    message: "Login Successfull",
  });
};

export { postSignup, postLogin };
