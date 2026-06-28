import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShoppingBag, ArrowRight, X, HelpCircle } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { cartService } from '../../services/cartService'
import { orderService } from '../../services/orderService'
import { paymentService } from '../../services/paymentService'
import CheckoutModal from './CheckoutModal'
import toast from 'react-hot-toast'

const getGPS = () =>
  new Promise((resolve) => {
    if (!navigator.geolocation) return resolve(null)
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => resolve(null),
      { timeout: 5000 }
    )
  })

export default function CheckoutButton() {
  const { items, clearCart, total } = useCart()
  const [showModal,       setShowModal]       = useState(false)
  const [loading,         setLoading]         = useState(false)
  const [notServiceable,  setNotServiceable]  = useState(null) // district name
  const navigate = useNavigate()

  const syncCartToBackend = async (email) => {
    await cartService.clearCart(email)
    for (const item of items) {
      await cartService.addToCart({
        user_email:  email,
        item_id:     item._id,
        name:        item.name,
        price:       item.price,
        quantity:    item.quantity,
        image_path:  item.image_path || item.image || '',
      })
    }
  }

  const handleConfirm = async ({ payment_method, scheduled_time, address }) => {
    setLoading(true)
    try {
      const user  = JSON.parse(localStorage.getItem('user'))
      const email = user?.email
      if (!email) throw new Error('Not logged in')

      // Try to get customer GPS for map tracking
      const gps = await getGPS()

      const extraData = {
        district: address?.district || '',
        area:     address?.area || '',
        address:  address || {},
        lat:      gps?.lat || null,
        lng:      gps?.lng || null,
      }

      if (payment_method === 'UPI') {
        setLoading(false)
        let paymentId
        try {
          paymentId = await paymentService.openRazorpay({ amount: total, email, name: user.name })
        } catch (err) {
          if (err.message !== 'cancelled') toast.error(err.message || 'Payment failed')
          return
        }
        setLoading(true)
        await syncCartToBackend(email)
        await orderService.place(email, 'UPI', scheduled_time, extraData)
        clearCart()
        setShowModal(false)
        toast.success(scheduled_time
          ? `Order scheduled for ${new Date(scheduled_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}!`
          : 'Payment successful! Order placed.')
        navigate('/orders')
      } else {
        await syncCartToBackend(email)
        await orderService.place(email, 'Cash', scheduled_time, extraData)
        clearCart()
        setShowModal(false)
        toast.success(scheduled_time
          ? `Order scheduled for ${new Date(scheduled_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}!`
          : 'Order placed! Pay at the counter when ready.')
        navigate('/orders')
      }
    } catch (err) {
      const msg = typeof err === 'string' ? err : ''
      if (msg.startsWith('NOT_SERVICEABLE:')) {
        const district = msg.split(':')[1]
        setNotServiceable(district)
        setShowModal(false)
      } else {
        toast.error(msg || 'Failed to place order')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        disabled={!items.length}
        className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-200 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition-colors shadow-md shadow-orange-200 disabled:shadow-none"
      >
        <ShoppingBag className="w-5 h-5" />
        Place Order
        <ArrowRight className="w-4 h-4" />
      </button>

      {showModal && (
        <CheckoutModal
          onClose={() => !loading && setShowModal(false)}
          onConfirm={handleConfirm}
          loading={loading}
        />
      )}

      {/* Not Serviceable Popup */}
      {notServiceable && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-xl p-6 text-center">
            <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">😔</span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">We're not there yet</h3>
            <p className="text-gray-500 text-sm mb-1">
              Sorry, we currently don't have a delivery partner in
            </p>
            <p className="font-bold text-orange-500 text-base mb-4">{notServiceable}</p>
            <p className="text-gray-400 text-xs mb-6">
              Please contact us through the Help Center and we'll try to reach your area soon.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setNotServiceable(null)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 font-medium hover:bg-gray-50"
              >
                Close
              </button>
              <button
                onClick={() => { setNotServiceable(null); navigate('/help-center') }}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-orange-500 text-white text-sm font-bold hover:bg-orange-600"
              >
                <HelpCircle className="w-4 h-4" />
                Help Center
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
