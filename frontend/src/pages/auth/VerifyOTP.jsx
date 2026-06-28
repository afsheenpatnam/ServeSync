import { useState, useRef, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Loader2, UtensilsCrossed, ShieldCheck, RotateCcw } from 'lucide-react'
import { authService } from '../../services/authService'
import toast from 'react-hot-toast'

export default function VerifyOTP() {
  const { state } = useLocation()
  const navigate  = useNavigate()
  const email     = state?.email || ''

  const [digits, setDigits]   = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const [countdown, setCountdown] = useState(30)
  const refs = useRef([])

  useEffect(() => {
    if (!email) navigate('/signup', { replace: true })
    refs.current[0]?.focus()
  }, [])

  useEffect(() => {
    if (countdown <= 0) return
    const t = setInterval(() => setCountdown((c) => c - 1), 1000)
    return () => clearInterval(t)
  }, [countdown])

  const handleChange = (i, val) => {
    if (!/^\d?$/.test(val)) return
    const next = [...digits]
    next[i] = val
    setDigits(next)
    if (val && i < 5) refs.current[i + 1]?.focus()
  }

  const handleKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !digits[i] && i > 0) {
      refs.current[i - 1]?.focus()
    }
  }

  const handlePaste = (e) => {
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (text.length === 6) {
      setDigits(text.split(''))
      refs.current[5]?.focus()
    }
    e.preventDefault()
  }

  const otp = digits.join('')

  const handleVerify = async () => {
    if (otp.length < 6) return toast.error('Enter all 6 digits')
    setLoading(true)
    try {
      await authService.verifyOtp(email, otp)
      toast.success('Email verified! You can now log in.')
      navigate('/login', { replace: true })
    } catch (err) {
      toast.error(typeof err === 'string' ? err : 'Invalid or expired OTP')
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    setResending(true)
    try {
      await authService.sendOtp(email)
      toast.success('New OTP sent to your email')
      setCountdown(30)
      setDigits(['', '', '', '', '', ''])
      refs.current[0]?.focus()
    } catch {
      toast.error('Failed to resend OTP')
    } finally {
      setResending(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="flex items-center gap-2 mb-8 justify-center">
          <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
            <UtensilsCrossed className="w-5 h-5 text-white" />
          </div>
          <span className="text-orange-500 font-bold text-xl">ServeSync</span>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center">
          <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="w-7 h-7 text-green-500" />
          </div>

          <h2 className="text-xl font-extrabold text-gray-900 mb-1">Verify your email</h2>
          <p className="text-gray-500 text-sm mb-1">We sent a 6-digit code to</p>
          <p className="font-semibold text-orange-500 text-sm mb-6 truncate">{email}</p>

          {/* OTP inputs */}
          <div className="flex gap-2 justify-center mb-6" onPaste={handlePaste}>
            {digits.map((d, i) => (
              <input
                key={i}
                ref={(el) => (refs.current[i] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={d}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                className="w-11 h-12 text-center text-xl font-bold rounded-xl border-2 border-gray-200 focus:border-orange-400 focus:outline-none transition-colors text-gray-900"
              />
            ))}
          </div>

          <button
            onClick={handleVerify}
            disabled={loading || otp.length < 6}
            className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-bold py-3 rounded-xl transition-all text-sm mb-4"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? 'Verifying…' : 'Verify Email'}
          </button>

          {/* Resend */}
          <div className="flex items-center justify-center gap-2 text-sm">
            {countdown > 0 ? (
              <span className="text-gray-400">Resend in {countdown}s</span>
            ) : (
              <button
                onClick={handleResend}
                disabled={resending}
                className="flex items-center gap-1.5 text-orange-500 font-medium hover:underline disabled:opacity-60"
              >
                {resending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RotateCcw className="w-3.5 h-3.5" />}
                Resend OTP
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
