import React, {Component} from 'react';
import {connect} from 'react-redux';
import AddBillForm from '../add-bill-form';
import LogoutWindow from '../logout-window';
import './app-header.css';
import { toggleShowAddBillForm, toggleLogoutWindow } from '../../actions';

class AppHeader extends Component {
  render() {
    const {userData} = this.props;
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
            <div 
              onClick={this.props.toggleLogoutWindow} 
              className="header-right-menu-user-box">
              {initials}
            </div>
          </div>
        </header>
        <div className='under-header-box'>
          <AddBillForm/>
          <LogoutWindow/>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    userData: state.userData
  };
};

const mapDispatchToProps = { toggleShowAddBillForm, toggleLogoutWindow };

export default connect(mapStateToProps, mapDispatchToProps)(AppHeader);


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