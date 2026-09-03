import { Routes, Route, Navigate } from 'react-router-dom';
import PublicLayout from '../layouts/PublicLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import Home from '../pages/public/Home';
import Products from '../pages/public/Products';
import ProductDetails from '../pages/public/ProductDetails';
import About from '../pages/public/About';
import Support from '../pages/public/Support';
import CustomerDashboard from '../pages/customer/CustomerDashboard';
import Cart from '../pages/customer/Cart';
import Orders from '../pages/customer/Orders';
import OrderDetail from '../pages/customer/OrderDetail';
import Profile from '../pages/customer/Profile';
import CustomerSupport from '../pages/customer/Support';
import ProviderDashboard from '../pages/provider/ProviderDashboard';
import ManageProviderProducts from '../pages/provider/ManageProducts';
import AddProduct from '../pages/provider/AddProduct';
import EditProduct from '../pages/provider/EditProduct';
import ProviderProfile from '../pages/provider/ProviderProfile';
import AdminDashboard from '../pages/admin/AdminDashboard';
import ManageUsers from '../pages/admin/ManageUsers';
import ManageProviders from '../pages/admin/ManageProviders';
import ManageProducts from '../pages/admin/ManageProducts';
import ManageMessages from '../pages/admin/ManageMessages';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import ForgotPassword from '../pages/auth/ForgotPassword';
import VerifyEmail from '../pages/auth/VerifyEmail';
import ResetPassword from '../pages/auth/ResetPassword';

const ROLE_KEY = 'ray-solar-role';

function getStoredRole() {
  return localStorage.getItem(ROLE_KEY) || '';
}

function ProtectedRoleRoute({ allowedRoles, children }) {
  const role = getStoredRole();

  if (!role || !allowedRoles.includes(role)) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/about" element={<About />} />
        <Route path="/support" element={<Support />} />
      </Route>

      <Route element={<DashboardLayout />}>
        <Route
          path="/customer"
          element={
            <ProtectedRoleRoute allowedRoles={['customer']}>
              <CustomerDashboard />
            </ProtectedRoleRoute>
          }
        />
        <Route
          path="/customer/cart"
          element={
            <ProtectedRoleRoute allowedRoles={['customer', 'provider', 'admin']}>
              <Cart />
            </ProtectedRoleRoute>
          }
        />
        <Route
          path="/customer/orders"
          element={
            <ProtectedRoleRoute allowedRoles={['customer', 'provider', 'admin']}>
              <Orders />
            </ProtectedRoleRoute>
          }
        />
        <Route
          path="/customer/orders/:id"
          element={
            <ProtectedRoleRoute allowedRoles={['customer']}>
              <OrderDetail />
            </ProtectedRoleRoute>
          }
        />
        <Route
          path="/customer/profile"
          element={
            <ProtectedRoleRoute allowedRoles={['customer']}>
              <Profile />
            </ProtectedRoleRoute>
          }
        />
        <Route
          path="/customer/support"
          element={
            <ProtectedRoleRoute allowedRoles={['customer']}>
              <CustomerSupport />
            </ProtectedRoleRoute>
          }
        />

        <Route
          path="/provider"
          element={
            <ProtectedRoleRoute allowedRoles={['provider']}>
              <ProviderDashboard />
            </ProtectedRoleRoute>
          }
        />
        <Route
          path="/provider/products"
          element={
            <ProtectedRoleRoute allowedRoles={['provider']}>
              <ManageProviderProducts />
            </ProtectedRoleRoute>
          }
        />
        <Route
          path="/provider/products/add"
          element={
            <ProtectedRoleRoute allowedRoles={['provider']}>
              <AddProduct />
            </ProtectedRoleRoute>
          }
        />
        <Route
          path="/provider/products/edit/:id"
          element={
            <ProtectedRoleRoute allowedRoles={['provider']}>
              <EditProduct />
            </ProtectedRoleRoute>
          }
        />
        <Route
          path="/provider/profile"
          element={
            <ProtectedRoleRoute allowedRoles={['provider']}>
              <ProviderProfile />
            </ProtectedRoleRoute>
          }
        />

        <Route path="/admin" element={<ProtectedRoleRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoleRoute>} />
        <Route path="/admin/users" element={<ProtectedRoleRoute allowedRoles={['admin']}><ManageUsers /></ProtectedRoleRoute>} />
        <Route path="/admin/providers" element={<ProtectedRoleRoute allowedRoles={['admin']}><ManageProviders /></ProtectedRoleRoute>} />
        <Route path="/admin/products" element={<ProtectedRoleRoute allowedRoles={['admin']}><ManageProducts /></ProtectedRoleRoute>} />
        <Route path="/admin/messages" element={<ProtectedRoleRoute allowedRoles={['admin']}><ManageMessages /></ProtectedRoleRoute>} />
      </Route>

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/reset-password" element={<ResetPassword />} />
    </Routes>
  );
}

export default AppRoutes;