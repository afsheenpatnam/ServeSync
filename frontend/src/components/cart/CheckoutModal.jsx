import { useState } from 'react'
import { X, MapPin, Banknote, Loader2, Smartphone, Clock } from 'lucide-react'

export default function CheckoutModal({ onClose, onConfirm, loading }) {
  const [address,       setAddress]       = useState({ flat: '', street: '', area: '', city: '', pincode: '', district: '' })
  const [payment,       setPayment]       = useState('Cash')
  const [scheduleType,  setScheduleType]  = useState('now') // 'now' | 'later'
  const [scheduledTime, setScheduledTime] = useState('')
  const [errors,        setErrors]        = useState({})

  const setAddr = (k, v) => setAddress((a) => ({ ...a, [k]: v }))

  // min time = 15 mins from now for scheduling
  const minTime = () => {
    const d = new Date(Date.now() + 15 * 60 * 1000)
    return d.toISOString().slice(0, 16)
  }

  const validate = () => {
    const errs = {}
    if (!address.district.trim()) errs.district = 'District is required'
    if (!address.flat.trim())     errs.flat      = 'Required'
    if (!address.area.trim())     errs.area      = 'Required'
    if (!address.city.trim())     errs.city      = 'Required'
    if (!address.pincode.match(/^\d{6}$/)) errs.pincode = '6-digit pincode required'
    if (scheduleType === 'later' && !scheduledTime) errs.time = 'Pick a time'
    return errs
  }

  const handleConfirm = () => {
    const errs = validate()
    if (Object.keys(errs).length) return setErrors(errs)
    onConfirm({
      payment_method: payment,
      address,
      district:       address.district,
      scheduled_time: scheduleType === 'later' ? scheduledTime : null,
    })
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">

        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h3 className="font-bold text-gray-900 text-base">Complete Your Order</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-6 max-h-[70vh] overflow-y-auto">

          {/* Address */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 bg-orange-50 rounded-lg flex items-center justify-center">
                <MapPin className="w-3.5 h-3.5 text-orange-500" />
              </div>
              <h4 className="font-semibold text-gray-900 text-sm">Delivery Address</h4>
            </div>
            <div className="space-y-2.5">
              <div>
                <input value={address.district} onChange={(e) => setAddr('district', e.target.value)}
                  placeholder="District * (e.g. YSR Kadapa)" className="inp" />
                {errors.district && <p className="err">{errors.district}</p>}
              </div>
              <div>
                <input value={address.flat} onChange={(e) => setAddr('flat', e.target.value)}
                  placeholder="Flat / House No / Block *" className="inp" />
                {errors.flat && <p className="err">{errors.flat}</p>}
              </div>
              <input value={address.street} onChange={(e) => setAddr('street', e.target.value)}
                placeholder="Street / Building Name (optional)" className="inp" />
              <div>
                <input value={address.area} onChange={(e) => setAddr('area', e.target.value)}
                  placeholder="Area / Locality *" className="inp" />
                {errors.area && <p className="err">{errors.area}</p>}
              </div>
              <div>
                <input value={address.district} onChange={(e) => setAddr('district', e.target.value)}
                  placeholder="District * (e.g. YSR Kadapa)" className="inp" />
                {errors.district && <p className="err">{errors.district}</p>}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <input value={address.city} onChange={(e) => setAddr('city', e.target.value)}
                    placeholder="City / Town *" className="inp" />
                  {errors.city && <p className="err">{errors.city}</p>}
                </div>
                <div>
                  <input value={address.pincode}
                    onChange={(e) => setAddr('pincode', e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="Pincode *" className="inp" />
                  {errors.pincode && <p className="err">{errors.pincode}</p>}
                </div>
              </div>
            </div>
          </div>

          {/* Schedule */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 bg-orange-50 rounded-lg flex items-center justify-center">
                <Clock className="w-3.5 h-3.5 text-orange-500" />
              </div>
              <h4 className="font-semibold text-gray-900 text-sm">When do you want it?</h4>
            </div>
            <div className="grid grid-cols-2 gap-2 mb-3">
              <button type="button" onClick={() => setScheduleType('now')}
                className={`py-2.5 rounded-xl border-2 text-sm font-medium transition-all ${
                  scheduleType === 'now' ? 'border-orange-500 bg-orange-50 text-orange-600' : 'border-gray-200 text-gray-600 hover:border-orange-200'
                }`}>
                Order Now
              </button>
              <button type="button" onClick={() => setScheduleType('later')}
                className={`py-2.5 rounded-xl border-2 text-sm font-medium transition-all ${
                  scheduleType === 'later' ? 'border-orange-500 bg-orange-50 text-orange-600' : 'border-gray-200 text-gray-600 hover:border-orange-200'
                }`}>
                Schedule for Later
              </button>
            </div>
            {scheduleType === 'later' && (
              <div>
                <input
                  type="datetime-local"
                  value={scheduledTime}
                  min={minTime()}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  className="inp"
                />
                {errors.time && <p className="err">{errors.time}</p>}
                <p className="text-xs text-gray-400 mt-1">Minimum 15 minutes from now</p>
              </div>
            )}
          </div>

          {/* Payment */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 bg-orange-50 rounded-lg flex items-center justify-center">
                <Banknote className="w-3.5 h-3.5 text-orange-500" />
              </div>
              <h4 className="font-semibold text-gray-900 text-sm">Payment Method</h4>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button type="button" onClick={() => setPayment('Cash')}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                  payment === 'Cash' ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-orange-200'
                }`}>
                <Banknote className={`w-6 h-6 ${payment === 'Cash' ? 'text-orange-500' : 'text-gray-400'}`} />
                <div className="text-center">
                  <p className={`text-xs font-bold ${payment === 'Cash' ? 'text-orange-600' : 'text-gray-700'}`}>Cash on Delivery</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">Pay at counter</p>
                </div>
              </button>
              <button type="button" onClick={() => setPayment('UPI')}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                  payment === 'UPI' ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-orange-200'
                }`}>
                <Smartphone className={`w-6 h-6 ${payment === 'UPI' ? 'text-orange-500' : 'text-gray-400'}`} />
                <div className="text-center">
                  <p className={`text-xs font-bold ${payment === 'UPI' ? 'text-orange-600' : 'text-gray-700'}`}>Pay Online</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">UPI · GPay · PhonePe · Card</p>
                </div>
              </button>
            </div>
            {payment === 'UPI' && (
              <p className="mt-3 text-xs text-gray-500 bg-blue-50 border border-blue-100 rounded-xl px-3 py-2.5">
                You will be redirected to Razorpay to complete your payment securely.
              </p>
            )}
          </div>
        </div>

        <div className="px-5 pb-5 pt-3 border-t border-gray-50 flex gap-3">
          <button onClick={onClose}
            className="flex-1 py-3 rounded-xl border border-gray-200 text-sm text-gray-600 font-medium hover:bg-gray-50">
            Cancel
          </button>
          <button onClick={handleConfirm} disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white text-sm font-bold transition-colors">
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? 'Processing…' : payment === 'UPI' ? 'Proceed to Pay' : scheduleType === 'later' ? 'Schedule Order' : 'Confirm Order'}
          </button>
        </div>

        <style>{`.inp{display:block;width:100%;padding:.6rem .75rem;border:1px solid #e5e7eb;border-radius:.75rem;font-size:.875rem;outline:none;background:#fff}.inp:focus{border-color:#f97316;box-shadow:0 0 0 2px rgba(249,115,22,.15)}.err{color:#ef4444;font-size:.75rem;margin-top:.25rem}`}</style>
      </div>
    </div>
  )
}
