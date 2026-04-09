import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import { pool } from "./db";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

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
    });
  }
});

app.get("/api/kpis", async (_req, res) => {
  try {
    const totalRevenueResult = await pool.query(`
      SELECT COALESCE(SUM(quantity * price), 0) AS total_revenue
      FROM sales
    `);

    const totalOrdersResult = await pool.query(`
      SELECT COUNT(*) AS total_orders
      FROM sales
    `);

    const topProductsResult = await pool.query(`
      SELECT product_name, SUM(quantity) AS total_quantity
      FROM sales
      GROUP BY product_name
      ORDER BY total_quantity DESC
      LIMIT 5
    `);

    res.json({
      totalRevenue: totalRevenueResult.rows[0].total_revenue,
      totalOrders: totalOrdersResult.rows[0].total_orders,
      topProducts: topProductsResult.rows,
    });
  } catch (error) {
    console.error("KPI error:", error);
    res.status(500).json({ error: "Failed to fetch KPIs" });
  }
});

app.get("/api/sales-by-category", async (_req, res) => {
  try {
    const result = await pool.query(`
      SELECT category, SUM(quantity * price) AS revenue
      FROM sales
      GROUP BY category
      ORDER BY revenue DESC
    `);

    res.json(result.rows);
  } catch (error) {
    console.error("Category sales error:", error);
    res.status(500).json({ error: "Failed to fetch category sales" });
  }
});

app.get("/api/recent-orders", async (_req, res) => {
  try {
    const result = await pool.query(`
      SELECT *
      FROM sales
      ORDER BY order_date DESC
      LIMIT 10
    `);

    res.json(result.rows);
  } catch (error) {
    console.error("Recent orders error:", error);
    res.status(500).json({ error: "Failed to fetch recent orders" });
  }
});

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);
});

setInterval(() => {
  const fakeOrder = {
    id: Date.now(),
    order_id: `LIVE-${Math.floor(Math.random() * 10000)}`,
    product_name: "Live Product",
    category: "Electronics",
    quantity: Math.floor(Math.random() * 5) + 1,
    price: (Math.random() * 500 + 20).toFixed(2),
    region: ["East", "West", "North", "South"][
      Math.floor(Math.random() * 4)
    ],
    order_date: new Date().toISOString(),
  };

  io.emit("new_order", fakeOrder);
}, 10000);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});