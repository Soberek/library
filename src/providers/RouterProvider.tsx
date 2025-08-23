import { createBrowserRouter, RouterProvider } from "react-router-dom";
import NotFound from "../pages/NotFound";
import ProtectedRoute from "../components/ProtectedRoute";
import App from "../App";
import SignUp from "../pages/SignUp";
import SignIn from "../pages/SignIn";
import Books from "../pages/Books";

const router = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedRoute />,
    children: [
      {
        path: "",
        element: <App />,
        children: [
          {
            index: true,
            element: <Books />,
          },
        ],
      },
    ],
  },
  {
    path: "/sign-up",
    element: <SignUp />,
  },
  {
    path: "/sign-in",
    element: <SignIn />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

const RouterProviderWrapper: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default RouterProviderWrapper;
