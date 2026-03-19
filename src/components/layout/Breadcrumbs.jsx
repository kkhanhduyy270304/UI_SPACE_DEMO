import { useLocation, Link } from 'react-router-dom';
import { Home, ChevronRight } from 'lucide-react';

/**
 * Dynamic breadcrumb navigation component
 * Maps URL paths to readable Vietnamese labels
 */
export const Breadcrumbs = () => {
  const location = useLocation();
  
  // Mapping URL segments to concise Vietnamese labels.
  const segmentLabels = {
    heatmap: 'Bản đồ nhiệt',
    analytics: 'Phân tích',
    'dwell-time': 'Thời gian dừng',
    customer: 'Khách hàng',
    zone: 'Khu vực',
    management: 'Quản lý',
    cameras: 'Camera',
    zones: 'Zone',
    users: 'Người dùng',
    customers: 'Khách hàng',
    products: 'Tài sản',
    rules: 'Rule',
    settings: 'Cài đặt',
    dashboard: 'Tổng quan',
    login: 'Đăng nhập'
  };

  const toReadableLabel = (segment) => {
    if (segmentLabels[segment]) return segmentLabels[segment];
    return segment
      .split('-')
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  };

  // Get breadcrumb segments from current path
  const getSegments = () => {
    const pathSegments = location.pathname
      .split('/')
      .filter(segment => segment !== '');

    // Build breadcrumb array
    const breadcrumbs = [{ label: 'Home', path: '/', isHome: true }];

    let currentPath = '';
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const label = toReadableLabel(segment);
      const isLast = index === pathSegments.length - 1;
      
      breadcrumbs.push({
        label,
        path: currentPath,
        isLast
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = getSegments();

  // Don't show breadcrumbs on dashboard (home page)
  if (location.pathname === '/') {
    return null;
  }

  return (
    <nav className="flex min-w-0 items-center gap-1 whitespace-nowrap" role="navigation" aria-label="breadcrumb">
      {breadcrumbs.map((breadcrumb, index) => (
        <div key={breadcrumb.path} className="flex min-w-0 items-center gap-1">
          {breadcrumb.isHome ? (
            <Link
              to={breadcrumb.path}
              className="flex items-center gap-1 text-slate-400 hover:text-slate-600 transition-colors"
              aria-label="Home"
            >
              <Home size={14} className="shrink-0" />
              <span className="text-sm">Home</span>
            </Link>
          ) : (
            <>
              {index > 0 && (
                <ChevronRight size={14} className="text-slate-300 shrink-0" />
              )}
              {breadcrumb.isLast ? (
                <span className="text-slate-900 font-bold text-sm truncate">
                  {breadcrumb.label}
                </span>
              ) : (
                <Link
                  to={breadcrumb.path}
                  className="text-slate-400 hover:text-slate-600 transition-colors text-sm truncate"
                >
                  {breadcrumb.label}
                </Link>
              )}
            </>
          )}
        </div>
      ))}
    </nav>
  );
};
