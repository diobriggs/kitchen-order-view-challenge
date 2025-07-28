/**
 * Formats a date string into a human-readable "time ago" format
 * @param dateString - ISO date string
 * @returns Formatted string like "2 mins ago", "Just now", etc.
 */
export function getTimeSince(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  
  if (seconds < 60) return 'Just now'
  
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes} min${minutes === 1 ? '' : 's'} ago`
  
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`
  
  const days = Math.floor(hours / 24)
  return `${days} day${days === 1 ? '' : 's'} ago`
}

/**
 * Returns Tailwind classes for order status colors
 * @param status - Order status
 * @returns Tailwind class string for background color
 */
export function getStatusColor(status: string): string {
  const colors = {
    pending: 'bg-yellow-400',
    preparing: 'bg-blue-400',
    ready: 'bg-green-400'
  }
  return colors[status as keyof typeof colors] || 'bg-gray-400'
}

/**
 * Returns a human-readable label for order status
 * @param status - Order status
 * @returns Formatted status label
 */
export function getStatusLabel(status: string): string {
  const labels = {
    pending: 'New Order',
    preparing: 'In Progress',
    ready: 'Ready for Pickup'
  }
  return labels[status as keyof typeof labels] || status
}