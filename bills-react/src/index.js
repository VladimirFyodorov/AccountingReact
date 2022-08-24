import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import './index.css';
import App from './components/app';
import ErrorBoundry from './components/error-boundry';
import Service from './service';
import ServiceContext from './components/service-context';
import store from './store';

const service = new Service();
const root = ReactDOM.createRoot(document.getElementById('root'));


root.render(
  <Provider store={store}>
    <ErrorBoundry>
      <ServiceContext.Provider value={service}>
        <Router>
          <App/>
        </Router>
      </ServiceContext.Provider>
    </ErrorBoundry>
  </Provider>
);
