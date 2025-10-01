import { Outlet } from "react-router-dom";

import Navbar from "./components/Navbar";
import MobileNavbar from "./components/MobileNavbar";
import ErrorBoundary from "./components/ErrorBoundary";
import "./App.css";

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
