import { Minus, Plus, Star, Leaf, Drumstick } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { formatCurrency, getImageUrl } from '../../utils/helpers'
import toast from 'react-hot-toast'

const CATEGORY_BG = {
  Breakfast: 'from-orange-400 to-amber-300',
  Lunch:     'from-green-400 to-emerald-300',
  Dinner:    'from-indigo-400 to-violet-300',
  Snacks:    'from-yellow-400 to-orange-300',
  Beverages: 'from-blue-400 to-sky-300',
  Desserts:  'from-pink-400 to-rose-300',
}

export default function FoodCard({ item }) {
  const { addItem, updateQty, items } = useCart()

  const cartEntry = items.find((i) => i._id === item._id)
  const qty = cartEntry?.quantity || 0

  const handleAdd = () => {
    if (!item.is_available) return
    addItem(item)
    toast.success(`${item.name} added!`, { duration: 1500 })
  }

  const handleInc = () => {
    if (!item.is_available) return
    addItem(item)
  }

  const handleDec = () => {
    updateQty(item._id, qty - 1)
  }

  const bgGradient = CATEGORY_BG[item.category] || 'from-gray-400 to-slate-300'
  const hasImage = item.image && !item.image.startsWith('/images/placeholder')

  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group flex flex-col
      ${item.is_available ? 'hover:shadow-md hover:-translate-y-0.5' : 'opacity-75'} transition-all duration-200`}>

      {/* Image / Emoji hero */}
      <div className={`relative h-40 bg-gradient-to-br ${bgGradient} overflow-hidden shrink-0`}>
        {hasImage ? (
          <img
            src={getImageUrl(item.image)}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => { e.target.style.display = 'none' }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <span className="text-6xl drop-shadow-sm select-none">{item.emoji || '🍽️'}</span>
          </div>
        )}

        {!item.is_available && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="text-white text-xs font-semibold bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-full">
              Unavailable
            </span>
          </div>
        )}

        {/* Veg / Non-veg */}
        <div className="absolute top-2 left-2">
          {item.is_veg !== undefined ? (
            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${item.is_veg ? 'border-green-500 bg-white' : 'border-red-500 bg-white'}`}>
              <div className={`w-2.5 h-2.5 rounded-full ${item.is_veg ? 'bg-green-500' : 'bg-red-500'}`} />
            </div>
          ) : null}
        </div>

        {/* Rating */}
        {item.rating > 0 && (
          <div className="absolute top-2 right-2 flex items-center gap-0.5 bg-black/30 backdrop-blur-sm text-white text-xs px-1.5 py-0.5 rounded-full">
            <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
            <span className="font-medium">{item.rating}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3.5 flex flex-col flex-1">
        <div className="mb-1">
          <span className="text-[10px] font-semibold text-orange-500 uppercase tracking-wider">{item.category}</span>
          <h3 className="font-semibold text-gray-900 text-sm leading-tight mt-0.5 line-clamp-1">{item.name}</h3>
        </div>

        {item.description && (
          <p className="text-[11px] text-gray-400 leading-relaxed line-clamp-2 mb-3 flex-1">{item.description}</p>
        )}

        <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-50">
          <span className="font-bold text-gray-900 text-sm">{formatCurrency(item.price)}</span>

          {qty > 0 ? (
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleDec}
                className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center hover:bg-orange-200 transition-colors"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="w-5 text-center text-sm font-bold text-gray-900">{qty}</span>
              <button
                onClick={handleInc}
                className="w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center hover:bg-orange-600 transition-colors"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleAdd}
              disabled={!item.is_available}
              className="flex items-center gap-1 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
            >
              <Plus className="w-3 h-3" />
              Add
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
