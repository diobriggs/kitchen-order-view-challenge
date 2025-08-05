import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';

const app = express();
const PORT = 3002;

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
// API ENDPOINTS
// ====================================

// GET /api/orders - Fetch all orders with their items
app.get('/api/orders', (req, res) => {
  const query = `
    SELECT 
      o.id,
      o.orderNumber,
      o.orderType,
      o.status,
      o.customerName,
      o.tableNumber,
      o.createdAt,
      oi.name as itemName,
      oi.quantity,
      oi.modifiers,
      oi.specialInstructions
    FROM orders o
    LEFT JOIN order_items oi ON o.id = oi.orderId
    ORDER BY o.createdAt DESC, oi.id ASC
  `;

  db.all(query, [], (err, rows) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Failed to fetch orders' });
    }

    // Group the results by order
    const ordersMap = new Map();
    
    rows.forEach(row => {
      if (!ordersMap.has(row.id)) {
        ordersMap.set(row.id, {
          id: row.id,
          orderNumber: row.orderNumber,
          orderType: row.orderType,
          status: row.status,
          customerName: row.customerName,
          tableNumber: row.tableNumber,
          createdAt: row.createdAt,
          items: []
        });
      }
      
      // Add item if it exists
      if (row.itemName) {
        const order = ordersMap.get(row.id);
        order.items.push({
          name: row.itemName,
          quantity: row.quantity,
          modifiers: row.modifiers ? JSON.parse(row.modifiers) : undefined,
          specialInstructions: row.specialInstructions || undefined
        });
      }
    });

    const orders = Array.from(ordersMap.values());
    res.json(orders);
  });
});

// PATCH /api/orders/:id - Update order status
app.patch('/api/orders/:id', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  // Validate status
  const validStatuses = ['pending', 'preparing', 'ready'];
  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({ 
      error: 'Invalid status. Must be one of: pending, preparing, ready' 
    });
  }

  const query = 'UPDATE orders SET status = ? WHERE id = ?';
  
  db.run(query, [status, id], function(err) {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Failed to update order status' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({ 
      message: 'Order status updated successfully',
      orderId: id,
      status: status
    });
  });
});

// DELETE /api/orders/:id - Delete a completed order
app.delete('/api/orders/:id', (req, res) => {
  const { id } = req.params;

  const query = 'DELETE FROM orders WHERE id = ?';
  
  db.run(query, [id], function(err) {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Failed to delete order' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({ 
      message: 'Order deleted successfully',
      orderId: id
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