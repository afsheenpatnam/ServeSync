import api from './api'

export const helpCenterService = {
  submit: async (data) => {
    const res = await api.post('/help-center/submit', data)
    return res.data
  },
  getAll: async () => {
    const res = await api.get('/help-center/all')
    return res.data
  },
  reply: async (id, reply) => {
    const res = await api.put(`/help-center/reply/${id}`, { reply })
    return res.data
  },
  getUnreadCount: async () => {
    const res = await api.get('/help-center/unread-count')
    return res.data
  },
}
