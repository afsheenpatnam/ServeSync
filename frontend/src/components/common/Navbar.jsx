import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { ShoppingCart, LogOut, UtensilsCrossed, Menu, X, LayoutDashboard, BookOpen, ClipboardList, Package, Tag, Combine, Bike, BarChart3 } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import NotificationBell from './NotificationBell'

const USER_NAV = [
  { to: '/', label: 'Home', icon: LayoutDashboard, exact: true },
  { to: '/menu', label: 'Menu', icon: BookOpen },
  { to: '/offers', label: 'Offers', icon: Tag },
  { to: '/combos', label: 'Combos', icon: Combine },
  { to: '/orders', label: 'My Orders', icon: ClipboardList },
]

const ADMIN_NAV = [
  { to: '/admin',              label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { to: '/admin/items',        label: 'Items',     icon: Package },
  { to: '/admin/orders',       label: 'Orders',    icon: ClipboardList },
  { to: '/admin/delivery',     label: 'Delivery',  icon: Bike },
  { to: '/admin/analytics',    label: 'Analytics', icon: BarChart3 },
]

const DELIVERY_NAV = [
  { to: '/delivery', label: 'Dashboard', icon: Bike, exact: true },
]

export default function Navbar() {
  const { user, logout, isAdmin, isDelivery } = useAuth()
  const { count } = useCart()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
    setMobileOpen(false)
  }

  const navLinks = isAdmin ? ADMIN_NAV : isDelivery ? DELIVERY_NAV : USER_NAV

  const isActive = ({ to, exact }) =>
    exact ? pathname === to : pathname === to || pathname.startsWith(to + '/')

  return (
    <nav className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-16">

        {/* Logo */}
        <Link
          to={isAdmin ? '/admin' : isDelivery ? '/delivery' : '/'}
          className="flex items-center gap-2.5 font-bold text-orange-500 text-lg shrink-0"
        >
          <div className="w-8 h-8 bg-orange-500 rounded-xl flex items-center justify-center shrink-0">
            <UtensilsCrossed className="w-4 h-4 text-white" />
          </div>
          ServeSync
        </Link>

        {/* Desktop nav — centered */}
        {user && (
          <div className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
            {navLinks.map((link) => {
              const active = isActive(link)
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    active
                      ? 'bg-orange-50 text-orange-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <link.icon className={`w-4 h-4 ${active ? 'text-orange-500' : 'text-gray-400'}`} />
                  {link.label}
                </Link>
              )
            })}
          </div>
        )}

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Notification bell — users only */}
          {user && !isAdmin && !isDelivery && <NotificationBell />}

          {/* Cart icon */}
          {user && !isAdmin && !isDelivery && (
            <Link
              to="/cart"
              className={`relative p-2.5 rounded-xl transition-colors ${
                pathname === '/cart'
                  ? 'bg-orange-50 text-orange-500'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
              }`}
            >
              <ShoppingCart className="w-5 h-5" />
              {count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-orange-500 text-white text-[10px] font-bold min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-1 leading-none">
                  {count > 9 ? '9+' : count}
                </span>
              )}
            </Link>
          )}

          {/* User info + logout */}
          {user ? (
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-2 bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-xl">
                <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">
                  {user.name?.[0]?.toUpperCase()}
                </div>
                <span className="text-sm font-medium text-gray-700 max-w-[90px] truncate">
                  {user.name?.split(' ')[0]}
                </span>
                {isAdmin && (
                  <span className="text-[10px] bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded-full font-semibold">
                    Admin
                  </span>
                )}
                {isDelivery && (
                  <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full font-semibold">
                    Delivery
                  </span>
                )}
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-500 transition-colors px-2.5 py-2 rounded-xl hover:bg-red-50"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden lg:inline">Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Link to="/login" className="text-sm px-4 py-2 rounded-xl text-gray-600 hover:text-orange-500 transition-colors font-medium">
                Login
              </Link>
              <Link to="/signup" className="text-sm px-4 py-2 rounded-xl bg-orange-500 text-white hover:bg-orange-600 transition-colors font-semibold">
                Sign Up
              </Link>
            </div>
          )}

          {/* Mobile hamburger */}
          {user && (
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-xl text-gray-500 hover:bg-gray-50 transition-colors"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          )}
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && user && (
        <div className="md:hidden border-t border-gray-100 bg-white px-6 py-3 space-y-1">
          {navLinks.map((link) => {
            const active = isActive(link)
            return (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  active ? 'bg-orange-50 text-orange-600' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <link.icon className="w-4 h-4" />
                {link.label}
              </Link>
            )
          })}
          <div className="border-t border-gray-100 pt-2 mt-2">
            <div className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 mb-1">
              <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                {user.name?.[0]?.toUpperCase()}
              </div>
              <span className="font-medium">{user.name}</span>
              {isAdmin && (
                <span className="text-[10px] bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded-full font-semibold">Admin</span>
              )}
              {isDelivery && (
                <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full font-semibold">Delivery</span>
              )}
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2.5 w-full rounded-xl text-sm text-red-500 hover:bg-red-50 transition-colors font-medium"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}
