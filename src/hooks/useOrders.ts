import { useState, useEffect, useCallback } from 'react'
import type { Order } from '../types'
import { OrderService, handleApiError } from '../services/orderService'

interface UseOrdersReturn {
  orders: Order[]
  loading: boolean
  error: string | null
  refreshOrders: () => Promise<void>
  updateOrderStatus: (orderId: string, status: 'pending' | 'preparing' | 'ready') => Promise<void>
  toggleOrderStatus: (orderId: string, currentStatus: 'pending' | 'preparing') => Promise<void>
  markOrderReady: (orderId: string) => Promise<void>
  deleteOrder: (orderId: string) => Promise<void>
}

export const useOrders = (): UseOrdersReturn => {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch orders from API
  const refreshOrders = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const fetchedOrders = await OrderService.getOrders()
      setOrders(fetchedOrders)
    } catch (err) {
      setError(handleApiError(err))
    } finally {
      setLoading(false)
    }
  }, [])

  // Update order status
  const updateOrderStatus = useCallback(async (orderId: string, status: 'pending' | 'preparing' | 'ready') => {
    try {
      setError(null)
      await OrderService.updateOrderStatus(orderId, status)
      
      // Update local state optimistically
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId ? { ...order, status } : order
        )
      )
    } catch (err) {
      setError(handleApiError(err))
      // Refresh orders to get the correct state from server
      await refreshOrders()
    }
  }, [refreshOrders])

  // Toggle order status between pending/preparing
  const toggleOrderStatus = useCallback(async (orderId: string, currentStatus: 'pending' | 'preparing') => {
    const newStatus = currentStatus === 'pending' ? 'preparing' : 'pending'
    await updateOrderStatus(orderId, newStatus)
  }, [updateOrderStatus])

  // Mark order as ready
  const markOrderReady = useCallback(async (orderId: string) => {
    try {
      setError(null)
      await OrderService.markOrderReady(orderId, false) // Don't auto-delete via API
      
      // Update local state to show as ready
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId ? { ...order, status: 'ready' as const } : order
        )
      )
      
      // Auto-remove from local state after 10 seconds (matching original behavior)
      setTimeout(() => {
        setOrders(prevOrders => 
          prevOrders.filter(order => order.id !== orderId)
        )
      }, 10000)
      
    } catch (err) {
      setError(handleApiError(err))
      await refreshOrders()
    }
  }, [refreshOrders])

  // Delete order
  const deleteOrder = useCallback(async (orderId: string) => {
    try {
      setError(null)
      await OrderService.deleteOrder(orderId)
      
      // Remove from local state
      setOrders(prevOrders => 
        prevOrders.filter(order => order.id !== orderId)
      )
    } catch (err) {
      setError(handleApiError(err))
      await refreshOrders()
    }
  }, [refreshOrders])

  // Load orders on mount
  useEffect(() => {
    refreshOrders()
  }, [refreshOrders])

  // Auto-refresh orders every 30 seconds to keep data fresh
  useEffect(() => {
    const interval = setInterval(() => {
      refreshOrders()
    }, 30000)

    return () => clearInterval(interval)
  }, [refreshOrders])

  return {
    orders,
    loading,
    error,
    refreshOrders,
    updateOrderStatus,
    toggleOrderStatus,
    markOrderReady,
    deleteOrder,
  }
}