import { Minus, Plus, Trash2 } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { formatCurrency, getImageUrl } from '../../utils/helpers'

const CATEGORY_BG = {
  Breakfast: 'from-orange-400 to-amber-300',
  Lunch:     'from-green-400 to-emerald-300',
  Dinner:    'from-indigo-400 to-violet-300',
  Snacks:    'from-yellow-400 to-orange-300',
  Beverages: 'from-blue-400 to-sky-300',
  Desserts:  'from-pink-400 to-rose-300',
}

export default function CartItem({ item }) {
  const { updateQty, removeItem } = useCart()
  const hasImage = item.image && !item.image.startsWith('/images/placeholder')
  const bgGradient = CATEGORY_BG[item.category] || 'from-gray-300 to-slate-200'

  return (
    <div className="flex items-center gap-3 py-3.5 border-b border-gray-100 last:border-0 group">
      {/* Thumbnail */}
      <div className={`w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-gradient-to-br ${bgGradient} flex items-center justify-center`}>
        {hasImage ? (
          <img
            src={getImageUrl(item.image)}
            alt={item.name}
            className="w-full h-full object-cover"
            onError={(e) => { e.target.style.display = 'none' }}
          />
        ) : (
          <span className="text-2xl">{item.emoji || '🍽️'}</span>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-900 text-sm truncate">{item.name}</p>
        <p className="text-xs text-gray-400 mt-0.5">{formatCurrency(item.price)} each</p>
      </div>

      {/* Qty controls */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={() => updateQty(item._id, item.quantity - 1)}
          className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center hover:border-orange-400 hover:text-orange-500 hover:bg-orange-50 transition-colors"
        >
          <Minus className="w-3 h-3" />
        </button>
        <span className="w-5 text-center text-sm font-bold text-gray-900">{item.quantity}</span>
        <button
          onClick={() => updateQty(item._id, item.quantity + 1)}
          className="w-7 h-7 rounded-full bg-orange-500 flex items-center justify-center text-white hover:bg-orange-600 transition-colors"
        >
          <Plus className="w-3 h-3" />
        </button>
      </div>

      {/* Price + remove */}
      <div className="flex items-center gap-2 ml-1 shrink-0">
        <span className="font-bold text-sm text-gray-900 w-16 text-right">
          {formatCurrency(item.price * item.quantity)}
        </span>
        <button
          onClick={() => removeItem(item._id)}
          className="text-gray-200 hover:text-red-500 transition-colors p-1 rounded-lg hover:bg-red-50"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
