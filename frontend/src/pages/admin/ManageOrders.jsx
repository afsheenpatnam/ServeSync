import { useEffect, useState } from 'react'
import { RefreshCw } from 'lucide-react'
import Navbar from '../../components/common/Navbar'
import OrderManagement from '../../components/admin/OrderManagement'
import Loader from '../../components/common/Loader'
import { orderService } from '../../services/orderService'
import { ORDER_STATUSES } from '../../utils/constants'

const STATUS_TABS = ['all', ...Object.keys(ORDER_STATUSES)]

export default function ManageOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [refreshing, setRefreshing] = useState(false)

  const load = async (silent = false) => {
    if (!silent) setLoading(true)
    else setRefreshing(true)
    try {
      const data = await orderService.getAllOrders()
      setOrders(data)
    } catch {
      setOrders([])
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => { load() }, [])

  const filtered = filter === 'all' ? orders : orders.filter((o) => o.status === filter)

  const counts = STATUS_TABS.reduce((acc, t) => {
    acc[t] = t === 'all' ? orders.length : orders.filter((o) => o.status === t).length
    return acc
  }, {})

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Manage Orders</h1>
            <p className="text-gray-500 text-sm mt-0.5">{orders.length} total orders</p>
          </div>
          <button
            onClick={() => load(true)}
            disabled={refreshing}
            className="flex items-center gap-1.5 text-sm text-gray-600 border border-gray-200 bg-white px-3.5 py-2 rounded-xl hover:border-orange-300 hover:text-orange-600 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1 mb-6" style={{ scrollbarWidth: 'none' }}>
          {STATUS_TABS.filter((t) => counts[t] > 0 || t === 'all').map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-sm font-medium transition-colors ${
                filter === tab
                  ? 'bg-orange-500 text-white shadow-sm shadow-orange-200'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-orange-300 hover:text-orange-500'
              }`}
            >
              {tab === 'all' ? 'All Orders' : ORDER_STATUSES[tab]}
              {counts[tab] > 0 && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                  filter === tab ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
                }`}>
                  {counts[tab]}
                </span>
              )}
            </button>
          ))}
        </div>

        {loading ? (
          <Loader fullPage={false} />
        ) : (
          <OrderManagement orders={filtered} onRefresh={() => load(true)} />
        )}
      </main>
    </div>
  )
}
