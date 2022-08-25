import React, { Component } from 'react';
import './add-bill-form.css';


class AddBillForm extends Component {
  render() {
    return (
      <div className="add-bill-form">
        <div className="add-bill-form-big-item">
          <h5>Name</h5>
          <input className="create-bill" type="text" id="input-bill-name" name="name"/>
        </div>
        <div className="add-bill-form-item">
          <h5>Type</h5>
          <select className="create-bill" id="input-bill-type" name="comment">
            <option value="Food">Food</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Health and Beauty">Health and Beauty</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="add-bill-form-item">
          <h5>Date</h5>
          <input className="create-bill" type="date" id="input-bill-date" name="date"/>
        </div>
        <div className="add-bill-form-item">
          <h5>Payer</h5>
          <select className="create-bill" id="input-bill-payer" name="lender">
            <option value="1">Vladimir</option>
            <option value="2">Sonia</option>
            <option value="3">Dima</option>
          </select>
        </div>
        <div className="add-bill-form-item">
          <div className="add-bill-form-btn">
            <h5 id="cancel-bill-btn">Cancel</h5>
          </div>
        </div>
        <div className="add-bill-form-middle-item">
          <div className="add-bill-form-btn">
            <button type="submit" id="add-bill-btn">Create bill</button>
          </div>
        </div>
      </div>
    );
  }
}

export default AddBillForm;