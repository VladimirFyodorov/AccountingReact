import React, { Component } from 'react';
import {connect} from 'react-redux';
import AppHeader from '../app-header';
import AppFooter from '../app-footer';
import AddBillForm from '../add-bill-form';
import BillsMenu from '../bills-menu/bills-menu';
import BillPreview from '../bill-preview';
import BillEdit from '../bill-edit/bill-edit';
import './app.css';

import WithService from '../hoc';
import { billsDataRequested, billsDataLoaded, billsDataError } from '../../actions';
import { usersDataRequested, usersDataLoaded, usersDataError } from '../../actions';
import Spinner from '../spinner';
import Error from '../error';


class App extends Component {

  componentDidMount() {
    const {Service} = this.props;

    this.props.billsDataRequested();
    Service.getBillsData()
      .then(response => this.props.billsDataLoaded(response))
      .catch(this.props.billsDataError());

    this.props.usersDataRequested();
    Service.getUsersData()
      .then(response => this.props.usersDataLoaded(response))
      .catch(this.props.usersDataError());
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
          <BillsMenu/>
          <div className="mainBill">
            <AddBillForm/>
            <BillPreview/>
            <BillEdit/>
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
    error: state.error
  };
};


const mapDispatchToProps = { 
  billsDataRequested, billsDataLoaded, billsDataError,
  usersDataRequested, usersDataLoaded, usersDataError};
  
export default WithService()(connect(mapStateToProps, mapDispatchToProps)(App));