import express from "express";
import db from "../db/db.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/products", verifyToken, (req, res) => {
  const query = `
    SELECT * FROM products
    WHERE is_approved = 1
    ORDER BY name
  `;

  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ message: "Database error" });
    return res.status(200).json(results);
  });
});

router.post("/products", verifyToken, (req, res) => {
  const userId = req.user.id;
  const { name, proteins, carbs, fats, calories } = req.body;

  if (!name || !proteins || !carbs || !fats || !calories) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const query = `
    INSERT INTO products (name, proteins, carbs, fats, calories, created_by, is_approved, is_admin)
    VALUES (?, ?, ?, ?, ?, ?, 0, 0)
  `;

  db.query(query, [name, proteins, carbs, fats, calories, userId], (err) => {
    if (err) return res.status(500).json({ message: "Insert error" });
    return res.status(200).json({ message: "Product submitted for review" });
  });
});

router.get("/products/pending", verifyToken, (req, res) => {
  if (!req.user.is_admin) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  const query = `
    SELECT * FROM products
    WHERE is_approved = 0
    ORDER BY name
  `;

  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ message: "Database error" });
    return res.status(200).json(results);
  });
});

router.put("/products/:id/approve", verifyToken, (req, res) => {
  if (!req.user.is_admin) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  const productId = req.params.id;

  const query = `
    UPDATE products
    SET is_approved = 1
    WHERE id = ?
  `;

  db.query(query, [productId], (err) => {
    if (err) return res.status(500).json({ message: "Approval error" });
    return res.status(200).json({ message: "Product approved" });
  });
});

router.delete("/products/:id", verifyToken, (req, res) => {
  if (!req.user.is_admin) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  const productId = req.params.id;

  const query = `DELETE FROM products WHERE id = ?`;

  db.query(query, [productId], (err) => {
    if (err) return res.status(500).json({ message: "Delete error" });
    return res.status(200).json({ message: "Product deleted" });
  });
});

export default router;
