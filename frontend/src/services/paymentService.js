import api from './api'

const loadRazorpayScript = () =>
  new Promise((resolve) => {
    if (window.Razorpay) return resolve(true)
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })

export const paymentService = {
  openRazorpay: async ({ amount, email, name }) => {
    const loaded = await loadRazorpayScript()
    if (!loaded) throw new Error('Razorpay failed to load. Check your internet connection.')

    const { data: order } = await api.post('/payments/create-order', { amount })

    return new Promise((resolve, reject) => {
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        order_id: order.order_id,
        name: 'ServeSync',
        description: 'Food Order Payment',
        prefill: { email, name: name || '' },
        theme: { color: '#f97316' },
        handler: async (response) => {
          try {
            await api.post('/payments/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            })
            resolve(response.razorpay_payment_id)
          } catch {
            reject(new Error('Payment verification failed'))
          }
        },
        modal: {
          ondismiss: () => reject(new Error('cancelled')),
        },
      }
      const rzp = new window.Razorpay(options)
      rzp.open()
    })
  },
}
