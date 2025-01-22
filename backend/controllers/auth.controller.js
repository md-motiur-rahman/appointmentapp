import { generateTokenAndSetCookie } from "../lib/generateToken.js";
import User from "../models/auth.model.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
  try {
    const { fullname, email, password, phone } = req.body;

    if (
      fullname.trim().length === 0 ||
      email.trim().length === 0 ||
      phone.trim().length === 0
    ) {
      return res.status(400).json({ error: "All the fields are required" });
    }

    const emialRegEx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emialRegEx.test(email)) {
      return res
        .status(400)
        .json({ error: "Please provide a valid email address" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "There is already an user exists with the email" });
    }

    if (password.length < 8) {
      return res
        .status(400)
        .json({ error: "The password must be at least 8 character" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      fullname,
      email,
      phone,
      password: hashedPassword,
    });

    if (user) {
      generateTokenAndSetCookie(user._id, res);
      const newUser = await user.save();
      newUser.password = null;
      return res.status(201).json(newUser);
    } else {
      return res.status(400).json({
        message: "Unable to create user, Please try again later or contact us",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({ success: false, error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    const checkPass = await bcrypt.compare(password, user?.password || "");
    if (!user || !checkPass) {
      return res.status(400).json({ error: "Invalid username or password" });
    }
    generateTokenAndSetCookie(user._id, res);
    return res.status(200).json({ data: user });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ success: false, error: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    return res.status(200).json({ message: "You are logged out" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: error.message });
  }
};
