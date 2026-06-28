import { useState } from 'react'
import { Star, X, Loader2 } from 'lucide-react'
import { reviewService } from '../../services/reviewService'
import toast from 'react-hot-toast'

export default function ReviewModal({ order, onClose }) {
  const [ratings,  setRatings]  = useState({})
  const [comments, setComments] = useState({})
  const [loading,  setLoading]  = useState(false)

  const setRating  = (itemId, val) => setRatings((r) => ({ ...r, [itemId]: val }))
  const setComment = (itemId, val) => setComments((c) => ({ ...c, [itemId]: val }))

  const handleSubmit = async () => {
    const items = order.items || []
    if (items.some((i) => !ratings[i.item_id])) {
      return toast.error('Please rate all items')
    }
    setLoading(true)
    try {
      await Promise.all(
        items.map((item) =>
          reviewService.addReview({
            order_id: order._id,
            item_id:  item.item_id,
            rating:   ratings[item.item_id],
            comment:  comments[item.item_id] || '',
          })
        )
      )
      toast.success('Thanks for your review!')
      onClose()
    } catch (err) {
      toast.error(typeof err === 'string' ? err : 'Failed to submit review')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="font-bold text-gray-900">Rate Your Order</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {(order.items || []).map((item) => (
            <div key={item.item_id} className="border border-gray-100 rounded-2xl p-4">
              <p className="font-semibold text-gray-900 text-sm mb-3">{item.name}</p>

              {/* Star row */}
              <div className="flex gap-1 mb-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(item.item_id, star)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-7 h-7 ${
                        star <= (ratings[item.item_id] || 0)
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-gray-200'
                      }`}
                    />
                  </button>
                ))}
                {ratings[item.item_id] && (
                  <span className="ml-2 text-xs text-gray-400 self-center">
                    {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][ratings[item.item_id]]}
                  </span>
                )}
              </div>

              <textarea
                value={comments[item.item_id] || ''}
                onChange={(e) => setComment(item.item_id, e.target.value)}
                placeholder="Add a comment (optional)…"
                rows={2}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
              />
            </div>
          ))}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-bold py-3 rounded-xl transition-all text-sm"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? 'Submitting…' : 'Submit Review'}
          </button>
        </div>
      </div>
    </div>
  )
}
