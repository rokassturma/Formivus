import express from "express";
import { login, register } from "../controllers/authController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/login", login);
router.post("/register", register);

router.get("/me", verifyToken, (req, res) => {
  res.status(200).json({ user: req.user });
});

router.post("/logout", (req, res) => {
  res.clearCookie("access_token", {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  });
  res.status(200).json({ message: "Logout successful" });
});

export default router;
