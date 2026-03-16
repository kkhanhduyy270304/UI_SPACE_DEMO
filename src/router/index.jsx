import { useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { MainLayout } from '../components/layout';
import { SignIn } from '../features/Auth';
import { Dashboard } from '../features/Dashboard';
import { Heatmap } from '../features/Heatmap';
import { Analytics } from '../features/Analytics';
import { RuleConfiguration } from '../features/RuleConfiguration';
import { ZoneManager } from '../features/ZoneManager';
import { CameraManager } from '../features/CameraManager';
import { ManagerUsers } from '../features/ManagerUsers';
import { Settings } from '../features/Settings';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { hydrateSession } from '../redux/slices/authSlice';
import { getStoredSession } from '../services/api/authApi';
const AuthBootstrap = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(hydrateSession(getStoredSession()));
  }, [dispatch]);
  return null;
};
const ProtectedLayout = () => {
  const {
    user
  } = useAppSelector(state => state.auth);
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <MainLayout />;
};
const GuestRoute = () => {
  const {
    user
  } = useAppSelector(state => state.auth);
  return user ? <Navigate to="/dashboard" replace /> : <SignIn />;
};

/**
 * App Router Configuration
 * All routes wrapped in MainLayout for consistent Header/Footer
 */
export const AppRouter = () => {
  return <BrowserRouter>
      <AuthBootstrap />
      <Routes>
        <Route path="/login" element={<GuestRoute />} />

        <Route element={<ProtectedLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/heatmap" element={<Heatmap />} />
          <Route path="/analytics" element={<Analytics />} />

          <Route path="/management/cameras" element={<CameraManager />} />
          <Route path="/management/zones" element={<ZoneManager />} />
          <Route path="/management/users" element={<ManagerUsers />} />
          <Route path="/management/products" element={<div className="text-slate-900">Quản lý sản phẩm</div>} />
          <Route path="/management/rules" element={<RuleConfiguration />} />

          <Route path="/settings" element={<Settings />} />
          <Route path="/privacy" element={<div className="text-slate-900">Chính sách bảo mật</div>} />
          <Route path="/docs" element={<div className="text-slate-900">Tài liệu hướng dẫn</div>} />
        </Route>
      </Routes>
    </BrowserRouter>;
};
