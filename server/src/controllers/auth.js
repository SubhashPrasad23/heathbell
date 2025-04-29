const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const handleSignUp = async (req, res) => {
  try {
   
    const { fullName, email, password } = req.body;
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const passwordHash = await bcrypt.hash(password, 10);

    const existingUser = await User.findOne({ email: email });
    console.log(existingUser, "existing");

    if (existingUser) {
      return res.status(409).json({ message: "User already exist" });
    }

    const user = new User({ fullName, email, password: passwordHash });

    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
  }
};

const handleLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json("Invalid credentials");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
      const token = await jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

      res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      res.status(200).json({ message: "Login successfully", data: user });
    } else {
      return res.status(404).json("Invalid credentials");
    }
    res.status(200).json("login success");
  } catch (error) {
    console.log(error);
  }
};

module.exports = { handleSignUp, handleLogin };
