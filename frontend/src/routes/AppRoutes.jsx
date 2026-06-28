import { Routes, Route, Navigate } from 'react-router-dom'
import Login from '../pages/auth/Login'
import Signup from '../pages/auth/Signup'
import VerifyOTP from '../pages/auth/VerifyOTP'
import ProjectGuide from '../pages/ProjectGuide'
import Dashboard from '../pages/user/Dashboard'
import Menu from '../pages/user/Menu'
import Cart from '../pages/user/Cart'
import Orders from '../pages/user/Orders'
import Offers from '../pages/user/Offers'
import Combos from '../pages/user/Combos'
import OrderTracking from '../pages/user/OrderTracking'
import AdminDashboard from '../pages/admin/AdminDashboard'
import ManageItems from '../pages/admin/ManageItems'
import ManageOrders from '../pages/admin/ManageOrders'
import Analytics from '../pages/admin/Analytics'
import OffersManagement from '../pages/admin/OffersManagement'
import ComboManagement from '../pages/admin/ComboManagement'
import DeliveryManagement from '../pages/admin/DeliveryManagement'
import DeliveryDashboard from '../pages/delivery/DeliveryDashboard'
import HelpCenter from '../pages/user/HelpCenter'
import HelpCenterInbox from '../pages/admin/HelpCenterInbox'
import ProtectedRoute from '../components/common/ProtectedRoute'

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/verify-otp" element={<VerifyOTP />} />
      <Route path="/guide" element={<ProjectGuide />} />
      <Route path="/offers" element={<Offers />} />

      {/* Public help center — no login needed */}
      <Route path="/help-center" element={<HelpCenter />} />

      {/* User */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/combos" element={<Combos />} />
        <Route path="/orders/:orderId/tracking" element={<OrderTracking />} />
      </Route>

      {/* Delivery */}
      <Route element={<ProtectedRoute deliveryOnly />}>
        <Route path="/delivery" element={<DeliveryDashboard />} />
      </Route>

      {/* Admin */}
      <Route element={<ProtectedRoute adminOnly />}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/items" element={<ManageItems />} />
        <Route path="/admin/orders" element={<ManageOrders />} />
        <Route path="/admin/analytics" element={<Analytics />} />
        <Route path="/admin/offers" element={<OffersManagement />} />
        <Route path="/admin/combos" element={<ComboManagement />} />
        <Route path="/admin/delivery" element={<DeliveryManagement />} />
        <Route path="/admin/help-center" element={<HelpCenterInbox />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
