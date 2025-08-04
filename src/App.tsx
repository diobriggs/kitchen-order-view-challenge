import { useState } from 'react';
import { orders as initialOrders } from './mockData';
import './App.css';


function getMinutesAgo(dateString: string) {
  const now = Date.now();
  const orderTime = new Date(dateString).getTime();
  const diffMs = now - orderTime;
  const diffMin = Math.floor(diffMs / 60000);
  return diffMin;
}

function App() {
  const [orders, setOrders] = useState(initialOrders);

  const setOrderReady = (orderId: string) => {
    setOrders(prev => prev.map(order =>
      order.id === orderId ? { ...order, status: 'ready' } : order
    ));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-6">Kitchen Orders</h1>
      <div>
        <ul>
          {orders.filter(order => order.status !== 'ready').map(order => (
            <li key={order.id} className="mb-4 p-4 bg-white rounded shadow">
              <strong>Order #{order.orderNumber}</strong> ({order.orderType})<br />
              {order.tableNumber && <span>Table: {order.tableNumber} | </span>}
              {order.customerName && <span>Customer: {order.customerName} | </span>}
              Status: <span className="font-semibold">{order.status}</span><br />
              <span>Placed: {getMinutesAgo(order.createdAt)} min ago</span>
              <ul className="mt-2 ml-4">
                {order.items.map((item, idx) => (
                  <li key={idx}>
                    {item.quantity}x {item.name}
                    {item.modifiers && item.modifiers.length > 0 && (
                      <span
                        className={item.modifiers.some(mod => mod.toUpperCase().includes('ALLERGY')) ? 'allergy' : ''}
                      >
                        [Modifiers: {item.modifiers.join(', ')}]
                      </span>
                    )}
                    {item.specialInstructions && (
                      <span className={item.specialInstructions.toUpperCase().includes('ALLERGY') ? 'allergy' : ''}>
                        | <em>{item.specialInstructions}</em>
                      </span>
                    )}
                  </li>
                ))}
              </ul>
              <button className="readyOrder" onClick={() => setOrderReady(order.id)}>
                Mark Order Ready
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;