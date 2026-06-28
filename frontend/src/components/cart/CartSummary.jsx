import { Tag, Truck } from 'lucide-react'
import { formatCurrency } from '../../utils/helpers'
import { useCart } from '../../context/CartContext'

const TAX_RATE = 0.05

export default function CartSummary() {
  const { total, count } = useCart()
  const tax = total * TAX_RATE
  const grandTotal = total + tax

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
      <h3 className="font-bold text-gray-900">Order Summary</h3>

      <div className="space-y-2.5 text-sm text-gray-600">
        <div className="flex justify-between">
          <span>Subtotal ({count} item{count !== 1 ? 's' : ''})</span>
          <span className="font-medium text-gray-800">{formatCurrency(total)}</span>
        </div>
        <div className="flex justify-between">
          <span>GST (5%)</span>
          <span className="font-medium text-gray-800">{formatCurrency(tax)}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Truck className="w-3.5 h-3.5 text-green-500" />
            <span>Pickup fee</span>
          </div>
          <span className="text-green-600 font-semibold">Free</span>
        </div>
      </div>

      <div className="border-t border-dashed border-gray-200 pt-3.5">
        <div className="flex justify-between items-center">
          <span className="font-bold text-gray-900">Total</span>
          <span className="font-bold text-orange-500 text-lg">{formatCurrency(grandTotal)}</span>
        </div>
        <p className="text-[11px] text-gray-400 mt-1">Inclusive of all taxes</p>
      </div>

      <div className="flex items-center gap-2 bg-green-50 border border-green-100 rounded-xl px-3 py-2">
        <Tag className="w-3.5 h-3.5 text-green-600 shrink-0" />
        <p className="text-xs text-green-700 font-medium">Free pickup from canteen counter</p>
      </div>
    </div>
  )
}
