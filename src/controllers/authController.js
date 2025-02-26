import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendResetEmail } from "../utils/email.js";
import passport from "passport"; 
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const crypto = require("crypto");

const generateToken = (user) => {
  return jwt.sign(
    { _id: user._id, name: user.name, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

export const register = async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;

    if (await User.findOne({ email })) {
      return res.status(400).json({ success: false, error: "User already exists" });
    }

    const user = new User({ name, email, password, phone, role }); 

    await user.save();
    const token = generateToken(user);

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "None",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .status(201)
      .json({ success: true, message: "Registration successful", user: { _id: user._id, name: user.name, email: user.email, role: user.role,token} });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};


export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, error: "Email and password are required" });
    }
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({ success: false, error: "Invalid email or password" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, error: "Invalid email or password" });
    }
    const token = generateToken(user);
    res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "None",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json({
        success: true,
        message: "Login successful",
        user: { _id: user._id, name: user.name, email: user.email, role: user.role, token },
      });

  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};


export const getProfile = (req, res) => {
  res.json({ success: true, user: req.user });
};

export const logout = (req, res) => {
  res
    .clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "None",
    })
    .status(200)
    .json({ success: true, message: "Logged out successfully" });
};

export const editProfile = async (req, res) => {
  try {
    const { email, phone } = req.body;
    const userId = req.user._id; 

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    if (email) {
      user.email = email;
    }

    if (phone) {
      user.phone = phone;
    }

    await user.save();

    res.json({
      success: true,
      message: "Profile updated successfully",
      user: { _id: user._id, name: user.name, email: user.email, phone: user.phone },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};


export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ success: false, error: "User not found" });

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(Date.now() + 3600000); 
    await user.save();

    const emailResponse = await sendResetEmail(user.email, resetToken);
    if (!emailResponse.success) return res.status(500).json({ success: false, error: "Failed to send email" });

    res.json({ success: true, message: "Reset link sent to your email" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) return res.status(400).json({ success: false, error: "Invalid or expired token" });

    user.password = await bcrypt.hash(newPassword, 12);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// export const googleAuth = (req, res, next) => {
//   passport.authenticate("google", { failureRedirect: "/login" }, (err, user) => {
//     if (err || !user) {
//       return res.status(400).json({ success: false, error: "Authentication failed" });
//     }

//     const token = jwt.sign(
//       { _id: user._id, name: user.name, email: user.email, role: user.role },
//       process.env.JWT_SECRET,
//       { expiresIn: "7d" }
//     );

//     res.cookie("token", token, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production", 
//       sameSite: "None",
//       maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
//     });

//     res.status(200).json({ success: true, message: "Google login successful", user });
//   })(req, res, next);
// };

// export const facebookAuth = (req, res, next) => {
//   passport.authenticate("facebook", { failureRedirect: "/login" }, (err, user) => {
//     if (err || !user) {
//       return res.status(400).json({ success: false, error: "Authentication failed" });
//     }

//     const token = jwt.sign(
//       { _id: user._id, name: user.name, email: user.email, role: user.role },
//       process.env.JWT_SECRET,
//       { expiresIn: "7d" }
//     );

//     res.cookie("token", token, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "None",
//       maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
//     });

//     res.status(200).json({ success: true, message: "Facebook login successful", user });
//   })(req, res, next);
// };

// export const twitterAuth = (req, res, next) => {
//   passport.authenticate("twitter", { failureRedirect: "/login" }, (err, user) => {
//     if (err || !user) {
//       return res.status(400).json({ success: false, error: "Authentication failed" });
//     }

//     const token = jwt.sign(
//       { _id: user._id, name: user.name, email: user.email, role: user.role },
//       process.env.JWT_SECRET,
//       { expiresIn: "7d" }
//     );

//     res.cookie("token", token, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "None",
//       maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
//     });

//     res.status(200).json({ success: true, message: "Twitter login successful", user });
//   })(req, res, next);
// };

export const changeUserStatusActive = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }
    user.status = "active";
    await user.save();
    res.json({ success: true, message: "User status changed to active" });
  }
  catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const changeUserStatusInactive = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }
    user.status = "suspended";
    await user.save();
    res.json({ success: true, message: "User status changed to inactive" });
  }
  catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}