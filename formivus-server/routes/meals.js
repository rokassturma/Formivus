import express from "express";
import db from "../db/db.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/meals", verifyToken, (req, res) => {
  const userId = req.user.id;

  const query = `
  SELECT id, meal_number, date, name
  FROM meals
  WHERE user_id = ? AND DATE(date) = DATE(NOW())
  ORDER BY meal_number ASC
`;

  db.query(query, [userId], (err, results) => {
    if (err) return res.status(500).json({ message: "Database error" });
    return res.status(200).json(results);
  });
});


router.post("/meals", verifyToken, (req, res) => {
  const userId = req.user.id;

  const getMaxQuery = `
    SELECT MAX(meal_number) AS maxMeal
    FROM meals
    WHERE user_id = ? AND DATE(date) = DATE(NOW())
  `;

  db.query(getMaxQuery, [userId], (err, results) => {
    if (err) return res.status(500).json({ message: "DB error" });

    const newMealNumber = (results[0].maxMeal || 0) + 1;

    const insertQuery = `
      INSERT INTO meals (user_id, date, meal_number)
      VALUES (?, NOW(), ?)
    `;

    db.query(insertQuery, [userId, newMealNumber], (err, result) => {
      if (err) return res.status(500).json({ message: "Insert failed" });
      return res.status(200).json({ message: "Meal created" });
    });
  });
});

router.put("/meals/:id", verifyToken, (req, res) => {
  const userId = req.user.id;
  const mealId = req.params.id;
  const { name } = req.body;

  const query = `UPDATE meals SET name = ? WHERE id = ? AND user_id = ?`;

  db.query(query, [name, mealId, userId], (err, result) => {
    if (err) return res.status(500).json({ message: "Update failed" });
    return res.status(200).json({ message: "Meal name updated" });
  });
});


router.delete("/meals/:id", verifyToken, (req, res) => {
  const userId = req.user.id;
  const mealId = req.params.id;

  const deleteItemsQuery = `
        DELETE FROM meal_items
        WHERE meal_id = ?
        AND meal_id IN (
            SELECT id FROM meals WHERE user_id = ?
        )
    `;

  db.query(deleteItemsQuery, [mealId, userId], (err) => {
    if (err) return res.status(500).json({ message: "Failed to delete meal items" });

    const deleteMealQuery = `
            DELETE FROM meals
            WHERE id = ? AND user_id = ?
        `;

    db.query(deleteMealQuery, [mealId, userId], (err) => {
      if (err) return res.status(500).json({ message: "Failed to delete meal" });
      return res.status(200).json({ message: "Meal deleted" });
    });
  });
});


export default router;

