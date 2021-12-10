import { Navigate, useRoutes } from 'react-router-dom';
import { useApp } from './context/AppContext'

// layouts
import DashboardLayout from './layouts/dashboard';
import LogoOnlyLayout from './layouts/LogoOnlyLayout';
//
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardApp from './pages/DashboardApp';
import Products from './pages/Products';
import Blog from './pages/Blog';
import User from './pages/User';
import NotFound from './pages/Page404';
// ---------------------------------------------------------------------

export default function Router() {
  const { authenticated } = useApp()

  let authenticatedConfig = {
    path: '/',
    element: <DashboardLayout />,
    children: [
      // { element: <Navigate to={authenticated ? "/dashboard/app" : "/login"} replace /> },
      { path: 'dashboard/app', element: <DashboardApp /> },
      { path: 'dashboard/user', element: <User /> },
      { path: 'products', element: <Products /> },
      { path: 'blog', element: <Blog /> },
      { path: '/', element: <Navigate to="/dashboard/app" /> },
      { path: '*', element: <NotFound /> }
    ]
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
