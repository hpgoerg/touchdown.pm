/**
 * @module index
 *
 * @description
 * entry point of the React application
 *
 * @author Hans-Peter Görg
 **/

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter as Router} from 'react-router-dom';
//imports necessary to initiate i18n
// eslint-disable-next-line
import { I18nextProvider } from "react-i18next";
// eslint-disable-next-line
import i18n from "./i18n";

ReactDOM.render(
  <React.StrictMode>
      <Router>
          <App />
      </Router>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
