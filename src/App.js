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
import useLocalStorage from './hooks/useLocalStorage'
import Loader from './components/Loader/Loader'

// ----------------------------------------------------------------------

export default function App() {
  const [token, setToken] = useLocalStorage('token', '')
  const { setAuthenticated, appLoading } = useApp()
  const { getAllPacients } = usePacientContext()

  useEffect(() => {
    if (token) {
      const decoded = jwtDecode(token)

      if (new Date(decoded.exp * 1000) < new Date()) {
        // !EXPIRED
        console.log('loging out...')
      } else {
        // store.dispatch({type: SET_AUTHENTICATED})
        setAuthenticated(true)
        getAllPacients()
      }
    }
  }, [token, setAuthenticated])

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
