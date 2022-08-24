import React, {Component} from 'react';
import './add-payment-form.css';

class AddBillForm extends Component {
  render() {
    if (!this.props.editMode || this.props.rowIsBeeingEdited) {
      return (<></>);
    }
    return (
      <div className="editBill-payments-add">
        <div className="editBill-payments-add-input">
          <div className="editBill-payments-add-input-name">
            <input type="text" id="editBill-payments-add-input-name"/>
          </div>
          <div className="editBill-payments-add-input-cost">
            <input type="text" id="editBill-payments-add-input-cost"/>
            <h5> ₽</h5>
          </div>
          <div className="editBill-payments-add-input-items">
            <input type="text" id="editBill-payments-add-input-items" defaultValue="1"/>
            <h4 className="editBill-payment-items-input"> items</h4>
          </div>
          <div className="editBill-payments-add-input-add-btn">
            <button id="add-payment-btn">Add payment</button>
          </div>
        </div>
      </div>
    );
  }
}

export default AddBillForm;