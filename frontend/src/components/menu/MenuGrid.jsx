import FoodCard from './FoodCard'
import Loader from '../common/Loader'
import { UtensilsCrossed } from 'lucide-react'

export default function MenuGrid({ items, loading }) {
  if (loading) return <Loader fullPage={false} />

  if (!items.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-400">
        <UtensilsCrossed className="w-12 h-12 mb-3" />
        <p className="text-lg font-medium">No items found</p>
        <p className="text-sm">Try a different search or category</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {items.map((item) => (
        <FoodCard key={item._id} item={item} />
      ))}
    </div>
  )
}
