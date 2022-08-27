import React, { Component } from 'react';
import {connect} from 'react-redux';
import WithService from '../hoc';
import { usersDataRequested, usersDataLoaded, usersDataError } from '../../actions';
import { userDataLoaded, accountDataLoaded } from '../../actions';
import Spinner from '../spinner';
import Error from '../error';

import AppHeader from '../app-header';
import AppFooter from '../app-footer';
import AccountTotalBox from '../account-total-box';
import AccountBill from '../account-bill';


class HomePage extends Component {
  componentDidMount() {
    const {Service} = this.props;
    this.props.usersDataRequested();
    Service.getUsersData()
      .then(response => this.props.usersDataLoaded(response))
      .catch(this.props.usersDataError());
    
    Service.getUser()
      .then(response => this.props.userDataLoaded(response))
      .catch(err => console.log(err));

    Service.getAccountData()
      .then(response => this.props.accountDataLoaded(response))
      .catch(err => console.log(err));
  }

  render() {
    const {loading, error} = this.props;

    if (loading) {
      return (
        <>
          <AppHeader/>
          <div id="content-wrap">
            <Spinner/>
          </div>
          <AppFooter/>
        </>
      );
    }

    if (error) {
      return (
        <>
          <AppHeader/>
          <div id="content-wrap">
            <Error />
          </div>
          <AppFooter/>
        </>
      );
    }

    return (
      <>
        <AppHeader/>
        <div id="content-wrap">
          <div className="mainBox">
            <AccountBill/>
            <AccountTotalBox/>
          </div>
        </div>
        <AppFooter/>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    loading: state.loading,
    error: state.error,
    userData: state.userData,
    accountData: state.accountData
  };
};


const mapDispatchToProps = {
  usersDataRequested, usersDataLoaded, usersDataError,
  userDataLoaded, accountDataLoaded};

export default WithService()(connect(mapStateToProps, mapDispatchToProps)(HomePage));