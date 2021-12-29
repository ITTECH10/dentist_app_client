// scroll bar
import 'simplebar/src/simplebar.css';

import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import AppContextProvider from './context/AppContext'
import EmployeeContextProvider from './context/EmployeeContext'
import PacientContextProvider from './context/PacientContext'

//
import App from './App';
import * as serviceWorker from './serviceWorker';
import reportWebVitals from './reportWebVitals';
import axios from 'axios';

axios.defaults.withCredentials = true

// DEVELOPMENT
axios.defaults.baseURL = 'http://localhost:8000/api/v1'

// PRODUCTION
// axios.defaults.baseURL = 'https://dentist-srv.herokuapp.com/api/v1'

// ----------------------------------------------------------------------

ReactDOM.render(
  <BrowserRouter>
    <AppContextProvider>
      <EmployeeContextProvider>
        <PacientContextProvider>
          <HelmetProvider>
            <App />
          </HelmetProvider>
        </PacientContextProvider>
      </EmployeeContextProvider>
    </AppContextProvider>,
  </BrowserRouter>,
  document.getElementById('root')
);

// If you want to enable client cache, register instead.
serviceWorker.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
