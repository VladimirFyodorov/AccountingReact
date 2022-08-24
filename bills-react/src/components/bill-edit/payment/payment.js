import React, {Component} from 'react';
import './payment.css';


export default class Payment extends Component {
  constructor(props) {
    super(props);
    this.state = {paymentEditMode: false};
    this.toggleEditMode = this.toggleEditMode.bind(this);
  }

  toggleEditMode() {
    this.props.toggleRowIsBeeingEdited();
    this.setState(({paymentEditMode}) => {
      return {paymentEditMode:!paymentEditMode};
    });
  }


  render() {
    if (!this.state.paymentEditMode) {
      return (
        <NormalRow 
          paymentData={this.props.paymentData}
          toggleEditMode={this.toggleEditMode}
          editMode={this.props.editMode}
          rowIsBeeingEdited={this.props.rowIsBeeingEdited}
        />
      );
    }
    return (
      <RowInEditMode
        paymentData={this.props.paymentData}
        toggleEditMode={this.toggleEditMode}
        editMode={this.props.editMode}
      />
    );
  }
}

const NormalRow = ({paymentData, toggleEditMode, editMode, rowIsBeeingEdited}) => {
  const {id, name, cost_per_exemplar, amount} = paymentData;
  return (
    <div key={id} className="editBill-payment-row">
      <div className="editBill-payment">
        <div className="editBill-payment-name">
          <h4>{name}</h4>
        </div>
        <div className="editBill-payment-cost">
          <h5>{cost_per_exemplar} ₽</h5>
        </div>
        <div className="editBill-payment-items">
          <h4>x{amount}</h4>
        </div>
        <EditBtn
          editMode={editMode}
          toggleEditMode={toggleEditMode}
          rowIsBeeingEdited={rowIsBeeingEdited}
        />
      </div>
    </div>
  );
};

const EditBtn = ({editMode, toggleEditMode, rowIsBeeingEdited}) => {
  if (editMode && !rowIsBeeingEdited) {
    return (
      <div className="editBill-payment-edit-btn">
        <h4 className="bold" onClick={toggleEditMode}>Edit</h4>
      </div>
    );
  }
  return(<></>);
};


const RowInEditMode = ({paymentData, toggleEditMode}) => {
  const {id, name, cost_per_exemplar, amount} = paymentData;
  return (
    <div key={id} className="editBill-payment-row">
      <div className="editBill-payment">
        <div className="editBill-payment-name">
          <input className="editBill-payment-name-input" defaultValue={name}/>
        </div>
        <div className="editBill-payment-cost">
          <input className="editBill-payment-cost-input" defaultValue={cost_per_exemplar}/>
          <h5> ₽</h5>
        </div>
        <div className="editBill-payment-items">
          <input className="editBill-payment-items-input" defaultValue={amount}/>
          <h4 className="editBill-payment-items-input">items</h4>
        </div>
      </div>
      <div className="editBill-payment-btns">
        <h4 className="editBill-payment-delete-btn bold">Delete</h4>
        <button 
          className="editBill-payment-cancel-btn"
          onClick={toggleEditMode}
        >
          Save
        </button>
      </div> 
    </div>
  );
};