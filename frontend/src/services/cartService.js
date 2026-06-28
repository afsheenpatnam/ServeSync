import api from './api'

export const cartService = {
  addToCart: async ({ user_email, item_id, name, price, quantity, image_path }) => {
    const res = await api.post('/cart/add', { user_email, item_id, name, price, quantity, image_path })
    return res.data
  },

  getCart: async (email) => {
    const res = await api.get(`/cart/${email}`)
    return res.data
  },

  removeItem: async (cartId) => {
    const res = await api.delete(`/cart/remove/${cartId}`)
    return res.data
  },

  clearCart: async (email) => {
    const res = await api.delete(`/cart/clear/${email}`)
    return res.data
  },
}
