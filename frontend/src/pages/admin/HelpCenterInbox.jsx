import { useEffect, useState } from 'react'
import { Loader2, HelpCircle, CheckCircle2, Clock, Send } from 'lucide-react'
import Navbar from '../../components/common/Navbar'
import Loader from '../../components/common/Loader'
import { helpCenterService } from '../../services/helpCenterService'
import toast from 'react-hot-toast'

export default function HelpCenterInbox() {
  const [queries,  setQueries]  = useState([])
  const [loading,  setLoading]  = useState(true)
  const [replies,  setReplies]  = useState({})
  const [sending,  setSending]  = useState(null)

  const load = async () => {
    try {
      const data = await helpCenterService.getAll()
      setQueries(Array.isArray(data) ? data : [])
    } catch {
      toast.error('Failed to load queries')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const handleReply = async (id) => {
    const reply = replies[id]?.trim()
    if (!reply) return toast.error('Reply cannot be empty')
    setSending(id)
    try {
      await helpCenterService.reply(id, reply)
      toast.success('Reply sent!')
      setReplies((r) => ({ ...r, [id]: '' }))
      await load()
    } catch {
      toast.error('Failed to send reply')
    } finally {
      setSending(null)
    }
  }

  if (loading) return <><Navbar /><Loader /></>

  const open     = queries.filter((q) => q.status === 'open')
  const resolved = queries.filter((q) => q.status === 'resolved')

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-4xl mx-auto px-6 py-8 space-y-8">

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Help Center Inbox</h1>
            <p className="text-gray-500 text-sm mt-0.5">{open.length} open · {resolved.length} resolved</p>
          </div>
          <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
            <HelpCircle className="w-5 h-5 text-orange-500" />
          </div>
        </div>

        {/* Open queries */}
        <section>
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-3">Open Queries</h2>
          {open.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
              <CheckCircle2 className="w-10 h-10 text-green-400 mx-auto mb-2" />
              <p className="text-gray-500 text-sm font-medium">All caught up! No open queries.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {open.map((q) => (
                <div key={q._id} className="bg-white rounded-2xl border border-orange-100 shadow-sm p-5 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-bold text-gray-900">{q.name}</p>
                      <p className="text-xs text-gray-500">{q.email} · <span className="text-blue-500 font-medium">{q.district}</span></p>
                    </div>
                    <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full font-bold shrink-0 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Open
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 bg-gray-50 rounded-xl px-4 py-3">{q.message}</p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={replies[q._id] || ''}
                      onChange={(e) => setReplies((r) => ({ ...r, [q._id]: e.target.value }))}
                      placeholder="Type your reply..."
                      className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                    />
                    <button
                      onClick={() => handleReply(q._id)}
                      disabled={sending === q._id}
                      className="flex items-center gap-1.5 px-4 py-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white text-sm font-bold rounded-xl transition-colors"
                    >
                      {sending === q._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                      Reply
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Resolved */}
        {resolved.length > 0 && (
          <section>
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-3">Resolved</h2>
            <div className="space-y-3">
              {resolved.map((q) => (
                <div key={q._id} className="bg-white rounded-2xl border border-gray-100 p-5 space-y-2 opacity-70">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-gray-900 text-sm">{q.name} · <span className="text-blue-500">{q.district}</span></p>
                      <p className="text-xs text-gray-400">{q.email}</p>
                    </div>
                    <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Resolved
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 bg-gray-50 rounded-xl px-3 py-2">{q.message}</p>
                  {q.reply && <p className="text-xs text-green-700 bg-green-50 rounded-xl px-3 py-2">Reply: {q.reply}</p>}
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  )
}
