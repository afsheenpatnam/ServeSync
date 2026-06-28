import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Star, RotateCcw, Clock, MapPin } from 'lucide-react'
import Navbar from '../../components/common/Navbar'
import OrderCard from '../../components/orders/OrderCard'
import ReviewModal from '../../components/orders/ReviewModal'
import Loader from '../../components/common/Loader'
import { orderService } from '../../services/orderService'
import { cartService } from '../../services/cartService'
import { ORDER_STATUSES } from '../../utils/constants'
import { formatCurrency } from '../../utils/helpers'
import toast from 'react-hot-toast'

const STATUS_TABS = ['all', 'pending', 'preparing', 'ready', 'delivered', 'cancelled']

export default function Orders() {
  const [orders,      setOrders]      = useState([])
  const [loading,     setLoading]     = useState(true)
  const [activeTab,   setActiveTab]   = useState('all')
  const [reviewing,   setReviewing]   = useState(null) // order being reviewed
  const [reordering,  setReordering]  = useState(null) // order _id being reordered

  useEffect(() => {
    orderService.getMyOrders()
      .then(setOrders)
      .catch(() => setOrders([]))
      .finally(() => setLoading(false))
  }, [])

  const filtered = activeTab === 'all' ? orders : orders.filter((o) => o.status === activeTab)

  const counts = STATUS_TABS.reduce((acc, t) => {
    acc[t] = t === 'all' ? orders.length : orders.filter((o) => o.status === t).length
    return acc
  }, {})

  const handleReorder = async (order) => {
    setReordering(order._id)
    try {
      const user = JSON.parse(localStorage.getItem('user'))
      const email = user?.email
      await cartService.clearCart(email)
      for (const item of order.items) {
        await cartService.addToCart({
          user_email: email,
          item_id:    item.item_id,
          name:       item.name,
          price:      item.price,
          quantity:   item.quantity,
          image_path: item.image_path || '',
        })
      }
      toast.success('Items added to cart!')
      window.location.href = '/cart'
    } catch {
      toast.error('Failed to reorder')
    } finally {
      setReordering(null)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">My Orders</h1>
          <p className="text-gray-500 text-sm">Track all your past and current orders</p>
        </div>

        {/* Status tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1 mb-6" style={{ scrollbarWidth: 'none' }}>
          {STATUS_TABS.filter((t) => counts[t] > 0 || t === 'all').map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`shrink-0 px-3.5 py-1.5 rounded-xl text-sm font-medium transition-colors ${
                activeTab === tab
                  ? 'bg-orange-500 text-white shadow-sm shadow-orange-200'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-orange-300 hover:text-orange-500'
              }`}
            >
              {tab === 'all' ? 'All' : ORDER_STATUSES[tab]}
              {counts[tab] > 0 && (
                <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${
                  activeTab === tab ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
                }`}>
                  {counts[tab]}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Active delivery banner */}
        {!loading && orders.some((o) => o.status === 'out for delivery') && (
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center shrink-0 animate-pulse">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-blue-800 text-sm">Your order is on the way! 🛵</p>
              <p className="text-xs text-blue-600 mt-0.5">
                Check your <strong>bell icon</strong> for the delivery OTP · Click <strong>"Track Order"</strong> to see live location
              </p>
            </div>
          </div>
        )}

        {loading ? (
          <Loader fullPage={false} />
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="text-6xl mb-4">📋</div>
            <p className="text-lg font-semibold text-gray-700 mb-1">
              {activeTab === 'all' ? 'No orders yet' : `No ${ORDER_STATUSES[activeTab]?.toLowerCase()} orders`}
            </p>
            <p className="text-sm text-gray-400 mb-6">
              {activeTab === 'all' ? 'Place your first order from the menu!' : 'Nothing here right now.'}
            </p>
            {activeTab === 'all' && (
              <Link to="/menu" className="px-5 py-2.5 bg-orange-500 text-white rounded-xl font-medium hover:bg-orange-600 transition-colors text-sm">
                Browse Menu
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((order) => (
              <div key={order._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <OrderCard order={order} />

                {/* Scheduled time badge */}
                {order.scheduled_time && (
                  <div className="px-5 pb-3 flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-orange-500" />
                    <span className="text-xs text-orange-600 font-medium">
                      Scheduled for {new Date(order.scheduled_time).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                    </span>
                  </div>
                )}

                {/* Action buttons */}
                <div className="px-5 pb-4 pt-1 flex gap-2 border-t border-gray-50">
                  <button
                    onClick={() => handleReorder(order)}
                    disabled={reordering === order._id}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:border-orange-300 hover:text-orange-600 transition-colors disabled:opacity-60"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    {reordering === order._id ? 'Adding…' : 'Reorder'}
                  </button>

                  {(order.status === 'out for delivery' || order.status === 'preparing' || order.status === 'ready') && (
                    <Link
                      to={`/orders/${order._id}/tracking`}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-50 border border-blue-200 text-sm font-medium text-blue-700 hover:bg-blue-100 transition-colors"
                    >
                      <MapPin className="w-3.5 h-3.5" />
                      Track Order
                    </Link>
                  )}

                  {order.status === 'delivered' && (
                    <button
                      onClick={() => setReviewing(order)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-50 border border-amber-200 text-sm font-medium text-amber-700 hover:bg-amber-100 transition-colors"
                    >
                      <Star className="w-3.5 h-3.5" />
                      Rate & Review
                    </button>
                  )}

                  <span className="ml-auto self-center text-sm font-bold text-gray-900">
                    {formatCurrency(order.total_amount)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {reviewing && (
        <ReviewModal order={reviewing} onClose={() => setReviewing(null)} />
      )}
    </div>
  )
}
