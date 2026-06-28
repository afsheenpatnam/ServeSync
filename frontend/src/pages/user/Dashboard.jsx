import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ShoppingBag, Clock, UtensilsCrossed, ChevronRight, ArrowRight } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import { orderService } from '../../services/orderService'
import { itemService } from '../../services/itemService'
import Navbar from '../../components/common/Navbar'
import FoodCard from '../../components/menu/FoodCard'
import OrderCard from '../../components/orders/OrderCard'
import Loader from '../../components/common/Loader'
import { formatCurrency } from '../../utils/helpers'

const getGreeting = () => {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

const QUICK_ACTIONS = [
  { label: 'Browse Menu', desc: 'See all items', to: '/menu', emoji: '🍽️', color: 'from-orange-400 to-amber-400' },
  { label: 'My Orders', desc: 'Track status', to: '/orders', emoji: '📦', color: 'from-blue-400 to-indigo-400' },
  { label: 'View Cart', desc: 'Checkout now', to: '/cart', emoji: '🛒', color: 'from-green-400 to-emerald-400' },
]

export default function Dashboard() {
  const { user } = useAuth()
  const { count, total } = useCart()
  const [recentOrders, setRecentOrders] = useState([])
  const [featuredItems, setFeaturedItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const [items, orders] = await Promise.all([
          itemService.getAll({}),
          orderService.getMyOrders(),
        ])
        const sorted = items
          .filter((i) => i.is_available)
          .sort((a, b) => (b.rating || 0) - (a.rating || 0))
        setFeaturedItems(sorted.slice(0, 4))
        setRecentOrders(orders.slice(0, 3))
      } catch {
        // silently fail
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) return <><Navbar /><Loader /></>

  const firstName = user?.name?.split(' ')[0] || 'there'

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-6xl mx-auto px-6 py-8 space-y-8">

        {/* Hero */}
        <div className="relative bg-gradient-to-r from-orange-500 via-orange-400 to-amber-400 rounded-2xl p-8 text-white overflow-hidden">
          <div className="absolute -top-10 -right-10 w-56 h-56 bg-white/10 rounded-full pointer-events-none" />
          <div className="absolute bottom-0 right-24 w-32 h-32 bg-white/10 rounded-full pointer-events-none" />

          <div className="relative z-10 max-w-lg">
            <p className="text-orange-100 text-sm font-medium mb-1">{getGreeting()},</p>
            <h1 className="text-3xl font-bold mb-2">{firstName}! 👋</h1>
            <p className="text-orange-100 text-sm mb-6">
              What are you craving today? Fresh meals are ready at the canteen.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/menu"
                className="inline-flex items-center gap-2 bg-white text-orange-600 font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-orange-50 transition-colors"
              >
                Browse Menu <ArrowRight className="w-4 h-4" />
              </Link>
              {count > 0 && (
                <Link
                  to="/cart"
                  className="inline-flex items-center gap-2 bg-white/20 border border-white/30 text-white font-medium text-sm px-5 py-2.5 rounded-xl hover:bg-white/30 transition-colors"
                >
                  <ShoppingBag className="w-4 h-4" />
                  {count} item{count !== 1 ? 's' : ''} in cart
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            {
              icon: ShoppingBag, label: 'Cart Items', value: count,
              sub: total > 0 ? formatCurrency(total) : 'empty',
              bg: 'bg-orange-50', color: 'text-orange-500',
            },
            {
              icon: Clock, label: 'Orders Placed', value: recentOrders.length,
              sub: 'all time',
              bg: 'bg-blue-50', color: 'text-blue-500',
            },
            {
              icon: UtensilsCrossed, label: 'Menu Items', value: `${featuredItems.length}+`,
              sub: 'available today',
              bg: 'bg-green-50', color: 'text-green-500',
            },
          ].map(({ icon: Icon, label, value, sub, bg, color }) => (
            <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-3">
              <div className={`w-11 h-11 ${bg} rounded-xl flex items-center justify-center`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <div>
                <p className="text-3xl font-extrabold text-gray-900 leading-none">{value}</p>
                <p className="text-sm font-semibold text-gray-700 mt-1.5">{label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-3 gap-4">
            {QUICK_ACTIONS.map(({ label, desc, to, emoji, color }) => (
              <Link
                key={to}
                to={to}
                className={`bg-gradient-to-br ${color} p-5 rounded-2xl text-white hover:opacity-90 transition-opacity group`}
              >
                <span className="text-4xl block mb-3 group-hover:scale-110 transition-transform duration-200 select-none">
                  {emoji}
                </span>
                <p className="font-bold text-base">{label}</p>
                <p className="text-sm text-white/75 mt-0.5">{desc}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Top Picks */}
        {featuredItems.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Top Picks</h2>
                <p className="text-xs text-gray-400 mt-0.5">Highest rated items today</p>
              </div>
              <Link to="/menu" className="flex items-center gap-1 text-sm text-orange-500 font-semibold hover:underline">
                View all <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {featuredItems.map((item) => (
                <FoodCard key={item._id} item={item} />
              ))}
            </div>
          </section>
        )}

        {/* Recent Orders */}
        {recentOrders.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Recent Orders</h2>
                <p className="text-xs text-gray-400 mt-0.5">Your latest activity</p>
              </div>
              <Link to="/orders" className="flex items-center gap-1 text-sm text-orange-500 font-semibold hover:underline">
                View all <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentOrders.map((order) => (
                <OrderCard key={order._id} order={order} />
              ))}
            </div>
          </section>
        )}

        {/* Empty CTA */}
        {recentOrders.length === 0 && count === 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
            <div className="text-6xl mb-4 select-none">🍽️</div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">Ready to order?</h3>
            <p className="text-sm text-gray-500 mb-6">Browse our menu and place your first order!</p>
            <Link
              to="/menu"
              className="inline-flex items-center gap-2 bg-orange-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-orange-600 transition-colors text-sm"
            >
              <UtensilsCrossed className="w-4 h-4" />
              Explore Menu
            </Link>
          </div>
        )}
      </main>
    </div>
  )
}
