import type { Order } from '../types'
import { getTimeSince, getStatusColor, getStatusLabel } from '../utils'
import clsx from 'clsx'

interface OrderCardProps {
  order: Order
  onStatusUpdate: (orderId: string, newStatus: Order['status']) => void
}

export function OrderCard({ order, onStatusUpdate }: OrderCardProps) {
  const hasAllergyWarning = order.items.some(
    item => item.specialInstructions?.toLowerCase().includes('allergy')
  )

  const getNextStatus = (currentStatus: Order['status']): Order['status'] | null => {
    switch (currentStatus) {
      case 'pending': return 'preparing'
      case 'preparing': return 'ready'
      default: return null
    }
  }

  const nextStatus = getNextStatus(order.status)

  return (
    <div
      className={clsx(
        'bg-white rounded-lg shadow-lg p-4 border-l-8',
        order.status === 'pending' && 'border-yellow-400',
        order.status === 'preparing' && 'border-blue-400',
        order.status === 'ready' && 'border-green-400',
        hasAllergyWarning && 'ring-4 ring-red-500'
      )}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-4xl font-bold">#{order.orderNumber}</h2>
          <p className="text-xl text-gray-600 mt-1">
            {order.orderType === 'dine-in' && order.tableNumber
              ? `Table ${order.tableNumber}`
              : order.orderType === 'takeout'
              ? `Takeout - ${order.customerName || 'Guest'}`
              : `Delivery - ${order.customerName || 'Guest'}`}
          </p>
        </div>
        <div className="text-right">
          <span
            className={clsx(
              'inline-block px-3 py-1 rounded-full text-lg font-semibold text-white',
              getStatusColor(order.status)
            )}
          >
            {getStatusLabel(order.status)}
          </span>
          <p className="text-lg text-gray-500 mt-2">{getTimeSince(order.createdAt)}</p>
        </div>
      </div>

      {hasAllergyWarning && (
        <div className="bg-red-600 text-white text-xl font-bold p-3 rounded mb-4 text-center animate-pulse">
          ALLERGY ALERT
        </div>
      )}

      <div className="space-y-3">
        {order.items.map((item, index) => {
          const isAllergyItem = item.specialInstructions?.toLowerCase().includes('allergy')

          return (
            <div
              key={index}
              className={clsx(
                'p-3 rounded',
                isAllergyItem ? 'bg-red-100 border-2 border-red-400' : 'bg-gray-50'
              )}
            >
              <div className="flex justify-between items-start">
                <span className="text-2xl font-semibold">
                  {item.quantity}x {item.name}
                </span>
              </div>

              {item.modifiers && item.modifiers.length > 0 && (
                <div className="mt-1 flex flex-wrap gap-2">
                  {item.modifiers.map((mod, modIndex) => (
                    <span
                      key={modIndex}
                      className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-lg"
                    >
                      {mod}
                    </span>
                  ))}
                </div>
              )}

              {item.specialInstructions && (
                <p
                  className={clsx(
                    'mt-2 text-lg font-medium',
                    isAllergyItem ? 'text-red-700 font-bold' : 'text-orange-600'
                  )}
                >
                  {item.specialInstructions}
                </p>
              )}
            </div>
          )
        })}
      </div>

      {nextStatus && (
        <button
          onClick={() => onStatusUpdate(order.id, nextStatus)}
          className={clsx(
            'w-full mt-4 py-3 rounded-lg text-xl font-bold text-white transition-colors',
            order.status === 'pending' && 'bg-blue-500 hover:bg-blue-600',
            order.status === 'preparing' && 'bg-green-500 hover:bg-green-600'
          )}
        >
          {order.status === 'pending' ? 'Start Preparing' : 'Mark Ready'}
        </button>
      )}

      {order.status === 'ready' && (
        <div className="mt-4 py-3 bg-green-100 text-green-800 text-xl font-bold text-center rounded-lg">
          Ready for Pickup
        </div>
      )}
    </div>
  )
}
