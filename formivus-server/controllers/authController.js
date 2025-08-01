import db from "../db/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = (req, res) => {
  const { email, username, password } = req.body;

  const checkQuery = `
    SELECT * 
    FROM users 
    WHERE email = ? OR username = ?
    `;

  db.query(checkQuery, [email, username], (err, data) => {
    if (err) return res.status(500).json({ message: "Server error" });
    if (data.length) {
      if (data.some((user) => user.email === email)) {
        return res.status(400).json({ message: "Email is already taken" });
      }

      if (data.some((user) => user.username === username)) {
        return res.status(400).json({ message: "Username is already taken" });
      }
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const insertQuery = `
        INSERT INTO users
        (email, username, password)
        VALUES
        (?, ?, ?)
        `;
    const values = [email, username, hashedPassword];

    db.query(insertQuery, values, (err, result) => {
      if (err)
        return res
          .status(500)
          .json({ message: "Something went wrong with registration" });

      return res.status(201).json({ message: "Registration is successful" });
    });
  });
};

export const login = (req, res) => {
  const { email, password } = req.body;

  const q = `
    SELECT * 
    FROM users 
    WHERE email = ?
    `;

  db.query(q, [email], (err, data) => {
    if (err) return res.status(500).json({ message: "Server error" });
    if (data.length === 0)
      return res.status(404).json({ message: "User is not found" });

    const user = data[0];

    const isPasswordCorrect = bcrypt.compareSync(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Password is incorrect" });
    }

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
        username: user.username,
        email: user.email,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1d" }
    );

    res
      .cookie("access_token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json({
        message: "Login is successful",
        user: { id: user.id, role: user.role, email: user.email },
      });
  });
};
