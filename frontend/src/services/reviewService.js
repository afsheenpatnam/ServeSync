import api from './api'

export const reviewService = {
  addReview: async (data) => {
    const res = await api.post('/reviews/add', data)
    return res.data
  },
  getItemReviews: async (itemId) => {
    const res = await api.get(`/reviews/item/${itemId}`)
    return res.data
  },
  getMyReviews: async () => {
    const res = await api.get('/reviews/my')
    return res.data
  },
}
