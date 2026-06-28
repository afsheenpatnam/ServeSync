import api from './api'

const getEmail = () => {
  try { return JSON.parse(localStorage.getItem('user'))?.email } catch { return null }
}

// Normalize backend order to what UI components expect
const normalize = (order) => ({
  ...order,
  status: (order.order_status || 'pending').toLowerCase(),
  user_name: order.user_email || '',
  total_amount: order.total_amount || 0,
})

export const orderService = {
  // Backend reads cart from DB — no body needed; payment_method sent as query param
  place: async (email, paymentMethod = 'Cash', scheduledTime = null, extraData = null) => {
    let url = `/orders/place/${email}?payment_method=${paymentMethod}`
    if (scheduledTime) url += `&scheduled_time=${encodeURIComponent(scheduledTime)}`
    const res = await api.post(url, extraData || {})
    return res.data
  },

  getMyOrders: async () => {
    const email = getEmail()
    const res = await api.get(`/orders/user/${email}`)
    return (res.data || []).map(normalize)
  },

  getAllOrders: async () => {
    const res = await api.get('/orders/all')
    return (res.data || []).map(normalize)
  },

  getById: async (id) => {
    const res = await api.get(`/orders/${id}`)
    return normalize(res.data)
  },

  // Capitalize status to match backend enum
  updateStatus: async (id, status) => {
    const capitalized = status.charAt(0).toUpperCase() + status.slice(1)
    const res = await api.put(`/orders/status/${id}`, { status: capitalized })
    return res.data
  },

  getDashboardStats: async () => {
    const res = await api.get('/dashboard/stats')
    return res.data
  },
}
