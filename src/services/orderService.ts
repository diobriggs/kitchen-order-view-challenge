import type { Order } from '../types'

const API_BASE_URL = 'http://localhost:3002/api'

export class OrderService {
  /**
   * Fetch all orders from the API
   */
  static async getOrders(): Promise<Order[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/orders`)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const orders = await response.json()
      return orders
    } catch (error) {
      console.error('Failed to fetch orders:', error)
      throw new Error('Failed to load orders. Please try again.')
    }
  }

  /**
   * Update order status
   */
  static async updateOrderStatus(orderId: string, status: 'pending' | 'preparing' | 'ready'): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      }
    } catch (error) {
      console.error('Failed to update order status:', error)
      throw new Error('Failed to update order status. Please try again.')
    }
  }

  /**
   * Delete a completed order
   */
  static async deleteOrder(orderId: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      }
    } catch (error) {
      console.error('Failed to delete order:', error)
      throw new Error('Failed to delete order. Please try again.')
    }
  }

  /**
   * Mark order as ready and optionally delete after delay
   */
  static async markOrderReady(orderId: string, autoDelete: boolean = true): Promise<void> {
    await this.updateOrderStatus(orderId, 'ready')
    
    if (autoDelete) {
      // Auto-delete after 10 seconds (matching the frontend behavior)
      setTimeout(async () => {
        try {
          await this.deleteOrder(orderId)
        } catch (error) {
          console.error('Failed to auto-delete order:', error)
        }
      }, 10000)
    }
  }

  /**
   * Toggle order status between pending and preparing
   */
  static async toggleOrderStatus(orderId: string, currentStatus: 'pending' | 'preparing'): Promise<void> {
    const newStatus = currentStatus === 'pending' ? 'preparing' : 'pending'
    await this.updateOrderStatus(orderId, newStatus)
  }
}

// Helper function for error handling in components
export const handleApiError = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message
  }
  return 'An unexpected error occurred'
}