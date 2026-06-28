import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Loader2, UtensilsCrossed, Eye, EyeOff, CheckCircle2 } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { validateLogin } from '../../utils/validators'
import toast from 'react-hot-toast'

const FEATURES = [
  'Browse 50+ fresh menu items daily',
  'Real-time order status tracking',
  'Pickup at counter in minutes',
]

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validateLogin(form)
    if (Object.keys(errs).length) return setErrors(errs)
    setErrors({})
    setLoading(true)
    try {
      const user = await login(form)
      toast.success(`Welcome back, ${user.name}!`)
      if (user.role === 'admin') navigate('/admin')
      else if (user.role === 'delivery') navigate('/delivery')
      else navigate('/')
    } catch (err) {
      const msg = typeof err === 'string' ? err : (err?.message || 'Login failed')

      // If email not verified → send to OTP page automatically
      if (msg.toLowerCase().includes('not verified') || msg.toLowerCase().includes('verify')) {
        toast('Please verify your email first.', { icon: '📧' })
        navigate('/verify-otp', { state: { email: form.email } })
        return
      }

      // Wrong password / user not found
      if (msg.toLowerCase().includes('invalid') || msg.toLowerCase().includes('credentials')) {
        setErrors({ password: 'Incorrect email or password' })
        return
      }

      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">

      {/* Left brand panel */}
      <div className="hidden lg:flex w-[46%] bg-gradient-to-br from-orange-500 via-orange-400 to-amber-400 relative overflow-hidden">
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-white/10 rounded-full" />
        <div className="absolute -bottom-24 -right-16 w-96 h-96 bg-white/10 rounded-full" />
        <div className="absolute top-1/2 right-10 w-20 h-20 bg-white/10 rounded-3xl rotate-12" />

        <div className="relative z-10 flex flex-col justify-center px-14 py-16 w-full">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-11 h-11 bg-white/25 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <UtensilsCrossed className="w-5 h-5 text-white" />
            </div>
            <span className="text-white text-2xl font-bold tracking-tight">ServeSync</span>
          </div>

          <h1 className="text-white text-4xl font-extrabold leading-tight mb-4">
            Delicious food,<br />delivered fast.
          </h1>
          <p className="text-orange-100 text-base leading-relaxed mb-10 max-w-xs">
            Order from your college canteen with ease. Fresh menu every day, real-time tracking,
            and counter pickup in minutes.
          </p>

          <ul className="space-y-3">
            {FEATURES.map((f) => (
              <li key={f} className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-orange-200 shrink-0" />
                <span className="text-orange-50 text-sm">{f}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 bg-gray-50 min-h-screen flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-9 h-9 bg-orange-500 rounded-xl flex items-center justify-center">
              <UtensilsCrossed className="w-4 h-4 text-white" />
            </div>
            <span className="text-orange-500 font-bold text-xl">ServeSync</span>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-1">Welcome back</h2>
            <p className="text-gray-500 text-sm">Sign in with your Gmail to continue</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 space-y-5">

            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                Gmail Address
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => set('email', e.target.value.trim())}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit(e)}
                placeholder="you@gmail.com"
                autoComplete="email"
                className={`w-full px-4 py-3 rounded-xl border text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all ${
                  errors.email ? 'border-red-300 bg-red-50' : 'border-gray-200'
                }`}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1.5">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => set('password', e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmit(e)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className={`w-full px-4 py-3 pr-11 rounded-xl border text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all ${
                    errors.password ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1.5">{errors.password}</p>}
            </div>

            {/* Sign In button */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 active:scale-[0.98] disabled:opacity-60 text-white font-bold py-3 rounded-xl transition-all text-sm mt-1"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </div>

          <div className="mt-6 text-center space-y-3">
            <p className="text-sm text-gray-500">New to ServeSync? Join for free!</p>
            <Link
              to="/signup"
              className="block w-full py-3 rounded-xl border-2 border-orange-500 text-orange-500 font-bold text-sm hover:bg-orange-50 transition-colors"
            >
              Create a Free Account
            </Link>
          </div>

        </div>
      </div>
    </div>
  )
}
