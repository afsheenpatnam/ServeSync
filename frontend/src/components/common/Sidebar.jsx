import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Package, ClipboardList, X } from 'lucide-react'

const adminLinks = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/items', icon: Package, label: 'Manage Items' },
  { to: '/admin/orders', icon: ClipboardList, label: 'Manage Orders' },
]

export default function Sidebar({ open, onClose }) {
  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-xl z-50 transform transition-transform duration-300 lg:translate-x-0 lg:static lg:h-auto lg:shadow-none lg:border-r lg:border-gray-100
          ${open ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex items-center justify-between px-5 h-16 border-b border-gray-100 lg:hidden">
          <span className="font-bold text-orange-500">Menu</span>
          <button onClick={onClose}><X className="w-5 h-5 text-gray-500" /></button>
        </div>

        <nav className="p-4 space-y-1">
          {adminLinks.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/admin'}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors
                ${isActive ? 'bg-orange-50 text-orange-600' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`
              }
            >
              <Icon className="w-4 h-4" />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  )
}
