import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { adminDb } from "./server/firebaseAdmin.js";

// Routes
import authRoutes from "./server/routes/authRoutes.js";
import productRoutes from "./server/routes/productRoutes.js";
import orderRoutes from "./server/routes/orderRoutes.js";
import userRoutes from "./server/routes/userRoutes.js";
import blogRoutes from "./server/routes/blogRoutes.js";
import settingsRoutes from "./server/routes/settingsRoutes.js";
import uploadRoutes from "./server/routes/uploadRoutes.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Serve uploaded files
  app.use("/uploads", express.static(path.join(process.cwd(), "public/uploads")));

  // API Routes
  app.use("/api/auth", authRoutes);
  app.use("/api/products", productRoutes);
  app.use("/api/orders", orderRoutes);
  app.use("/api/user", userRoutes);
  app.use("/api/blogs", blogRoutes);
  app.use("/api/settings", settingsRoutes);
  app.use("/api/upload", uploadRoutes);

  // Stats Route (Admin)
  app.get("/api/admin/stats", async (req, res) => {
    try {
      const ordersSnapshot = await adminDb.collection('orders').get();
      const productsSnapshot = await adminDb.collection('products').get();
      
      const orders = ordersSnapshot.docs.map(doc => doc.data());
      const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
      const productCount = productsSnapshot.size;
      
      res.json({
        totalRevenue,
        orderCount: orders.length,
        productCount,
        recentOrders: orders.slice(-5).reverse()
      });
    } catch (error) {
      console.error('Stats error:', error);
      res.status(500).json({ error: "Failed to fetch stats" });
    }
  });

  // Users Route (Admin)
  app.get("/api/admin/users", async (req, res) => {
    try {
      const snapshot = await adminDb.collection('users').get();
      const users = snapshot.docs.map(doc => {
        const data = doc.data();
        delete data.password;
        return { id: doc.id, ...data };
      });
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch users" });
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
