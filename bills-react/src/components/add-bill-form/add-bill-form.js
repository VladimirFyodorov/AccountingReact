import React, { Component } from 'react';
import { connect, useSelector } from 'react-redux';
import { saveAddBillFormData } from '../../actions';
import './add-bill-form.css';


class AddBillForm extends Component {

  render() {
    if (!this.props.showAddBillForm) {
      return (
        <></>
      );
    }

    console.log(this.props.addBillFormData);
    const {saveAddBillFormData} = this.props;

    return (
      <div className="add-bill-form">
        <BillNameInput saveAddBillFormData={saveAddBillFormData}/>
        <CostTypesInput saveAddBillFormData={saveAddBillFormData}/>
        <BillDateInput saveAddBillFormData={saveAddBillFormData}/>
        <PayerInput saveAddBillFormData={saveAddBillFormData}/>
        <CancelBtn/>
        <CreateBillBtn/>
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

const mapDispatchToProps = {saveAddBillFormData};

export default connect(mapStateToProps, mapDispatchToProps)(AddBillForm);


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


const CancelBtn = () => {
  return (
    <div className="add-bill-form-item">
      <div className="add-bill-form-btn">
        <h5 id="cancel-bill-btn">Cancel</h5>
      </div>
    </div>
  );
};


const CreateBillBtn = () => {
  return (
    <div className="add-bill-form-middle-item">
      <div className="add-bill-form-btn">
        <button type="submit" id="add-bill-btn">Create bill</button>
      </div>
    </div>
  );
};