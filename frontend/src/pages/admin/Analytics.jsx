import { useEffect, useState } from 'react'
import {
  TrendingUp, ShoppingBag, CheckCircle2, XCircle, Clock,
  Users, Shield, Bike, Package, AlertTriangle
} from 'lucide-react'
import Navbar from '../../components/common/Navbar'
import Loader from '../../components/common/Loader'
import { analyticsService } from '../../services/analyticsService'
import { formatCurrency } from '../../utils/helpers'

function StatCard({ label, value, icon: Icon, color, iconColor, subLabel }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-3">
      <div className={`w-11 h-11 ${color} rounded-xl flex items-center justify-center`}>
        <Icon className={`w-5 h-5 ${iconColor}`} />
      </div>
      <div>
        <p className="text-3xl font-extrabold text-gray-900 leading-none">{value}</p>
        <p className="text-sm font-semibold text-gray-700 mt-1.5">{label}</p>
        {subLabel && <p className="text-xs text-gray-400 mt-0.5">{subLabel}</p>}
      </div>
    </div>
  )
}

function SectionHeader({ title, description }) {
  return (
    <div className="mb-4">
      <h2 className="text-lg font-bold text-gray-900">{title}</h2>
      {description && <p className="text-gray-500 text-sm mt-0.5">{description}</p>}
    </div>
  )
}

export default function Analytics() {
  const [sales, setSales] = useState(null)
  const [inventory, setInventory] = useState(null)
  const [users, setUsers] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      analyticsService.getSales().catch(() => null),
      analyticsService.getInventory().catch(() => null),
      analyticsService.getUsers().catch(() => null),
    ]).then(([s, inv, u]) => {
      setSales(s)
      setInventory(inv)
      setUsers(u)
    }).finally(() => setLoading(false))
  }, [])

  if (loading) return <><Navbar /><Loader /></>

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-6xl mx-auto px-6 py-8 space-y-10">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-0.5">Analytics</h1>
          <p className="text-gray-500 text-sm">Data-driven insights into your canteen operations</p>
        </div>

        {/* Sales Section */}
        <section>
          <SectionHeader title="Sales Overview" description="Revenue and order statistics" />
          {sales ? (
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
              <StatCard
                label="Total Sales"
                value={formatCurrency(sales.total_sales || 0)}
                icon={TrendingUp}
                color="bg-green-50"
                iconColor="text-green-600"
                subLabel="all time revenue"
              />
              <StatCard
                label="Total Orders"
                value={sales.total_orders ?? 0}
                icon={ShoppingBag}
                color="bg-blue-50"
                iconColor="text-blue-600"
                subLabel="orders placed"
              />
              <StatCard
                label="Delivered"
                value={sales.delivered_orders ?? 0}
                icon={CheckCircle2}
                color="bg-teal-50"
                iconColor="text-teal-600"
                subLabel="successfully delivered"
              />
              <StatCard
                label="Cancelled"
                value={sales.cancelled_orders ?? 0}
                icon={XCircle}
                color="bg-red-50"
                iconColor="text-red-500"
                subLabel="orders cancelled"
              />
              <StatCard
                label="Pending"
                value={sales.pending_orders ?? 0}
                icon={Clock}
                color="bg-orange-50"
                iconColor="text-orange-500"
                subLabel="awaiting action"
              />
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center text-gray-400 text-sm">
              Sales data unavailable
            </div>
          )}
        </section>

        {/* Users Section */}
        <section>
          <SectionHeader title="User Statistics" description="Registered users by role" />
          {users ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <StatCard
                label="Total Users"
                value={users.total_users ?? 0}
                icon={Users}
                color="bg-purple-50"
                iconColor="text-purple-600"
                subLabel="registered customers"
              />
              <StatCard
                label="Admins"
                value={users.total_admins ?? 0}
                icon={Shield}
                color="bg-indigo-50"
                iconColor="text-indigo-600"
                subLabel="admin accounts"
              />
              <StatCard
                label="Delivery Partners"
                value={users.total_delivery_partners ?? 0}
                icon={Bike}
                color="bg-amber-50"
                iconColor="text-amber-600"
                subLabel="active partners"
              />
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center text-gray-400 text-sm">
              User data unavailable
            </div>
          )}
        </section>

        {/* Inventory Section */}
        <section>
          <SectionHeader title="Inventory Health" description="Stock levels across menu items" />
          {inventory ? (
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Summary cards */}
              <div className="space-y-4">
                <StatCard
                  label="Total Items"
                  value={inventory.total_items ?? 0}
                  icon={Package}
                  color="bg-gray-50"
                  iconColor="text-gray-600"
                />
                <StatCard
                  label="Low Stock"
                  value={inventory.low_stock_items?.length ?? inventory.low_stock_count ?? 0}
                  icon={AlertTriangle}
                  color="bg-yellow-50"
                  iconColor="text-yellow-600"
                  subLabel="needs restocking"
                />
                <StatCard
                  label="Out of Stock"
                  value={inventory.out_of_stock_items?.length ?? inventory.out_of_stock_count ?? 0}
                  icon={XCircle}
                  color="bg-red-50"
                  iconColor="text-red-500"
                  subLabel="unavailable items"
                />
              </div>

              {/* Low stock list */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-500" />
                  Low Stock Items
                </h3>
                {Array.isArray(inventory.low_stock_items) && inventory.low_stock_items.length > 0 ? (
                  <ul className="space-y-2">
                    {inventory.low_stock_items.map((item, i) => (
                      <li key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                        <span className="text-sm text-gray-700 font-medium">{item.name || item}</span>
                        {item.quantity != null && (
                          <span className="text-xs bg-yellow-100 text-yellow-700 font-bold px-2 py-0.5 rounded-full">
                            {item.quantity} left
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-400 py-4 text-center">All items well-stocked</p>
                )}
              </div>

              {/* Out of stock list */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-red-500" />
                  Out of Stock
                </h3>
                {Array.isArray(inventory.out_of_stock_items) && inventory.out_of_stock_items.length > 0 ? (
                  <ul className="space-y-2">
                    {inventory.out_of_stock_items.map((item, i) => (
                      <li key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                        <span className="text-sm text-gray-700 font-medium">{item.name || item}</span>
                        <span className="text-xs bg-red-100 text-red-600 font-bold px-2 py-0.5 rounded-full">
                          Out
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-400 py-4 text-center">No items out of stock</p>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center text-gray-400 text-sm">
              Inventory data unavailable
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
