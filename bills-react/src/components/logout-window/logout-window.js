import React, { Component } from 'react';
import { connect } from 'react-redux';
import './logout-window.css';
import { toggleLogoutWindow } from '../../actions';
import WithService from '../hoc';

class LogoutWindow extends Component {
  constructor(props) {
    super(props);
    this.logout = this.logout.bind(this);
  }

  logout() {
    this.props.Service.logout()
      .then(() => {
        sessionStorage.setItem('status','loggedOut');
        window.location.replace(`${location.protocol}//${location.host}/login`);
      })
      .catch((err) => console.log(err));
  }

  render() {
    const { showLogoutWindow, userData } = this.props;
    const fullName = `${userData.first_name} ${userData.last_name}`;
    if (!showLogoutWindow) {
      return (<></>);
    }

    return (
      <div className="account-popup-window">
        <div className="account-popup-window-textbox">
          <h5 className="bold">{fullName}</h5>
          <h6>{userData.email}</h6>
        </div>
        <div className="account-popup-window-signountbox" onClick={this.logout}>
          <h6>Sign out</h6>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    showLogoutWindow: state.showLogoutWindow,
    userData: state.userData
  };
};

const mapDispatchToProps = { toggleLogoutWindow };

export default WithService()(connect(mapStateToProps, mapDispatchToProps)(LogoutWindow));