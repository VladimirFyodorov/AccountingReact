import React, {Component, useState} from 'react';
import './payment.css';
import {prePutPayment, preDeletePayment} from '../../../actions';
import {connect} from 'react-redux';


class Payment extends Component {
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

    const data = {
      ...this.props.paymentData, 
      index: this.props.index,
      bill: this.props.billEditData[0].id
    };

    return (
      <RowInEditMode
        data={data}
        toggleEditMode={this.toggleEditMode}
        prePutPayment={this.props.prePutPayment}
        preDeletePayment={this.props.preDeletePayment}/>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    billEditData: state.billEditData
  };
};

const mapDispatchToProps = {prePutPayment, preDeletePayment};

export default connect(mapStateToProps, mapDispatchToProps)(Payment);




const NormalRow = ({paymentData, toggleEditMode, editMode, rowIsBeeingEdited}) => {
  const {name, cost_per_exemplar, amount, error} = paymentData;
  const rowClass = error?'editBill-payment-error':'editBill-payment';
  return (
    <div className="editBill-payment-row">
      <div className={rowClass}>
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



const RowInEditMode = ({data, prePutPayment, preDeletePayment, toggleEditMode}) => {
  const [state, setState] = useState(data);

  const onSave = () => {
    const {index, id, name, cost_per_exemplar, amount, bill} = state;
    let errMsg = '';
    errMsg += (!name)? 'Name is not valid. ': '';
    errMsg += (!cost_per_exemplar)? 'Cost is not valid. ': '';
    errMsg += (!amount)? 'Items are not valid. ': '';
    if (errMsg) {
      alert(errMsg);
    } else {
      const data = {index, id, name, cost_per_exemplar, amount, bill};
      prePutPayment(data);
      toggleEditMode();
    }
  };

  const onDelete = () => {
    preDeletePayment({index: state.index});
    toggleEditMode();
  };
  
  const {index, name, cost_per_exemplar, amount} = state;
  return (
    <div key={index} className="editBill-payment-row">
      <div className="editBill-payment">
        <div className="editBill-payment-name">
          <input 
            className="editBill-payment-name-input" 
            value={name}
            onChange={e => setState({...state, name: e.target.value})}/>
        </div>
        <div className="editBill-payment-cost">
          <input 
            className="editBill-payment-cost-input" 
            value={cost_per_exemplar}
            onChange={e => setState({...state, cost_per_exemplar: +e.target.value || ''})}/>
          <h5> ₽</h5>
        </div>
        <div className="editBill-payment-items">
          <input 
            className="editBill-payment-items-input" 
            value={amount}
            onChange={e => setState({...state, amount: +e.target.value || ''})}/>
          <h4 className="editBill-payment-items-input">items</h4>
        </div>
      </div>
      <div className="editBill-payment-btns">
        <h4 
          className="editBill-payment-delete-btn bold"
          onClick={onDelete}>
          Delete
        </h4>
        <button 
          className="editBill-payment-cancel-btn"
          onClick={onSave}>
          Save
        </button>
      </div> 
    </div>
  );
};