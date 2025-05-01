import mysql from "mysql2";

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "formivus_managing_system"
});

db.connect((err) => {
    if (err) {
        console.log("Error while connecting:", err.message);
    } else {
        console.log("Successfully connected to MySQL");
    }
});

export default db;