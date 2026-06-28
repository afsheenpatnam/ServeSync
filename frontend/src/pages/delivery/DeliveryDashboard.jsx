import { useEffect, useRef, useState } from 'react'
import { Loader2, Package, CheckCircle2, Bike, ChevronDown, MapPin, KeyRound, Navigation, RefreshCw, IndianRupee } from 'lucide-react'
import Navbar from '../../components/common/Navbar'
import Loader from '../../components/common/Loader'
import LiveMap from '../../components/common/LiveMap'
import { deliveryService } from '../../services/deliveryService'
import { useAuth } from '../../context/AuthContext'
import { formatCurrency } from '../../utils/helpers'
import toast from 'react-hot-toast'

const STATUS_OPTIONS = ['Picked Up', 'Reached Location', 'Waiting For Confirmation']

function StatCard({ label, value, icon: Icon, color, iconColor }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-4">
      <div className={`w-11 h-11 ${color} rounded-xl flex items-center justify-center`}>
        <Icon className={`w-5 h-5 ${iconColor}`} />
      </div>
      <div>
        <p className="text-3xl font-extrabold text-gray-900 leading-none">{value}</p>
        <p className="text-sm font-semibold text-gray-700 mt-1.5">{label}</p>
      </div>
    </div>
  )
}

function AvailableOrderRow({ order, onAccept, accepting }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <span className="text-sm font-bold text-gray-900">Order #{order._id?.slice(-6)?.toUpperCase()}</span>
          <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full font-medium">{order.order_status}</span>
          {order.delivery_area && (
            <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
              <MapPin className="w-3 h-3" />{order.delivery_area}
            </span>
          )}
        </div>
        <p className="text-xs text-gray-500">{order.items?.map((i) => `${i.name} x${i.quantity}`).join(', ')}</p>
        <p className="text-xs text-gray-400 mt-0.5">{order.user_email} · {formatCurrency(order.total_amount || 0)}</p>
      </div>
      <button
        onClick={() => onAccept(order._id)}
        disabled={accepting === order._id}
        className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white text-sm font-semibold rounded-xl transition-colors shrink-0"
      >
        {accepting === order._id && <Loader2 className="w-4 h-4 animate-spin" />}
        Accept Order
      </button>
    </div>
  )
}

function ActiveOrderCard({ order, onVerifyOtp, onUpdateStatus, verifying, updating, myLocation }) {
  const [otp,            setOtp]            = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')
  const [showMap,        setShowMap]        = useState(false)

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
      {/* Order header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-sm font-bold text-gray-900">Order #{order._id?.slice(-6)?.toUpperCase()}</span>
            <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-medium">
              {order.delivery_status || order.order_status}
            </span>
          </div>
          <p className="text-xs text-gray-500">{order.items?.map((i) => `${i.name} x${i.quantity}`).join(', ')}</p>
          <p className="text-xs text-gray-400 mt-0.5">{order.user_email} · {formatCurrency(order.total_amount || 0)}</p>
          {order.delivery_address?.area && (
            <p className="text-xs text-blue-500 mt-0.5 flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {[order.delivery_address.flat, order.delivery_address.area, order.delivery_address.city].filter(Boolean).join(', ')}
            </p>
          )}
        </div>
        <button
          onClick={() => setShowMap((s) => !s)}
          className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl bg-blue-50 text-blue-600 font-medium hover:bg-blue-100 transition-colors"
        >
          <MapPin className="w-3.5 h-3.5" />
          {showMap ? 'Hide Map' : 'View Map'}
        </button>
      </div>

      {/* Map */}
      {showMap && (
        <LiveMap
          deliveryLat={myLocation?.lat}
          deliveryLng={myLocation?.lng}
          customerLat={order.customer_lat}
          customerLng={order.customer_lng}
          deliveryName="You"
          height="220px"
        />
      )}

      {/* Update status */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full px-3 py-2 pr-8 rounded-xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-400 appearance-none bg-white"
          >
            <option value="">Update status...</option>
            {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <ChevronDown className="w-4 h-4 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
        <button
          onClick={() => { if (selectedStatus) { onUpdateStatus(order._id, selectedStatus); setSelectedStatus('') } }}
          disabled={!selectedStatus || updating === order._id}
          className="flex items-center gap-1.5 px-4 py-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white text-sm font-semibold rounded-xl transition-colors"
        >
          {updating === order._id && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
          Update
        </button>
      </div>

      {/* COD OTP verification */}
      <div className="border-t border-gray-100 pt-4">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-1.5">
          <KeyRound className="w-3.5 h-3.5" /> COD Confirmation OTP
        </p>
        <p className="text-xs text-gray-400 mb-3">Ask the customer to show their OTP from notifications. Enter it below to confirm delivery.</p>
        <div className="flex gap-2">
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 4))}
            placeholder="4-digit OTP"
            className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 font-mono text-center tracking-widest"
          />
          <button
            onClick={() => { onVerifyOtp(order._id, otp); setOtp('') }}
            disabled={otp.length < 4 || verifying === order._id}
            className="flex items-center gap-1.5 px-4 py-2 bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white text-sm font-semibold rounded-xl transition-colors"
          >
            {verifying === order._id && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            Confirm
          </button>
        </div>
      </div>
    </div>
  )
}

export default function DeliveryDashboard() {
  const { user } = useAuth()
  const [availableOrders, setAvailableOrders] = useState([])
  const [myOrders,        setMyOrders]        = useState([])
  const [loading,         setLoading]         = useState(true)
  const [accepting,       setAccepting]       = useState(null)
  const [updating,        setUpdating]        = useState(null)
  const [verifying,       setVerifying]       = useState(null)
  const [myLocation,      setMyLocation]      = useState(null)
  const [sharing,         setSharing]         = useState(false)
  const [fetchError,      setFetchError]      = useState(false)
  const [isAvailable,     setIsAvailable]     = useState(true)
  const [togglingAvail,   setTogglingAvail]   = useState(false)
  const watchRef = useRef(null)
  const intervalRef = useRef(null)
  const pollRef = useRef(null)

  const load = async (silent = false) => {
    if (!silent) setLoading(true)
    setFetchError(false)
    try {
      const [available, mine] = await Promise.all([
        deliveryService.getAvailableOrders(),
        deliveryService.getMyOrders(),
      ])
      setAvailableOrders(Array.isArray(available) ? available : [])
      setMyOrders(Array.isArray(mine) ? mine : [])
    } catch (err) {
      setFetchError(true)
      if (!silent) toast.error('Could not load orders. Check your connection.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    pollRef.current = setInterval(() => load(true), 30000)
    return () => clearInterval(pollRef.current)
  }, [])

  const handleToggleAvailability = async () => {
    setTogglingAvail(true)
    try {
      const res = await deliveryService.toggleAvailability()
      setIsAvailable(res.is_available)
      toast.success(res.message)
    } catch {
      toast.error('Failed to update availability')
    } finally {
      setTogglingAvail(false)
    }
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (watchRef.current) navigator.geolocation.clearWatch(watchRef.current)
      if (intervalRef.current) clearInterval(intervalRef.current)
      if (pollRef.current) clearInterval(pollRef.current)
    }
  }, [])

  const activeOrders    = myOrders.filter((o) => o.delivery_status !== 'Delivered' && o.order_status !== 'Delivered')
  const completedOrders = myOrders.filter((o) => o.delivery_status === 'Delivered' || o.order_status === 'Delivered')
  const completedToday  = completedOrders.length
  const totalEarnings   = completedOrders.reduce((sum, o) => sum + (o.total_amount || 0), 0)

  const startSharingLocation = () => {
    if (!navigator.geolocation) return toast.error('GPS not available on this device')

    setSharing(true)
    toast.success('Location sharing started')

    watchRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords
        setMyLocation({ lat, lng })

        // Send location update for all active orders
        activeOrders.forEach((order) => {
          deliveryService.updateLocation(order._id, lat, lng).catch(() => {})
        })
      },
      () => { setSharing(false); toast.error('GPS error') },
      { enableHighAccuracy: true, maximumAge: 5000 }
    )
  }

  const stopSharingLocation = () => {
    if (watchRef.current) navigator.geolocation.clearWatch(watchRef.current)
    setSharing(false)
    setMyLocation(null)
    toast('Location sharing stopped')
  }

  const handleAccept = async (orderId) => {
    setAccepting(orderId)
    try {
      const res = await deliveryService.acceptOrder(orderId)
      toast.success('Order accepted! Check My Active Deliveries.')
      if (res.delivery_otp) toast(`Your delivery OTP is ${res.delivery_otp}`, { icon: '🔑', duration: 6000 })
      await load()
    } catch (err) {
      toast.error(typeof err === 'string' ? err : 'Failed to accept order')
    } finally {
      setAccepting(null)
    }
  }

  const handleUpdateStatus = async (orderId, status) => {
    setUpdating(orderId)
    try {
      await deliveryService.updateStatus(orderId, status)
      toast.success(`Status: "${status}"`)
      await load()
    } catch {
      toast.error('Failed to update status')
    } finally {
      setUpdating(null)
    }
  }

  const handleVerifyOtp = async (orderId, otp) => {
    if (otp.length < 4) return toast.error('Enter the 4-digit OTP')
    setVerifying(orderId)
    try {
      await deliveryService.verifyOtp(orderId, otp)
      toast.success('Delivery confirmed! Order marked as Delivered.')
      await load()
    } catch (err) {
      toast.error(typeof err === 'string' ? err : 'Wrong OTP')
    } finally {
      setVerifying(null)
    }
  }

  if (loading) return <><Navbar /><Loader /></>


  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-6xl mx-auto px-6 py-8 space-y-8">

        {/* Welcome */}
        <div className="bg-gradient-to-br from-orange-500 to-amber-400 rounded-2xl p-6 text-white flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Bike className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Welcome, {user?.name?.split(' ')[0]}!</h1>
              <p className="text-orange-100 text-sm">Delivery Partner Dashboard</p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Available / Busy toggle */}
            <button
              onClick={handleToggleAvailability}
              disabled={togglingAvail}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-colors ${
                isAvailable
                  ? 'bg-green-500 text-white hover:bg-green-600'
                  : 'bg-red-500 text-white hover:bg-red-600'
              }`}
            >
              {togglingAvail
                ? <Loader2 className="w-4 h-4 animate-spin" />
                : <span className={`w-2 h-2 rounded-full ${isAvailable ? 'bg-white' : 'bg-white/60'}`} />
              }
              {isAvailable ? 'Available' : 'Busy'}
            </button>

            {/* Location sharing toggle */}
            <button
              onClick={sharing ? stopSharingLocation : startSharingLocation}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-colors ${
                sharing
                  ? 'bg-white text-orange-600 hover:bg-orange-50'
                  : 'bg-white/20 text-white hover:bg-white/30 border border-white/30'
              }`}
            >
              <Navigation className={`w-4 h-4 ${sharing ? 'text-orange-500' : ''}`} />
              {sharing ? 'Sharing Location' : 'Share My Location'}
            </button>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard label="Available Orders"  value={availableOrders.length}          icon={Package}      color="bg-orange-50" iconColor="text-orange-500" />
          <StatCard label="Active Deliveries" value={activeOrders.length}             icon={Bike}         color="bg-blue-50"   iconColor="text-blue-500"   />
          <StatCard label="Completed"         value={completedToday}                  icon={CheckCircle2} color="bg-green-50"  iconColor="text-green-500"  />
          <StatCard label="Total Earnings"    value={`₹${totalEarnings.toFixed(0)}`}  icon={IndianRupee}  color="bg-purple-50" iconColor="text-purple-500" />
        </div>

        {/* Available Orders */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Available Orders</h2>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 text-xs text-green-600 font-medium">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                Auto-refresh
              </span>
              <button onClick={() => load(true)} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-orange-500 transition-colors">
                <RefreshCw className="w-3.5 h-3.5" />
                Refresh
              </button>
            </div>
          </div>
          {fetchError ? (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
              <p className="text-red-600 font-semibold mb-1">Could not connect to server</p>
              <p className="text-red-400 text-sm mb-3">The backend may be sleeping (Render free plan). Try again in 30 seconds.</p>
              <button onClick={() => load()} className="px-4 py-2 bg-red-500 text-white text-sm rounded-xl font-semibold hover:bg-red-600 transition-colors">Retry</button>
            </div>
          ) : availableOrders.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center">
              <div className="text-4xl mb-3">📦</div>
              <p className="text-gray-600 font-medium">No available orders right now</p>
              <p className="text-gray-400 text-sm mt-1">Orders appear here only after the admin marks them as <strong>Ready</strong></p>
              <p className="text-gray-400 text-xs mt-1">Admin → Orders → change status to "Ready for Pickup"</p>
            </div>
          ) : (
            <div className="space-y-3">
              {availableOrders.map((order) => (
                <AvailableOrderRow key={order._id} order={order} onAccept={handleAccept} accepting={accepting} />
              ))}
            </div>
          )}
        </section>

        {/* Active Deliveries */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">My Active Deliveries</h2>
            <span className="text-sm text-gray-500">{activeOrders.length} in progress</span>
          </div>
          {activeOrders.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center">
              <div className="text-4xl mb-3">🛵</div>
              <p className="text-gray-600 font-medium">No active deliveries</p>
              <p className="text-gray-400 text-sm mt-1">Accept an order above to get started</p>
            </div>
          ) : (
            <div className="space-y-4">
              {activeOrders.map((order) => (
                <ActiveOrderCard
                  key={order._id}
                  order={order}
                  onVerifyOtp={handleVerifyOtp}
                  onUpdateStatus={handleUpdateStatus}
                  verifying={verifying}
                  updating={updating}
                  myLocation={myLocation}
                />
              ))}
            </div>
          )}
        </section>

        {/* Earnings History */}
        {completedOrders.length > 0 && (
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-4">Completed Deliveries</h2>
            <div className="space-y-3">
              {completedOrders.map((order) => (
                <div key={order._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-bold text-gray-900">Order #{order._id?.slice(-6)?.toUpperCase()}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{order.user_email}</p>
                    <p className="text-xs text-gray-400">{order.items?.map((i) => `${i.name} x${i.quantity}`).join(', ')}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-green-600">₹{order.total_amount?.toFixed(0)}</p>
                    <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">Delivered</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 bg-purple-50 border border-purple-100 rounded-2xl px-5 py-4 flex items-center justify-between">
              <p className="text-sm font-bold text-purple-700">Total Earned</p>
              <p className="text-xl font-extrabold text-purple-600">₹{totalEarnings.toFixed(0)}</p>
            </div>
          </section>
        )}

      </main>
    </div>
  )
}
