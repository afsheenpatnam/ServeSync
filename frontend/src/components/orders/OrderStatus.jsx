import { ORDER_STATUSES } from '../../utils/constants'

const STATUS_CONFIG = {
  pending:   { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', dot: 'bg-yellow-400', label: 'Pending' },
  confirmed: { color: 'bg-blue-100 text-blue-800 border-blue-200',       dot: 'bg-blue-500',   label: 'Confirmed' },
  preparing: { color: 'bg-orange-100 text-orange-800 border-orange-200', dot: 'bg-orange-500', label: 'Preparing' },
  ready:     { color: 'bg-green-100 text-green-800 border-green-200',    dot: 'bg-green-500',  label: 'Ready' },
  delivered: { color: 'bg-gray-100 text-gray-700 border-gray-200',       dot: 'bg-gray-400',   label: 'Delivered' },
  cancelled: { color: 'bg-red-100 text-red-800 border-red-200',          dot: 'bg-red-500',    label: 'Cancelled' },
}

export default function OrderStatus({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending
  const isPulsing = status === 'preparing' || status === 'pending'

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${cfg.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} ${isPulsing ? 'animate-pulse' : ''}`} />
      {ORDER_STATUSES[status] || status}
    </span>
  )
}
