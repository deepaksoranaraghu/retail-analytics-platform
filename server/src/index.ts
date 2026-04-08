import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { pool } from "./db";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
    res.send("Retail Analytics API is running");
});

app.get("/api/test-db", async (_req, res) => {
    try {
        const result = await pool.query("SELECT NOW() as current_time");
        res.json({
            success: true,
            message: "Database connected successfully",
            time: result.rows[0].current_time,
        });
    } catch (error) {
        console.error("DB connection error:", error);
        res.status(500).json({
            success: false,
            message: "Database connection failed",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
});
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});