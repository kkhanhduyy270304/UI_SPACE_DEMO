import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion'; // eslint-disable-line no-unused-vars
import { LayoutDashboard, Flame, BarChart3, Settings, Camera, SlidersHorizontal, Menu, X, User, LogOut, ChevronDown, Package, MapPin, Store, Users } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { signOut } from '../../redux/slices/authSlice';
/**
 * Header Component - The Command Center
 * Sticky navigation bar with glassmorphism effect
 * Updated with Corporate Blue (#1E40AF) color scheme
 */
export const Header = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const {
    user
  } = useAppSelector(state => state.auth);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isManagementOpen, setIsManagementOpen] = useState(false);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isStoreOpen, setIsStoreOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState('Cửa hàng 1 - Trung tâm');

  // Available stores for selection
  const stores = [{
    id: 'store-001',
    name: 'Cửa hàng 1 - Trung tâm'
  }, {
    id: 'store-002',
    name: 'Cửa hàng 2 - Trung tâm thương mại'
  }, {
    id: 'store-003',
    name: 'Cửa hàng 3 - Sân bay'
  }];

  // Navigation items
  const navItems = [{
    label: 'Tổng quan',
    path: '/',
    icon: <LayoutDashboard size={20} />
  }, {
    label: 'Bản đồ nhiệt',
    path: '/heatmap',
    icon: <Flame size={20} />
  }];

  // Analytics dropdown items
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

  // Management dropdown items
  const managementItems = [{
    label: 'Phân tích khu vực',
    path: '/zone-analytics',
    icon: <MapPin size={18} />
  }, {
    label: 'Cấu hình camera',
    path: '/management/cameras',
    icon: <Camera size={18} />
  }, {
    label: 'Cấu hình zone',
    path: '/management/zones',
    icon: <MapPin size={18} />
  }, {
    label: 'Người dùng',
    path: '/management/users',
    icon: <Users size={18} />
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
  const isActive = path => location.pathname === path;
  const handleLogout = async () => {
    await dispatch(signOut());
    setIsProfileOpen(false);
    setIsMobileMenuOpen(false);
    navigate('/login', {
      replace: true
    });
  };
  return <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform" style={{
            backgroundColor: '#1E40AF'
          }}>
              <Flame className="text-white" size={24} />
            </div>
            <span className="text-xl font-bold" style={{
            color: '#1E40AF'
          }}>
              StoreLens
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map(item => <Link key={item.path} to={item.path} className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${isActive(item.path) ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}>
                {item.icon}
                <span className="font-medium">{item.label}</span>
              </Link>)}

            {/* Analytics Dropdown */}
            <div className="relative">
              <button onClick={() => setIsAnalyticsOpen(!isAnalyticsOpen)} className="flex items-center space-x-2 px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-all">
                <BarChart3 size={20} />
                <span className="font-medium">Phân tích</span>
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
              }} className="absolute top-full mt-2 right-0 w-56 bg-white border border-slate-200 rounded-lg shadow-xl overflow-hidden">
                    {analyticsItems.map(item => <Link key={item.path} to={item.path} onClick={() => setIsAnalyticsOpen(false)} className="flex items-center space-x-3 px-4 py-3 text-slate-600 hover:bg-blue-50 hover:text-blue-700 transition-colors">
                        {item.icon}
                        <span>{item.label}</span>
                      </Link>)}
                  </motion.div>}
              </AnimatePresence>
            </div>

            {/* Management Dropdown */}
            <div className="relative">
              <button onClick={() => setIsManagementOpen(!isManagementOpen)} className="flex items-center space-x-2 px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-all">
                <Settings size={20} />
                <span className="font-medium">Quản lý</span>
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
              }} className="absolute top-full mt-2 right-0 w-56 bg-white border border-slate-200 rounded-lg shadow-xl overflow-hidden">
                    {managementItems.map(item => <Link key={item.path} to={item.path} onClick={() => setIsManagementOpen(false)} className="flex items-center space-x-3 px-4 py-3 text-slate-600 hover:bg-blue-50 hover:text-blue-700 transition-colors">
                        {item.icon}
                        <span>{item.label}</span>
                      </Link>)}
                  </motion.div>}
              </AnimatePresence>
            </div>
          </nav>

          {/* Right Section */}
          <div className="flex items-center space-x-3">
            {/* Live Status Indicator */}
            <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-full">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-emerald-700 text-sm font-medium">Đang hoạt động</span>
            </div>

            {/* Store Selector */}
            <div className="relative hidden md:block">
              <button onClick={() => setIsStoreOpen(!isStoreOpen)} className="flex items-center space-x-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition-all text-sm">
                <Store size={15} className="text-slate-500" />
                <span className="text-slate-700 font-medium max-w-[120px] truncate">{selectedStore}</span>
                <ChevronDown size={13} className={`text-slate-400 transition-transform ${isStoreOpen ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {isStoreOpen && <motion.div initial={{
                opacity: 0,
                y: -10
              }} animate={{
                opacity: 1,
                y: 0
              }} exit={{
                opacity: 0,
                y: -10
              }} className="absolute top-full mt-2 right-0 w-52 bg-white border border-slate-200 rounded-lg shadow-xl overflow-hidden z-50">
                    {stores.map(store => <button key={store.id} onClick={() => {
                  setSelectedStore(store.name);
                  setIsStoreOpen(false);
                }} className={`flex items-center space-x-3 px-4 py-3 w-full text-left transition-colors ${selectedStore === store.name ? 'bg-blue-50 text-blue-700 font-medium' : 'text-slate-600 hover:bg-slate-50'}`}>
                        <Store size={15} />
                        <span className="text-sm">{store.name}</span>
                      </button>)}
                  </motion.div>}
              </AnimatePresence>
            </div>

            {/* User Profile Dropdown */}
            <div className="relative hidden md:block">
              <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="flex items-center space-x-2 p-1.5 rounded-lg hover:bg-slate-100 transition-all">
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{
                backgroundColor: '#1E40AF'
              }}>
                  <User size={18} className="text-white" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-slate-800 leading-none">{user?.fullName || 'Tai khoan'}</p>
                  <p className="text-xs text-slate-500 mt-1">{user?.role || 'guest'}</p>
                </div>
              </button>

              <AnimatePresence>
                {isProfileOpen && <motion.div initial={{
                opacity: 0,
                y: -10
              }} animate={{
                opacity: 1,
                y: 0
              }} exit={{
                opacity: 0,
                y: -10
              }} className="absolute top-full mt-2 right-0 w-48 bg-white border border-slate-200 rounded-lg shadow-xl overflow-hidden">
                    <Link to="/settings" onClick={() => setIsProfileOpen(false)} className="flex items-center space-x-3 px-4 py-3 text-slate-600 hover:bg-blue-50 hover:text-blue-700 transition-colors">
                      <Settings size={18} />
                      <span>Cài đặt</span>
                    </Link>
                    <button onClick={handleLogout} className="flex items-center space-x-3 px-4 py-3 text-slate-600 hover:bg-rose-50 hover:text-rose-600 transition-colors w-full">
                      <LogOut size={18} />
                      <span>Đăng xuất</span>
                    </button>
                  </motion.div>}
              </AnimatePresence>
            </div>

            {/* Mobile Menu Toggle */}
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-all text-slate-600">
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
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
        }} className="md:hidden border-t border-slate-200 py-4 space-y-2">
              {navItems.map(item => <Link key={item.path} to={item.path} onClick={() => setIsMobileMenuOpen(false)} className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${isActive(item.path) ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-100'}`}>
                  {item.icon}
                  <span className="font-medium">{item.label}</span>
                </Link>)}

              {/* Mobile Analytics Dropdown */}
              <div className="pt-2 border-t border-slate-200">
                <button onClick={() => setIsAnalyticsOpen(!isAnalyticsOpen)} className="w-full flex items-center justify-between px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-all">
                  <div className="flex items-center space-x-3">
                    <BarChart3 size={18} />
                    <span className="font-medium">Phân tích</span>
                  </div>
                  <ChevronDown size={16} className={`transition-transform ${isAnalyticsOpen ? 'rotate-180' : ''}`} />
                </button>
                {isAnalyticsOpen && (
                  <div className="mt-2 space-y-1">
                    {analyticsItems.map(item => <Link key={item.path} to={item.path} onClick={() => { setIsMobileMenuOpen(false); setIsAnalyticsOpen(false); }} className="flex items-center space-x-3 px-8 py-2 rounded-lg text-slate-600 hover:bg-blue-50 transition-all">
                        {item.icon}
                        <span className="text-sm">{item.label}</span>
                      </Link>)}
                  </div>
                )}
              </div>

              {/* Mobile Management Items */}
              <div className="pt-2 border-t border-slate-200">
                <p className="px-4 py-2 text-xs text-slate-400 font-semibold uppercase">
                  Quản lý
                </p>
                {managementItems.map(item => <Link key={item.path} to={item.path} onClick={() => setIsMobileMenuOpen(false)} className="flex items-center space-x-3 px-4 py-3 rounded-lg text-slate-600 hover:bg-slate-100 transition-all">
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>)}
              </div>

              {/* Mobile Live Status */}
              <div className="flex items-center justify-center space-x-2 px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-full mx-4">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-emerald-700 text-sm font-medium">AI Edge đang hoạt động</span>
              </div>

              {/* Mobile Profile Actions */}
              <div className="pt-2 border-t border-slate-200 space-y-2">
                <Link to="/settings" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center space-x-3 px-4 py-3 rounded-lg text-slate-600 hover:bg-slate-100">
                  <Settings size={18} />
                  <span>Cài đặt</span>
                </Link>
                <button onClick={handleLogout} className="flex items-center space-x-3 px-4 py-3 rounded-lg text-slate-600 hover:bg-rose-50 hover:text-rose-600 w-full">
                  <LogOut size={18} />
                  <span>Đăng xuất</span>
                </button>
              </div>
            </motion.nav>}
        </AnimatePresence>
      </div>
    </header>;
};
