// import Products from './pages/Products';
// import Blog from './pages/Blog';
// import Ordinations from './pages/Ordinations';
import { Suspense, lazy } from 'react'
import Loader from './components/Loader/Loader'

import { Navigate, useRoutes } from 'react-router-dom';
import { useApp } from './context/AppContext'
import { useEmployeeContext } from './context/EmployeeContext'
import { hasPermission, actions } from './utils/DataProviders/ROLES/permissions'
// const AvatarComponent = lazy(() => import('./AvatarComponent'));

// layouts
import DashboardLayout from './layouts/dashboard';
import LogoOnlyLayout from './layouts/LogoOnlyLayout';
// ---------------------------------------------------------------------

const Login = lazy(() => import('./pages/Login'))
const DashboardApp = lazy(() => import('./pages/DashboardApp'))
const User = lazy(() => import('./pages/User'))
const Diagnosis = lazy(() => import('./pages/Diagnosis'))
const OrdinationsAlt = lazy(() => import('./pages/OrdinationsAlt'))
const Employees = lazy(() => import('./pages/Employees'))
const PacientDetails = lazy(() => import('./pages/PacientDetails'))
const Appointments = lazy(() => import('./pages/Appointments'))
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'))
const ResetPassword = lazy(() => import('./pages/ResetPassword'))
const NotFound = lazy(() => import('./pages/Page404'))

export default function Router() {
  const { authenticated } = useApp()
  const { logedInEmployee } = useEmployeeContext()

  const match = hasPermission(logedInEmployee, actions.MAIN_ROLE_UI_VISIBILITY)

  const MAIN_ROLE_ROUTING = [
    // { element: <Navigate to={authenticated ? "/dashboard/app" : "/login"} replace /> },
    { path: 'dashboard/app', element: <DashboardApp /> },
    { path: '/pacients', element: <User /> },
    { path: '/pacients/:id', element: <PacientDetails /> },
    { path: '/employees', element: <Employees /> },
    { path: '/appointments', element: <Appointments /> },
    { path: '/ordinations', element: <OrdinationsAlt /> },
    { path: '/diagnosis', element: <Diagnosis /> },
    { path: '/', element: <Navigate to="/dashboard/app" /> },
    { path: '*', element: <NotFound /> }
  ]

  const SUB_ROLE_ROUTING = [
    { path: 'dashboard/app', element: <DashboardApp /> },
    { path: '/pacients', element: <User /> },
    { path: '/pacients/:id', element: <PacientDetails /> },
    { path: '/appointments', element: <Appointments /> },
    { path: '/diagnosis', element: <Diagnosis /> },
    // { path: 'dashboard/employees', element: <Navigate to="/dashboard/app" /> },
    { path: '/', element: <Navigate to="/dashboard/app" /> },
    { path: '*', element: <NotFound /> }
  ]

  let authenticatedConfig = {
    path: '/',
    element:
      <Suspense fallback={<Loader />}>
        <DashboardLayout />
      </Suspense>,
    children: match ? MAIN_ROLE_ROUTING : SUB_ROLE_ROUTING
  }

  let nonAuthConfig = {
    path: '/',
    element:
      <Suspense fallback={<Loader />}>
        <LogoOnlyLayout />
      </Suspense>,
    children: [
      { path: 'login', element: <Login /> },
      { path: '/forgotPassword', element: <ForgotPassword /> },
      { path: '/resetPassword/:token', element: <ResetPassword /> },
      { path: '404', element: <NotFound /> },
      { path: '/', element: <Navigate to='/login' /> },
      { path: '*', element: <NotFound /> }
    ]
  }

  const configToUse = authenticated ? authenticatedConfig : nonAuthConfig

  return useRoutes([
    configToUse,
    { path: '*', element: <Navigate to="/404" replace /> }
  ]);
}
