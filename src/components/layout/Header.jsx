import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { LayoutDashboard, Flame, BarChart3, Settings, Camera, SlidersHorizontal, Menu, X, User, LogOut, ChevronDown, Package, MapPin, Users, Search } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { signOut } from '../../redux/slices/authSlice';
import { NotificationPopover } from './NotificationPopover';

/**
 * Header chinh cua he thong.
 * Giao dien glassmorphism, toi uu cho desktop va mobile.
 */
export const Header = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAppSelector(state => state.auth);
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isManagementOpen, setIsManagementOpen] = useState(false);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const isActive = path => location.pathname === path;

  const navItems = [{
    label: 'Tổng quan',
    path: '/',
    icon: <LayoutDashboard size={20} />
  }, {
    label: 'Bản đồ nhiệt',
    path: '/heatmap',
    icon: <Flame size={20} />
  }];

  const analyticsItems = [{
    label: 'Phân tích thời gian dừng',
    path: '/analytics/dwell-time',
    icon: <BarChart3 size={18} />
  }, {
    label: 'Phân tích khách hàng',
    path: '/analytics/customer',
    icon: <Users size={18} />
  }, {
    label: 'Phân tích khu vực',
    path: '/analytics/zone',
    icon: <MapPin size={18} />
  }];

  const managementItems = [{
    label: 'Cấu hình camera',
    path: '/management/cameras',
    icon: <Camera size={18} />
  }, {
    label: 'Cấu hình zone',
    path: '/management/zones',
    icon: <MapPin size={18} />
  }, {
    label: 'Quản lý khách hàng',
    path: '/management/customers',
    icon: <Users size={18} />
  }, {
    label: 'Quản lý tài sản',
    path: '/management/products',
    icon: <Package size={18} />
  }, {
    label: 'Cấu hình rule',
    path: '/management/rules',
    icon: <SlidersHorizontal size={18} />
  }];

  // Handle logout
  const handleLogout = async () => {
    await dispatch(signOut());
    setIsProfileOpen(false);
    setIsMobileMenuOpen(false);
    navigate('/login', { replace: true });
  };

  return (
    <header className="sticky top-0 z-50 w-full h-16 border-b border-slate-200 bg-white shadow-sm">
      <div className="mx-auto h-full px-4 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-6">
          <div className="flex items-center gap-4 min-w-0 flex-[1.4]">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-slate-100 transition-all text-slate-600 hover:text-slate-900 shrink-0"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <Link to="/" className="flex items-center space-x-2 group shrink-0">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-teal-500 group-hover:scale-110 transition-transform">
                <Flame className="text-white" size={24} />
              </div>
              <span className="text-xl font-bold text-slate-900 hidden lg:block">SpaceLens</span>
            </Link>

            <div className="hidden xl:flex items-center gap-2 min-w-0 border-l border-slate-200 pl-4">
              {navItems.map(item => <Link key={item.path} to={item.path} className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all ${isActive(item.path) ? 'bg-teal-50 text-teal-700 border-b-2 border-teal-500' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}>
                  {item.icon}
                  <span className="font-medium text-sm">{item.label}</span>
                </Link>)}

              <div className="relative">
                <button onClick={() => setIsAnalyticsOpen(!isAnalyticsOpen)} className="flex items-center space-x-2 px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-all">
                  <BarChart3 size={20} />
                  <span className="font-medium text-sm">Phân tích</span>
                  <ChevronDown size={16} className={`transition-transform ${isAnalyticsOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {isAnalyticsOpen && <motion.div initial={{
                  opacity: 0,
                  y: -10
                }} animate={{
                  opacity: 1,
                  y: 0
                }} exit={{
                  opacity: 0,
                  y: -10
                }} className="absolute top-full mt-2 right-0 w-56 bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
                      {analyticsItems.map(item => <Link key={item.path} to={item.path} onClick={() => setIsAnalyticsOpen(false)} className="flex items-center space-x-3 px-4 py-3 text-slate-700 hover:bg-teal-50 hover:text-teal-700 transition-colors">
                          {item.icon}
                          <span>{item.label}</span>
                        </Link>)}
                    </motion.div>}
                </AnimatePresence>
              </div>

              <div className="relative">
                <button onClick={() => setIsManagementOpen(!isManagementOpen)} className="flex items-center space-x-2 px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-all">
                  <Settings size={20} />
                  <span className="font-medium text-sm">Quản lý</span>
                  <ChevronDown size={16} className={`transition-transform ${isManagementOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {isManagementOpen && <motion.div initial={{
                  opacity: 0,
                  y: -10
                }} animate={{
                  opacity: 1,
                  y: 0
                }} exit={{
                  opacity: 0,
                  y: -10
                }} className="absolute top-full mt-2 right-0 w-56 bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
                      {managementItems.map(item => <Link key={item.path} to={item.path} onClick={() => setIsManagementOpen(false)} className="flex items-center space-x-3 px-4 py-3 text-slate-700 hover:bg-teal-50 hover:text-teal-700 transition-colors">
                          {item.icon}
                          <span>{item.label}</span>
                        </Link>)}
                    </motion.div>}
                </AnimatePresence>
              </div>
            </div>
          </div>

          <div className="hidden md:flex flex-1 justify-center px-2 lg:px-4 max-w-xl mx-auto">
            <div className="relative w-full">
              <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Tim kiem..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 py-2 pl-10 pr-4 bg-slate-50 border border-slate-200 rounded-full text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/40 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 shrink-0 lg:w-[22%]">
            <div className="hidden lg:flex items-center space-x-2 px-3 py-1 bg-emerald-50 border border-emerald-200 rounded-full">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-emerald-700 text-xs font-medium">Truc tuyen</span>
            </div>

            <NotificationPopover />

            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-2 p-1 rounded-lg hover:bg-slate-100 transition-all shrink-0"
              >
                <div className="w-9 h-9 rounded-full border border-slate-200 flex items-center justify-center bg-teal-500">
                  <User size={20} className="text-white" />
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium text-slate-900 leading-none">{user?.fullName || 'Tai khoan'}</p>
                  <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider">{user?.role || 'khach'}</p>
                </div>
              </button>

              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full mt-2 right-0 w-48 bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden"
                  >
                    <Link
                      to="/management/users"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center space-x-3 px-4 py-3 text-slate-700 hover:bg-teal-50 hover:text-teal-700 transition-colors"
                    >
                      <Users size={18} />
                      <span>Quản lý người dùng</span>
                    </Link>
                    <Link
                      to="/settings"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center space-x-3 px-4 py-3 text-slate-700 hover:bg-teal-50 hover:text-teal-700 transition-colors"
                    >
                      <Settings size={18} />
                      <span>Cài đặt</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-3 px-4 py-3 text-slate-700 hover:bg-rose-50 hover:text-rose-600 transition-colors w-full"
                    >
                      <LogOut size={18} />
                      <span>Đăng xuất</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {isMobileMenuOpen && <motion.nav initial={{
          opacity: 0,
          height: 0
        }} animate={{
          opacity: 1,
          height: 'auto'
        }} exit={{
          opacity: 0,
          height: 0
        }} className="lg:hidden border-t border-slate-200 py-4 space-y-2">
              <div className="px-4 pb-3 border-b border-slate-200">
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input type="text" placeholder="Tim kiem..." className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/40 text-sm" />
                </div>
              </div>

              {navItems.map(item => <Link key={item.path} to={item.path} onClick={() => setIsMobileMenuOpen(false)} className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${isActive(item.path) ? 'bg-teal-50 text-teal-700' : 'text-slate-700 hover:bg-slate-100'}`}>
                  {item.icon}
                  <span className="font-medium">{item.label}</span>
                </Link>)}

              <div className="pt-2 border-t border-slate-200">
                <button onClick={() => setIsAnalyticsOpen(!isAnalyticsOpen)} className="w-full flex items-center justify-between px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-all">
                  <div className="flex items-center space-x-3">
                    <BarChart3 size={18} />
                    <span className="font-medium">Phân tích</span>
                  </div>
                  <ChevronDown size={16} className={`transition-transform ${isAnalyticsOpen ? 'rotate-180' : ''}`} />
                </button>
                {isAnalyticsOpen && <div className="mt-2 space-y-1">
                    {analyticsItems.map(item => <Link key={item.path} to={item.path} onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsAnalyticsOpen(false);
                }} className="flex items-center space-x-3 px-8 py-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-all">
                        {item.icon}
                        <span className="text-sm">{item.label}</span>
                      </Link>)}
                  </div>}
              </div>

              <div className="pt-2 border-t border-slate-200">
                <button onClick={() => setIsManagementOpen(!isManagementOpen)} className="w-full flex items-center justify-between px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-all">
                  <div className="flex items-center space-x-3">
                    <Settings size={18} />
                    <span className="font-medium">Quản lý</span>
                  </div>
                  <ChevronDown size={16} className={`transition-transform ${isManagementOpen ? 'rotate-180' : ''}`} />
                </button>
                {isManagementOpen && <div className="mt-2 space-y-1">
                    {managementItems.map(item => <Link key={item.path} to={item.path} onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsManagementOpen(false);
                }} className="flex items-center space-x-3 px-8 py-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-all">
                        {item.icon}
                        <span className="text-sm">{item.label}</span>
                      </Link>)}
                  </div>}
              </div>

              <div className="pt-2 border-t border-slate-200 space-y-2">
                <Link to="/management/users" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center space-x-3 px-4 py-3 text-slate-700 hover:bg-slate-100 rounded-lg transition-all">
                  <Users size={18} />
                  <span>Quản lý người dùng</span>
                </Link>
                <Link to="/settings" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center space-x-3 px-4 py-3 text-slate-700 hover:bg-slate-100 rounded-lg transition-all">
                  <Settings size={18} />
                  <span>Cài đặt</span>
                </Link>
                <button onClick={handleLogout} className="flex items-center space-x-3 px-4 py-3 text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all w-full">
                  <LogOut size={18} />
                  <span>Đăng xuất</span>
                </button>
              </div>
            </motion.nav>}
        </AnimatePresence>
      </div>
    </header>
  );
};
