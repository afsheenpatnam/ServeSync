import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { CATEGORIES } from '../../utils/constants'
import { validateItem } from '../../utils/validators'
import { itemService } from '../../services/itemService'
import toast from 'react-hot-toast'

const empty = { name: '', description: '', price: '', category: '', quantity: '', image_path: '' }

export default function AddItemForm({ onSuccess }) {
  const [form, setForm] = useState(empty)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validateItem(form)
    if (Object.keys(errs).length) return setErrors(errs)
    setErrors({})
    setLoading(true)
    try {
      await itemService.create({
        name: form.name,
        description: form.description,
        price: Number(form.price),
        category: form.category,
        quantity: Number(form.quantity) || 0,
        image_path: form.image_path,
      })
      toast.success('Item added!')
      setForm(empty)
      onSuccess?.()
    } catch (err) {
      toast.error(typeof err === 'string' ? err : 'Failed to add item')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Image URL input with live preview */}
      <div>
        <input
          value={form.image_path}
          onChange={(e) => set('image_path', e.target.value)}
          placeholder="Image URL (optional)"
          className="input-field w-full"
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
          <input
            value={form.name}
            onChange={(e) => set('name', e.target.value)}
            placeholder="Item name *"
            className="input-field w-full"
          />
          {errors.name && <p className="err">{errors.name}</p>}
        </div>

        <div>
          <input
            value={form.price}
            onChange={(e) => set('price', e.target.value)}
            placeholder="Price (₹) *"
            type="number"
            min="0"
            step="0.5"
            className="input-field w-full"
          />
          {errors.price && <p className="err">{errors.price}</p>}
        </div>

        <div>
          <input
            value={form.quantity}
            onChange={(e) => set('quantity', e.target.value)}
            placeholder="Quantity / Stock"
            type="number"
            min="0"
            className="input-field w-full"
          />
        </div>

        <div className="col-span-2">
          <select
            value={form.category}
            onChange={(e) => set('category', e.target.value)}
            className="input-field w-full"
          >
            <option value="">Select category *</option>
            {CATEGORIES.filter((c) => c !== 'All').map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          {errors.category && <p className="err">{errors.category}</p>}
        </div>

        <div className="col-span-2">
          <textarea
            value={form.description}
            onChange={(e) => set('description', e.target.value)}
            placeholder="Description (optional)"
            rows={2}
            className="input-field w-full resize-none"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-semibold py-2.5 rounded-xl transition-colors"
      >
        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        {loading ? 'Adding…' : 'Add Item'}
      </button>

      <style>{`.input-field{padding:.6rem .75rem;border:1px solid #e5e7eb;border-radius:.75rem;font-size:.875rem;outline:none;background:#fff}.input-field:focus{border-color:#f97316;box-shadow:0 0 0 2px rgba(249,115,22,.15)}.err{color:#ef4444;font-size:.75rem;margin-top:.2rem}`}</style>
    </form>
  )
}
