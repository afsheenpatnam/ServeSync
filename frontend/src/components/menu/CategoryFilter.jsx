import { CATEGORIES } from '../../utils/constants'

const CATEGORY_META = {
  All:       { emoji: '🍽️' },
  Breakfast: { emoji: '☀️' },
  Lunch:     { emoji: '🌤️' },
  Dinner:    { emoji: '🌙' },
  Snacks:    { emoji: '🍟' },
  Beverages: { emoji: '☕' },
  Desserts:  { emoji: '🍮' },
}

export default function CategoryFilter({ active, onChange }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none" style={{ scrollbarWidth: 'none' }}>
      {CATEGORIES.map((cat) => {
        const isActive = active === cat
        const meta = CATEGORY_META[cat] || { emoji: '🍽️' }
        return (
          <button
            key={cat}
            onClick={() => onChange(cat)}
            className={`shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
              isActive
                ? 'bg-orange-500 text-white shadow-md shadow-orange-200'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-orange-300 hover:text-orange-500'
            }`}
          >
            <span className="text-base leading-none">{meta.emoji}</span>
            {cat}
          </button>
        )
      })}
    </div>
  )
}
