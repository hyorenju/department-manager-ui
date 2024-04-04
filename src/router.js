import LoginPage from './pages/LoginPage';
import Layout from './components/Layout';
import { NotFound } from './components/NotFound';
import ManageUser from './pages/ManageUser';
import ManageClass from './pages/ManageClass';

const { createBrowserRouter } = require('react-router-dom');

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LoginPage />,
    errorElement: <NotFound />,
  },
  {
    path: '/manager',
    element: <Layout />,
    errorElement: <NotFound />,
    children: [
      {
        path: 'user',
        element: <ManageUser />,
        errorElement: <NotFound />,
      },
      {
        path: 'class',
        element: <ManageClass />,
        errorElement: <NotFound />,
      },
    ],
  },
  {
    path: '/user',
    element: <NotFound />,
    errorElement: <NotFound />,
    children: [{}],
  },
]);

export default router;
