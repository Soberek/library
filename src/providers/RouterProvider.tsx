import React, { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { PageLoader } from '../components/ui/PageLoader';
import { PageError } from '../components/ui/PageError';
import { ProtectedRoute } from '../components';
import App from '../App';

const Books = lazy(() => import('../pages/Books'));
const MagdaLosuje = lazy(() => import('../pages/MagdaLosuje'));
const BookLosuje = lazy(() => import('../pages/BookLosuje'));
const PozycjeSeksualne = lazy(() => import('../pages/PozycjeSeksualne'));
const SignUp = lazy(() => import('../pages/SignUp'));
const SignIn = lazy(() => import('../pages/SignIn'));
const NotFound = lazy(() => import('../pages/NotFound'));

const withSuspense = (Component: React.ComponentType) => (
  <Suspense fallback={<PageLoader />}>
    <Component />
  </Suspense>
);

const router = createBrowserRouter([
  {
    path: '/',
    element: <ProtectedRoute />,
    errorElement: (
      <div className="p-6 max-w-4xl mx-auto">
        <PageError message="Wystąpił nieoczekiwany błąd podczas ładowania widoku." />
      </div>
    ),
    children: [
      {
        path: '',
        element: <App />,
        children: [
          {
            index: true,
            element: withSuspense(Books),
          },
          {
            path: 'magda-losuje',
            element: withSuspense(MagdaLosuje),
          },
          {
            path: 'losuj-ksiazke',
            element: withSuspense(BookLosuje),
          },
          {
            path: 'pozycje-seksualne',
            element: withSuspense(PozycjeSeksualne),
          },
        ],
      },
    ],
  },
  {
    path: '/sign-up',
    element: withSuspense(SignUp),
  },
  {
    path: '/sign-in',
    element: withSuspense(SignIn),
  },
  {
    path: '*',
    element: withSuspense(NotFound),
  },
]);

export const RouterProviderWrapper: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default RouterProviderWrapper;
