import api from './api'

export const comboService = {
  getAll: async () => {
    const res = await api.get('/combos/')
    return res.data
  },
  getAvailable: async () => {
    const res = await api.get('/combos/available/list')
    return res.data
  },
  create: async (data) => {
    const res = await api.post('/combos/create', data)
    return res.data
  },
  update: async (id, data) => {
    const res = await api.put(`/combos/update/${id}`, data)
    return res.data
  },
  delete: async (id) => {
    const res = await api.delete(`/combos/delete/${id}`)
    return res.data
  },
}
