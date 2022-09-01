import React, { Component } from 'react';
import AppFooter from '../app-footer';
import './singup-page.css';


class SignupPage extends Component {
  render() {
    return (
      <>
        <div id="content-wrap">
          <div className='signup-div'>
            <h3>This page is currently under construction</h3>
            <h3>Use acc.app.bot@gmail.com and test_user as email and password to login</h3>
            <a href="/login" className="link">Login</a>
          </div>
        </div>
        <AppFooter/>
      </>
    );
  }
}

export default SignupPage;