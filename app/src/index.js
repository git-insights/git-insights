import React from 'react';
import ReactDOM from 'react-dom';
import * as Sentry from '@sentry/browser';
import * as serviceWorker from './serviceWorker';
import App from './App';

if (process.env.NODE_ENV === 'production') {
  Sentry.init({dsn: process.env.SENTRY_DSN});
}

ReactDOM.render(<App />, document.getElementById('root'));

serviceWorker.unregister();
