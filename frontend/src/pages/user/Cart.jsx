import { Link } from 'react-router-dom'
import { ShoppingCart, ArrowLeft, Trash2, UtensilsCrossed } from 'lucide-react'
import Navbar from '../../components/common/Navbar'
import CartItem from '../../components/cart/CartItem'
import CartSummary from '../../components/cart/CartSummary'
import CheckoutButton from '../../components/cart/CheckoutButton'
import { useCart } from '../../context/CartContext'

export default function Cart() {
  const { items, clearCart } = useCart()

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Link
            to="/menu"
            className="p-2 rounded-xl hover:bg-white text-gray-400 hover:text-gray-700 border border-transparent hover:border-gray-100 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Your Cart</h1>
            {items.length > 0 && (
              <p className="text-sm text-gray-400 mt-0.5">
                {items.length} item{items.length !== 1 ? 's' : ''} ready to order
              </p>
            )}
          </div>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 bg-orange-50 rounded-3xl flex items-center justify-center mb-5">
              <ShoppingCart className="w-10 h-10 text-orange-300" />
            </div>
            <h2 className="text-xl font-bold text-gray-700 mb-2">Your cart is empty</h2>
            <p className="text-sm text-gray-400 mb-8 max-w-xs">
              Looks like you haven&apos;t added anything yet. Browse our menu and pick your favourites!
            </p>
            <Link
              to="/menu"
              className="flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition-colors shadow-md shadow-orange-200"
            >
              <UtensilsCrossed className="w-4 h-4" />
              Browse Menu
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Items list */}
            <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center justify-between mb-1 pb-3 border-b border-gray-50">
                <h2 className="font-bold text-gray-900">
                  Order Items
                  <span className="ml-2 text-sm font-normal text-gray-400">({items.length})</span>
                </h2>
                <button
                  onClick={clearCart}
                  className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-red-500 transition-colors px-2 py-1.5 rounded-lg hover:bg-red-50"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Clear all
                </button>
              </div>
              <div>
                {items.map((item) => <CartItem key={item._id} item={item} />)}
              </div>
              <Link
                to="/menu"
                className="mt-4 flex items-center justify-center gap-1.5 text-sm text-orange-500 font-medium hover:underline py-2"
              >
                + Add more items
              </Link>
            </div>

            {/* Summary */}
            <div className="lg:w-72 space-y-4">
              <CartSummary />
              <CheckoutButton />
              <p className="text-xs text-center text-gray-400 leading-relaxed">
                Your order will be ready for pickup at the canteen counter. We&apos;ll notify you when it&apos;s ready!
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
