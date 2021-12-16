import { Navigate, useRoutes } from 'react-router-dom';
import { useApp } from './context/AppContext'
import { useEmployeeContext } from './context/EmployeeContext'
import { hasPermission, actions } from './utils/DataProviders/ROLES/permissions'

// layouts
import DashboardLayout from './layouts/dashboard';
import LogoOnlyLayout from './layouts/LogoOnlyLayout';
//
import Login from './pages/Login';
import Employees from './pages/Employees';
import DashboardApp from './pages/DashboardApp';
import Products from './pages/Products';
import Blog from './pages/Blog';
import User from './pages/User';
import PacientDetails from './pages/PacientDetails';
import NotFound from './pages/Page404';
// ---------------------------------------------------------------------

export default function Router() {
  const { authenticated } = useApp()
  const { logedInEmployee } = useEmployeeContext()

  const match = hasPermission(logedInEmployee, actions.MAIN_ROLE_UI_VISIBILITY)

  const MAIN_ROLE_ROUTING = [
    // { element: <Navigate to={authenticated ? "/dashboard/app" : "/login"} replace /> },
    { path: 'dashboard/app', element: <DashboardApp /> },
    { path: 'dashboard/pacients', element: <User /> },
    { path: 'dashboard/pacients/:id', element: <PacientDetails /> },
    { path: 'dashboard/employees', element: <Employees /> },
    { path: 'products', element: <Products /> },
    { path: 'blog', element: <Blog /> },
    { path: '/', element: <Navigate to="/dashboard/app" /> },
    { path: '*', element: <NotFound /> }
  ]

  const SUB_ROLE_ROUTING = [
    { path: 'dashboard/app', element: <DashboardApp /> },
    { path: 'dashboard/pacients', element: <User /> },
    { path: 'dashboard/pacients/:id', element: <PacientDetails /> },
    // { path: 'dashboard/employees', element: <Navigate to="/dashboard/app" /> },
    { path: '/', element: <Navigate to="/dashboard/app" /> },
    { path: '*', element: <NotFound /> }
  ]

  let authenticatedConfig = {
    path: '/',
    element: <DashboardLayout />,
    children: match ? MAIN_ROLE_ROUTING : SUB_ROLE_ROUTING
  }

  let nonAuthConfig = {
    path: '/',
    element: <LogoOnlyLayout />,
    children: [
      { path: 'login', element: <Login /> },
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
