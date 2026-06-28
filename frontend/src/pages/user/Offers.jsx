import { useEffect, useState } from 'react'
import { Tag } from 'lucide-react'
import Navbar from '../../components/common/Navbar'
import Loader from '../../components/common/Loader'
import { offerService } from '../../services/offerService'
import { formatCurrency } from '../../utils/helpers'

function OfferCard({ offer }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <div className="bg-gradient-to-br from-orange-500 to-amber-400 px-4 py-3 flex items-center justify-between">
        <span className="text-white font-bold text-sm">{offer.title || 'Special Offer'}</span>
        <span className="bg-white text-orange-600 text-xs font-extrabold px-2.5 py-1 rounded-full">
          {offer.discount_percentage}% OFF
        </span>
      </div>
      <div className="p-5">
        <h3 className="font-bold text-gray-900 text-base mb-1">{offer.item_name || 'Item'}</h3>
        {offer.description && (
          <p className="text-gray-500 text-xs mb-3">{offer.description}</p>
        )}
        <div className="flex items-center gap-3">
          {offer.original_price != null && (
            <span className="text-gray-400 text-sm line-through">
              {formatCurrency(offer.original_price)}
            </span>
          )}
          {offer.final_price != null && (
            <span className="text-orange-500 font-extrabold text-lg">
              {formatCurrency(offer.final_price)}
            </span>
          )}
        </div>
        <div className="mt-3 flex items-center gap-1.5 text-green-600 text-xs font-medium">
          <Tag className="w-3.5 h-3.5" />
          Save {offer.discount_percentage}% on this item today!
        </div>
      </div>
    </div>
  )
}

export default function Offers() {
  const [offers, setOffers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    offerService.getAll()
      .then((data) => setOffers(Array.isArray(data) ? data : []))
      .catch(() => setOffers([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Today's Offers 🔥</h1>
          <p className="text-gray-500 text-sm">Exclusive discounts just for you — grab them before they're gone!</p>
        </div>

        {loading ? (
          <Loader fullPage={false} />
        ) : offers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="text-6xl mb-4">🏷️</div>
            <p className="text-lg font-semibold text-gray-700 mb-1">No offers right now</p>
            <p className="text-sm text-gray-400">Check back later — we add new deals every day!</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {offers.map((offer, i) => (
              <OfferCard key={offer._id || offer.item_id || i} offer={offer} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
