import api from './api'

export const offerService = {
  getAll: async () => {
    const res = await api.get('/offers/')
    return res.data
  },
  create: async (data) => {
    const res = await api.post('/offers/create', data)
    return res.data
  },
  apply: async (itemId, discount_percentage) => {
    const res = await api.put(`/offers/apply/${itemId}`, { discount_percentage })
    return res.data
  },
  remove: async (itemId) => {
    const res = await api.put(`/offers/remove/${itemId}`)
    return res.data
  },
  getFinalPrice: async (itemId) => {
    const res = await api.get(`/offers/final-price/${itemId}`)
    return res.data
  },
}
