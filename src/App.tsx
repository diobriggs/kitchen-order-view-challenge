import { useState, useEffect } from 'react';

import { getTimeSince } from './utils'
import type { Order } from './types'

function App() {
  // TODO: Build your kitchen order display here
  // Requirements are in the README.md file
  // The 'orders' variable contains all the mock order data
  const [mockOrders, setMockOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const response = await fetch('http://localhost:3001/api/orders');
        const data = await response.json();
        console.log(response)
        setMockOrders(data);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      }
    }

    fetchOrders();
  }, []);

  // Mark as done
  async function handleMarkAsDone(orderId: string): Promise<void> {
    try {
      const response = await fetch(`http://localhost:3001/api/orders/${orderId}`, {
        method: 'PATCH',
      });

      if (!response.ok) {
        throw new Error('Failed to mark order as done');
      }

      setMockOrders((prev) => prev.filter((order: Order) => order.id !== orderId));

      if (selectedOrder?.id === orderId) {
        setSelectedOrder(null);
      }
    } catch (err) {
      console.error(err);
      alert('Could not mark order as done. Please try again.');
    }
  }

  // const handleRemoveOrder = (orderId: string) => {
  //   setMockOrders((prevMockOrders) => prevMockOrders.filter((order) => order.id !== orderId));
  //   if (selectedOrder?.id === orderId) setSelectedOrder(null);
  // };

  return (
    <div className="min-h-screen bg-[#246a73] px-6 py-10">
      <h1 className="text-4xl font-bold text-[#f3dfc1] mb-10">Kitchen Orders</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {mockOrders.map((order) => (
          <div
            key={order.id}
            className="relative bg-white rounded-2xl shadow-lg p-6 transition hover:shadow-2xl cursor-pointer"
            onClick={() => setSelectedOrder(order)}
          >
            <h2 className="text-2xl font-semibold text-gray-800">
              Order #{order.orderNumber}
            </h2>
            <p className="text-lg text-gray-600 mb-20">
              {order.orderType.charAt(0).toUpperCase() + order.orderType.slice(1)} •{' '}
              {getTimeSince(order.createdAt)}
            </p>

            <button
              onClick={() => setSelectedOrder(order)}
              className="absolute top-5 right-5 bg-[#246a73] hover:bg-blue-600 text-white p-2 rounded-full shadow"
              title="View Details"
            >
              🔍
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleMarkAsDone(order.id);
              }}
              className="absolute bottom-5 right-5 bg-green-600 hover:bg-green-700 text-white px-5 py-3 text-lg font-medium rounded-xl shadow"
            >
              Mark as Done
            </button>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {selectedOrder && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setSelectedOrder(null)}
        >
          <div
            className="bg-white w-full max-w-xl rounded-2xl p-8 shadow-xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-3 right-4 text-gray-400 hover:text-gray-600 text-2xl"
              onClick={() => setSelectedOrder(null)}
            >
              &times;
            </button>

            <h2 className="text-3xl font-bold mb-6 text-gray-800">
              🧾 Order #{selectedOrder.orderNumber} Details
            </h2>

            <ul className="space-y-4">
              {selectedOrder.items.map((item, index) => {
                const hasAllergy =
                  item.specialInstructions?.toLowerCase().includes('allergy') ?? false;

                return (
                  <li key={index} className="bg-gray-100 p-4 rounded-xl">
                    <p className="text-xl font-semibold text-gray-800">
                      {item.quantity} × {item.name}
                    </p>

                    {item.modifiers && (
                      <p className="text-gray-600 mt-1">
                        <span className="font-medium">Modifiers:</span>{' '}
                        {item.modifiers.join(', ')}
                      </p>
                    )}

                    {item.specialInstructions && (
                      <p
                        className={`mt-1 text-lg ${
                          hasAllergy ? 'font-bold text-red-600' : 'text-gray-600'
                        }`}
                      >
                        <span className="font-medium">Instructions:</span>{' '}
                        {item.specialInstructions}
                      </p>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default App