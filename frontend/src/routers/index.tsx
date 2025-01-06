import { createBrowserRouter } from 'react-router-dom';
import { EntryPage } from '@pages/EntryPage';
import { LoginPage } from '@pages/Login';
import { SignUpPage } from '@pages/SignUp';
import { ProfilePage } from '@pages/Profile';
import { ProtectedRoute } from '@routers/ProtectedRoute'; // Make sure this is the correct path
import { GuestRoute } from './GuestRoute';

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <GuestRoute>
        <ProtectedRoute>
          <EntryPage />
        </ProtectedRoute>
      </GuestRoute>
    ),
  },
  {
    path: '/login',
    element: (
      <GuestRoute>
        <LoginPage />
      </GuestRoute>
    ),
  },
  {
    path: '/sign-up',
    element: <SignUpPage />,
  },
  {
    path: '/profile/:id',
    element: (
      <ProtectedRoute>
        <ProfilePage />
      </ProtectedRoute>
    ),
  },
]);
