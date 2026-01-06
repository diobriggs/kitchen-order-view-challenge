import type { Order } from '../types'
import { orders as mockOrders } from '../mockData'

const API_BASE_URL = 'http://localhost:3001/api'

export async function fetchOrders(): Promise<Order[]> {
  return Promise.resolve([...mockOrders])
}

export async function updateOrderStatus(orderId: string, status: Order['status']): Promise<Order> {
  const order = mockOrders.find(o => o.id === orderId)
  if (!order) {
    throw new Error('Order not found')
  }
  order.status = status
  return Promise.resolve(order)
}
