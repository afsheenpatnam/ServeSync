import api from './api'

export const authService = {
  login: async ({ email, password }) => {
    const form = new URLSearchParams()
    form.append('username', email)
    form.append('password', password)
    const res = await api.post('/login', form, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    })
    return res.data
  },

  // Returns { requires_otp, email } if email verification is on, otherwise auto-logs in
  signup: async ({ name, email, phone, password, role = 'user', city = '', area = '' }) => {
    const res = await api.post('/signup', { name, email, phone, password, role, city, area })
    if (res.data.requires_otp) {
      return { requires_otp: true, email }
    }
    return authService.login({ email, password })
  },

  sendOtp: async (email) => {
    const res = await api.post('/send-otp', { email })
    return res.data
  },

  verifyOtp: async (email, otp) => {
    const res = await api.post('/verify-otp', { email, otp })
    return res.data
  },
}
