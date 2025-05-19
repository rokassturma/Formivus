import express from "express";
import db from "../db/db.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/meal-items", verifyToken, (req, res) => {
  const userId = req.user.id;

  const query = `
    SELECT mi.id, mi.meal_id, mi.amount, mi.proteins, mi.carbs, mi.fats, mi.calories, mi.created_at AS date, p.name AS product_name
    FROM meal_items mi
    JOIN meals m ON mi.meal_id = m.id
    JOIN products p ON mi.product_id = p.id
    WHERE m.user_id = ? AND DATE(m.date) = DATE(NOW())
    ORDER BY mi.created_at DESC
  `;

  db.query(query, [userId], (err, data) => {
    if (err) return res.status(500).json({ message: "Database error" });
    return res.status(200).json(data);
  });
});

router.post("/meal-items", verifyToken, (req, res) => {
    const userId = req.user.id;
    const { product_id, amount, meal_id } = req.body;

    if (!product_id || !amount || !meal_id) {
        return res.status(400).json({ message: "Missing data" });
    }

    const productQuery = `SELECT * FROM products WHERE id = ?`;

    db.query(productQuery, [product_id], (err, results) => {
        if (err || !results.length) {
            return res.status(400).json({ message: "Product not found" });
        }

        const product = results[0];
        const factor = Number(amount) / 100;

        const proteins = (product.proteins * factor).toFixed(2);
        const carbs = (product.carbs * factor).toFixed(2);
        const fats = (product.fats * factor).toFixed(2);
        const calories = (product.calories * factor).toFixed(2);

        const insertItemQuery = `
      INSERT INTO meal_items (meal_id, product_id, amount, proteins, carbs, fats, calories, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
    `;

        db.query(insertItemQuery, [
            meal_id,
            product_id,
            amount,
            proteins,
            carbs,
            fats,
            calories
        ], (err) => {
            if (err) {
                console.error("Insert error:", err);
                return res.status(500).json({ message: "Insert error", error: err });
            }

            return res.status(200).json({ message: "Meal item saved" });
        });
    });
});


router.delete("/meal-items/:id", verifyToken, (req, res) => {
    const id = req.params.id;

    const query = `DELETE FROM meal_items WHERE id = ?`;

    db.query(query, [id], (err) => {
        if (err) return res.status(500).json({ message: "Delete error" });
        return res.status(200).json({ message: "Meal item deleted" });
    });
});

export default router;
