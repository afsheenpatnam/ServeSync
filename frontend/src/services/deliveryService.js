import api from './api'

export const deliveryService = {
  getAvailableOrders: async () => {
    const res = await api.get('/delivery/available-orders')
    return res.data
  },
  acceptOrder: async (orderId) => {
    const res = await api.put(`/delivery/accept-order/${orderId}`)
    return res.data
  },
  getMyOrders: async () => {
    const res = await api.get('/delivery/my-orders')
    return res.data
  },
  updateStatus: async (orderId, status) => {
    const res = await api.put(`/delivery/update-status/${orderId}`, { status })
    return res.data
  },
  verifyOtp: async (orderId, otp) => {
    const res = await api.post(`/delivery/verify-otp/${orderId}`, { otp })
    return res.data
  },
  updateLocation: async (orderId, lat, lng) => {
    const res = await api.put(`/delivery/update-location/${orderId}`, { lat, lng })
    return res.data
  },
  getLocation: async (orderId) => {
    const res = await api.get(`/delivery/location/${orderId}`)
    return res.data
  },
  getTracking: async (orderId) => {
    const res = await api.get(`/delivery/tracking/${orderId}`)
    return res.data
  },
  getPartners: async () => {
    const res = await api.get('/delivery/partners')
    return res.data
  },
  toggleAvailability: async () => {
    const res = await api.put('/delivery/toggle-availability')
    return res.data
  },
}
