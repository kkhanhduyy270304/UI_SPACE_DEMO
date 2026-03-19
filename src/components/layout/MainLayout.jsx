import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { GlobalFilter } from './GlobalFilter';

/**
 * MainLayout Component - The Wrapper
 * Wraps all protected routes with Header, main content area, and Footer
 */
export const MainLayout = () => {
  return <div className="min-h-screen bg-white text-slate-800 flex flex-col">
      <Header />

      <div className="w-full bg-white">
        <div className="mx-auto w-full max-w-[1760px] px-6 pt-6 lg:px-10 2xl:px-14">
          <GlobalFilter />
        </div>
      </div>

      <main className="mx-auto w-full max-w-[1760px] px-6 py-6 flex-grow lg:px-10 2xl:px-14">
        <Outlet />
      </main>

      <Footer />
    </div>;
};
