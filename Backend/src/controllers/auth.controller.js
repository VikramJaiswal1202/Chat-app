import User from "../models/user.model.js";
import bcrypt from "bcryptjs";


export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;

  try {
    // Check the passowrd length
    if (password.lenght < 6) {
      return res
        .status(400)
        .json({ message: "Password Must be Longer than 6 Characters" });
    }

    // check if the account with the mail exists or not

    const user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({message : "Account with this Mail exists"});
    }

    // Hashing of passwords

    const salt= await bcrypt.genSalt(10);
    const hashedPassword= await bcrypt.hash(salt,password);

    // Creating a new user profile
    const newUser= new User({
      fullName : fullName,
      email : email,
      password : hashedPassword
    })

  } catch (error) {}
};

export const login = (req, res) => {
  res.send("login route");
};

export const logout = (req, res) => {
  res.send("logout route");
};
