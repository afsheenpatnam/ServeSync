import { Pencil, Trash2, ToggleLeft, ToggleRight } from 'lucide-react'
import { formatCurrency, getImageUrl } from '../../utils/helpers'
import { itemService } from '../../services/itemService'
import toast from 'react-hot-toast'

export default function StockTable({ items, onEdit, onRefresh }) {
  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"?`)) return
    try {
      await itemService.delete(id)
      toast.success('Item deleted')
      onRefresh?.()
    } catch (err) {
      toast.error(typeof err === 'string' ? err : 'Delete failed')
    }
  }

  const handleToggle = async (id, currentValue) => {
    try {
      await itemService.toggleAvailability(id, currentValue)
      onRefresh?.()
    } catch (err) {
      toast.error(typeof err === 'string' ? err : 'Toggle failed')
    }
  }

  if (!items.length) {
    return <p className="text-center py-10 text-gray-400 text-sm">No items yet. Add your first item!</p>
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-100">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
          <tr>
            <th className="text-left px-4 py-3">Item</th>
            <th className="text-left px-4 py-3">Category</th>
            <th className="text-right px-4 py-3">Price</th>
            <th className="text-right px-4 py-3">Stock</th>
            <th className="text-center px-4 py-3">Status</th>
            <th className="text-center px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {items.map((item) => (
            <tr key={item._id} className="hover:bg-gray-50/60 transition-colors">
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <img
                    src={getImageUrl(item.image)}
                    alt={item.name}
                    className="w-9 h-9 rounded-lg object-cover bg-gray-100 shrink-0"
                    onError={(e) => { e.target.src = 'https://placehold.co/36x36?text=F' }}
                  />
                  <span className="font-medium text-gray-900 max-w-40 truncate">{item.name}</span>
                </div>
              </td>
              <td className="px-4 py-3 text-gray-500">{item.category}</td>
              <td className="px-4 py-3 text-right font-medium text-gray-900">{formatCurrency(item.price)}</td>
              <td className="px-4 py-3 text-right text-gray-600">{item.stock ?? '—'}</td>
              <td className="px-4 py-3 text-center">
                <button onClick={() => handleToggle(item._id, item.is_available)} title="Toggle availability">
                  {item.is_available
                    ? <ToggleRight className="w-6 h-6 text-green-500 mx-auto" />
                    : <ToggleLeft className="w-6 h-6 text-gray-300 mx-auto" />}
                </button>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => onEdit(item)}
                    className="p-1.5 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-500 transition-colors"
                    title="Edit"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(item._id, item.name)}
                    className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
