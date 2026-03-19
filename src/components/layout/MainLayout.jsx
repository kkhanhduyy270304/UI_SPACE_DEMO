import { Outlet } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { GlobalFilter } from './GlobalFilter';
import { Breadcrumbs } from './Breadcrumbs';

/**
 * MainLayout Component - The Wrapper
 * Wraps all protected routes with Header, main content area, and Footer
 */
export const MainLayout = () => {
  const location = useLocation();
  const hideGlobalFilter = location.pathname === '/heatmap';
  const showBreadcrumbs = location.pathname !== '/';

  return <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <div className="flex flex-col flex-1">
        <Header />

        {showBreadcrumbs && <div className="border-b border-slate-200 bg-white px-6 py-3">
            <div className="mx-auto w-full max-w-[1760px] lg:px-4 2xl:px-8">
              <Breadcrumbs />
            </div>
          </div>}

        {!hideGlobalFilter && <div className="sticky top-16 z-40 px-6 bg-slate-50">
            <div className="mx-auto w-full max-w-[1760px] lg:px-4 2xl:px-8">
              <GlobalFilter />
            </div>
          </div>}

        <main className="mx-auto w-full max-w-[1760px] px-6 pb-6 flex-grow lg:px-10 2xl:px-14">
          <Outlet />
        </main>
      </div>

      <Footer />
    </div>;
};
