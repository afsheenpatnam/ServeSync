export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export const CATEGORIES = [
  'All',
  'Breakfast',
  'Lunch',
  'Dinner',
  'Snacks',
  'Beverages',
  'Desserts',
]

export const ORDER_STATUSES = {
  pending:   'Pending',
  preparing: 'Preparing',
  ready:     'Ready for Pickup',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
}

export const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  preparing: 'bg-orange-100 text-orange-800',
  ready: 'bg-green-100 text-green-800',
  delivered: 'bg-gray-100 text-gray-800',
  cancelled: 'bg-red-100 text-red-800',
}
