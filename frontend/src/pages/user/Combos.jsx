import { useEffect, useState } from 'react'
import { ShoppingCart } from 'lucide-react'
import Navbar from '../../components/common/Navbar'
import Loader from '../../components/common/Loader'
import { comboService } from '../../services/comboService'
import { useCart } from '../../context/CartContext'
import { formatCurrency, getImageUrl } from '../../utils/helpers'
import toast from 'react-hot-toast'

function ComboCard({ combo, onAddToCart }) {
  const [adding, setAdding] = useState(false)

  const handleAdd = async () => {
    setAdding(true)
    await onAddToCart(combo)
    setAdding(false)
  }

  // Calculate "original" price as sum of item prices if available
  const originalTotal = combo.items_detail
    ? combo.items_detail.reduce((sum, item) => sum + (item.price || 0), 0)
    : combo.original_price || null

  const savings = originalTotal != null ? originalTotal - combo.combo_price : null

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow flex flex-col">
      {combo.image_path ? (
        <img
          src={getImageUrl(combo.image_path)}
          alt={combo.combo_name}
          className="w-full h-44 object-cover"
          onError={(e) => { e.target.style.display = 'none' }}
        />
      ) : (
        <div className="w-full h-44 bg-gradient-to-br from-orange-100 to-amber-50 flex items-center justify-center">
          <span className="text-5xl">🍱</span>
        </div>
      )}

      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-bold text-gray-900 text-base mb-2">{combo.combo_name}</h3>

        {/* Items list */}
        {combo.items_detail && combo.items_detail.length > 0 ? (
          <ul className="space-y-1 mb-3">
            {combo.items_detail.map((item, i) => (
              <li key={i} className="flex items-center gap-1.5 text-xs text-gray-500">
                <span className="w-1.5 h-1.5 bg-orange-400 rounded-full shrink-0" />
                {item.name}
              </li>
            ))}
          </ul>
        ) : combo.items && combo.items.length > 0 ? (
          <p className="text-xs text-gray-400 mb-3">{combo.items.length} items included</p>
        ) : null}

        {/* Pricing */}
        <div className="mt-auto">
          <div className="flex items-center gap-3 mb-1">
            {originalTotal != null && originalTotal > combo.combo_price && (
              <span className="text-gray-400 text-sm line-through">{formatCurrency(originalTotal)}</span>
            )}
            <span className="text-orange-500 font-extrabold text-xl">{formatCurrency(combo.combo_price)}</span>
          </div>
          {savings != null && savings > 0 && (
            <p className="text-green-600 text-xs font-medium mb-3">
              You save {formatCurrency(savings)}!
            </p>
          )}

          <button
            onClick={handleAdd}
            disabled={adding}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white text-sm font-bold rounded-xl transition-colors"
          >
            <ShoppingCart className="w-4 h-4" />
            {adding ? 'Adding...' : 'Add Combo to Cart'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Combos() {
  const [combos, setCombos] = useState([])
  const [loading, setLoading] = useState(true)
  const { addItem } = useCart()

  useEffect(() => {
    comboService.getAvailable()
      .then((data) => setCombos(Array.isArray(data) ? data : []))
      .catch(() => setCombos([]))
      .finally(() => setLoading(false))
  }, [])

  const handleAddComboToCart = async (combo) => {
    try {
      // Add each item in the combo individually
      if (combo.items_detail && combo.items_detail.length > 0) {
        for (const item of combo.items_detail) {
          await addItem(item)
        }
      } else if (combo.items && combo.items.length > 0) {
        // items may be just IDs; add what we can
        for (const itemId of combo.items) {
          await addItem({ _id: itemId, name: 'Combo Item', price: 0 })
        }
      }
      toast.success(`${combo.combo_name} added to cart!`)
    } catch {
      toast.error('Failed to add combo to cart')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Combo Meals 🍱</h1>
          <p className="text-gray-500 text-sm">Better together — save more with our curated combo deals</p>
        </div>

        {loading ? (
          <Loader fullPage={false} />
        ) : combos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="text-6xl mb-4">🍱</div>
            <p className="text-lg font-semibold text-gray-700 mb-1">No combos available</p>
            <p className="text-sm text-gray-400">Check back soon — we're cooking up new combos!</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {combos.map((combo, i) => (
              <ComboCard
                key={combo._id || i}
                combo={combo}
                onAddToCart={handleAddComboToCart}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
