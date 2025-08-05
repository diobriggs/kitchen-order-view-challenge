import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

// Helper function to get all orders with items
export async function getAllOrders() {
  const db = await open({
    filename: './kitchen.db',
    driver: sqlite3.Database
  });

  const rows = await db.all(`
    SELECT 
        o.id AS order_id,
        o.orderNumber,
        o.orderType,
        o.status,
        o.customerName,
        o.tableNumber,
        o.createdAt,
        i.id AS item_id,
        i.name AS item_name,
        i.quantity,
        i.modifiers,
        i.specialInstructions
    FROM orders o
    LEFT JOIN order_items i ON o.id = i.orderId
    WHERE o.status != 'done'
    ORDER BY o.createdAt DESC, i.id ASC
  `);


  const ordersMap = {};

  for (const row of rows) {
    const orderId = row.order_id;

    if (!ordersMap[orderId]) {
      ordersMap[orderId] = {
        id: orderId,
        orderNumber: row.orderNumber,
        orderType: row.orderType,
        status: row.status,
        customerName: row.customerName,
        tableNumber: row.tableNumber,
        createdAt: row.createdAt,
        items: []
      };
    }

    if (row.item_id !== null) {
      ordersMap[orderId].items.push({
        id: row.item_id,
        name: row.item_name,
        quantity: row.quantity,
        modifiers: row.modifiers ? JSON.parse(row.modifiers) : null,
        specialInstructions: row.specialInstructions
      });
    }
  }

  await db.close();
  return Object.values(ordersMap);
}
