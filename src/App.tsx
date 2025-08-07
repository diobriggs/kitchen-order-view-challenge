import { useState, useEffect } from 'react'
import { getStatusColor, getTimeSince } from './utils'
import type { Order, OrderItem } from './types'

function getOrderTypeEmoji(orderType: Order['orderType']): string {
  const emojis = {
    'dine-in': '🍽️',
    'takeout': '📦',
    'delivery': '🚚'
  }
  return emojis[orderType] || '❓'
}

function OrderItemDisplay({ item }: { item: OrderItem }) {
  const isAllergy = item.specialInstructions?.toUpperCase().includes('ALLERGY')
  
  return (
    <div className="mb-4">
      <div className="flex items-center gap-3">
        <span className="text-2xl opacity-90">x{item.quantity}</span>
        <span className="font-semibold text-2xl">{item.name}</span>
        
      </div>
      
      {item.modifiers && item.modifiers.length > 0 && (
        <div className="ml-8 mt-2">
          {item.modifiers.map((modifier, index) => (
            <div key={index} className="flex items-center gap-3">
              <span className="text-xl">◦</span>
              <span className="text-xl">{modifier}</span>
            </div>
          ))}
        </div>
      )}
      
      {item.specialInstructions && (
        <div className="ml-8 mt-3">
          {isAllergy ? (
            <div className="bg-white text-red-600 px-3 py-2 rounded text-xl font-bold">
              ‼️ {item.specialInstructions}
            </div>
          ) : (
            <div className="bg-white text-black px-3 py-2 rounded text-lg">
              {item.specialInstructions}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function OrderCard({ order, onMarkReady }: { order: Order; onMarkReady: (orderId: string) => void }) {
  return (
    <div className={`relative rounded-lg p-6 shadow-lg ${getStatusColor(order.status)} bg-opacity-85 text-white`}>
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-1xl font-bold">Order #{order.orderNumber}</h2>
        <span className="text-xl opacity-90">{getTimeSince(order.createdAt)}</span>
      </div>
      
      <div className="flex items-center gap-3 mb-6">
        <span className="text-5xl">{getOrderTypeEmoji(order.orderType)}</span>
        <span className="capitalize text-xl font-medium">{order.orderType.replace('-', ' ')}</span>
        {/* {order.tableNumber && <span className="text-xl">• Table {order.tableNumber}</span>}
        {order.customerName && <span className="text-xl">• {order.customerName}</span>} */}
      </div>
      
      <div className="space-y-2 mb-6 text-3xl">
        {order.items.map((item, index) => (
          <OrderItemDisplay key={index} item={item} />
        ))}
      </div>
      
      {order.status !== 'ready' && (
        <button
          onClick={() => onMarkReady(order.id)}
          style={{ height: '75px' }}
          className="w-full bg-white text-black text-2xl font-bold rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center gap-3"
        >
          ✅ MARK READY
        </button>
      )}
    </div>
  )
}

// API functions
const fetchOrders = async (): Promise<Order[]> => {
  console.log('Fetching orders from API...')
  try {
    const response = await fetch('http://localhost:3001/api/orders')
    console.log('API Response status:', response.status, response.statusText)
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('API Error response:', errorText)
      throw new Error(`Failed to fetch orders: ${response.status} ${response.statusText}`)
    }
    
    const data = await response.json()
    console.log('Fetched orders:', data)
    return data
  } catch (error) {
    console.error('Fetch orders error:', error)
    throw error
  }
}

const updateOrderStatus = async (orderId: string, status: Order['status']): Promise<void> => {
  const response = await fetch(`http://localhost:3001/api/orders/${orderId}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status }),
  })
  
  if (!response.ok) {
    throw new Error('Failed to update order status')
  }
}

function App() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const loadOrders = async () => {
    console.log('Loading orders...')
    try {
      setLoading(true)
      const fetchedOrders = await fetchOrders()
      console.log('Successfully loaded orders:', fetchedOrders.length, 'orders')
      setOrders(fetchedOrders)
      setError(null)
    } catch (err) {
      console.error('Error loading orders:', err)
      setError(`Failed to load orders: ${err instanceof Error ? err.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }
  
  const handleMarkReady = async (orderId: string) => {
    try {
      await updateOrderStatus(orderId, 'ready')
      // Reload orders to get updated data from database
      await loadOrders()
    } catch (err) {
      setError('Failed to mark order as ready')
      console.error('Error updating order:', err)
    }
  }
  
  useEffect(() => {
    loadOrders()
  }, [])
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-4 flex items-center justify-center">
        <div className="text-4xl font-bold text-gray-600">Loading orders...</div>
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl font-bold text-red-600 mb-4">{error}</div>
          <button 
            onClick={loadOrders}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg text-xl font-bold hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }
  
  const activeOrders = orders.filter(order => order.status !== 'ready')
  const readyOrders = orders.filter(order => order.status === 'ready')
  
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-5xl font-bold mb-8">Kitchen Orders</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
        {activeOrders.map((order) => (
          <OrderCard key={order.id} order={order} onMarkReady={handleMarkReady} />
        ))}
      </div>
      
      {readyOrders.length > 0 && (
        <div className="border-t-4 border-green-500 pt-8">
          <h2 className="text-4xl font-bold text-green-600 mb-6">Ready Orders</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {readyOrders.map((order) => (
              <OrderCard key={order.id} order={order} onMarkReady={handleMarkReady} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default App