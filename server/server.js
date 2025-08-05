import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';

import { getAllOrders } from './helper.js';

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
app.get('/api/orders', async (req, res) => {
  // Your code here
  try {
    const orders = await getAllOrders();
    res.status(200).json(orders);
  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

app.patch('/api/orders/:id', (req, res) => {
  const orderId = req.params.id;

  const sql = `UPDATE orders SET status = 'done' WHERE id = ?`;

  db.run(sql, [orderId], function (err) {
    if (err) {
      console.error('Error updating order status:', err);
      return res.status(500).json({ error: 'Failed to update order status' });
    }

    if (this.changes === 0) {
      // No rows updated = no matching order
      return res.status(404).json({ error: 'Order not found' });
    }

    res.status(200).json({ message: 'Order marked as done', orderId });
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