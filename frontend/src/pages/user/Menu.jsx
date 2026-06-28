import { useEffect, useState } from 'react'
import { Search, X, AlertCircle } from 'lucide-react'
import Navbar from '../../components/common/Navbar'
import CategoryFilter from '../../components/menu/CategoryFilter'
import MenuGrid from '../../components/menu/MenuGrid'
import { itemService } from '../../services/itemService'
import api from '../../services/api'

export default function Menu() {
  const [allItems, setAllItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [canteenOpen, setCanteenOpen] = useState(true)
  const [canteenMsg, setCanteenMsg] = useState('')

  useEffect(() => {
    itemService.getAll()
      .then(setAllItems)
      .catch(() => setAllItems([]))
      .finally(() => setLoading(false))

    api.get('/canteen/status').then((r) => {
      setCanteenOpen(r.data.is_open)
      setCanteenMsg(r.data.message || '')
    }).catch(() => {})
  }, [])

  const items = allItems.filter((item) => {
    const matchesCategory = category === 'All' || item.category === category
    const matchesSearch = !search || item.name.toLowerCase().includes(search.toLowerCase()) || item.category.toLowerCase().includes(search.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const availableCount = allItems.filter((i) => i.is_available).length

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-6xl mx-auto px-6 py-8">

        {/* Canteen closed banner */}
        {!canteenOpen && (
          <div className="mb-5 flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 rounded-2xl px-4 py-3.5">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-sm">Canteen is currently closed</p>
              <p className="text-xs mt-0.5">{canteenMsg || 'Orders are not being accepted right now. Check back soon!'}</p>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-0.5">Our Menu</h1>
          <p className="text-gray-500 text-sm">
            {loading ? 'Loading…' : `${availableCount} items available today`}
          </p>
        </div>

        {/* Search + filter sticky bar */}
        <div className="sticky top-16 z-30 bg-gray-50/95 backdrop-blur-sm py-3 -mx-4 sm:-mx-6 px-4 sm:px-6 mb-6 border-b border-gray-100">
          <div className="relative mb-3">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search dishes, categories…"
              className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <CategoryFilter active={category} onChange={setCategory} />
        </div>

        <MenuGrid items={items} loading={loading} />
      </main>
    </div>
  )
}
