import LoginPage from './pages/LoginPage';
import LoginSuccess from './pages/LoginSuccess';
import { NotFound } from './components/NotFound';

const { createBrowserRouter } = require('react-router-dom');

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LoginPage />,
    errorElement: <NotFound />,
  },
  {
    path: '/manager',
    element: <LoginSuccess />,
    errorElement: <NotFound />,
    children: [{}],
  },
  {
    path: '/user',
    element: <NotFound />,
    errorElement: <NotFound />,
    children: [{}],
  },
]);

export default router;
