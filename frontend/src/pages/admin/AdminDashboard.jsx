import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Package, ClipboardList, TrendingUp, Clock,
  ChevronRight, BarChart3, Bike, Tag, Combine, AlertTriangle,
  ToggleLeft, ToggleRight, Loader2, HelpCircle
} from 'lucide-react'
import Navbar from '../../components/common/Navbar'
import Loader from '../../components/common/Loader'
import OrderManagement from '../../components/admin/OrderManagement'
import { itemService } from '../../services/itemService'
import { orderService } from '../../services/orderService'
import { formatCurrency } from '../../utils/helpers'
import { ORDER_STATUSES } from '../../utils/constants'
import api from '../../services/api'
import toast from 'react-hot-toast'

const STATUS_COLORS_BAR = {
  pending:   'bg-yellow-400',
  preparing: 'bg-orange-400',
  ready:     'bg-green-400',
  delivered: 'bg-gray-300',
  cancelled: 'bg-red-300',
}

const QUICK_LINKS = [
  { to: '/admin/delivery',    label: 'Delivery',    desc: 'Partners & tracking',  icon: Bike,        color: 'bg-blue-50',   iconColor: 'text-blue-500'   },
  { to: '/admin/analytics',   label: 'Analytics',   desc: 'Sales & inventory',    icon: BarChart3,   color: 'bg-purple-50', iconColor: 'text-purple-500' },
  { to: '/admin/offers',      label: 'Offers',      desc: 'Manage discounts',     icon: Tag,         color: 'bg-pink-50',   iconColor: 'text-pink-500'   },
  { to: '/admin/combos',      label: 'Combos',      desc: 'Meal combinations',    icon: Combine,     color: 'bg-teal-50',   iconColor: 'text-teal-500'   },
  { to: '/admin/help-center', label: 'Help Center', desc: 'Customer queries',     icon: HelpCircle,  color: 'bg-orange-50', iconColor: 'text-orange-500' },
]

export default function AdminDashboard() {
  const [stats, setStats] = useState({ items: 0, orders: 0, revenue: 0, pending: 0 })
  const [recentOrders, setRecentOrders] = useState([])
  const [ordersByStatus, setOrdersByStatus] = useState({})
  const [lowStock, setLowStock] = useState([])
  const [loading, setLoading] = useState(true)
  const [canteenOpen, setCanteenOpen] = useState(true)
  const [toggling, setToggling] = useState(false)

  const handleToggleCanteen = async () => {
    setToggling(true)
    try {
      const res = await api.put('/canteen/toggle')
      setCanteenOpen(res.data.is_open)
      toast.success(res.data.message)
    } catch {
      toast.error('Failed to toggle canteen')
    } finally {
      setToggling(false)
    }
  }

  const load = async () => {
    api.get('/canteen/status').then((r) => setCanteenOpen(r.data.is_open)).catch(() => {})
    try {
      const [dashStats, items, orders] = await Promise.all([
        orderService.getDashboardStats(),
        itemService.getAll(),
        orderService.getAllOrders(),
      ])
      setStats({
        items:   dashStats.menu_items          ?? items.length,
        orders:  dashStats.orders?.total_orders ?? orders.length,
        revenue: dashStats.revenue?.total_revenue ?? 0,
        pending: dashStats.orders?.pending_orders ?? orders.filter((o) => o.status === 'pending').length,
      })
      setLowStock(dashStats.inventory?.low_stock_items ?? [])
      setRecentOrders(orders.slice(0, 5))

      const byStatus = {}
      orders.forEach((o) => {
        byStatus[o.status] = (byStatus[o.status] || 0) + 1
      })
      setOrdersByStatus(byStatus)
    } catch {
      // silently fail
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  if (loading) return <><Navbar /><Loader /></>

  const maxCount = Math.max(...Object.values(ordersByStatus), 1)

  const statCards = [
    { label: 'Total Items',  value: stats.items,                  icon: Package,     color: 'bg-blue-50',   iconColor: 'text-blue-500'   },
    { label: 'Total Orders', value: stats.orders,                 icon: ClipboardList, color: 'bg-purple-50', iconColor: 'text-purple-500' },
    { label: 'Revenue',      value: formatCurrency(stats.revenue), icon: TrendingUp,  color: 'bg-green-50',  iconColor: 'text-green-500'  },
    { label: 'Pending',      value: stats.pending,                icon: Clock,       color: 'bg-orange-50', iconColor: 'text-orange-500', urgent: stats.pending > 0 },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-6xl mx-auto px-6 py-8 space-y-8">

        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-500 text-sm mt-0.5">Overview of your canteen operations</p>
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            {/* Canteen toggle */}
            <button
              onClick={handleToggleCanteen}
              disabled={toggling}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-sm font-semibold transition-all ${
                canteenOpen
                  ? 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100'
                  : 'bg-red-50 border-red-200 text-red-700 hover:bg-red-100'
              }`}
            >
              {toggling
                ? <Loader2 className="w-4 h-4 animate-spin" />
                : canteenOpen
                  ? <ToggleRight className="w-4 h-4" />
                  : <ToggleLeft className="w-4 h-4" />
              }
              {canteenOpen ? 'Canteen Open' : 'Canteen Closed'}
            </button>
            <Link to="/admin/items" className="text-sm px-3.5 py-2 rounded-xl border border-gray-200 bg-white text-gray-700 hover:border-orange-300 hover:text-orange-600 transition-colors font-medium">
              Manage Items
            </Link>
            <Link to="/admin/orders" className="text-sm px-3.5 py-2 rounded-xl bg-orange-500 text-white hover:bg-orange-600 transition-colors font-medium">
              All Orders
            </Link>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map(({ label, value, icon: Icon, color, iconColor, urgent }) => (
            <div
              key={label}
              className={`bg-white rounded-2xl border shadow-sm p-5 flex flex-col gap-4 ${urgent ? 'border-orange-200 ring-1 ring-orange-100' : 'border-gray-100'}`}
            >
              <div className="flex items-start justify-between">
                <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${iconColor}`} />
                </div>
                {urgent && (
                  <span className="text-[10px] bg-orange-100 text-orange-600 font-bold px-2 py-0.5 rounded-full animate-pulse uppercase tracking-wide">
                    Action!
                  </span>
                )}
              </div>
              <div>
                <p className="text-3xl font-extrabold text-gray-900 leading-none">{value}</p>
                <p className="text-sm font-semibold text-gray-700 mt-1.5">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Quick links */}
        <div>
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-3">Quick Access</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {QUICK_LINKS.map(({ to, label, desc, icon: Icon, color, iconColor }) => (
              <Link
                key={to}
                to={to}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-3 hover:border-orange-200 hover:shadow-md transition-all group"
              >
                <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center shrink-0`}>
                  <Icon className={`w-5 h-5 ${iconColor}`} />
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-gray-900 text-sm group-hover:text-orange-600 transition-colors">{label}</p>
                  <p className="text-xs text-gray-400 truncate">{desc}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-orange-400 transition-colors ml-auto shrink-0" />
              </Link>
            ))}
          </div>
        </div>

        {/* Low stock alert */}
        {lowStock.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-yellow-800 text-sm mb-1">Low Stock Alert</p>
              <p className="text-yellow-700 text-xs">
                {lowStock.map((i) => `${i.item_name} (${i.remaining_stock} left)`).join(' · ')}
              </p>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Order status breakdown */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-gray-900">Order Breakdown</h2>
              <BarChart3 className="w-4 h-4 text-gray-300" />
            </div>
            <div className="space-y-3">
              {Object.entries(ORDER_STATUSES).map(([key, label]) => {
                const count = ordersByStatus[key] || 0
                const pct = Math.round((count / maxCount) * 100)
                return (
                  <div key={key}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-gray-600 font-medium">{label}</span>
                      <span className="text-gray-500 font-bold">{count}</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${STATUS_COLORS_BAR[key] || 'bg-gray-300'}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Recent orders */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-gray-900">Recent Orders</h2>
              <Link to="/admin/orders" className="flex items-center gap-1 text-sm text-orange-500 font-medium hover:underline">
                View all <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <OrderManagement orders={recentOrders} onRefresh={load} compact />
          </div>
        </div>

      </main>
    </div>
  )
}
