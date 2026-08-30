import { Outlet, ScrollRestoration } from 'react-router-dom';
import { Navbar, MobileNavbar, Sidebar, ErrorBoundary } from './components';
import { PwaInstallPrompt, Toaster } from './components/ui';
import './App.css';

function App() {
  return (
    <ErrorBoundary>
      <ScrollRestoration />
      <div className="min-h-screen bg-slate-50/50 flex flex-col md:flex-row w-full overflow-x-hidden">
        {/* Modern Desktop Sidebar */}
        <Sidebar />

        {/* Main Content Viewport */}
        <div className="flex-1 flex flex-col min-w-0 w-full overflow-x-hidden">
          <Navbar />
          <main className="flex-1 min-w-0 w-full">
            <Outlet />
          </main>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNavbar />

      <PwaInstallPrompt />
      <Toaster />
    </ErrorBoundary>
  );
}

export default App;
