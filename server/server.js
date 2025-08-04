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
app.get('/api/orders', (req, res) => {
  db.all(`SELECT * FROM orders`, (err, orders) => {
    if (err) {
      res.status(500).json({ error: 'Failed to fetch orders' });
      return;
    }
    // For each order, get its items
    let pending = orders.length;
    if (pending === 0) return res.json([]);
    const fullOrders = [];
    orders.forEach(order => {
      db.all(`SELECT * FROM order_items WHERE orderId = ?`, [order.id], (err, items) => {
        if (err) {
          res.status(500).json({ error: 'Failed to fetch order items' });
          return;
        }
        fullOrders.push({
          ...order,
          items: items.map(item => ({
            ...item,
            modifiers: item.modifiers ? JSON.parse(item.modifiers) : [],
          }))
        });
        pending--;
        if (pending === 0) {
          res.json(fullOrders);
        }
      });
    });
  });
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