import bcrypt from "bcrypt";
import db from "../config/database.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import dotenv from "dotenv";
dotenv.config();

const signup = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const get_userdetails_sql =
      "SELECT COUNT(id) AS count FROM user_details WHERE name = ? AND email = ?";

    const [response] = await db.query(get_userdetails_sql, [name, email]);

    if (response[0].count > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    const insert_user_sql =
      "INSERT INTO user_details (name, email, password) VALUES (?, ?, ?)";

    const [result] = await db.query(insert_user_sql, [
      name,
      email,
      hashedPassword,
    ]);
    return res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Error:", error);

    if (error.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Handle generic server errors
    return res.status(500).json({ message: "Server error" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user_sql = "SELECT * FROM user_details WHERE email = ?";
    const [response] = await db.query(user_sql, [email]);

    if (response[0].count === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = response[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: "Invalid password" });
    }

    const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
    const JWT_REFRESH_KEY = process.env.JWT_REFRESH_KEY;

    const userName = user.name;

    if (!JWT_SECRET_KEY) {
      return res.status(500).json({ error: "JWT secret is missing" });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      JWT_SECRET_KEY,
      { expiresIn: "1h" }
    );

    // //Generate refresh token
    // const refreshToken = jwt.sign(
    //   { id: user.id, email: user.email },
    //   JWT_REFRESH_KEY,
    //   { expiresIn: "7d" }
    // );

    // res.cookie("refreshToken", refreshToken, {
    //   httpOnly: true,
    //   secure: false,
    //   sameSite: "strict",
    //   maxAge: 7 * 24 * 60 * 60 * 1000, //7 days
    // });

    return res
      .status(200)
      .json({ message: "Login successful", token, userName });
  } catch (err) {
    console.error("Error in login:", err);
    res.status(500).json({ error: "Error in loggin" });
  }
};

const generateRefreshToken = (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    const JWT_REFRESH_KEY = process.env.JWT_REFRESH_KEY;
    const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

    if (!refreshToken) {
      return res.status(401).json({ message: "No refresh token provided" });
    }

    jwt.verify(refreshToken, JWT_REFRESH_KEY, (err, user) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          return res
            .status(401)
            .json({ message: "Refresh token expired. Please log in again." });
        }

        return res
          .status(401)
          .json({ message: "Invalid refresh token: " + err.message });
      }

      const newAccessToken = jwt.sign(
        { id: user.id, email: user.email },
        JWT_SECRET_KEY,
        { expiresIn: "1h" }
      );

      return res
        .status(200)
        .json({ message: "New access token generated", newAccessToken });
    });
  } catch (error) {
    console.error(error);
    return res
      .status(401)
      .json({ message: "Invalid refresh token: " + error.message });
  }
};

const logout = (req, res) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    sameSite: "strict",
    secure: false,
  });

  res.status(200).json({ message: "Logged out successfully" });
};

export default {
  signup,
  login,
  generateRefreshToken,
  logout,
};
