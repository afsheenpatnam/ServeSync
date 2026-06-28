import api from './api'

export const analyticsService = {
  getSales: async () => {
    const res = await api.get('/analytics/sales')
    return res.data
  },
  getInventory: async () => {
    const res = await api.get('/analytics/inventory')
    return res.data
  },
  getUsers: async () => {
    const res = await api.get('/analytics/users')
    return res.data
  },
}
