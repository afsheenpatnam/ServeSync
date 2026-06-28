import { useEffect, useRef, useState } from 'react'
import { Bell, X, CheckCheck } from 'lucide-react'
import { notificationService } from '../../services/notificationService'
import { formatDate } from '../../utils/helpers'

const TYPE_COLORS = {
  order:    'bg-orange-100 text-orange-600',
  delivery: 'bg-blue-100 text-blue-600',
  payment:  'bg-green-100 text-green-600',
  inventory:'bg-yellow-100 text-yellow-600',
  default:  'bg-gray-100 text-gray-600',
}

export default function NotificationBell() {
  const [open, setOpen]       = useState(false)
  const [notifs, setNotifs]   = useState([])
  const [unread, setUnread]   = useState(0)
  const ref = useRef(null)

  const load = async () => {
    try {
      const [list, countData] = await Promise.all([
        notificationService.getMyNotifications(),
        notificationService.getUnreadCount(),
      ])
      setNotifs(Array.isArray(list) ? list.slice(0, 20) : [])
      setUnread(countData?.unread_count ?? 0)
    } catch {}
  }

  useEffect(() => {
    load()
    const interval = setInterval(load, 30000) // poll every 30s
    return () => clearInterval(interval)
  }, [])

  // close on outside click
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleOpen = () => {
    setOpen((o) => !o)
    if (!open) load()
  }

  const handleRead = async (id) => {
    try {
      await notificationService.markRead(id)
      setNotifs((prev) => prev.map((n) => n._id === id ? { ...n, is_read: true } : n))
      setUnread((c) => Math.max(0, c - 1))
    } catch {}
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={handleOpen}
        className={`relative p-2.5 rounded-xl transition-colors ${
          open ? 'bg-orange-50 text-orange-500' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
        }`}
      >
        <Bell className="w-5 h-5" />
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-bold min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-1 leading-none">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-12 w-80 bg-white rounded-2xl border border-gray-100 shadow-xl z-50">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <span className="font-bold text-gray-900 text-sm">Notifications</span>
              {unread > 0 && (
                <span className="text-xs bg-red-100 text-red-600 font-bold px-2 py-0.5 rounded-full">{unread} new</span>
              )}
            </div>
            <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600 p-1">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {notifs.length === 0 ? (
              <div className="py-10 text-center">
                <CheckCheck className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                <p className="text-gray-400 text-sm">All caught up!</p>
              </div>
            ) : (
              notifs.map((n) => (
                <button
                  key={n._id}
                  onClick={() => !n.is_read && handleRead(n._id)}
                  className={`w-full text-left px-4 py-3 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors ${
                    !n.is_read ? 'bg-orange-50/40' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full mt-0.5 shrink-0 ${TYPE_COLORS[n.notification_type] || TYPE_COLORS.default}`}>
                      {n.notification_type || 'info'}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-900 leading-snug">{n.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5 leading-snug">{n.message}</p>
                      <p className="text-[10px] text-gray-300 mt-1">{formatDate(n.created_at)}</p>
                    </div>
                    {!n.is_read && <div className="w-2 h-2 bg-orange-400 rounded-full shrink-0 mt-1" />}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
