import { useState } from 'react'
import { formatCurrency, formatDate } from '../../utils/helpers'
import { ORDER_STATUSES } from '../../utils/constants'
import OrderStatus from '../orders/OrderStatus'
import { orderService } from '../../services/orderService'
import { User2, Calendar } from 'lucide-react'
import toast from 'react-hot-toast'

export default function OrderManagement({ orders, onRefresh, compact = false }) {
  const [updating, setUpdating] = useState(null)

  const handleStatus = async (id, status) => {
    setUpdating(id)
    try {
      await orderService.updateStatus(id, status)
      toast.success('Status updated')
      onRefresh?.()
    } catch (err) {
      toast.error(typeof err === 'string' ? err : 'Update failed')
    } finally {
      setUpdating(null)
    }
  }

  if (!orders.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="text-4xl mb-3">📭</div>
        <p className="text-gray-500 text-sm font-medium">No orders found</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {orders.map((order) => (
        <div
          key={order._id}
          className="border border-gray-100 rounded-2xl p-4 hover:border-orange-100 hover:bg-orange-50/20 transition-colors"
        >
          <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 bg-orange-50 rounded-xl flex items-center justify-center shrink-0">
                <span className="text-sm font-bold text-orange-500">
                  {order.user_name?.[0]?.toUpperCase() || '?'}
                </span>
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">#{order._id?.slice(-6).toUpperCase()}</p>
                <div className="flex items-center gap-1.5 text-[11px] text-gray-400 mt-0.5">
                  <User2 className="w-3 h-3" />
                  {order.user_name || order.user_id}
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-gray-400 mt-0.5">
                  <Calendar className="w-3 h-3" />
                  {formatDate(order.created_at)}
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end gap-1.5">
              <OrderStatus status={order.status} />
              <span className="font-bold text-gray-900 text-sm">{formatCurrency(order.total_amount)}</span>
            </div>
          </div>

          {/* Items */}
          {!compact && (
            <div className="bg-gray-50 rounded-xl px-3 py-2 mb-3 space-y-1">
              {order.items.map((item, i) => (
                <div key={i} className="flex justify-between text-xs text-gray-600">
                  <span>{item.name || item.item_id} ×{item.quantity}</span>
                  <span className="font-medium">{formatCurrency(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
          )}

          {compact && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {order.items.map((i, idx) => (
                <span key={idx} className="inline-flex items-center gap-1 bg-gray-100 text-gray-600 text-[11px] font-medium px-2 py-0.5 rounded-full">
                  {i.name}
                  <span className="bg-gray-200 text-gray-500 rounded-full px-1 leading-none">×{i.quantity}</span>
                </span>
              ))}
            </div>
          )}

          {/* Status update */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 shrink-0">Update:</span>
            <select
              value={order.status}
              disabled={updating === order._id}
              onChange={(e) => handleStatus(order._id, e.target.value)}
              className="flex-1 text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-orange-400 bg-white text-gray-700 disabled:opacity-50"
            >
              {Object.entries(ORDER_STATUSES).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
          </div>
        </div>
      ))}
    </div>
  )
}
