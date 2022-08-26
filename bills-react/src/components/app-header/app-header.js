import React, {Component} from 'react';
import {connect} from 'react-redux';
import LogoutWindow from '../logout-window';
import './app-header.css';
import { toggleShowAddBillForm } from '../../actions';
import WithService from '../hoc';

class AppHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {showLogoutWindow: false};
    this.toggleLogoutWindow = this.toggleLogoutWindow.bind(this);
    this.logout = this.logout.bind(this);
  }

  toggleLogoutWindow() {
    this.setState(state => ({
      showLogoutWindow: !state.showLogoutWindow}
    ));
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
    const {showLogoutWindow} = this.state;
    let {userData} = this.props;
    const initials = userData.first_name.slice(0, 1) + userData.last_name.slice(0, 1);

    return (
      <>
        <header>
          <div className="header-menu">
            <HeaderItem text='Home' url='/home/'/>
            <HeaderItem text='Bills' url='/bills/'/>
          </div>
          <div className="header-right-menu">
            <div 
              className="header-right-menu-add-bill-box"
              onClick={this.props.toggleShowAddBillForm}>
              +$
            </div>
            <div onClick={this.toggleLogoutWindow} className="header-right-menu-user-box">
              {initials}
            </div>
          </div>
        </header>
        {showLogoutWindow?<LogoutWindow userData={userData} logout={this.logout}/>:<></>}
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    userData: state.userData
  };
};

const mapDispatchToProps = { toggleShowAddBillForm };

export default WithService()(connect(mapStateToProps, mapDispatchToProps)(AppHeader));


const HeaderItem = ({text, url}) => {
  const currentUrl = window.location.href;
  const isCurent = currentUrl.includes(url);
  const itemClass = isCurent?'header-menu-item-current':'header-menu-item';
  return (
    <div className={itemClass}>
      <a href={url}>
        {text}
      </a>
    </div>
  );
};