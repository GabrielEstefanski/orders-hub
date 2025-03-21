import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import OrderPage from '../pages/order';
import RegisterPage from '../pages/auth/register';
import Login from '../pages/auth/login';
import ProtectedRoute from './protectedRoute';
import DashboardPage from '../pages/DashboardPage';
import MainLayout from '../components/layout/MainLayout';
import AboutSystemPage from '../pages/aboutSystem';
import NotFound from '../pages/notFound';
import { PerformancePage } from '../pages/PerformancePage';
import UserProfile from '../pages/profile/UserProfile';
import Feedback from '../pages/feedback';
const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/register" element={<RegisterPage />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/orders" element={<OrderPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/about" element={<AboutSystemPage />} />
            <Route path="/performance" element={<PerformancePage />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/feedback" element={<Feedback />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
