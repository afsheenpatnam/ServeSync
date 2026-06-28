import { formatCurrency, formatDate } from '../../utils/helpers'
import OrderStatus from './OrderStatus'
import { Receipt } from 'lucide-react'

const STATUS_STEPS = ['pending', 'preparing', 'ready', 'delivered']

const STEP_LABELS = {
  pending:   'Placed',
  preparing: 'Cooking',
  ready:     'Ready',
  delivered: 'Done',
}

function StatusStepper({ status }) {
  if (status === 'cancelled') {
    return (
      <div className="flex items-center gap-1.5 text-xs text-red-500 font-medium py-2">
        <span className="w-2 h-2 rounded-full bg-red-400" />
        Order Cancelled
      </div>
    )
  }

  const currentIdx = STATUS_STEPS.indexOf(status)

  return (
    <div className="flex items-center gap-0 my-3">
      {STATUS_STEPS.map((step, idx) => {
        const done = idx <= currentIdx
        const isLast = idx === STATUS_STEPS.length - 1
        return (
          <div key={step} className="flex items-center flex-1 min-w-0">
            <div className="flex flex-col items-center gap-1 shrink-0">
              <div
                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                  done
                    ? 'bg-orange-500 border-orange-500'
                    : 'bg-white border-gray-200'
                }`}
              >
                {done && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
              </div>
              <span className={`text-[9px] font-medium whitespace-nowrap ${done ? 'text-orange-500' : 'text-gray-300'}`}>
                {STEP_LABELS[step]}
              </span>
            </div>
            {!isLast && (
              <div className={`flex-1 h-0.5 mb-3.5 mx-0.5 rounded-full transition-colors ${
                idx < currentIdx ? 'bg-orange-400' : 'bg-gray-100'
              }`} />
            )}
          </div>
        )
      })}
    </div>
  )
}

export default function OrderCard({ order }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-1">
        <div>
          <div className="flex items-center gap-1.5 mb-0.5">
            <Receipt className="w-3.5 h-3.5 text-gray-400" />
            <p className="text-xs font-semibold text-gray-700">#{order._id?.slice(-6).toUpperCase()}</p>
          </div>
          <p className="text-[11px] text-gray-400">{formatDate(order.created_at)}</p>
        </div>
        <OrderStatus status={order.status} />
      </div>

      {/* Stepper */}
      <StatusStepper status={order.status} />

      {/* Items */}
      <div className="bg-gray-50 rounded-xl px-3 py-2.5 space-y-1.5 mb-4">
        {order.items.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between text-xs text-gray-600">
            <div className="flex items-center gap-1.5">
              <span className="text-gray-400">×{item.quantity}</span>
              <span className="font-medium text-gray-800">{item.name || item.item_id}</span>
            </div>
            <span className="font-medium">{formatCurrency(item.price * item.quantity)}</span>
          </div>
        ))}
      </div>

      {/* Total */}
      <div className="flex items-center justify-between pt-2 border-t border-dashed border-gray-100">
        <span className="text-xs text-gray-500">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</span>
        <div className="text-right">
          <span className="text-xs text-gray-400 block">Total</span>
          <span className="font-bold text-gray-900 text-sm">{formatCurrency(order.total_amount)}</span>
        </div>
      </div>
    </div>
  )
}
