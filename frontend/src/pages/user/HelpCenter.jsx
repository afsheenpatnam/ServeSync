import { useState } from 'react'
import { HelpCircle, Send, CheckCircle2, Loader2 } from 'lucide-react'
import Navbar from '../../components/common/Navbar'
import { helpCenterService } from '../../services/helpCenterService'
import toast from 'react-hot-toast'

export default function HelpCenter() {
  const [form,      setForm]      = useState({ name: '', email: '', district: '', message: '' })
  const [loading,   setLoading]   = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.district || !form.message)
      return toast.error('Please fill all fields')
    setLoading(true)
    try {
      await helpCenterService.submit(form)
      setSubmitted(true)
    } catch {
      toast.error('Failed to send. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-lg mx-auto px-6 py-12">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <HelpCircle className="w-7 h-7 text-orange-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Help Center</h1>
          <p className="text-gray-500 text-sm mt-1">Cannot find delivery in your area? Let us know.</p>
        </div>
        {submitted ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center">
            <CheckCircle2 className="w-14 h-14 text-green-500 mx-auto mb-4" />
            <h2 className="text-lg font-bold text-gray-900 mb-2">Query Submitted!</h2>
            <p className="text-gray-500 text-sm">Our team has been notified. We will contact you at <strong>{form.email}</strong> soon.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Your Name</label>
              <input type="text" value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Rahul Kumar" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Email</label>
              <input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="you@gmail.com" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Your District</label>
              <input type="text" value={form.district} onChange={(e) => set('district', e.target.value)} placeholder="e.g. YSR Kadapa, Nellore, Kurnool" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Message</label>
              <textarea value={form.message} onChange={(e) => set('message', e.target.value)} placeholder="Tell us your location and how we can help..." rows={4} className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none" />
            </div>
            <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-bold transition-colors">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        )}
      </main>
    </div>
  )
}
