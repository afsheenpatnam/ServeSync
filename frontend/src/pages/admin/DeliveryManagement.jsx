import { useEffect, useState } from 'react'
import { Loader2, Bike, Users, Activity, UserPlus } from 'lucide-react'
import Navbar from '../../components/common/Navbar'
import Loader from '../../components/common/Loader'
import { deliveryService } from '../../services/deliveryService'
import { orderService } from '../../services/orderService'
import { authService } from '../../services/authService'
import { formatCurrency } from '../../utils/helpers'
import toast from 'react-hot-toast'

const TABS = [
  { id: 'partners', label: 'Delivery Partners', icon: Users },
  { id: 'create', label: 'Create Delivery Partner', icon: UserPlus },
  { id: 'active', label: 'Active Deliveries', icon: Activity },
]

const EMPTY_FORM = { name: '', email: '', phone: '', password: '', district: '', town: '' }

function PartnerCard({ partner }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-start gap-4">
      <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center shrink-0">
        <Bike className="w-5 h-5 text-orange-500" />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-gray-900 truncate">{partner.name}</h3>
        <p className="text-sm text-gray-500 truncate">{partner.email}</p>
        <div className="flex flex-wrap gap-2 mt-2">
          {partner.district && (
            <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-medium">
              {partner.district}
            </span>
          )}
          {partner.town && (
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium">
              {partner.town}
            </span>
          )}
          {partner.phone && (
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium">
              {partner.phone}
            </span>
          )}
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${partner.is_available !== false ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
            {partner.is_available !== false ? 'Available' : 'Busy'}
          </span>
        </div>
      </div>
    </div>
  )
}

export default function DeliveryManagement() {
  const [activeTab, setActiveTab] = useState('partners')
  const [partners, setPartners] = useState([])
  const [activeDeliveries, setActiveDeliveries] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(EMPTY_FORM)
  const [creating, setCreating] = useState(false)

  const load = async () => {
    try {
      const [partnersData, allOrders] = await Promise.all([
        deliveryService.getPartners().catch(() => []),
        orderService.getAllOrders().catch(() => []),
      ])
      setPartners(Array.isArray(partnersData) ? partnersData : [])
      // Active deliveries = orders with a delivery_partner_email set and not yet delivered
      const active = Array.isArray(allOrders)
        ? allOrders.filter((o) => o.delivery_partner_email && o.status !== 'Delivered')
        : []
      setActiveDeliveries(active)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.password) return toast.error('Name, email and password are required')

    setCreating(true)
    try {
      await authService.signup({ ...form, role: 'delivery', city: form.town, area: form.town })
      toast.success(`Delivery partner ${form.name} created!`)
      setForm(EMPTY_FORM)
      await load()
      setActiveTab('partners')
    } catch (err) {
      toast.error(typeof err === 'string' ? err : 'Failed to create delivery partner')
    } finally {
      setCreating(false)
    }
  }

  if (loading) return <><Navbar /><Loader /></>

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-5xl mx-auto px-6 py-8 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-0.5">Delivery Management</h1>
          <p className="text-gray-500 text-sm">Manage delivery partners and track active deliveries</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-gray-200 pb-0 overflow-x-auto">
          {TABS.map((tab) => {
            const active = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap -mb-px ${
                  active
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Tab content */}
        {activeTab === 'partners' && (
          <section>
            <p className="text-sm text-gray-500 mb-4">{partners.length} partner{partners.length !== 1 ? 's' : ''} registered</p>
            {partners.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center">
                <div className="text-4xl mb-3">🛵</div>
                <p className="text-gray-600 font-medium">No delivery partners yet</p>
                <p className="text-gray-400 text-sm mt-1">Create one using the "Create Delivery Partner" tab</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {partners.map((partner, i) => (
                  <PartnerCard key={partner._id || partner.email || i} partner={partner} />
                ))}
              </div>
            )}
          </section>
        )}

        {activeTab === 'create' && (
          <section>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 max-w-xl">
              <h2 className="font-bold text-gray-900 mb-5">New Delivery Partner Account</h2>
              <form onSubmit={handleCreate} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => set('name', e.target.value)}
                      placeholder="John Doe"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => set('phone', e.target.value)}
                      placeholder="9876543210"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-400"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => set('email', e.target.value)}
                    placeholder="partner@example.com"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                    Password *
                  </label>
                  <input
                    type="password"
                    value={form.password}
                    onChange={(e) => set('password', e.target.value)}
                    placeholder="Min. 6 characters"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                      District *
                    </label>
                    <input
                      type="text"
                      value={form.district}
                      onChange={(e) => set('district', e.target.value)}
                      placeholder="YSR Kadapa"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                      Town / Village *
                    </label>
                    <input
                      type="text"
                      value={form.town}
                      onChange={(e) => set('town', e.target.value)}
                      placeholder="Proddatur"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-400"
                    />
                  </div>
                </div>
                <p className="text-xs text-blue-500 bg-blue-50 rounded-xl px-3 py-2">
                  Orders from customers in this district will be assigned to this delivery partner.
                </p>
                <button
                  type="submit"
                  disabled={creating}
                  className="flex items-center gap-2 px-6 py-2.5 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-bold rounded-xl transition-colors text-sm"
                >
                  {creating && <Loader2 className="w-4 h-4 animate-spin" />}
                  Create Partner Account
                </button>
              </form>
            </div>
          </section>
        )}

        {activeTab === 'active' && (
          <section>
            <p className="text-sm text-gray-500 mb-4">{activeDeliveries.length} active deliver{activeDeliveries.length !== 1 ? 'ies' : 'y'}</p>
            {activeDeliveries.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center">
                <div className="text-4xl mb-3">📦</div>
                <p className="text-gray-600 font-medium">No active deliveries</p>
                <p className="text-gray-400 text-sm mt-1">Deliveries in progress will appear here</p>
              </div>
            ) : (
              <div className="space-y-3">
                {activeDeliveries.map((order) => (
                  <div key={order._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-gray-900 text-sm">
                          Order #{order._id?.slice(-6)?.toUpperCase()}
                        </span>
                        <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-medium">
                          {order.delivery_status || order.status}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">Customer: {order.user_email || order.email}</p>
                      <p className="text-xs text-gray-400 mt-0.5">Partner: {order.delivery_partner_email}</p>
                    </div>
                    <span className="text-orange-600 font-bold text-sm shrink-0">
                      {formatCurrency(order.total_amount || 0)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  )
}
