import type { Order } from '../types'
import { orders as mockOrders } from '../mockData'

const API_BASE_URL = 'http://localhost:3001/api'

export async function fetchOrders(): Promise<Order[]> {
  let response;
  try {
     response = await fetch(`${API_BASE_URL}/orders`)
    if (response.status !=200  ) {
      throw new Error('Network response was not ok')
    }
    console.log(response, "response");
    const data = await response.json()
    return data.orders.map((o:any) => ({
      ...o,
      items: o.items ?? [], // API has none -> []
    })) as Order[];
  }catch(err){
    console.log(err, "err")
    return Promise.resolve([...mockOrders])
  }
  // return fetch(`${API_BASE_URL}/orders`)
  // return Promise.resolve([...mockOrders])

}

export async function updateOrderStatus(orderId: string, status: Order['status']): Promise<Order> {
  const order = mockOrders.find(o => o.id === orderId)
  if (!order) {
    throw new Error('Order not found')
  }
  order.status = status
  try{
    const result = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    })
    if(result.status !=200){
      throw new Error('Network response was not ok')
    }
  }catch(err){
    console.log(err, "err")
  }
  return Promise.resolve(order)
}
