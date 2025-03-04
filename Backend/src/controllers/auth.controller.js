import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/util.js";
import cloudinary from "../lib/cloudinary.js";

export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;

  try {
    // checking if all he details are being provided

    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All the fields must be filled" });
    }
    // Check the passowrd length
    if (password.lenght < 6) {
      return res
        .status(400)
        .json({ message: "Password Must be Longer than 6 Characters" });
    }

    // check if the account with the mail exists or not

    const user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ message: "Account with this Mail exists" });
    }

    // Hashing of passwords

    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, salt);

    // Creating a new user profile
    const newUser = new User({
      fullName: fullName,
      email: email,
      password: hashedPassword,
    });

    if (newUser) {
      // Generate JWT

      generateToken(newUser._id, res); // newUser._id is how db stores the unique id of any account

      await newUser.save();

      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
      });
    } else {
      return res.status(400).json({ message: "Invalid User Data" });
    }
  } catch (error) {
    console.log("Error in signup controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    // fetch the data from  DB
    const user = await User.findOne({ email });

    // checking if the user data exist in the db

    if (!user) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    // password check
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    generateToken(user._id, res);

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.log("error in login controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged Out Successfully" });
  } catch (error) {
    console.log("error in Logout Controller", error.message);
    return res.status(400).json({ message: "internal server error" });
  }
};

export const updageProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const userId = req.user._id;
    if (!userId) {
      return res.status(400).json({ message: "profile pic is req" });
    }
    const uploadResponse = await cloudinary.uploader.upload(profilePic);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse.secure_url },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    console.log("error in updating the profile", error);
    res.status(500).json({ message: "internal server error" });
  }
};

export const checkAuth= (req,res)=>{
  try {
    res.status(200).json(req.user);

  } catch (error) {
    
    console.log("error in checkAuth Controller",error.message);
    res.status(500).json({message: "Internal Server Error"});
  }
}