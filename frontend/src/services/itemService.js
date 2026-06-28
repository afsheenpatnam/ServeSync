import api from './api'

// Normalize backend item fields to what frontend components expect
const normalize = (item) => ({
  ...item,
  stock: item.quantity ?? 0,
  image: item.image_path || '',
  is_available: item.available !== false, // default true if field absent
})

export const itemService = {
  getAll: async (params = {}) => {
    const res = await api.get('/items/', { params })
    return res.data.map(normalize)
  },

  getById: async (id) => {
    const res = await api.get(`/items/${id}`)
    return normalize(res.data)
  },

  create: async (data) => {
    const body = {
      name: data.name,
      description: data.description || '',
      price: Number(data.price),
      quantity: Number(data.quantity) || 0,
      category: data.category,
      image_path: data.image_path || '',
    }
    const res = await api.post('/items/add', body)
    return res.data
  },

  update: async (id, data) => {
    const body = {
      name: data.name,
      description: data.description,
      price: data.price !== undefined ? Number(data.price) : undefined,
      quantity: data.quantity !== undefined ? Number(data.quantity) : undefined,
      category: data.category,
      image_path: data.image_path,
      available: data.available,
    }
    // Strip undefined keys
    Object.keys(body).forEach((k) => body[k] === undefined && delete body[k])
    const res = await api.put(`/items/update/${id}`, body)
    return res.data
  },

  delete: async (id) => {
    const res = await api.delete(`/items/delete/${id}`)
    return res.data
  },

  toggleAvailability: async (id, currentValue) => {
    const res = await api.put(`/items/update/${id}`, { available: !currentValue })
    return res.data
  },
}
