import { useState, useEffect } from 'react'
import type { Order } from './types'
import { OrderCard } from './components/OrderCard'
import { fetchOrders, updateOrderStatus } from './services/api'

function App() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadOrders()
  }, [])

  const loadOrders = async () => {
    try {
      setLoading(true)
      const data = await fetchOrders()
      setOrders(data)
      setError(null)
    } catch (err) {
      setError('Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (orderId: string, newStatus: Order['status']) => {
    try {
      await updateOrderStatus(orderId, newStatus)
      setOrders(prev =>
        prev.map(order =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      )
    } catch (err) {
      setError('Failed to update order status')
    }
  }

  const pendingOrders = orders.filter(o => o.status === 'pending')
  const preparingOrders = orders.filter(o => o.status === 'preparing')
  const readyOrders = orders.filter(o => o.status === 'ready')

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-2xl text-gray-600">Loading orders...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl text-red-600 mb-4">{error}</p>
          <button
            onClick={loadOrders}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg text-xl"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-4xl font-bold mb-6 text-center">Kitchen Order Display</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div>
          <h2 className="text-2xl font-bold mb-4 text-yellow-600">
            New Orders ({pendingOrders.length})
          </h2>
          <div className="space-y-4">
            {pendingOrders.map(order => (
              <OrderCard
                key={order.id}
                order={order}
                onStatusUpdate={handleStatusUpdate}
              />
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4 text-blue-600">
            In Progress ({preparingOrders.length})
          </h2>
          <div className="space-y-4">
            {preparingOrders.map(order => (
              <OrderCard
                key={order.id}
                order={order}
                onStatusUpdate={handleStatusUpdate}
              />
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4 text-green-600">
            Ready ({readyOrders.length})
          </h2>
          <div className="space-y-4">
            {readyOrders.map(order => (
              <OrderCard
                key={order.id}
                order={order}
                onStatusUpdate={handleStatusUpdate}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
