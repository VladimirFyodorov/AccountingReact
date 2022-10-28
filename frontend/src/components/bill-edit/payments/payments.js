import React, {Component} from 'react';
import {connect} from 'react-redux';
import Payment from '../payment';
import AddBillForm from '../add-payment-form';
import './payments.css';
import WithService from '../../hoc';
import {postPayments, putPayments, deletePayments} from '../../../actions';

class Payments extends Component {
  constructor(props) {
    super(props);
    this.state = {editMode: false, rowIsBeeingEdited: false};
    this.toggleEditMode = this.toggleEditMode.bind(this);
    this.toggleRowIsBeeingEdited = this.toggleRowIsBeeingEdited.bind(this);
    this.onSave = this.onSave.bind(this);
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

  onSave() {
    const { Service } = this.props;
    const payments = this.props.billEditData[0].items;
    const postPayments = payments
      .filter(payment => payment.isEditedType == 'POST')
      .map(({bill, name, amount, cost_per_exemplar}) => {
        return {bill, name, amount, cost_per_exemplar};
      });
    
    const postPaymentsIndexes = payments
      .map((payment, index) => {
        if (payment.isEditedType == 'POST') {
          return index;
        } else {
          return -1;
        }
      })
      .filter(index => index != -1);
  

    const putPayments = payments
      .filter(payment => payment.isEditedType == 'PUT')
      .map(({id, bill, name, amount, cost_per_exemplar}) => {
        return {id, bill, name, amount, cost_per_exemplar};
      });

    const putPaymentsIndexes = payments
      .map((payment, index) => {
        if (payment.isEditedType == 'PUT') {
          return index;
        } else {
          return -1;
        }
      })
      .filter(index => index != -1);

    const deletePayments = payments
      .filter(payment => payment.isEditedType == 'DELETE')
      .map(({id}) => {
        return {id};
      });
    
    const deletePaymentsIndexes = payments
      .map((payment, index) => {
        if (payment.isEditedType == 'DELETE') {
          return index;
        } else {
          return -1;
        }
      })
      .filter(index => index != -1);
    
    if (postPayments.length > 0) {
      Service.postPayments(postPayments)
        .then(res => {
          this.props.postPayments({indexes:postPaymentsIndexes, ...res});
          const error = (res.response.filter(({status}) => status == 400).length > 0);
          if (error && !this.state.editMode) {
            this.toggleEditMode();
          }
        })
        .catch((err) => console.log(err));
    }

    if (putPayments.length > 0) {
      Service.putPayments(putPayments)
        .then(res => {
          this.props.putPayments({indexes:putPaymentsIndexes, ...res});
          const error = (res.response.filter(({status}) => status == 400).length > 0);
          if (error && !this.state.editMode) {
            this.toggleEditMode();
          }
        })
        .catch((err) => console.log(err));
    }

    if (deletePayments.length > 0) {
      Service.deletePayments(deletePayments)
        .then(res => {
          this.props.deletePayments({indexes:deletePaymentsIndexes, ...res});
          const error = (res.response.filter(({status}) => status == 400).length > 0);
          if (error && !this.state.editMode) {
            this.toggleEditMode();
          }
        })
        .catch((err) => console.log(err));
    }
  }


  render () {
    if (this.props.billEditData.length != 0) {
      const [{items, currency}] = this.props.billEditData;
      return (
        <div className="editBill-payments">
          <Header/>
          <AddBillForm 
            editMode={this.state.editMode}
            rowIsBeeingEdited={this.state.rowIsBeeingEdited}/>
          <PaymentsBox 
            items={items}
            currency={currency}
            editMode={this.state.editMode}
            rowIsBeeingEdited={this.state.rowIsBeeingEdited}
            toggleRowIsBeeingEdited={this.toggleRowIsBeeingEdited}/>
          <Btn
            onSave={this.onSave}
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

const mapDispatchToProps = {postPayments, putPayments, deletePayments};


export default WithService()(connect(mapStateToProps, mapDispatchToProps)(Payments));


const Header = () => {
  return (
    <div className="editBill-payments-header">
      <h4 className="bold">Payments</h4>
    </div>
  );
};

const PaymentsBox = ({items, currency, editMode, rowIsBeeingEdited, toggleRowIsBeeingEdited}) => {
  return (
    <div className="editBill-payments-box">
      {
        items.map((item, index) => {
          if (item.isEditedType == 'DELETE') {
            return (<></>);
          }
          return (
            <Payment 
              key={index}
              index={index}
              paymentData={item}
              currency={currency}
              editMode={editMode}
              rowIsBeeingEdited={rowIsBeeingEdited}
              toggleRowIsBeeingEdited={toggleRowIsBeeingEdited}/>
          );
        })
      }
    </div>
  );
};

const Btn = ({onSave, toggleEditMode, editMode, rowIsBeeingEdited, someBlockIsBeengEdited}) => {
  const btnText = (editMode)? 'Save': 'Edit';
  if (rowIsBeeingEdited) {
    return (<></>);
  }
  if (someBlockIsBeengEdited && !editMode) {
    return (<></>);
  }
  const onClick = () => {
    if (editMode) {
      onSave();
    }
    toggleEditMode();
  };

  return (
    <div className="editBill-payments-btns">
      <button id="edit-payments-btn" onClick={onClick}>{ btnText }</button>
    </div>
  );
};