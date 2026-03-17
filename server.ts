import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { connectDB } from "./server/db.js";

// Routes
import authRoutes from "./server/routes/authRoutes.js";
import productRoutes from "./server/routes/productRoutes.js";
import orderRoutes from "./server/routes/orderRoutes.js";
import userRoutes from "./server/routes/userRoutes.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  // Connect to MongoDB
  await connectDB();

  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.use("/api/auth", authRoutes);
  app.use("/api/products", productRoutes);
  app.use("/api/orders", orderRoutes);
  app.use("/api/user", userRoutes);

  // Stats Route (Admin)
  app.get("/api/admin/stats", async (req, res) => {
    try {
      const { Product } = await import("./server/models/Product.js");
      const { Order } = await import("./server/models/Order.js");
      
      const orders = await Order.find();
      const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
      const productCount = await Product.countDocuments();
      
      res.json({
        totalRevenue,
        orderCount: orders.length,
        productCount,
        recentOrders: orders.slice(-5).reverse()
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch stats" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
