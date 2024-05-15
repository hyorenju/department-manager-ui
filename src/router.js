import LoginPage from './pages/LoginPage';
import Layout from './components/Layout';
import { NotFound } from './components/NotFound';
import ManageUser from './pages/ManageUser';
import ManageClass from './pages/ManageClass';
import ManageSubject from './pages/MangeSubject';
import ManageIntern from './pages/ManageIntern';
import ManageExam from './pages/ManageExam';
import ManageTeaching from './pages/ManageTeaching';
import ManageFaculty from './pages/ManageFaculty';
import ManageDepartment from './pages/ManageDeparment';

const { createBrowserRouter } = require('react-router-dom');

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LoginPage />,
    errorElement: <NotFound />,
  },
  {
    path: '/manage',
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
      {
        path: 'subject',
        element: <ManageSubject />,
        errorElement: <NotFound />,
      },
      {
        path: 'intern',
        element: <ManageIntern />,
        errorElement: <NotFound />,
      },
      {
        path: 'teaching',
        element: <ManageTeaching />,
        errorElement: <NotFound />,
      },
      {
        path: 'exam',
        element: <ManageExam />,
        errorElement: <NotFound />,
      },
      {
        path: 'faculty',
        element: <ManageFaculty />,
        errorElement: <NotFound />,
      },
      {
        path: 'department',
        element: <ManageDepartment />,
        errorElement: <NotFound />,
      },
    ],
  },
]);

export default router;
