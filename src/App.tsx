import { Outlet } from 'react-router-dom';

import { Navbar, MobileNavbar, ErrorBoundary } from './components';
import './App.css';

function App() {
  return (
    <ErrorBoundary>
      <Navbar />
      <MobileNavbar />
      <Outlet />
    </ErrorBoundary>
  );
}

export default App;
