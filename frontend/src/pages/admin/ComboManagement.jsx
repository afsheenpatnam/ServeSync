import { useEffect, useState } from 'react'
import { Loader2, Trash2, Combine, Check } from 'lucide-react'
import Navbar from '../../components/common/Navbar'
import Loader from '../../components/common/Loader'
import { comboService } from '../../services/comboService'
import { itemService } from '../../services/itemService'
import { formatCurrency } from '../../utils/helpers'
import toast from 'react-hot-toast'

const EMPTY = { combo_name: '', image_path: '', combo_price: '', items: [] }

export default function ComboManagement() {
  const [combos,     setCombos]     = useState([])
  const [menuItems,  setMenuItems]  = useState([])
  const [loading,    setLoading]    = useState(true)
  const [form,       setForm]       = useState(EMPTY)
  const [submitting, setSubmitting] = useState(false)
  const [deleting,   setDeleting]   = useState(null)

  const load = async () => {
    try {
      const [c, m] = await Promise.all([
        comboService.getAll().catch(() => []),
        itemService.getAll().catch(() => []),
      ])
      setCombos(Array.isArray(c) ? c : [])
      setMenuItems(Array.isArray(m) ? m : [])
    } finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const toggleItem = (id) =>
    setForm((f) => ({
      ...f,
      items: f.items.includes(id) ? f.items.filter((i) => i !== id) : [...f.items, id],
    }))

  const selectedTotal = form.items.reduce((sum, id) => {
    const item = menuItems.find((m) => m._id === id)
    return sum + (item?.price || 0)
  }, 0)

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!form.combo_name.trim())                    return toast.error('Combo name is required')
    if (!form.combo_price || Number(form.combo_price) <= 0) return toast.error('Enter a valid price')
    if (form.items.length < 2)                      return toast.error('Select at least 2 items')
    setSubmitting(true)
    try {
      await comboService.create({
        combo_name:  form.combo_name.trim(),
        image_path:  form.image_path.trim() || '',
        combo_price: Number(form.combo_price),
        items:       form.items,
      })
      toast.success('Combo created!')
      setForm(EMPTY)
      await load()
    } catch { toast.error('Failed to create combo') }
    finally { setSubmitting(false) }
  }

  const handleDelete = async (id) => {
    setDeleting(id)
    try {
      await comboService.delete(id)
      toast.success('Combo deleted')
      await load()
    } catch { toast.error('Failed to delete') }
    finally { setDeleting(null) }
  }

  if (loading) return <><Navbar /><Loader /></>

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-5xl mx-auto px-6 py-8 space-y-6">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Combo Meals</h1>
          <p className="text-gray-500 text-sm mt-0.5">Bundle items together at a special price</p>
        </div>

        <div className="grid lg:grid-cols-5 gap-6">

          {/* Form */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-5 h-fit">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 bg-orange-50 rounded-xl flex items-center justify-center">
                <Combine className="w-4 h-4 text-orange-500" />
              </div>
              <h2 className="font-bold text-gray-900">New Combo</h2>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Combo Name</label>
                <input
                  type="text"
                  value={form.combo_name}
                  onChange={(e) => setForm((f) => ({ ...f, combo_name: e.target.value }))}
                  placeholder="e.g. Student Meal"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Combo Price (₹)</label>
                <div className="relative">
                  <input
                    type="number" min="1"
                    value={form.combo_price}
                    onChange={(e) => setForm((f) => ({ ...f, combo_price: e.target.value }))}
                    placeholder="e.g. 99"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                </div>
                {selectedTotal > 0 && Number(form.combo_price) > 0 && (
                  <p className="text-xs mt-1.5">
                    {Number(form.combo_price) < selectedTotal
                      ? <span className="text-green-600 font-medium">Customer saves {formatCurrency(selectedTotal - Number(form.combo_price))}</span>
                      : <span className="text-red-500">Price is higher than individual items</span>
                    }
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Image URL (optional)</label>
                <input
                  type="text"
                  value={form.image_path}
                  onChange={(e) => setForm((f) => ({ ...f, image_path: e.target.value }))}
                  placeholder="https://..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>

              {/* Items */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                  Select Items <span className="text-orange-500">({form.items.length} selected · {formatCurrency(selectedTotal)})</span>
                </label>
                <div className="space-y-1.5 max-h-52 overflow-y-auto pr-0.5">
                  {menuItems.map((item) => {
                    const checked = form.items.includes(item._id)
                    return (
                      <button
                        key={item._id}
                        type="button"
                        onClick={() => toggleItem(item._id)}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl border text-left transition-colors ${
                          checked ? 'border-orange-400 bg-orange-50' : 'border-gray-100 hover:border-orange-200 hover:bg-gray-50'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded flex items-center justify-center shrink-0 border ${
                          checked ? 'bg-orange-500 border-orange-500' : 'border-gray-300'
                        }`}>
                          {checked && <Check className="w-3 h-3 text-white" />}
                        </div>
                        <span className="text-sm text-gray-800 flex-1 truncate">{item.name}</span>
                        <span className="text-xs text-gray-400 shrink-0">{formatCurrency(item.price)}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              <button type="submit" disabled={submitting}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-bold rounded-xl text-sm transition-colors">
                {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                Create Combo
              </button>
            </form>
          </div>

          {/* Combo list */}
          <div className="lg:col-span-3 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-gray-900">Active Combos</h2>
              <span className="text-xs bg-orange-100 text-orange-600 font-bold px-2.5 py-1 rounded-full">
                {combos.length} combos
              </span>
            </div>

            {combos.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
                <div className="text-4xl mb-3">🍱</div>
                <p className="text-gray-600 font-medium">No combos yet</p>
                <p className="text-gray-400 text-sm mt-1">Create your first combo using the form</p>
              </div>
            ) : (
              combos.map((combo) => {
                const origPrice = combo.items_detail?.reduce((s, i) => s + (i.price || 0), 0)
                const savings   = origPrice != null ? origPrice - combo.combo_price : null
                return (
                  <div key={combo._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-start gap-4">
                    {combo.image_path ? (
                      <img src={combo.image_path} alt={combo.combo_name}
                        className="w-14 h-14 rounded-xl object-cover shrink-0 border border-gray-100" />
                    ) : (
                      <div className="w-14 h-14 bg-orange-50 rounded-xl flex items-center justify-center shrink-0 text-2xl">🍱</div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-900">{combo.combo_name}</p>
                      {combo.items_detail?.length > 0 && (
                        <p className="text-xs text-gray-500 mt-0.5 truncate">
                          {combo.items_detail.map((i) => i.name).join(' + ')}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-1.5">
                        {origPrice != null && origPrice > combo.combo_price && (
                          <span className="text-xs text-gray-400 line-through">{formatCurrency(origPrice)}</span>
                        )}
                        <span className="font-extrabold text-orange-500">{formatCurrency(combo.combo_price)}</span>
                        {savings != null && savings > 0 && (
                          <span className="text-xs bg-green-100 text-green-700 font-bold px-2 py-0.5 rounded-full">
                            Save {formatCurrency(savings)}
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(combo._id)}
                      disabled={deleting === combo._id}
                      className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors shrink-0"
                    >
                      {deleting === combo._id
                        ? <Loader2 className="w-4 h-4 animate-spin" />
                        : <Trash2 className="w-4 h-4" />}
                    </button>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
