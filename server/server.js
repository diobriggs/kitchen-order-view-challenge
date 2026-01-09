import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const db = new sqlite3.Database('./kitchen.db', (err) => {
  if (err) {
    console.error('Error opening database:', err);
    process.exit(1);
  }
  console.log('Connected to SQLite database');
});

// ====================================
// TODO: Implement your endpoints here
// ====================================

// Example endpoint structure:
// app.get('/api/orders', (req, res) => {
//   // Your code here
// });

const dbAll = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });


  app.get("/api/orders", async (req, res) => {
    try {
      const rows = await dbAll("SELECT * FROM orders;", []);
  
      // (Optional) sequential is safest with sqlite3
      for (const o of rows) {
        const items = await dbAll(
          "SELECT name, quantity, modifiers FROM order_items WHERE orderId = ?",
          [o.id]
        );
  
        o.items = items.map((i) => ({
          ...i,
          modifiers: i.modifiers ? JSON.parse(i.modifiers) : [],
        }));
      }
  
      res.status(200).json({ orders: rows });
    } catch (err) {
      res.status(500).json({ error: err?.message ?? String(err) });
    }
  });
  
  const dbRun = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve({ changes: this.changes, lastID: this.lastID });
    });
  });

  app.put("/api/orders/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
  
      const idNum = Number(id);
      if (!Number.isInteger(idNum) || idNum <= 0) {
        return res.status(400).json({ error: "Order id is required" });
      }
      if (!status) {
        return res.status(400).json({ error: "status is required" });
      }
  
      const result = await dbRun(
        "UPDATE orders SET status = ? WHERE id = ?",
        [status, idNum]
      );
  
      if (result.changes === 0) {
        return res.status(404).json({ error: "Order not found" });
      }
  
      res.status(200).json({ message: "Order status updated successfully" });
    } catch (err) {
      res.status(500).json({ error: err?.message ?? String(err) });
    }
  });
  
// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('\nYour tasks:');
  console.log('1. Implement GET /api/orders endpoint');
  console.log('2. Implement PATCH /api/orders/:id endpoint');
  console.log('3. Create a service layer in the frontend');
  console.log('4. Update React components to use the API');
});

// Graceful shutdown
process.on('SIGINT', () => {
  db.close(() => {
    console.log('\nDatabase connection closed');
    process.exit(0);
  });
});