import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

/*
// MongoDB Integration (Uncomment in VS Code)
// import { connectDB } from "./server/db.ts";
// import { User } from "./server/models/User.ts";
// import { Product } from "./server/models/Product.ts";
// import { Order } from "./server/models/Order.ts";

// connectDB();
*/

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  // connectDB(); // Uncomment in VS Code to connect to MongoDB

  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Mock Database State
  const db = {
    products: [
      {
        id: "1",
        name: "Silk Slip Dress",
        price: 198,
        category: "Dresses",
        image: "https://picsum.photos/seed/dress1/800/1000",
        description: "A timeless silhouette crafted from 100% mulberry silk.",
        variants: [
          { size: "XS", stock: 5 },
          { size: "S", stock: 12 },
          { size: "M", stock: 8 },
        ],
        rating: 4.8,
        reviews: 124
      },
      {
        id: "2",
        name: "Cashmere Crewneck",
        price: 150,
        category: "Knitwear",
        image: "https://picsum.photos/seed/knit1/800/1000",
        description: "Grade-A cashmere that gets softer with every wear.",
        variants: [
          { size: "S", stock: 20 },
          { size: "M", stock: 15 },
          { size: "L", stock: 10 },
        ],
        rating: 4.9,
        reviews: 89
      },
      {
        id: "3",
        name: "Italian Leather Tote",
        price: 275,
        category: "Accessories",
        image: "https://picsum.photos/seed/bag1/800/1000",
        description: "Handcrafted in Florence using premium pebbled leather.",
        variants: [
          { color: "Black", stock: 15 },
          { color: "Cognac", stock: 7 },
        ],
        rating: 4.7,
        reviews: 56
      },
      {
        id: "4",
        name: "High-Waist Flare Jean",
        price: 118,
        category: "Denim",
        image: "https://picsum.photos/seed/denim1/800/1000",
        description: "Vintage-inspired fit with a modern stretch.",
        variants: [
          { size: "24", stock: 4 },
          { size: "26", stock: 9 },
          { size: "28", stock: 11 },
        ],
        rating: 4.5,
        reviews: 210
      }
    ],
    categories: ["Dresses", "Knitwear", "Accessories", "Denim", "Outerwear"],
    orders: [],
    users: [
      { id: "1", email: "admin@luxe.com", password: "password123", role: "admin", name: "Admin User", addresses: [], payments: [] },
      { id: "2", email: "user@luxe.com", password: "password123", role: "user", name: "John Doe", addresses: [], payments: [] }
    ]
  };

  // Auth Routes
  app.post("/api/auth/register", (req, res) => {
    const { email, password, name } = req.body;
    if (db.users.find(u => u.email === email)) {
      return res.status(400).json({ error: "User already exists" });
    }
    const newUser = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      password, // In a real app, hash this!
      name,
      role: "user",
      addresses: [],
      payments: []
    };
    db.users.push(newUser as any);
    const { password: _, ...userWithoutPassword } = newUser;
    res.status(201).json(userWithoutPassword);
  });

  // User Profile Routes
  app.get("/api/user/addresses/:userId", (req, res) => {
    const user = db.users.find(u => u.id === req.params.userId);
    res.json(user?.addresses || []);
  });

  app.post("/api/user/addresses/:userId", (req, res) => {
    const user = db.users.find(u => u.id === req.params.userId);
    if (user) {
      const newAddress = { id: Math.random().toString(36).substr(2, 9), ...req.body };
      user.addresses.push(newAddress);
      return res.status(201).json(newAddress);
    }
    res.status(404).json({ error: "User not found" });
  });

  app.delete("/api/user/addresses/:userId/:addressId", (req, res) => {
    const user = db.users.find(u => u.id === req.params.userId);
    if (user) {
      user.addresses = user.addresses.filter(a => a.id !== req.params.addressId);
      return res.status(204).send();
    }
    res.status(404).json({ error: "User not found" });
  });

  app.get("/api/user/payments/:userId", (req, res) => {
    const user = db.users.find(u => u.id === req.params.userId);
    res.json(user?.payments || []);
  });

  app.post("/api/user/payments/:userId", (req, res) => {
    const user = db.users.find(u => u.id === req.params.userId);
    if (user) {
      const newPayment = { id: Math.random().toString(36).substr(2, 9), ...req.body };
      user.payments.push(newPayment);
      return res.status(201).json(newPayment);
    }
    res.status(404).json({ error: "User not found" });
  });

  app.delete("/api/user/payments/:userId/:paymentId", (req, res) => {
    const user = db.users.find(u => u.id === req.params.userId);
    if (user) {
      user.payments = user.payments.filter(p => p.id !== req.params.paymentId);
      return res.status(204).send();
    }
    res.status(404).json({ error: "User not found" });
  });

  app.put("/api/user/settings/:userId", (req, res) => {
    const user = db.users.find(u => u.id === req.params.userId);
    if (user) {
      const { name, email, password } = req.body;
      if (name) user.name = name;
      if (email) user.email = email;
      if (password) user.password = password;
      const { password: _, ...userWithoutPassword } = user;
      return res.json(userWithoutPassword);
    }
    res.status(404).json({ error: "User not found" });
  });

  app.post("/api/auth/login", (req, res) => {
    const { email, password } = req.body;
    const user = db.users.find(u => u.email === email && u.password === password);
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const { password: _, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  });

  // API Routes
  app.get("/api/products", (req, res) => {
    res.json(db.products);
  });

  app.get("/api/categories", (req, res) => {
    res.json(db.categories);
  });

  app.post("/api/products", (req, res) => {
    const { name, price, category, description, image, variants } = req.body;
    const newProduct = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      price: Number(price),
      category,
      description,
      image,
      variants,
      rating: 5,
      reviews: 0
    };
    db.products.push(newProduct as any);
    res.status(201).json(newProduct);
  });

  app.delete("/api/products/:id", (req, res) => {
    const { id } = req.params;
    const index = db.products.findIndex(p => p.id === id);
    if (index !== -1) {
      db.products.splice(index, 1);
      return res.status(204).send();
    }
    res.status(404).json({ error: "Product not found" });
  });

  app.put("/api/products/:id", (req, res) => {
    const { id } = req.params;
    const index = db.products.findIndex(p => p.id === id);
    if (index !== -1) {
      db.products[index] = { ...db.products[index], ...req.body };
      return res.json(db.products[index]);
    }
    res.status(404).json({ error: "Product not found" });
  });

  app.post("/api/orders", (req, res) => {
    const order = {
      id: `ORD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      ...req.body,
      status: "Pending",
      createdAt: new Date().toISOString()
    };
    db.orders.push(order);
    res.status(201).json(order);
  });

  app.get("/api/orders/:userId", (req, res) => {
    const userOrders = db.orders.filter(o => o.userId === req.params.userId);
    res.json(userOrders);
  });

  app.get("/api/admin/users", (req, res) => {
    const usersWithoutPasswords = db.users.map(({ password, ...user }) => user);
    res.json(usersWithoutPasswords);
  });

  app.get("/api/admin/stats", (req, res) => {
    const totalRevenue = db.orders.reduce((sum, order) => sum + order.total, 0);
    res.json({
      totalRevenue,
      orderCount: db.orders.length,
      productCount: db.products.length,
      recentOrders: db.orders.slice(-5).reverse()
    });
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
