import { useEffect } from 'react'
// routes
import Router from './routes';
// theme
import ThemeConfig from './theme';
import GlobalStyles from './theme/globalStyles';
// components
import ScrollToTop from './components/ScrollToTop';
import { BaseOptionChartStyle } from './components/charts/BaseOptionChart';
import jwtDecode from 'jwt-decode'
import { useApp } from './context/AppContext'
import { usePacientContext } from './context/PacientContext'
import { useEmployeeContext } from './context/EmployeeContext'
import useLocalStorage from './hooks/useLocalStorage'
import Loader from './components/Loader/Loader'

// ----------------------------------------------------------------------

export default function App() {
  const [token, setToken] = useLocalStorage('token', '')
  const { setAuthenticated, appLoading, authenticated } = useApp()
  const { getAllPacients } = usePacientContext()
  const { getLogedInEmployee } = useEmployeeContext()

  // ONLY RUN IF WE ARE AUTHENTICATED, AND WE CAN ONLY
  // BECOME AUTHENTICATED WITH A VALID TOKEN
  // SO THIS IS THE BEST APPROACH
  useEffect(() => {
    if (authenticated) {
      getAllPacients()
      getLogedInEmployee()
    }

    if (token) {
      const decoded = jwtDecode(token)

      if (new Date(decoded.exp * 1000) < new Date()) {
        // !EXPIRED
        console.log('loging out...')
      } else {
        setAuthenticated(true)
      }
    }
  }, [token, setAuthenticated, getAllPacients, getLogedInEmployee, authenticated])

  return (
    !appLoading ?
      <ThemeConfig>
        <ScrollToTop />
        <GlobalStyles />
        <BaseOptionChartStyle />
        <Router />
      </ThemeConfig> : <Loader />
  );
}
