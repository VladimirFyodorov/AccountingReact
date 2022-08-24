import React, {Component} from 'react';
import {connect} from 'react-redux';
// import WithService from '../hoc';
import './bill-edit.css';
import Header from '../header';
import Payments from '../payments';
import Shares from '../shares';


class BillEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {someBlockIsBeengEdited: false};
    this.toggleSomeBlockIsBeengEdited = this.toggleSomeBlockIsBeengEdited.bind(this);
  }

  toggleSomeBlockIsBeengEdited() {
    this.setState(({someBlockIsBeengEdited}) => {
      return {someBlockIsBeengEdited: !someBlockIsBeengEdited};
    });
  }

  render() {

    if (this.props.usersData.length == 0 || this.props.billEditData.length == 0) {
      return (<></>);
    }

    const [{lender}] = this.props.billEditData;
    const billCreator = lender.first_name;
    const user1 = this.props.usersData[0].first_name;
    const user2 = this.props.usersData[1].first_name;
    const initialFilter = (user1 != billCreator)? user1: user2;
    const {someBlockIsBeengEdited} = this.state;
    
    
    return (
      <div className="editBill">
        <Header 
          someBlockIsBeengEdited={someBlockIsBeengEdited}
          toggleSomeBlockIsBeengEdited={this.toggleSomeBlockIsBeengEdited}/>
        <Payments 
          someBlockIsBeengEdited={someBlockIsBeengEdited}
          toggleSomeBlockIsBeengEdited={this.toggleSomeBlockIsBeengEdited}/>
        <Shares 
          initialFilter={initialFilter}
          someBlockIsBeengEdited={someBlockIsBeengEdited}
          toggleSomeBlockIsBeengEdited={this.toggleSomeBlockIsBeengEdited}/>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    usersData: state.usersData,
    billEditData: state.billEditData
  };
};


export default connect(mapStateToProps)(BillEdit);