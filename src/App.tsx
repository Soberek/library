import { Outlet } from "react-router-dom";

import Navbar from "./components/Navbar";
import MobileNavbar from "./components/MobileNavbar";
import "./App.css";

function App() {
  // Form should be visible when User clicks button

  return (
    <>
      <Navbar />
      <MobileNavbar />
      <Outlet />
    </>
  );
}

export default App;
