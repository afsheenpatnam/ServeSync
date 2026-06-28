import api from './api'

export const inventoryService = {
  getLowStock: async () => {
    const res = await api.get('/inventory/low-stock')
    return res.data
  },
  updateStock: async (itemId, quantity) => {
    const res = await api.put(`/inventory/update-stock/${itemId}`, { quantity })
    return res.data
  },
  getLogs: async () => {
    const res = await api.get('/inventory/logs')
    return res.data
  },
}
