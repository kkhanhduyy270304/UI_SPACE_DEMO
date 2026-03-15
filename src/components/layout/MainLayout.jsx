import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';

/**
 * MainLayout Component - The Wrapper
 * Wraps all protected routes with Header, main content area, and Footer
 */
export const MainLayout = () => {
  return <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col">
      <Header />

      <main className="container mx-auto px-4 py-6 flex-grow">
        <Outlet />
      </main>

      <Footer />
    </div>;
};
