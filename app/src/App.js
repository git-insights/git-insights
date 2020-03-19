import React, { useState, useEffect } from 'react';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { Chart } from 'react-chartjs-2';
import { ThemeProvider } from '@material-ui/styles';
import validate from 'validate.js';

import { chartjs, apiClient } from './helpers';
import theme from './theme';
import 'react-perfect-scrollbar/dist/css/styles.css';
import './assets/scss/index.scss';
import validators from './common/validators';
import Routes from './Routes';
import { AuthProvider, UserProvider } from 'context';
import client from 'helpers/api-client';

const browserHistory = createBrowserHistory();

Chart.helpers.extend(Chart.elements.Rectangle.prototype, {
  draw: chartjs.draw
});

validate.validators = {
  ...validate.validators,
  ...validators
};

export default function App(props) {
  // const [authTokens, setAuthTokens] = useState();
  // const [user, setUser] = useState();

  // const setTokens = (data) => {
  //   if (data) {
  //     localStorage.setItem('session', JSON.stringify(data));
  //     setAuthTokens(data);
  //   } else {
  //     // TODO: handle this case
  //     console.log('Error');
  //   }
  // }

  // apiClient('api/accounts')

  // const removeTokens = () => {
  //   localStorage.removeItem('session');
  //   setAuthTokens();
  // }

  // // Check if we have jwt stored in local storage
  // let sessionData = localStorage.getItem('session');
  // if (sessionData && !authTokens) {
  //   console.log('Setting Token');
  //   const data = JSON.parse(sessionData);
  //   setTokens(data);
  //   const options = {
  //     method: 'GET',
  //     credentials: 'include',
  //     headers: {
  //       'Authorization': `Bearer ${data.token}`
  //     }
  //   };
  //   fetch(`${process.env.REACT_APP_API_SERVER}/api/accounts`, options)
  //     .then(result => {
  //       if (result.status === 200) {
  //         result.json().then(user => {
  //           console.log('Setting User');
  //           setUser(user);
  //         });
  //       } else {
  //         // Session expired, reboot
  //         removeTokens();
  //       }
  //     })
  // }

  return (
    <AuthProvider>
      <UserProvider>
        <ThemeProvider theme={theme}>
            <Router history={browserHistory}>
              <Routes />
            </Router>
        </ThemeProvider>
      </UserProvider>
    </AuthProvider>
  );
}
