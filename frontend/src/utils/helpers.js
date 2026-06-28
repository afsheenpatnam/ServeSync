export const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount)

export const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  })

export const getImageUrl = (path) => {
  if (!path) return '/images/placeholder.png'
  if (path.startsWith('http')) return path
  return `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:8000'}/${path}`
}

export const truncate = (str, len = 60) =>
  str?.length > len ? str.slice(0, len) + '…' : str
