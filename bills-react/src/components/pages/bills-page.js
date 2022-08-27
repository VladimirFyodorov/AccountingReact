import React, { Component } from 'react';
import {connect} from 'react-redux';
import AppHeader from '../app-header';
import AppFooter from '../app-footer';
import BillsMenu from '../bills-menu/bills-menu';
import BillPreview from '../bill-preview';
import BillEdit from '../bill-edit/bill-edit';

import WithService from '../hoc';
import { billsDataRequested, billsDataLoaded, billsDataError } from '../../actions';
import { usersDataRequested, usersDataLoaded, usersDataError } from '../../actions';
import { startBillEdit, userDataLoaded } from '../../actions';
import Spinner from '../spinner';
import Error from '../error';
import './bills-page.css';


class BillsPage extends Component {

  componentDidMount() {
    const {Service} = this.props;
    const url = window.location.href;
    const billIdToEdit = parseInt(url.split('?id=')[1]);
    

    this.props.billsDataRequested();
    Service.getBillsData()
      .then(response => {
        this.props.billsDataLoaded(response);
        if (billIdToEdit) {
          const billData = response.find(bill => bill.id == billIdToEdit);
          this.props.startBillEdit(billData);
        }
      })
      .catch(this.props.billsDataError());

    this.props.usersDataRequested();
    Service.getUsersData()
      .then(response => this.props.usersDataLoaded(response))
      .catch(this.props.usersDataError());
    
    Service.getUser()
      .then(response => this.props.userDataLoaded(response))
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
          <div className='mainBox'>
            <BillsMenu/>
            <div className="mainBill">
              <BillPreview/>
              <BillEdit/>
            </div>
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
  usersDataRequested, usersDataLoaded, usersDataError,
  userDataLoaded, startBillEdit};
  
export default WithService()(connect(mapStateToProps, mapDispatchToProps)(BillsPage));