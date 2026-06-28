import { useEffect, useState } from 'react'
import { Loader2, Tag, Trash2, Percent } from 'lucide-react'
import Navbar from '../../components/common/Navbar'
import Loader from '../../components/common/Loader'
import { offerService } from '../../services/offerService'
import { itemService } from '../../services/itemService'
import { formatCurrency } from '../../utils/helpers'
import toast from 'react-hot-toast'

export default function OffersManagement() {
  const [items,      setItems]      = useState([])
  const [offers,     setOffers]     = useState([])
  const [loading,    setLoading]    = useState(true)
  const [form,       setForm]       = useState({ item_id: '', discount_percentage: '' })
  const [submitting, setSubmitting] = useState(false)
  const [removing,   setRemoving]   = useState(null)

  const load = async () => {
    try {
      const [itemsData, offersData] = await Promise.all([
        itemService.getAll().catch(() => []),
        offerService.getAll().catch(() => []),
      ])
      setItems(Array.isArray(itemsData) ? itemsData : [])
      setOffers(Array.isArray(offersData) ? offersData : [])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const handleApply = async (e) => {
    e.preventDefault()
    if (!form.item_id) return toast.error('Select an item')
    const discount = Number(form.discount_percentage)
    if (!discount || discount < 1 || discount > 90) return toast.error('Discount must be 1–90%')
    setSubmitting(true)
    try {
      await offerService.apply(form.item_id, discount)
      toast.success('Offer applied!')
      setForm({ item_id: '', discount_percentage: '' })
      await load()
    } catch { toast.error('Failed to apply offer') }
    finally { setSubmitting(false) }
  }

  const handleRemove = async (itemId) => {
    setRemoving(itemId)
    try {
      await offerService.remove(itemId)
      toast.success('Offer removed')
      await load()
    } catch { toast.error('Failed to remove offer') }
    finally { setRemoving(null) }
  }

  if (loading) return <><Navbar /><Loader /></>

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-5xl mx-auto px-6 py-8 space-y-6">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Offers & Discounts</h1>
          <p className="text-gray-500 text-sm mt-0.5">Apply percentage discounts to menu items</p>
        </div>

        <div className="grid lg:grid-cols-5 gap-6">

          {/* Form — left */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-5 h-fit">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 bg-orange-50 rounded-xl flex items-center justify-center">
                <Tag className="w-4 h-4 text-orange-500" />
              </div>
              <h2 className="font-bold text-gray-900">New Offer</h2>
            </div>

            <form onSubmit={handleApply} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Item</label>
                <select
                  value={form.item_id}
                  onChange={(e) => setForm((f) => ({ ...f, item_id: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
                >
                  <option value="">Choose item…</option>
                  {items.map((item) => (
                    <option key={item._id} value={item._id}>
                      {item.name} — {formatCurrency(item.price)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Discount %</label>
                <div className="relative">
                  <input
                    type="number" min="1" max="90"
                    value={form.discount_percentage}
                    onChange={(e) => setForm((f) => ({ ...f, discount_percentage: e.target.value }))}
                    placeholder="e.g. 20"
                    className="w-full px-3.5 py-2.5 pr-10 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                  <Percent className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Preview */}
              {form.item_id && form.discount_percentage && (() => {
                const item = items.find((i) => i._id === form.item_id)
                const disc = Number(form.discount_percentage)
                if (!item || !disc) return null
                const final = item.price * (1 - disc / 100)
                return (
                  <div className="bg-orange-50 rounded-xl px-4 py-3 text-sm">
                    <span className="text-gray-400 line-through mr-2">{formatCurrency(item.price)}</span>
                    <span className="font-bold text-orange-600">{formatCurrency(final)}</span>
                    <span className="ml-2 text-xs bg-green-100 text-green-700 font-bold px-2 py-0.5 rounded-full">
                      Save {formatCurrency(item.price - final)}
                    </span>
                  </div>
                )
              })()}

              <button type="submit" disabled={submitting}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-bold rounded-xl text-sm transition-colors">
                {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                Apply Offer
              </button>
            </form>
          </div>

          {/* Offers list — right */}
          <div className="lg:col-span-3 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-gray-900">Active Offers</h2>
              <span className="text-xs bg-orange-100 text-orange-600 font-bold px-2.5 py-1 rounded-full">
                {offers.length} active
              </span>
            </div>

            {offers.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
                <div className="text-4xl mb-3">🏷️</div>
                <p className="text-gray-600 font-medium">No active offers</p>
                <p className="text-gray-400 text-sm mt-1">Apply an offer using the form</p>
              </div>
            ) : (
              offers.map((offer, i) => (
                <div key={offer._id || i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-4">
                  <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center shrink-0">
                    <Tag className="w-5 h-5 text-orange-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-900 truncate">{offer.item_name || '—'}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      {offer.original_price != null && (
                        <span className="text-xs text-gray-400 line-through">{formatCurrency(offer.original_price)}</span>
                      )}
                      {offer.final_price != null && (
                        <span className="text-sm font-bold text-orange-600">{formatCurrency(offer.final_price)}</span>
                      )}
                    </div>
                  </div>
                  <span className="text-sm font-extrabold bg-orange-500 text-white px-3 py-1 rounded-full shrink-0">
                    {offer.discount_percentage}% OFF
                  </span>
                  <button
                    onClick={() => handleRemove(offer.item_id || offer._id)}
                    disabled={removing === (offer.item_id || offer._id)}
                    className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors shrink-0"
                  >
                    {removing === (offer.item_id || offer._id)
                      ? <Loader2 className="w-4 h-4 animate-spin" />
                      : <Trash2 className="w-4 h-4" />}
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
