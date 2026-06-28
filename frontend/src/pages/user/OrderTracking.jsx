import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, MapPin, Bike, Clock, CheckCircle2, Package, ChefHat, Navigation } from 'lucide-react'
import Navbar from '../../components/common/Navbar'
import Loader from '../../components/common/Loader'
import LiveMap from '../../components/common/LiveMap'
import { deliveryService } from '../../services/deliveryService'
import { orderService } from '../../services/orderService'
import { formatCurrency } from '../../utils/helpers'

// Haversine formula — distance in km between two GPS points
function getDistanceKm(lat1, lng1, lat2, lng2) {
  const R = 6371
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) ** 2
  return (R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))).toFixed(1)
}

const STEPS = [
  { key: 'pending',            label: 'Order Placed',     icon: Package      },
  { key: 'preparing',          label: 'Preparing',        icon: ChefHat      },
  { key: 'ready',              label: 'Ready',            icon: CheckCircle2 },
  { key: 'out for delivery',   label: 'Out for Delivery', icon: Bike         },
  { key: 'delivered',          label: 'Delivered',        icon: CheckCircle2 },
]

const STATUS_INDEX = {
  pending:            0,
  preparing:          1,
  ready:              2,
  'out for delivery': 3,
  delivered:          4,
}

export default function OrderTracking() {
  const { orderId }        = useParams()
  const [order,    setOrder]    = useState(null)
  const [location, setLocation] = useState(null)
  const [loading,  setLoading]  = useState(true)

  const loadData = async () => {
    try {
      const o = await orderService.getById(orderId)
      setOrder(o)
      if (o.status === 'out for delivery' || o.delivery_status) {
        deliveryService.getLocation(orderId).then(setLocation).catch(() => {})
      }
    } catch {
      setOrder(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
    const interval = setInterval(loadData, 8000)
    return () => clearInterval(interval)
  }, [orderId])

  if (loading) return <><Navbar /><Loader /></>

  if (!order) return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-lg mx-auto px-6 py-20 text-center">
        <p className="text-gray-500">Order not found.</p>
        <Link to="/orders" className="text-orange-500 font-medium mt-2 inline-block">Back to Orders</Link>
      </div>
    </div>
  )

  const currentStep      = STATUS_INDEX[order.status?.toLowerCase()] ?? 0
  const isOutForDelivery = order.status?.toLowerCase() === 'out for delivery'
  const isDelivered      = order.status?.toLowerCase() === 'delivered'

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-2xl mx-auto px-6 py-8 space-y-6">

        <Link to="/orders" className="flex items-center gap-2 text-sm text-gray-500 hover:text-orange-500 transition-colors font-medium">
          <ArrowLeft className="w-4 h-4" /> Back to Orders
        </Link>

        {/* Header */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-1">
            <h1 className="text-lg font-bold text-gray-900">Order #{order._id?.slice(-6)?.toUpperCase()}</h1>
            <span className={`text-xs font-bold px-3 py-1 rounded-full ${
              isDelivered                          ? 'bg-green-100 text-green-700'   :
              isOutForDelivery                     ? 'bg-blue-100 text-blue-700'     :
              order.status === 'preparing'         ? 'bg-orange-100 text-orange-700' :
                                                     'bg-yellow-100 text-yellow-700'
            }`}>
              {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
            </span>
          </div>
          <p className="text-sm text-gray-500">{formatCurrency(order.total_amount)} · {order.payment_method}</p>
          {order.scheduled_time && (
            <p className="text-xs text-orange-500 mt-1 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              Scheduled for {new Date(order.scheduled_time).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
            </p>
          )}
        </div>

        {/* Progress steps */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h2 className="font-bold text-gray-900 mb-5">Order Progress</h2>
          <div className="space-y-4">
            {STEPS.map((step, i) => {
              const done    = i < currentStep
              const current = i === currentStep
              return (
                <div key={step.key} className="flex items-center gap-4">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all ${
                    done    ? 'bg-green-500'  :
                    current ? 'bg-orange-500 ring-4 ring-orange-100' :
                              'bg-gray-100'
                  }`}>
                    <step.icon className={`w-4 h-4 ${done || current ? 'text-white' : 'text-gray-400'}`} />
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm font-semibold ${done || current ? 'text-gray-900' : 'text-gray-400'}`}>
                      {step.label}
                    </p>
                    {current && <p className="text-xs text-orange-500 font-medium">In progress…</p>}
                    {done    && <p className="text-xs text-green-500 font-medium">Done</p>}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Delivery OTP reminder */}
        {isOutForDelivery && (
          <div className="bg-orange-50 border-2 border-orange-200 rounded-2xl p-5">
            <p className="font-bold text-orange-800 mb-1">🔑 Your Delivery OTP</p>
            <p className="text-sm text-orange-700">
              Check your <strong>notifications (bell icon)</strong> for your 4-digit OTP.
              Show it to the delivery partner to confirm you received your order.
            </p>
          </div>
        )}

        {/* Live map */}
        {(isOutForDelivery || isDelivered) && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Bike className="w-4 h-4 text-orange-500" />
              {isDelivered ? 'Delivery Completed' : 'Live Tracking'}
              {isOutForDelivery && (
                <span className="ml-auto text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full font-medium animate-pulse">
                  Live
                </span>
              )}
            </h2>

            {location?.delivery_lat && location?.delivery_lng ? (
              <>
                {/* Distance badge */}
                {(location.customer_lat || order.customer_lat) && (
                  <div className="flex items-center gap-3 mb-4 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
                    <div className="w-9 h-9 bg-blue-500 rounded-xl flex items-center justify-center shrink-0">
                      <Navigation className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-blue-500 font-medium">Delivery partner is</p>
                      <p className="text-xl font-extrabold text-blue-700">
                        {getDistanceKm(
                          location.delivery_lat, location.delivery_lng,
                          location.customer_lat || order.customer_lat,
                          location.customer_lng || order.customer_lng
                        )} km away
                      </p>
                    </div>
                    <p className="ml-auto text-xs text-blue-400">Updates every 8s</p>
                  </div>
                )}

                <LiveMap
                  deliveryLat={location.delivery_lat}
                  deliveryLng={location.delivery_lng}
                  customerLat={location.customer_lat || order.customer_lat}
                  customerLng={location.customer_lng || order.customer_lng}
                  deliveryName={location.delivery_partner_name || 'Delivery Partner'}
                  height="300px"
                />
                <p className="text-xs text-gray-400 mt-2 text-center">
                  🟠 Delivery Partner &nbsp;·&nbsp; 🟢 Your Location
                </p>
              </>
            ) : (
              <div className="bg-gray-50 rounded-xl p-8 text-center">
                <MapPin className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500 font-medium">Waiting for delivery partner's location…</p>
                <p className="text-xs text-gray-400 mt-1">Map appears once the partner starts sharing their location</p>
              </div>
            )}
          </div>
        )}

        {/* Items */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h2 className="font-bold text-gray-900 mb-3">Items</h2>
          <div className="space-y-2">
            {order.items?.map((item, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span className="text-gray-700">{item.name} × {item.quantity}</span>
                <span className="font-semibold text-gray-900">{formatCurrency(item.price * item.quantity)}</span>
              </div>
            ))}
            <div className="border-t border-gray-100 pt-2 flex justify-between font-bold text-gray-900">
              <span>Total</span>
              <span>{formatCurrency(order.total_amount)}</span>
            </div>
          </div>
        </div>

      </main>
    </div>
  )
}
