import { getTimeSince, getStatusColor, getStatusLabel } from './utils'
import { useOrders } from './hooks/useOrders'
import { ErrorBoundary, LoadingSpinner, ErrorDisplay } from './components/ErrorBoundary'

function App() {
  // Use the custom hook to manage orders and API calls
  const {
    orders,
    loading,
    error,
    refreshOrders,
    toggleOrderStatus,
    markOrderReady,
  } = useOrders()
  
  // Filter orders by status
  const activeOrders = orders.filter(order => order.status !== 'ready')
  const readyOrders = orders.filter(order => order.status === 'ready')

  // Show loading spinner while fetching data
  if (loading && orders.length === 0) {
    return <LoadingSpinner />
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      {/* Header with refresh button */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-6xl font-bold text-white text-center flex-1">
          Kitchen Orders
        </h1>
        <div className="flex items-center gap-4">
          {/* Network Status Indicator */}
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${
            error ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
          }`}>
            <div className={`w-2 h-2 rounded-full ${
              error ? 'bg-red-500' : 'bg-green-500'
            } ${loading ? 'animate-pulse' : ''}`}></div>
            {error ? 'OFFLINE' : 'ONLINE'}
          </div>
          
          <button
            onClick={refreshOrders}
            disabled={loading}
            className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg text-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '⏳' : '🔄 Refresh'}
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <ErrorDisplay 
          error={error} 
          onRetry={refreshOrders}
        />
      )}
      
      {/* Ready Orders Section */}
      {readyOrders.length > 0 && (
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-green-400 mb-4 text-center">
            🎉 Ready for Pickup
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {readyOrders.map(order => (
              <div 
                key={order.id} 
                className="bg-green-100 rounded-lg shadow-lg p-4 border-4 border-green-400 animate-pulse"
              >
                <div className="text-center">
                  <h3 className="text-3xl font-bold text-green-800 mb-2">
                    Order #{order.orderNumber}
                  </h3>
                  <div className="text-2xl font-semibold text-green-700">
                    {order.orderType === 'dine-in' && order.tableNumber ? `Table ${order.tableNumber}` : order.customerName}
                  </div>
                  <div className="text-xl text-green-600 mt-2">
                    ✅ Ready to serve!
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Active Orders Section */}
      <div className="mb-4">
        <h2 className="text-4xl font-bold text-white mb-6 text-center">
          Active Orders ({activeOrders.length})
        </h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeOrders.map(order => (
          <div 
            key={order.id} 
            className={`bg-white rounded-lg shadow-lg p-6 border-l-8 transform hover:scale-105 transition-transform duration-200 ${
              order.status === 'pending' 
                ? 'border-yellow-400' 
                : 'border-blue-400'
            }`}
          >
            {/* Order Header */}
            <div className="mb-4">
              <h2 className="text-4xl font-bold text-gray-800 mb-2">
                Order #{order.orderNumber}
              </h2>
              
              {/* Order Type */}
              <div className="flex items-center gap-3 mb-3">
                <span className={`px-4 py-2 rounded-full text-2xl font-semibold text-white ${
                  order.orderType === 'dine-in' ? 'bg-blue-500' :
                  order.orderType === 'takeout' ? 'bg-green-500' : 'bg-purple-500'
                }`}>
                  {order.orderType === 'dine-in' ? 'DINE IN' :
                   order.orderType === 'takeout' ? 'TAKEOUT' : 'DELIVERY'}
                </span>
                
                {/* Table number for dine-in */}
                {order.orderType === 'dine-in' && order.tableNumber && (
                  <span className="text-2xl font-bold text-gray-700">
                    Table {order.tableNumber}
                  </span>
                )}
                
                {/* Customer name for takeout/delivery */}
                {(order.orderType === 'takeout' || order.orderType === 'delivery') && order.customerName && (
                  <span className="text-2xl font-semibold text-gray-700">
                    {order.customerName}
                  </span>
                )}
              </div>
              
              {/* Time since order */}
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold text-red-600">
                  {getTimeSince(order.createdAt)}
                </span>
                <span className={`px-3 py-1 rounded-full text-xl font-semibold text-white ${getStatusColor(order.status)}`}>
                  {getStatusLabel(order.status)}
                </span>
              </div>
            </div>
            
            {/* Order Items */}
            <div className="mt-6">
              <h3 className="text-3xl font-bold text-gray-800 mb-4 border-b-2 border-gray-300 pb-2">
                Items:
              </h3>
              
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4 border-2 border-gray-200">
                    {/* Item name and quantity */}
                    <div className="flex items-center gap-3 mb-3">
                      <span className="bg-blue-600 text-white text-2xl font-bold px-3 py-1 rounded-full min-w-[3rem] text-center">
                        {item.quantity}
                      </span>
                      <span className="text-3xl font-bold text-gray-800">
                        {item.name}
                      </span>
                    </div>
                    
                    {/* Modifiers */}
                    {item.modifiers && item.modifiers.length > 0 && (
                      <div className="mb-3">
                        <div className="flex flex-wrap gap-2">
                          {item.modifiers.map((modifier, modIndex) => (
                            <span 
                              key={modIndex}
                              className="bg-blue-100 text-blue-800 text-xl font-semibold px-3 py-1 rounded-full border border-blue-300"
                            >
                              {modifier}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Special Instructions */}
                    {item.specialInstructions && (
                      <div className="mt-3">
                        {/* Check for allergy warnings */}
                        {item.specialInstructions.toUpperCase().includes('ALLERGY') ? (
                          <div className="bg-red-600 text-white p-4 rounded-lg border-4 border-red-700 animate-pulse">
                            <div className="flex items-center gap-3">
                              <span className="text-4xl">⚠️</span>
                              <div>
                                <div className="text-xl font-bold mb-1">ALLERGY WARNING!</div>
                                <div className="text-2xl font-bold">
                                  {item.specialInstructions}
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="bg-yellow-100 text-yellow-800 p-3 rounded-lg border-2 border-yellow-300">
                            <div className="text-xl font-semibold">
                              📝 {item.specialInstructions}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="mt-6 flex gap-4">
              {/* Toggle Status Button */}
              <button
                onClick={() => toggleOrderStatus(order.id, order.status as 'pending' | 'preparing')}
                disabled={loading}
                className={`flex-1 py-4 px-6 text-2xl font-bold rounded-lg transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
                  order.status === 'pending' 
                    ? 'bg-blue-500 hover:bg-blue-600 text-white'
                    : 'bg-yellow-500 hover:bg-yellow-600 text-white'
                }`}
              >
                {loading ? '⏳' : (order.status === 'pending' ? '👨‍🍳 START COOKING' : '⏸️ PAUSE')}
              </button>
              
              {/* Mark Ready Button */}
              <button
                onClick={() => markOrderReady(order.id)}
                disabled={loading}
                className="flex-1 py-4 px-6 text-2xl font-bold bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? '⏳' : '✅ MARK READY'}
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {activeOrders.length === 0 && (
        <div className="text-center text-white text-4xl mt-12">
          No active orders - Kitchen is caught up! 🎉
        </div>
      )}
    </div>
  )
}

export default App