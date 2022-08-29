import React, { Component } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PrivateRoutes from './private-routes';
import HomePage from '../pages/home-page';
import BillsPage from '../pages/bills-page';
import LoginPage from '../pages/login-page';
import './app.css';

class App extends Component {
  render() {
    return (
      <>
        <Router>
          <Routes>
            <Route element={<PrivateRoutes/>}>
              <Route element={<HomePage/>} path='/home' exact/>
              <Route element={<BillsPage/>} path='/bills' exact/>
            </Route>
            <Route element={<LoginPage/>} path='/login'/>
          </Routes>
        </Router>
      </>
    );
  }
}

export default App;