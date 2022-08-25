import React, { Component } from 'react';
import { connect, useSelector } from 'react-redux';
import { saveAddBillFormData, clearAddBillFormData } from '../../actions';
import { toggleShowAddBillForm, postBill } from '../../actions';
import WithService from '../hoc';
import './add-bill-form.css';


class AddBillForm extends Component {
  constructor(props) {
    super(props);
    this.onSave = this.onSave.bind(this);
    this.onCancel = this.onCancel.bind(this);
  }

  onSave() {
    const {Service, toggleShowAddBillForm, clearAddBillFormData, postBill} = this.props;
    const {name, costType, date, payer} = this.props.addBillFormData;
    const data = {name, comment: costType, date, lender: payer};
  
    Service.postBill(data)
      .then(res => {
        postBill(res);
        toggleShowAddBillForm();
        clearAddBillFormData();
      })
      .catch(err => console.log(err));
  }

  onCancel() {
    this.props.clearAddBillFormData();
    this.props.toggleShowAddBillForm();
  }

  render() {
    if (!this.props.showAddBillForm) {
      return (
        <></>
      );
    }

    const {saveAddBillFormData} = this.props;

    return (
      <div className="add-bill-form">
        <BillNameInput saveAddBillFormData={saveAddBillFormData}/>
        <CostTypesInput saveAddBillFormData={saveAddBillFormData}/>
        <BillDateInput saveAddBillFormData={saveAddBillFormData}/>
        <PayerInput saveAddBillFormData={saveAddBillFormData}/>
        <CancelBtn onCancel={this.onCancel}/>
        <CreateBillBtn onSave={this.onSave}/>
      </div>
    );
  }
}


const mapStateToProps = (state) => {
  return {
    showAddBillForm: state.showAddBillForm,
    addBillFormData: state.addBillFormData
  };
};

const mapDispatchToProps = {
  saveAddBillFormData, clearAddBillFormData, toggleShowAddBillForm, postBill
};

export default WithService()(connect(mapStateToProps, mapDispatchToProps)(AddBillForm));


const BillNameInput = ({saveAddBillFormData}) => {
  const saved_value = useSelector(state => state.addBillFormData.name);
  const name = saved_value || 'New bill';
  if (!saved_value) {
    saveAddBillFormData({name: name}); // initial value
  }
  return (
    <div className="add-bill-form-big-item">
      <h5>Name</h5>
      <input 
        onChange={(e) => saveAddBillFormData({name: e.target.value})}
        className="create-bill" 
        type="text" 
        name="name" 
        defaultValue={name}/>
    </div>
  );
};

const BillDateInput = ({saveAddBillFormData}) => {
  const saved_value = useSelector(state => state.addBillFormData.date);
  const today = new Date().toISOString().slice(0, 10);
  const date = saved_value || today;
  if (!saved_value) {
    saveAddBillFormData({date: date}); // initial value
  }
  return (
    <div className="add-bill-form-item">
      <h5>Date</h5>
      <input
        onChange={(e) => saveAddBillFormData({date: e.target.value})} 
        className="create-bill"
        type="date" 
        name="date" 
        defaultValue={date}/>
    </div>
  );
};


const CostTypesInput = ({saveAddBillFormData}) => {
  const {costTypes} = useSelector(state => state);
  const saved_value = useSelector(state => state.addBillFormData.costType);
  const selectedCostType = saved_value || costTypes[0];
  if (!saved_value) {
    saveAddBillFormData({costType: selectedCostType}); // initial value
  }
  return (
    <div className="add-bill-form-item">
      <h5>Type</h5>
      <select 
        onChange={(e) => saveAddBillFormData({costType: e.target.value})}
        className="create-bill" 
        name="comment">
        {
          costTypes.map(elem => {
            if (elem == selectedCostType) {
              return (
                <option selected="selected" key={elem} value={elem}>{elem}</option>
              );
            }
            return (
              <option key={elem} value={elem}>{elem}</option>
            );
          })
        }
      </select>
    </div>
  );
};


const PayerInput = ({saveAddBillFormData}) => {
  const {usersData} = useSelector(state => state);
  const saved_value = useSelector(state => state.addBillFormData.payer);
  const payer = saved_value || usersData[0].id;
  if (!saved_value) {
    saveAddBillFormData({payer}); // initial value
  }
  return (
    <div className="add-bill-form-item">
      <h5>Payer</h5>
      <select
        onChange={(e) => saveAddBillFormData({payer: parseInt(e.target.value)})}
        className="create-bill" 
        id="input-bill-payer" 
        name="lender">
        {
          usersData.map(({id, first_name}) => {
            if (id == payer) {
              return (
                <option selected="selected" key={id} value={id}>{first_name}</option>
              );
            }
            return (
              <option key={id} value={id}>{first_name}</option>
            );
          })
        }
      </select>
    </div>
  );
};


const CancelBtn = ({onCancel}) => {
  return (
    <div className="add-bill-form-item">
      <div className="add-bill-form-btn">
        <h5 id="cancel-bill-btn" onClick={onCancel}>Cancel</h5>
      </div>
    </div>
  );
};


const CreateBillBtn = ({onSave}) => {
  return (
    <div className="add-bill-form-middle-item">
      <div className="add-bill-form-btn">
        <button type="submit" id="add-bill-btn" onClick={onSave}>Create bill</button>
      </div>
    </div>
  );
};