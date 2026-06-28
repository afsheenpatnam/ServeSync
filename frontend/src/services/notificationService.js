import api from './api'

export const notificationService = {
  getMy: async () => {
    const res = await api.get('/notifications/my')
    return res.data
  },
  getMyNotifications: async () => {
    const res = await api.get('/notifications/my')
    return res.data
  },
  getUnreadCount: async () => {
    const res = await api.get('/notifications/unread-count')
    return res.data
  },
  markRead: async (id) => {
    const res = await api.put(`/notifications/read/${id}`)
    return res.data
  },
  delete: async (id) => {
    const res = await api.delete(`/notifications/${id}`)
    return res.data
  },
}
