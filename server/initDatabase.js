import sqlite3 from 'sqlite3';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create/connect to database
const db = new sqlite3.Database('./kitchen.db', (err) => {
  if (err) {
    console.error('Error opening database:', err);
    process.exit(1);
  }
  console.log('Connected to SQLite database');
});

// Create tables
db.serialize(() => {
  // Create orders table
  db.run(`
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      orderNumber TEXT NOT NULL,
      orderType TEXT NOT NULL CHECK(orderType IN ('dine-in', 'takeout', 'delivery')),
      status TEXT NOT NULL CHECK(status IN ('pending', 'preparing', 'ready')),
      customerName TEXT,
      tableNumber TEXT,
      createdAt TEXT NOT NULL
    )
  `, (err) => {
    if (err) console.error('Error creating orders table:', err);
    else console.log('✓ Orders table created');
  });

  // Create order_items table
  db.run(`
    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      orderId TEXT NOT NULL,
      name TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      modifiers TEXT,
      specialInstructions TEXT,
      FOREIGN KEY (orderId) REFERENCES orders(id) ON DELETE CASCADE
    )
  `, (err) => {
    if (err) console.error('Error creating order_items table:', err);
    else console.log('✓ Order items table created');
  });

  // Insert sample data (from mockData)
  const mockDataPath = join(__dirname, '..', 'src', 'mockData.ts');
  const mockDataContent = readFileSync(mockDataPath, 'utf-8');
  
  // Parse the orders (basic parsing - in real scenario you'd import properly)
  const ordersMatch = mockDataContent.match(/export const orders: Order\[\] = (\[[\s\S]*\])/);
  if (ordersMatch) {
    try {
      // Clean up TypeScript syntax for eval
      let ordersString = ordersMatch[1]
        .replace(/as const/g, '')
        .replace(/Order\[\]/g, '')
        .replace(/new Date\(/g, 'new Date(')
        .replace(/\.toISOString\(\)/g, '.toISOString()');
      
      const orders = eval(ordersString);
      
      console.log(`\nInserting ${orders.length} sample orders...`);
      
      orders.forEach(order => {
        // Insert order
        db.run(`
          INSERT OR IGNORE INTO orders (id, orderNumber, orderType, status, customerName, tableNumber, createdAt)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [
          order.id,
          order.orderNumber,
          order.orderType,
          'preparing', // All orders start as preparing for Phase 2
          order.customerName || null,
          order.tableNumber || null,
          order.createdAt
        ], function(err) {
          if (err) {
            console.error('Error inserting order:', err);
          } else if (this.changes > 0) {
            // Insert order items
            order.items.forEach(item => {
              db.run(`
                INSERT INTO order_items (orderId, name, quantity, modifiers, specialInstructions)
                VALUES (?, ?, ?, ?, ?)
              `, [
                order.id,
                item.name,
                item.quantity,
                item.modifiers ? JSON.stringify(item.modifiers) : null,
                item.specialInstructions || null
              ]);
            });
          }
        });
      });
      
      console.log('✓ Sample data inserted\n');
    } catch (e) {
      console.error('Error parsing mock data:', e);
    }
  }
});

// Close database after operations complete
setTimeout(() => {
  db.close((err) => {
    if (err) console.error(err.message);
    console.log('Database initialization complete!');
    console.log('\nNext steps for candidates:');
    console.log('1. Install Express: npm install express cors');
    console.log('2. Create server.js with your API endpoints');
    console.log('3. Update the frontend to use your API');
  });
}, 1000);