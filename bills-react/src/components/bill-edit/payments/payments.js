import React, {Component} from 'react';
import {connect} from 'react-redux';
import Payment from '../payment';
import AddBillForm from '../add-payment-form';
import './payments.css';

class Payments extends Component {
  constructor(props) {
    super(props);
    this.state = {editMode: false, rowIsBeeingEdited: false};
    this.toggleEditMode = this.toggleEditMode.bind(this);
    this.toggleRowIsBeeingEdited = this.toggleRowIsBeeingEdited.bind(this);
  }

  toggleEditMode() {
    this.props.toggleSomeBlockIsBeengEdited();
    this.setState(({editMode}) => {
      return {editMode:!editMode};
    });
  }

  toggleRowIsBeeingEdited() {
    this.setState(({rowIsBeeingEdited}) => {
      return {rowIsBeeingEdited:!rowIsBeeingEdited};
    });
  }


  render () {
    if (this.props.billEditData.length != 0) {
      const [{items}] = this.props.billEditData;
      return (
        <div className="editBill-payments">
          <Header/>
          <AddBillForm 
            editMode={this.state.editMode}
            rowIsBeeingEdited={this.state.rowIsBeeingEdited}/>
          <PaymentsBox 
            items={items} 
            editMode={this.state.editMode}
            rowIsBeeingEdited={this.state.rowIsBeeingEdited}
            toggleRowIsBeeingEdited={this.toggleRowIsBeeingEdited}/>
          <Btn
            someBlockIsBeengEdited={this.props.someBlockIsBeengEdited}
            toggleEditMode={this.toggleEditMode} 
            editMode={this.state.editMode}
            rowIsBeeingEdited={this.state.rowIsBeeingEdited}/>
        </div>
      );
    }
    return (
      <></>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    billEditData: state.billEditData
  };
};


export default connect(mapStateToProps)(Payments);


const Header = () => {
  return (
    <div className="editBill-payments-header">
      <h4 className="bold">Payments</h4>
    </div>
  );
};

const PaymentsBox = ({items, editMode, rowIsBeeingEdited, toggleRowIsBeeingEdited}) => {
  return (
    <div className="editBill-payments-box">
      {
        items.map(item => <Payment 
          key={item.id} 
          paymentData={item} 
          editMode={editMode}
          rowIsBeeingEdited={rowIsBeeingEdited}
          toggleRowIsBeeingEdited={toggleRowIsBeeingEdited}/>)
      }
    </div>
  );
};

const Btn = ({toggleEditMode, editMode, rowIsBeeingEdited, someBlockIsBeengEdited}) => {
  const btnText = (editMode)? 'Save': 'Edit';
  if (rowIsBeeingEdited) {
    return (<></>);
  }
  if (someBlockIsBeengEdited && !editMode) {
    return (<></>);
  }
  return (
    <div className="editBill-payments-btns">
      <button id="edit-payments-btn" onClick={toggleEditMode}>{ btnText }</button>
    </div>
  );
};