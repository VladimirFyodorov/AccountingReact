import React, { Component } from 'react';
import AppFooter from '../app-footer';
import LoginForm from '../login-form';

class LoginPage extends Component {
  render() {
    return (
      <>
        <div id="content-wrap">
          <LoginForm/>
        </div>
        <AppFooter/>
      </>
    );
  }
}

export default LoginPage;