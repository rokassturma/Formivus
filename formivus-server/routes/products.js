import express from "express";
import db from "../db/db.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();


router.get("/", verifyToken, (req, res) => {
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


router.post("/", verifyToken, (req, res) => {
  const userId = req.user.id;
  const role = req.user.role;

  const isAdmin = role === 'admin' ? 1 : 0;
  const isApproved = role === 'admin' ? 1 : 0;

  const { name, proteins, carbs, fats, calories } = req.body;

  if (!name || !proteins || !carbs || !fats || !calories) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const query = `
    INSERT INTO products (name, proteins, carbs, fats, calories, created_by, is_approved, is_admin)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    query,
    [name, proteins, carbs, fats, calories, userId, isApproved, isAdmin],
    (err) => {
      if (err) return res.status(500).json({ message: "Insert error" });
      return res.status(200).json({ message: "Product submitted" });
    }
  );
});



router.get("/pending", verifyToken, (req, res) => {
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


router.put("/:id/approve", verifyToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: "Unauthorized" });
  }

  const productId = req.params.id;
  const { action } = req.body;

  let isApproved = null;
  if (action === "approve") isApproved = 1;
  else if (action === "reject") isApproved = 2;
  else return res.status(400).json({ message: "Invalid action" });

  const query = `UPDATE products SET is_approved = ? WHERE id = ?`;

  db.query(query, [isApproved, productId], (err) => {
    if (err) return res.status(500).json({ message: "Action error" });
    return res.status(200).json({ message: "Product status updated" });
  });
});



router.delete("/:id", verifyToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: "Unauthorized" });
  }

  const productId = req.params.id;

  const query = `DELETE FROM products WHERE id = ?`;

  db.query(query, [productId], (err) => {
    if (err) return res.status(500).json({ message: "Delete error" });
    return res.status(200).json({ message: "Product deleted" });
  });
});


router.get("/submitted", verifyToken, (req, res) => {
  const userId = req.user.id;

  const query = `
    SELECT * FROM products
    WHERE created_by = ?
    ORDER BY is_approved ASC, name
  `;

  db.query(query, [userId], (err, results) => {
    if (err) return res.status(500).json({ message: "Database error" });
    return res.status(200).json(results);
  });
});

export default router;
