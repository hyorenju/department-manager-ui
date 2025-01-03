import LoginPage from './pages/LoginPage';
import Layout from './components/Layout';
import { NotFound } from './components/NotFound';
import ManageUser from './pages/ManageUser';
import ManageClass from './pages/ManageClass';
import ManageSubject from './pages/MangeSubject';
import ManageIntern from './pages/ManageIntern';
import ManageInternV2 from './pages/ManageInternV2';
import ManageInternV3 from './pages/ManageInternV3';
import ManageExam from './pages/ManageExam';
import ManageTeaching from './pages/ManageTeaching';
import ManageFaculty from './pages/ManageFaculty';
import ManageDepartment from './pages/ManageDeparment';
import Statistic from './pages/Statistic';
import Project from './pages/Project';
import { Button } from 'antd';
import Profile from './pages/Profile';
import Work from './pages/Work';
import { useState } from 'react';

const { createBrowserRouter } = require('react-router-dom');

const userData = JSON.parse(localStorage.getItem('user_info'));

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
        // element: <ManageIntern />,
        // element: <ManageInternV2 />,
        element: <ManageInternV3 />,
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
      {
        path: 'profile',
        element: <Profile />,
        errorElement: <NotFound />,
      },
      {
        path: 'work',
        element: <Work userData={userData} />,
        errorElement: <NotFound />,
      },
      {
        path: 'statistic',
        element: <Statistic />,
        errorElement: <NotFound />,
      },
      {
        path: 'project',
        element: <Project />,
        errorElement: <NotFound />,
      },
    ],
  },
  {
    path: '/instruction',
    element: (
      <div>
        <h2 className="text-rose-600 text-[20px] font-bold uppercase absolute bottom-[65%] right-[60%] translate-x-[50%] translate-y-[50%]">
          Tính năng này đang phát triển
        </h2>
        <a
          href="/manage"
          className="absolute bottom-[55%] right-[60%] translate-x-[50%] translate-y-[50%]"
        >
          <Button>Bấm để trở lại</Button>
        </a>
      </div>
    ),
    errorElement: <NotFound />,
  },
]);

export default router;
