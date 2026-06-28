import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const SECTIONS = [
  { id: 'overview',   emoji: '🏠', label: 'What You Built'     },
  { id: 'stack',      emoji: '🛠️', label: 'Tech Stack'         },
  { id: 'structure',  emoji: '📁', label: 'File Structure'     },
  { id: 'auth',       emoji: '🔐', label: 'Authentication'     },
  { id: 'routing',    emoji: '🗺️', label: 'Routing'           },
  { id: 'context',    emoji: '🧠', label: 'State & Context'    },
  { id: 'services',   emoji: '🔌', label: 'Services & Mocks'   },
  { id: 'pages',      emoji: '📄', label: 'All Pages'          },
  { id: 'components', emoji: '🧩', label: 'Components'         },
  { id: 'concepts',   emoji: '🎨', label: 'UI Concepts'        },
  { id: 'extend',     emoji: '🚀', label: 'How to Extend'      },
]

function Code({ children }) {
  return (
    <code className="bg-gray-100 text-orange-600 text-xs font-mono px-1.5 py-0.5 rounded">
      {children}
    </code>
  )
}

function Block({ children, lang = '' }) {
  return (
    <pre className="bg-gray-900 text-gray-100 text-xs font-mono rounded-xl p-4 overflow-x-auto leading-relaxed mt-3 mb-1">
      <code>{children}</code>
    </pre>
  )
}

function SectionHeader({ emoji, title, subtitle }) {
  return (
    <div className="flex items-start gap-4 mb-6">
      <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center shrink-0 text-2xl">
        {emoji}
      </div>
      <div>
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        {subtitle && <p className="text-gray-500 text-sm mt-0.5">{subtitle}</p>}
      </div>
    </div>
  )
}

function Card({ color = 'orange', title, children }) {
  const colors = {
    orange: 'border-orange-200 bg-orange-50',
    blue:   'border-blue-200 bg-blue-50',
    green:  'border-green-200 bg-green-50',
    purple: 'border-purple-200 bg-purple-50',
    gray:   'border-gray-200 bg-gray-50',
    red:    'border-red-200 bg-red-50',
  }
  return (
    <div className={`border rounded-xl p-4 ${colors[color]}`}>
      {title && <p className="font-bold text-gray-800 text-sm mb-2">{title}</p>}
      {children}
    </div>
  )
}

function Step({ n, title, children }) {
  return (
    <div className="flex gap-4 mb-4">
      <div className="w-7 h-7 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
        {n}
      </div>
      <div>
        <p className="font-semibold text-gray-800 text-sm">{title}</p>
        <p className="text-gray-600 text-sm mt-0.5 leading-relaxed">{children}</p>
      </div>
    </div>
  )
}

function Divider() {
  return <hr className="border-gray-100 my-10" />
}

export default function ProjectGuide() {
  const [active, setActive] = useState('overview')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id)
        })
      },
      { rootMargin: '-30% 0px -60% 0px' }
    )
    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Top bar */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">📖</span>
            <span className="font-bold text-gray-900">ServeSync — Project Guide</span>
            <span className="ml-2 text-xs bg-orange-100 text-orange-600 font-semibold px-2 py-0.5 rounded-full">Learn Mode</span>
          </div>
          <Link to="/login" className="text-sm text-orange-500 font-semibold hover:underline">
            Go to App →
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10 flex gap-10">

        {/* ── Sticky sidebar ── */}
        <aside className="hidden lg:block w-56 shrink-0">
          <div className="sticky top-24 space-y-1">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3 px-3">Contents</p>
            {SECTIONS.map(({ id, emoji, label }) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-left transition-colors ${
                  active === id
                    ? 'bg-orange-50 text-orange-600'
                    : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800'
                }`}
              >
                <span>{emoji}</span>
                {label}
              </button>
            ))}
          </div>
        </aside>

        {/* ── Main content ── */}
        <main className="flex-1 min-w-0 space-y-2">

          {/* ─────────────────────────────────────── OVERVIEW */}
          <section id="overview" className="scroll-mt-24 bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            <SectionHeader emoji="🏠" title="What You Built" subtitle="A full canteen ordering system — two roles, many features" />

            <div className="bg-gradient-to-r from-orange-500 to-amber-400 rounded-xl p-6 text-white mb-6">
              <h3 className="text-lg font-bold mb-1">ServeSync</h3>
              <p className="text-orange-100 text-sm leading-relaxed">
                A web app that lets college students browse the canteen menu, add items to a cart, place orders, and track them in real time.
                A separate admin panel lets canteen managers see all orders and update their status.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              <Card color="orange" title="👨‍🎓 Student (User) can…">
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Browse menu with search &amp; category filter</li>
                  <li>• Add items to cart, change quantities</li>
                  <li>• Place an order</li>
                  <li>• Track order status (Pending → Ready)</li>
                  <li>• View order history</li>
                </ul>
              </Card>
              <Card color="purple" title="👨‍🍳 Admin (Manager) can…">
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• See dashboard with stats &amp; charts</li>
                  <li>• Add / edit / remove menu items</li>
                  <li>• View all orders</li>
                  <li>• Update order status (accept, start cooking…)</li>
                  <li>• Filter orders by status</li>
                </ul>
              </Card>
            </div>

            <Card color="blue" title="⚠️ Backend not built yet — here's how we handle it">
              <p className="text-sm text-gray-700 leading-relaxed">
                Every service first tries to call the real API. If the server isn't running, it automatically falls back to
                <strong> mock (fake) data</strong> stored inside the app itself. This means you can see and click through every feature
                right now without a backend. Orders are saved in <Code>localStorage</Code> so they survive page refresh.
              </p>
            </Card>
          </section>

          <Divider />

          {/* ─────────────────────────────────────── STACK */}
          <section id="stack" className="scroll-mt-24 bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            <SectionHeader emoji="🛠️" title="Tech Stack" subtitle="The tools and libraries used to build this project" />

            <div className="space-y-4">
              {[
                {
                  name: 'React 19',
                  badge: 'UI Library',
                  color: 'bg-blue-100 text-blue-700',
                  icon: '⚛️',
                  desc: 'The core framework. React lets you build your UI as a tree of components — small, reusable pieces of HTML + JavaScript. When data changes, React automatically re-renders only what changed.',
                  example: '// A component is just a function that returns HTML-like JSX\nfunction FoodCard({ item }) {\n  return <div className="card">{item.name}</div>\n}',
                },
                {
                  name: 'Vite',
                  badge: 'Dev Server & Builder',
                  color: 'bg-yellow-100 text-yellow-700',
                  icon: '⚡',
                  desc: 'Vite is the development server. When you run `npm run dev`, Vite starts a local server at localhost:5173, instantly reloads the browser whenever you save a file, and bundles the app for production.',
                  example: '// vite.config.js — just a few plugin lines\nexport default defineConfig({\n  plugins: [react()],\n})',
                },
                {
                  name: 'Tailwind CSS (CDN)',
                  badge: 'Styling',
                  color: 'bg-sky-100 text-sky-700',
                  icon: '🎨',
                  desc: 'Instead of writing separate CSS files, Tailwind lets you style directly in JSX using short class names. The CDN version scans your HTML and generates the needed CSS automatically in the browser — no build step needed.',
                  example: '// No external CSS file needed — classes do the styling\n<div className="bg-orange-500 text-white rounded-xl px-4 py-2">\n  Order Now\n</div>',
                },
                {
                  name: 'React Router v7',
                  badge: 'Navigation',
                  color: 'bg-green-100 text-green-700',
                  icon: '🗺️',
                  desc: 'Handles navigation between pages without full page reloads. When you click "Menu" in the navbar, React Router swaps out the current page component and updates the URL — the browser never actually loads a new HTML file.',
                  example: '// Link replaces <a> tag — no page reload\n<Link to="/menu">Browse Menu</Link>\n\n// useNavigate for programmatic navigation\nconst navigate = useNavigate()\nnavigate(\'/admin\')',
                },
                {
                  name: 'Axios',
                  badge: 'HTTP Client',
                  color: 'bg-indigo-100 text-indigo-700',
                  icon: '📡',
                  desc: 'A library for making HTTP requests to the backend API. Simpler than the built-in fetch() — handles JSON parsing, error status codes, and lets you set headers (like auth tokens) globally.',
                  example: '// GET request\nconst { data } = await axios.get(\'/api/items\')\n\n// POST with body\nconst { data } = await axios.post(\'/api/orders\', { items })',
                },
                {
                  name: 'Lucide React',
                  badge: 'Icons',
                  color: 'bg-orange-100 text-orange-700',
                  icon: '✨',
                  desc: 'A library of 1000+ clean SVG icons as React components. Used throughout the app for the navbar, buttons, cards, and status indicators.',
                  example: 'import { ShoppingCart, UtensilsCrossed, LogOut } from \'lucide-react\'\n\n<ShoppingCart className="w-5 h-5 text-orange-500" />',
                },
                {
                  name: 'React Hot Toast',
                  badge: 'Notifications',
                  color: 'bg-rose-100 text-rose-700',
                  icon: '🔔',
                  desc: 'Shows the small notification popups (toasts) that appear in the top-right corner when you log in, add to cart, or update an order status.',
                  example: 'import toast from \'react-hot-toast\'\n\ntoast.success(\'Item added to cart!\')\ntoast.error(\'Something went wrong\')',
                },
              ].map(({ name, badge, color, icon, desc, example }) => (
                <div key={name} className="border border-gray-100 rounded-xl p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xl">{icon}</span>
                    <span className="font-bold text-gray-900">{name}</span>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${color}`}>{badge}</span>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed mb-1">{desc}</p>
                  <Block>{example}</Block>
                </div>
              ))}
            </div>
          </section>

          <Divider />

          {/* ─────────────────────────────────────── STRUCTURE */}
          <section id="structure" className="scroll-mt-24 bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            <SectionHeader emoji="📁" title="File Structure" subtitle="How the codebase is organized and why" />

            <Block>{`frontend/src/
├── pages/                  ← One file per screen
│   ├── auth/
│   │   ├── Login.jsx       ← /login
│   │   └── Signup.jsx      ← /signup
│   ├── user/
│   │   ├── Dashboard.jsx   ← / (home for students)
│   │   ├── Menu.jsx        ← /menu
│   │   ├── Cart.jsx        ← /cart
│   │   └── Orders.jsx      ← /orders
│   └── admin/
│       ├── AdminDashboard.jsx  ← /admin
│       ├── ManageItems.jsx     ← /admin/items
│       └── ManageOrders.jsx    ← /admin/orders
│
├── components/             ← Reusable building blocks
│   ├── common/
│   │   ├── Navbar.jsx      ← Top navigation bar
│   │   ├── Loader.jsx      ← Loading spinner
│   │   └── ProtectedRoute.jsx  ← Auth guard
│   ├── menu/
│   │   ├── FoodCard.jsx    ← Single food item card
│   │   ├── MenuGrid.jsx    ← Grid of FoodCards
│   │   └── CategoryFilter.jsx  ← Category buttons
│   ├── orders/
│   │   ├── OrderCard.jsx   ← Single order with stepper
│   │   └── OrderStatus.jsx ← Status badge chip
│   ├── cart/
│   │   ├── CartItem.jsx    ← Single item row in cart
│   │   ├── CartSummary.jsx ← Price breakdown
│   │   └── CheckoutButton.jsx
│   └── admin/
│       ├── OrderManagement.jsx ← Admin order list
│       ├── StockTable.jsx  ← Items table
│       ├── AddItemForm.jsx ← Add new item form
│       └── EditItemModal.jsx
│
├── context/                ← Global shared state
│   ├── AuthContext.jsx     ← Who is logged in
│   └── CartContext.jsx     ← What's in the cart
│
├── services/               ← API calls (+ mock fallback)
│   ├── authService.js
│   ├── itemService.js
│   └── orderService.js
│
├── mocks/
│   └── data.js             ← Fake data used when API is offline
│
├── utils/
│   ├── constants.js        ← ORDER_STATUSES, CATEGORIES, etc.
│   ├── helpers.js          ← formatCurrency(), formatDate()
│   └── validators.js       ← Form validation logic
│
├── routes/
│   └── AppRoutes.jsx       ← All route definitions
│
├── App.jsx                 ← Root: wraps everything in providers
├── main.jsx                ← Entry point: mounts App into index.html
└── index.css               ← Global base styles`}</Block>

            <div className="mt-4 grid sm:grid-cols-3 gap-3">
              <Card color="orange" title="pages/">
                <p className="text-xs text-gray-600">Full screens. Each file = one URL. They import components and call services.</p>
              </Card>
              <Card color="blue" title="components/">
                <p className="text-xs text-gray-600">Smaller pieces. FoodCard is used in both Menu and Dashboard. Build once, use anywhere.</p>
              </Card>
              <Card color="green" title="services/">
                <p className="text-xs text-gray-600">All API logic lives here. Pages never call axios directly — they call service functions.</p>
              </Card>
            </div>
          </section>

          <Divider />

          {/* ─────────────────────────────────────── AUTH */}
          <section id="auth" className="scroll-mt-24 bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            <SectionHeader emoji="🔐" title="Authentication" subtitle="How login, signup, and sessions work" />

            <p className="text-sm text-gray-600 leading-relaxed mb-6">
              Authentication answers one question: <strong>"who is currently using this app?"</strong> The answer is stored in the browser's
              <Code>localStorage</Code> so you stay logged in even after refreshing the page.
            </p>

            <div className="space-y-3 mb-6">
              <Step n="1" title="User submits the login form">
                The email and password are sent to <Code>authService.login()</Code>. The service tries the real API first.
                If the server is offline, it checks if the email matches a demo account — if yes, it returns that user's data.
              </Step>
              <Step n="2" title="Token + user are saved to localStorage">
                On success, two things are saved: <Code>token</Code> (a key that proves who you are to the server) and
                <Code>user</Code> (name, email, role). These survive page refresh.
              </Step>
              <Step n="3" title="AuthContext updates its state">
                <Code>setUser()</Code> is called. Now every component in the app can call <Code>useAuth()</Code> to get
                the current user and know their role.
              </Step>
              <Step n="4" title="React Router navigates to the right page">
                If <Code>user.role === 'admin'</Code>, you go to <Code>/admin</Code>. Otherwise, you go to <Code>/</Code>.
              </Step>
            </div>

            <Block>{`// AuthContext.jsx — simplified
const login = async (credentials) => {
  const data = await authService.login(credentials)  // calls API (or mock)
  localStorage.setItem('token', data.access_token)   // persist token
  localStorage.setItem('user', JSON.stringify(data.user))
  setUser(data.user)                                 // update global state
  return data.user
}

// Any component can read this:
const { user, isAdmin, logout } = useAuth()`}</Block>

            <div className="mt-4 grid sm:grid-cols-2 gap-4">
              <Card color="green" title="Demo Login (no backend needed)">
                <p className="text-xs text-gray-600 leading-relaxed">
                  The "Demo User" and "Demo Admin" buttons on the login page call <Code>demoLogin()</Code>,
                  which skips the API entirely and directly sets mock user data into localStorage.
                  Useful for testing the full UI without a server.
                </p>
              </Card>
              <Card color="blue" title="ProtectedRoute">
                <p className="text-xs text-gray-600 leading-relaxed">
                  Wraps all user/admin routes. If <Code>user</Code> is null (not logged in), it redirects
                  to <Code>/login</Code>. If <Code>adminOnly</Code> prop is set and the user isn't admin,
                  it redirects to <Code>/</Code>.
                </p>
              </Card>
            </div>
          </section>

          <Divider />

          {/* ─────────────────────────────────────── ROUTING */}
          <section id="routing" className="scroll-mt-24 bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            <SectionHeader emoji="🗺️" title="Routing" subtitle="How navigation between pages works" />

            <p className="text-sm text-gray-600 leading-relaxed mb-5">
              React Router v7 maps URLs to React components. When the URL changes, the matching component renders.
              No actual page reload happens — this is called a <strong>Single Page Application (SPA)</strong>.
            </p>

            <Block>{`// AppRoutes.jsx — all routes in one place

<Routes>
  {/* ── PUBLIC — anyone can visit ── */}
  <Route path="/login"  element={<Login />} />
  <Route path="/signup" element={<Signup />} />
  <Route path="/guide"  element={<ProjectGuide />} />

  {/* ── USER ONLY — must be logged in ── */}
  <Route element={<ProtectedRoute />}>          {/* ← guard */}
    <Route path="/"        element={<Dashboard />} />
    <Route path="/menu"    element={<Menu />} />
    <Route path="/cart"    element={<Cart />} />
    <Route path="/orders"  element={<Orders />} />
  </Route>

  {/* ── ADMIN ONLY ── */}
  <Route element={<ProtectedRoute adminOnly />}> {/* ← stricter guard */}
    <Route path="/admin"         element={<AdminDashboard />} />
    <Route path="/admin/items"   element={<ManageItems />} />
    <Route path="/admin/orders"  element={<ManageOrders />} />
  </Route>

  {/* ── FALLBACK — redirect anything unknown to home ── */}
  <Route path="*" element={<Navigate to="/" replace />} />
</Routes>`}</Block>

            <div className="mt-4 grid sm:grid-cols-3 gap-3">
              <Card color="gray" title="🔓 Public routes">
                <p className="text-xs text-gray-600">/login, /signup, /guide — no auth check, anyone can visit</p>
              </Card>
              <Card color="blue" title="🔒 User routes">
                <p className="text-xs text-gray-600">/, /menu, /cart, /orders — must be logged in (any role)</p>
              </Card>
              <Card color="purple" title="🛡️ Admin routes">
                <p className="text-xs text-gray-600">/admin/* — must be logged in AND have role = "admin"</p>
              </Card>
            </div>
          </section>

          <Divider />

          {/* ─────────────────────────────────────── CONTEXT */}
          <section id="context" className="scroll-mt-24 bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            <SectionHeader emoji="🧠" title="State & Context API" subtitle="How data is shared across the whole app without prop-drilling" />

            <p className="text-sm text-gray-600 leading-relaxed mb-6">
              Normally in React, data flows <em>down</em> through props: Parent → Child → Grandchild. The problem: if the
              Navbar (far away in the tree) needs to know the cart count, you'd have to pass that data through dozens of
              components. <strong>Context API</strong> solves this — it creates a global store any component can tap into.
            </p>

            <div className="grid sm:grid-cols-2 gap-5 mb-6">
              <div className="border border-orange-200 rounded-xl p-5 bg-orange-50">
                <p className="font-bold text-gray-800 mb-2">AuthContext — answers "who is logged in?"</p>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li><Code>user</Code> — the logged-in user object (or null)</li>
                  <li><Code>isAdmin</Code> — true if user.role === "admin"</li>
                  <li><Code>login()</Code> — call the API, save token</li>
                  <li><Code>demoLogin()</Code> — bypass API for demo</li>
                  <li><Code>logout()</Code> — clear localStorage + state</li>
                  <li><Code>loading</Code> — true while checking localStorage on startup</li>
                </ul>
              </div>
              <div className="border border-blue-200 rounded-xl p-5 bg-blue-50">
                <p className="font-bold text-gray-800 mb-2">CartContext — answers "what's in the cart?"</p>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li><Code>items</Code> — array of cart items with quantity</li>
                  <li><Code>count</Code> — total item count (for badge)</li>
                  <li><Code>total</Code> — total price in rupees</li>
                  <li><Code>addItem(item)</Code> — add one or increment</li>
                  <li><Code>updateQty(id, qty)</Code> — set exact quantity</li>
                  <li><Code>clearCart()</Code> — empty the cart</li>
                </ul>
              </div>
            </div>

            <Block>{`// How any component uses context:
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'

function Navbar() {
  const { user, logout, isAdmin } = useAuth()  // grab what you need
  const { count } = useCart()                  // cart badge count

  return (
    <nav>
      Welcome, {user.name}!
      {count > 0 && <span>{count} items in cart</span>}
      <button onClick={logout}>Logout</button>
    </nav>
  )
}`}</Block>
          </section>

          <Divider />

          {/* ─────────────────────────────────────── SERVICES */}
          <section id="services" className="scroll-mt-24 bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            <SectionHeader emoji="🔌" title="Services & Mock Data" subtitle="How the app talks to the backend (and fakes it when there isn't one)" />

            <p className="text-sm text-gray-600 leading-relaxed mb-5">
              Instead of calling <Code>axios</Code> directly inside a page, all HTTP logic lives in service files under
              <Code>src/services/</Code>. Pages import these service functions — they don't know or care whether the
              response came from a real server or mock data.
            </p>

            <Block>{`// src/services/itemService.js — simplified

export const itemService = {
  getAll: async (params) => {
    try {
      // 1. Try the real API
      const { data } = await axios.get('/api/items', { params })
      return data
    } catch {
      // 2. API failed (server offline) → return mock data
      return MOCK_ITEMS
    }
  },

  create: async (itemData) => {
    try {
      const { data } = await axios.post('/api/items', itemData)
      return data
    } catch {
      // Add to the in-memory mock store instead
      const newItem = { ...itemData, _id: Date.now().toString() }
      mockStore.push(newItem)
      return newItem
    }
  }
}`}</Block>

            <div className="mt-4 grid sm:grid-cols-3 gap-4">
              <Card color="orange" title="itemService.js">
                <p className="text-xs text-gray-600">getAll, getById, create, update, delete — CRUD for menu items. Mock store has 19 pre-built items.</p>
              </Card>
              <Card color="blue" title="orderService.js">
                <p className="text-xs text-gray-600">getMyOrders, getAllOrders, placeOrder, updateStatus — orders saved to localStorage so they persist.</p>
              </Card>
              <Card color="green" title="authService.js">
                <p className="text-xs text-gray-600">login, signup — if offline, matches against demo accounts (user@demo.com / admin@demo.com).</p>
              </Card>
            </div>

            <div className="mt-4">
              <Card color="gray" title="📦 Mock data lives in src/mocks/data.js">
                <p className="text-sm text-gray-600 leading-relaxed">
                  Contains <strong>MOCK_ITEMS</strong> (19 food items across Breakfast, Lunch, Dinner, Snacks, Beverages, Desserts),
                  <strong> MOCK_ORDERS</strong> (5 sample orders with different statuses), <strong>MOCK_USER</strong> and <strong>MOCK_ADMIN</strong>.
                  When you place a real order via the UI, it's saved to <Code>localStorage</Code> under the key
                  <Code>mock_orders</Code> so it shows up even after page refresh.
                </p>
              </Card>
            </div>
          </section>

          <Divider />

          {/* ─────────────────────────────────────── PAGES */}
          <section id="pages" className="scroll-mt-24 bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            <SectionHeader emoji="📄" title="All Pages — What Each Screen Does" subtitle="Walk through every route and what happens on it" />

            <div className="space-y-5">
              {[
                {
                  path: '/login',
                  file: 'pages/auth/Login.jsx',
                  color: 'bg-orange-500',
                  who: 'Public',
                  desc: 'Split-panel design. Left: brand panel with logo, features, and demo credentials. Right: email/password form. Two quick buttons let you log in as a demo user or admin without typing anything. On success, navigates to /admin or / based on role.',
                  key: 'handleDemoLogin() calls demoLogin() from AuthContext — no API needed.',
                },
                {
                  path: '/signup',
                  file: 'pages/auth/Signup.jsx',
                  color: 'bg-amber-500',
                  who: 'Public',
                  desc: 'Name, email, password form. Calls authService.signup() which hits the real API or falls back to mock. Creates a user account and auto-logs you in.',
                  key: 'validateSignup() in utils/validators.js checks fields before the API call.',
                },
                {
                  path: '/',
                  file: 'pages/user/Dashboard.jsx',
                  color: 'bg-blue-500',
                  who: 'User',
                  desc: 'Student home screen. Shows a greeting hero banner, 3 stat cards (cart items, orders placed, menu size), 3 quick-action gradient links (Menu/Orders/Cart), a "Top Picks" grid of the 4 highest-rated available items, and recent orders.',
                  key: 'Loads items + orders in parallel using Promise.all() on mount.',
                },
                {
                  path: '/menu',
                  file: 'pages/user/Menu.jsx',
                  color: 'bg-green-500',
                  who: 'User',
                  desc: 'Full menu listing with a debounced search bar (waits 300ms after you stop typing before fetching), category filter buttons (All, Breakfast, Lunch…), and a responsive grid of FoodCards. Unavailable items show a greyed-out overlay.',
                  key: 'useCallback + useEffect + setTimeout for 300ms search debounce.',
                },
                {
                  path: '/cart',
                  file: 'pages/user/Cart.jsx',
                  color: 'bg-teal-500',
                  who: 'User',
                  desc: 'Shows all cart items with +/− quantity controls, a price summary panel, and a checkout button. Empty state has a full-screen illustration with a "Browse Menu" CTA.',
                  key: 'All state lives in CartContext — the Cart page just reads it.',
                },
                {
                  path: '/orders',
                  file: 'pages/user/Orders.jsx',
                  color: 'bg-indigo-500',
                  who: 'User',
                  desc: 'Lists your orders with status-based filter tabs at the top (All, Pending, Cooking…). Each tab shows a count badge. Only tabs with at least one order are shown. Orders display as cards with a 5-step progress stepper.',
                  key: 'counts object built with reduce() over the orders array.',
                },
                {
                  path: '/admin',
                  file: 'pages/admin/AdminDashboard.jsx',
                  color: 'bg-purple-500',
                  who: 'Admin',
                  desc: 'Admin home. 4 stat cards (items, orders, revenue, pending). An order breakdown bar chart (CSS bars, no chart library). A recent orders panel showing the latest 5 with inline status-update dropdowns.',
                  key: 'Bar chart uses inline style={{ width: `${pct}%` }} for percentage bars.',
                },
                {
                  path: '/admin/items',
                  file: 'pages/admin/ManageItems.jsx',
                  color: 'bg-rose-500',
                  who: 'Admin',
                  desc: 'Full item management. Searchable table of all menu items with Edit and toggle-availability buttons. A slide-in "Add Item" form panel on the right. Clicking Edit opens a modal overlay.',
                  key: 'editItem state controls the EditItemModal — null = closed, item = open.',
                },
                {
                  path: '/admin/orders',
                  file: 'pages/admin/ManageOrders.jsx',
                  color: 'bg-orange-600',
                  who: 'Admin',
                  desc: 'All orders view. Same filter tabs as the user Orders page. Each order card shows customer name, date, items as pill tags, current status badge, and a dropdown to update status immediately.',
                  key: 'Refresh button re-fetches without showing the full loading spinner.',
                },
              ].map(({ path, file, color, who, desc, key }) => (
                <div key={path} className="border border-gray-100 rounded-xl overflow-hidden">
                  <div className={`${color} px-5 py-3 flex items-center justify-between`}>
                    <div className="flex items-center gap-3">
                      <code className="text-white font-bold text-sm">{path}</code>
                    </div>
                    <span className="text-white/80 text-xs font-semibold bg-white/20 px-2 py-0.5 rounded-full">{who}</span>
                  </div>
                  <div className="p-5">
                    <p className="text-xs text-gray-400 font-mono mb-2">{file}</p>
                    <p className="text-sm text-gray-700 leading-relaxed mb-3">{desc}</p>
                    <div className="bg-gray-50 border border-gray-100 rounded-lg px-3 py-2">
                      <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Key detail: </span>
                      <span className="text-xs text-gray-600">{key}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <Divider />

          {/* ─────────────────────────────────────── COMPONENTS */}
          <section id="components" className="scroll-mt-24 bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            <SectionHeader emoji="🧩" title="Key Components" subtitle="The reusable building blocks and how they work" />

            <div className="space-y-5">
              {[
                {
                  name: 'Navbar',
                  file: 'components/common/Navbar.jsx',
                  desc: 'Sticky top bar (z-40, bg-white). Logo on left, nav links absolutely centered, user avatar + logout on right. Reads useAuth() to decide which links to show (USER_NAV vs ADMIN_NAV). Cart badge shows item count from useCart(). Mobile: hamburger menu reveals a dropdown.',
                },
                {
                  name: 'FoodCard',
                  file: 'components/menu/FoodCard.jsx',
                  desc: 'Renders one menu item. Top half: gradient hero image (or emoji if no image). Overlays: veg/non-veg dot (green/red square with circle inside — FSSAI style), star rating. Bottom: category label, name, description, price, and Add button. Once in cart, the Add button becomes a −qty+ stepper.',
                },
                {
                  name: 'OrderCard',
                  file: 'components/orders/OrderCard.jsx',
                  desc: 'Shows one order with its 5-step status stepper (Placed→Confirmed→Cooking→Ready→Done). Steps are orange circles when completed, gray when pending. A line connects each step — orange if passed, gray if not. Cancelled orders skip the stepper and show a red label.',
                },
                {
                  name: 'OrderManagement',
                  file: 'components/admin/OrderManagement.jsx',
                  desc: 'Used by both AdminDashboard (compact=true) and ManageOrders (compact=false). In compact mode: items shown as pill badges. In full mode: items in a detailed table row. Both modes have an inline status-update <select> dropdown. Calls orderService.updateStatus() on change.',
                },
                {
                  name: 'ProtectedRoute',
                  file: 'components/common/ProtectedRoute.jsx',
                  desc: 'A layout route that wraps other routes. Uses useAuth() to check if a user is logged in. If not: redirect to /login. If adminOnly prop is true and user is not admin: redirect to /. Otherwise: renders <Outlet /> which shows the child route\'s component.',
                },
                {
                  name: 'CategoryFilter',
                  file: 'components/menu/CategoryFilter.jsx',
                  desc: 'Horizontally scrollable pill buttons for each food category. Active category gets orange background. Calls parent\'s onChange prop when clicked. Hidden scrollbar for a clean look.',
                },
              ].map(({ name, file, desc }) => (
                <div key={name} className="border border-gray-100 rounded-xl p-5">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <p className="font-bold text-gray-900">{name}</p>
                    <code className="text-[11px] text-gray-400 font-mono shrink-0">{file}</code>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </section>

          <Divider />

          {/* ─────────────────────────────────────── UI CONCEPTS */}
          <section id="concepts" className="scroll-mt-24 bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            <SectionHeader emoji="🎨" title="UI Concepts Used" subtitle="The building blocks of the visual design system" />

            <div className="space-y-6">

              <div>
                <p className="font-bold text-gray-800 mb-3">Color System</p>
                <div className="flex flex-wrap gap-2 mb-2">
                  {[
                    ['orange-500', '#f97316', 'Primary — buttons, active states'],
                    ['orange-50',  '#fff7ed', 'Light tint — card backgrounds'],
                    ['gray-900',   '#111827', 'Headings'],
                    ['gray-500',   '#6b7280', 'Body text'],
                    ['gray-100',   '#f3f4f6', 'Card borders'],
                    ['gray-50',    '#f9fafb', 'Page background'],
                  ].map(([name, hex, desc]) => (
                    <div key={name} className="border border-gray-100 rounded-xl p-3 flex items-center gap-3 bg-gray-50">
                      <div className="w-8 h-8 rounded-lg shrink-0" style={{ backgroundColor: hex }} />
                      <div>
                        <p className="text-xs font-mono font-bold text-gray-700">{name}</p>
                        <p className="text-[11px] text-gray-400">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="font-bold text-gray-800 mb-3">Layout Primitives</p>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Card color="gray" title="Container">
                    <Block>{`<main className="max-w-6xl mx-auto px-6 py-8">
  {/* All pages use this exact pattern */}
  {/* max-w-6xl = max 1152px wide */}
  {/* mx-auto   = center horizontally */}
  {/* px-6      = 24px side padding */}
  {/* py-8      = 32px top/bottom */}
</main>`}</Block>
                  </Card>
                  <Card color="gray" title="Responsive Grid">
                    <Block>{`{/* 1 col on mobile, 2 on tablet, 4 on desktop */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
  {items.map(item => <FoodCard key={item._id} item={item} />)}
</div>`}</Block>
                  </Card>
                </div>
              </div>

              <div>
                <p className="font-bold text-gray-800 mb-3">Card Pattern</p>
                <p className="text-sm text-gray-600 mb-3">Almost every card in the app follows the same formula:</p>
                <Block>{`<div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
  {/*  bg-white        = white background           */}
  {/*  rounded-2xl     = large border radius        */}
  {/*  border          = 1px border                 */}
  {/*  border-gray-100 = very light gray border     */}
  {/*  shadow-sm       = subtle drop shadow         */}
  {/*  p-5             = 20px padding all sides     */}
</div>`}</Block>
              </div>

              <div>
                <p className="font-bold text-gray-800 mb-3">Responsive Breakpoints (Tailwind)</p>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="text-left px-4 py-2 border border-gray-100 font-semibold text-gray-700">Prefix</th>
                        <th className="text-left px-4 py-2 border border-gray-100 font-semibold text-gray-700">Min Width</th>
                        <th className="text-left px-4 py-2 border border-gray-100 font-semibold text-gray-700">Device</th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-600">
                      {[
                        ['(none)', '0px', 'Mobile — always applies'],
                        ['sm:', '640px', 'Large phones, small tablets'],
                        ['md:', '768px', 'Tablets'],
                        ['lg:', '1024px', 'Laptops'],
                        ['xl:', '1280px', 'Desktops'],
                      ].map(([p, w, d]) => (
                        <tr key={p}>
                          <td className="px-4 py-2 border border-gray-100 font-mono text-orange-600">{p}</td>
                          <td className="px-4 py-2 border border-gray-100">{w}</td>
                          <td className="px-4 py-2 border border-gray-100">{d}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          </section>

          <Divider />

          {/* ─────────────────────────────────────── EXTEND */}
          <section id="extend" className="scroll-mt-24 bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            <SectionHeader emoji="🚀" title="How to Extend This Project" subtitle="Step-by-step guides for common next tasks" />

            <div className="space-y-8">

              <div>
                <p className="text-base font-bold text-gray-900 mb-4">A — Connect the Real Backend</p>
                <Step n="1" title="Set your API base URL">
                  Create a file <Code>src/services/api.js</Code> and set <Code>axios.defaults.baseURL = 'http://localhost:8000'</Code> (or wherever your backend runs).
                </Step>
                <Step n="2" title="Remove the try/catch mock fallbacks">
                  In each service file, delete the <Code>catch</Code> block that returns mock data. Let real errors bubble up.
                </Step>
                <Step n="3" title="Set the auth token on every request">
                  Use an axios interceptor to attach the token from localStorage to every request header.
                </Step>
                <Block>{`// src/services/api.js
import axios from 'axios'

axios.defaults.baseURL = 'http://localhost:8000/api'

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = \`Bearer \${token}\`
  return config
})

export default axios`}</Block>
              </div>

              <div>
                <p className="text-base font-bold text-gray-900 mb-4">B — Add a New Page</p>
                <Step n="1" title="Create the page file">
                  Add <Code>src/pages/user/Favourites.jsx</Code>. Export a default function component.
                </Step>
                <Step n="2" title="Add the route in AppRoutes.jsx">
                  Inside the <Code>{`<Route element={<ProtectedRoute />}>`}</Code> block, add <Code>{`<Route path="/favourites" element={<Favourites />} />`}</Code>.
                </Step>
                <Step n="3" title="Add it to the Navbar">
                  In <Code>Navbar.jsx</Code>, find the <Code>USER_NAV</Code> array and add your new entry.
                </Step>
                <Block>{`// Navbar.jsx
const USER_NAV = [
  { to: '/',           label: 'Home',       icon: LayoutDashboard, exact: true },
  { to: '/menu',       label: 'Menu',       icon: BookOpen },
  { to: '/orders',     label: 'My Orders',  icon: ClipboardList },
  { to: '/favourites', label: 'Favourites', icon: Heart },  // ← new
]`}</Block>
              </div>

              <div>
                <p className="text-base font-bold text-gray-900 mb-4">C — Add a New Menu Item Field</p>
                <Step n="1" title="Add the field to mock data">
                  In <Code>src/mocks/data.js</Code>, add the new field (e.g., <Code>calories: 320</Code>) to each item in <Code>MOCK_ITEMS</Code>.
                </Step>
                <Step n="2" title="Show it in FoodCard">
                  Open <Code>FoodCard.jsx</Code> and add a line to display <Code>item.calories</Code> inside the card content.
                </Step>
                <Step n="3" title="Add it to AddItemForm">
                  Open <Code>AddItemForm.jsx</Code> and add an <Code>{`<input>`}</Code> for the new field.
                </Step>
              </div>

              <div>
                <p className="text-base font-bold text-gray-900 mb-4">D — Add a New Order Status</p>
                <Step n="1" title="Add it to constants">
                  In <Code>src/utils/constants.js</Code>, add the new status to <Code>ORDER_STATUSES</Code>.
                </Step>
                <Step n="2" title="Add a color for it">
                  In <Code>OrderStatus.jsx</Code>, add a color mapping for the new status key.
                </Step>
                <Step n="3" title="Update the stepper if needed">
                  If the new status is part of the progress flow, add it to <Code>STATUS_STEPS</Code> in <Code>OrderCard.jsx</Code>.
                </Step>
              </div>

            </div>

            <div className="mt-8 bg-gradient-to-r from-orange-500 to-amber-400 rounded-2xl p-6 text-white">
              <p className="font-bold text-lg mb-1">You now know this project end-to-end 🎉</p>
              <p className="text-orange-100 text-sm leading-relaxed mb-4">
                You understand the stack, the folder structure, how auth and routing work, how mock data fills in for the missing backend,
                what every page does, and how to extend it. The best way to deepen your understanding is to change something and watch what happens.
              </p>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 bg-white text-orange-600 font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-orange-50 transition-colors"
              >
                Open the App → Try it yourself
              </Link>
            </div>
          </section>

          <div className="h-16" />
        </main>
      </div>
    </div>
  )
}
