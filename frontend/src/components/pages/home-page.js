import React, { Component } from 'react';
import {connect} from 'react-redux';
import WithService from '../hoc';
import { usersDataRequested, usersDataLoaded, usersDataError } from '../../actions';
import { userDataLoaded, accountDataLoaded, exchangeRatesLoaded } from '../../actions';
import Spinner from '../spinner';
import Error from '../error';

import AppHeader from '../app-header';
import AppFooter from '../app-footer';
import AccountTotalBox from '../account-total-box';
import AccountBill from '../account-bill';


class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currencyConvertationTypes: [null, 'RUB', 'KZT', 'USD', 'EUR'],
      indexOfCurrentConvType: 0,
    };
    this.toggleConv = this.toggleConv.bind(this);
  }

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
    
    Service.getExchangeRates()
      .then(response => this.props.exchangeRatesLoaded(response))
      .catch(err => console.log(err));
  }

  toggleConv() {
    this.setState(({indexOfCurrentConvType, currencyConvertationTypes}) => {
      const newIndex = (indexOfCurrentConvType + 1 < currencyConvertationTypes.length)?indexOfCurrentConvType + 1: 0;
      return {indexOfCurrentConvType: newIndex};
    });
  }

  render() {
    const {loading, error} = this.props;
    const convCurrency = this.state.currencyConvertationTypes[this.state.indexOfCurrentConvType];

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
            <AccountBill convCurrency={convCurrency} />
            <AccountTotalBox convCurrency={convCurrency} toggleConv={this.toggleConv}/>
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
  userDataLoaded, accountDataLoaded, exchangeRatesLoaded};

export default WithService()(connect(mapStateToProps, mapDispatchToProps)(HomePage));