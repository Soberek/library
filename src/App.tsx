import { Outlet } from 'react-router-dom';
import { Navbar, MobileNavbar, ErrorBoundary } from './components';
import { PwaInstallPrompt } from './components/ui';
import './App.css';

function App() {
  return (
    <ErrorBoundary>
      <Navbar />
      <MobileNavbar />
      <Outlet />
      <PwaInstallPrompt />
    </ErrorBoundary>
  );
}

export default App;
