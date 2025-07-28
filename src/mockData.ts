import type { Order } from './types'

export const orders: Order[] = [
  {
    id: '1',
    orderNumber: '101',
    orderType: 'dine-in',
    tableNumber: '5',
    status: 'pending',
    items: [
      {
        name: 'Classic Burger',
        quantity: 2,
        modifiers: ['No Onions', 'Extra Pickles'],
        specialInstructions: 'Well done please'
      },
      {
        name: 'French Fries',
        quantity: 1,
        modifiers: ['Extra Salt']
      },
      {
        name: 'Caesar Salad',
        quantity: 1
      }
    ],
    createdAt: new Date(Date.now() - 2 * 60 * 1000).toISOString() // 2 minutes ago
  },
  {
    id: '2',
    orderNumber: '102',
    orderType: 'takeout',
    customerName: 'Sarah Chen',
    status: 'preparing',
    items: [
      {
        name: 'Margherita Pizza',
        quantity: 1,
        modifiers: ['Extra Cheese', 'Thin Crust'],
        specialInstructions: 'ALLERGY: Gluten free crust required'
      },
      {
        name: 'Chicken Wings',
        quantity: 12,
        modifiers: ['Buffalo Sauce', 'Ranch on side']
      }
    ],
    createdAt: new Date(Date.now() - 8 * 60 * 1000).toISOString() // 8 minutes ago
  },
  {
    id: '3',
    orderNumber: '103',
    orderType: 'delivery',
    customerName: 'Mike Johnson',
    status: 'ready',
    items: [
      {
        name: 'Ribeye Steak',
        quantity: 1,
        modifiers: ['Medium Rare', 'No Butter'],
        specialInstructions: 'Birthday dinner - please make it special!'
      },
      {
        name: 'Loaded Baked Potato',
        quantity: 1
      },
      {
        name: 'Asparagus',
        quantity: 1,
        modifiers: ['Extra Crispy']
      },
      {
        name: 'Chocolate Cake',
        quantity: 1,
        specialInstructions: 'Add birthday candle'
      }
    ],
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString() // 15 minutes ago
  },
  {
    id: '4',
    orderNumber: '104',
    orderType: 'dine-in',
    tableNumber: '12',
    status: 'pending',
    items: [
      {
        name: 'Fish Tacos',
        quantity: 3,
        modifiers: ['Grilled', 'Extra Lime']
      },
      {
        name: 'Chips & Guacamole',
        quantity: 1
      },
      {
        name: 'Margarita',
        quantity: 2,
        modifiers: ['No Salt', 'Extra Ice']
      }
    ],
    createdAt: new Date(Date.now() - 30 * 1000).toISOString() // 30 seconds ago
  },
  {
    id: '5',
    orderNumber: '105',
    orderType: 'takeout',
    customerName: 'Emily Davis',
    status: 'preparing',
    items: [
      {
        name: 'Pad Thai',
        quantity: 2,
        modifiers: ['Mild Spice', 'No Peanuts'],
        specialInstructions: 'SEVERE PEANUT ALLERGY - Please ensure no cross contamination'
      },
      {
        name: 'Spring Rolls',
        quantity: 4
      },
      {
        name: 'Thai Iced Tea',
        quantity: 2
      }
    ],
    createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString() // 5 minutes ago
  },
  {
    id: '6',
    orderNumber: '106',
    orderType: 'dine-in',
    tableNumber: '8',
    status: 'pending',
    items: [
      {
        name: 'Kids Chicken Tenders',
        quantity: 1,
        modifiers: ['Apple Slices instead of Fries']
      },
      {
        name: 'Mac & Cheese',
        quantity: 1,
        specialInstructions: 'Extra cheesy please'
      },
      {
        name: 'Grilled Salmon',
        quantity: 1,
        modifiers: ['Lemon Butter', 'Side of Broccoli']
      },
      {
        name: 'House Salad',
        quantity: 1,
        modifiers: ['Balsamic Dressing', 'No Croutons']
      }
    ],
    createdAt: new Date(Date.now() - 90 * 1000).toISOString() // 90 seconds ago
  }
]