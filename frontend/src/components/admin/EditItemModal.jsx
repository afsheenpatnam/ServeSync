import { useState, useEffect } from 'react'
import { X, Loader2 } from 'lucide-react'
import { CATEGORIES } from '../../utils/constants'
import { validateItem } from '../../utils/validators'
import { itemService } from '../../services/itemService'
import toast from 'react-hot-toast'

export default function EditItemModal({ item, onClose, onSuccess }) {
  const [form, setForm] = useState({ name: '', description: '', price: '', category: '', quantity: '', image_path: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (item) {
      setForm({
        name: item.name,
        description: item.description || '',
        price: item.price,
        category: item.category,
        quantity: item.stock ?? item.quantity ?? '',
        image_path: item.image_path || item.image || '',
      })
    }
  }, [item])

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validateItem(form)
    if (Object.keys(errs).length) return setErrors(errs)
    setErrors({})
    setLoading(true)
    try {
      await itemService.update(item._id, {
        name: form.name,
        description: form.description,
        price: Number(form.price),
        category: form.category,
        quantity: Number(form.quantity) || 0,
        image_path: form.image_path,
      })
      toast.success('Item updated!')
      onSuccess?.()
      onClose()
    } catch (err) {
      toast.error(typeof err === 'string' ? err : 'Failed to update item')
    } finally {
      setLoading(false)
    }
  }

  if (!item) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">Edit Item</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Image URL with live preview */}
          <div>
            <input
              value={form.image_path}
              onChange={(e) => set('image_path', e.target.value)}
              placeholder="Image URL (optional)"
              className="inp w-full"
            />
            {form.image_path && (
              <img
                src={form.image_path}
                alt="preview"
                className="mt-2 w-full h-28 object-cover rounded-xl bg-gray-100"
                onError={(e) => { e.target.style.display = 'none' }}
              />
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <input value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Item name *" className="inp w-full" />
              {errors.name && <p className="err">{errors.name}</p>}
            </div>
            <div>
              <input value={form.price} onChange={(e) => set('price', e.target.value)} placeholder="Price (₹) *" type="number" min="0" step="0.5" className="inp w-full" />
              {errors.price && <p className="err">{errors.price}</p>}
            </div>
            <div>
              <input value={form.quantity} onChange={(e) => set('quantity', e.target.value)} placeholder="Quantity / Stock" type="number" min="0" className="inp w-full" />
            </div>
            <div className="col-span-2">
              <select value={form.category} onChange={(e) => set('category', e.target.value)} className="inp w-full">
                <option value="">Select category *</option>
                {CATEGORIES.filter((c) => c !== 'All').map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              {errors.category && <p className="err">{errors.category}</p>}
            </div>
            <div className="col-span-2">
              <textarea value={form.description} onChange={(e) => set('description', e.target.value)} placeholder="Description" rows={2} className="inp w-full resize-none" />
            </div>
          </div>

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white text-sm font-semibold">
              {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {loading ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </form>

        <style>{`.inp{padding:.55rem .75rem;border:1px solid #e5e7eb;border-radius:.75rem;font-size:.875rem;outline:none;width:100%;background:#fff}.inp:focus{border-color:#f97316;box-shadow:0 0 0 2px rgba(249,115,22,.15)}.err{color:#ef4444;font-size:.75rem;margin-top:.2rem}`}</style>
      </div>
    </div>
  )
}
