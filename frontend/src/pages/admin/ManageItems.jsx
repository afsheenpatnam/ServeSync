import { useEffect, useState } from 'react'
import { Plus, X, Search, Package } from 'lucide-react'
import Navbar from '../../components/common/Navbar'
import StockTable from '../../components/admin/StockTable'
import AddItemForm from '../../components/admin/AddItemForm'
import EditItemModal from '../../components/admin/EditItemModal'
import Loader from '../../components/common/Loader'
import { itemService } from '../../services/itemService'

export default function ManageItems() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editItem, setEditItem] = useState(null)

  const load = async () => {
    setLoading(true)
    try {
      const data = await itemService.getAll(search ? { search } : {})
      setItems(data)
    } catch {
      setItems([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const t = setTimeout(load, 300)
    return () => clearTimeout(t)
  }, [search])

  const availableCount = items.filter((i) => i.is_available).length

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Menu Items</h1>
            <p className="text-gray-500 text-sm mt-0.5">
              {items.length} total · {availableCount} available
            </p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className={`flex items-center gap-2 text-sm font-medium px-4 py-2.5 rounded-xl transition-colors ${
              showForm
                ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                : 'bg-orange-500 text-white hover:bg-orange-600 shadow-sm shadow-orange-200'
            }`}
          >
            {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {showForm ? 'Cancel' : 'Add Item'}
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Table section */}
          <div className="flex-1 space-y-4">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search items by name or category…"
                className="w-full pl-10 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {loading ? (
              <Loader fullPage={false} />
            ) : (
              <StockTable items={items} onEdit={setEditItem} onRefresh={load} />
            )}
          </div>

          {/* Add form panel */}
          {showForm && (
            <div className="lg:w-80 bg-white rounded-2xl border border-gray-100 shadow-sm p-5 h-fit">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-orange-50 rounded-xl flex items-center justify-center">
                  <Package className="w-4 h-4 text-orange-500" />
                </div>
                <h3 className="font-bold text-gray-900">Add New Item</h3>
              </div>
              <AddItemForm onSuccess={() => { setShowForm(false); load() }} />
            </div>
          )}
        </div>
      </main>

      <EditItemModal item={editItem} onClose={() => setEditItem(null)} onSuccess={load} />
    </div>
  )
}
