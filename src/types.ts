export interface OrderItem {
  name: string
  quantity: number
  modifiers?: string[]
  specialInstructions?: string
}

export interface Order {
  id: string
  orderNumber: string
  orderType: 'dine-in' | 'takeout' | 'delivery'
  status: 'pending' | 'preparing' | 'ready'
  items: OrderItem[]
  createdAt: string
  customerName?: string
  tableNumber?: string
}