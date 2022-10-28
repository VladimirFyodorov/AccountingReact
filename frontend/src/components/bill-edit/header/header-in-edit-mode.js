import React from 'react';
import { useSelector } from 'react-redux';

const HeaderInEditMode = ({onPut, changeUnsavedData}) => {
  const {billEditData, usersData, costTypes} = useSelector((state) => state);

  const [{name, date}] = billEditData;
  return (
    <div className="editBill-header">
      <div className='editBill-header-input'>
        <input type="text" 
          className='editBill-header-input-name' 
          defaultValue={name}
          onChange={(e) => changeUnsavedData({name: e.target.value})}/>
        <input type="date" 
          className='editBill-header-input-date' 
          defaultValue={date}
          onChange={(e) => changeUnsavedData({date: e.target.value})}/>
        <CostTypeInput
          costTypes={costTypes}
          billEditData={billEditData}
          changeUnsavedData={changeUnsavedData}/>
        <PayerInput
          usersData={usersData}
          billEditData={billEditData}
          changeUnsavedData={changeUnsavedData}/>
        <CurrencyInput
          billEditData={billEditData}
          changeUnsavedData={changeUnsavedData}/>
      </div>

      <div className="editBill-header-btns">
        <button 
          id="edit-header-btn"
          onClick={onPut}>
          Save
        </button>
      </div>
    </div>
  );
};
  
  
const CostTypeInput = ({costTypes, billEditData, changeUnsavedData}) => {
  let [{comment}] = billEditData;
  comment = (comment == '')? costTypes[0]: comment;
  return (
    <select 
      className='editBill-header-input-costType' 
      onChange={(e) => changeUnsavedData({comment: e.target.value})}>
      <option value={comment}>{comment}</option>
      {
        costTypes.filter(type => type != comment).map(type => {
          return (<option key={type} value={type}>{type}</option>);
        })
      }
    </select>
  );
};


const PayerInput = ({usersData, billEditData, changeUnsavedData}) => {
  const [{lender}] = billEditData;

  return (
    <select 
      className='editBill-header-input-payer'
      onChange={(e) => changeUnsavedData({lender: parseInt(e.target.value)})}>
      <option value={lender.id}>{lender.first_name}</option>
      {
        usersData.filter(user => user.id != lender.id).map(user => {
          return (<option key={user.id} value={user.id}>{user.first_name}</option>);
        })
      }
    </select>
  );
};

const CurrencyInput = ({billEditData, changeUnsavedData}) => {
  const [{currency}] = billEditData;
  const currency_dic = {'RUB': '₽', 'USD': '$', 'EUR': '€', 'KZT': '₸'};

  return (
    <select 
      className='editBill-header-input-currency'
      onChange={(e) => changeUnsavedData({currency: e.target.value})}>
      <option value={currency}>{currency_dic[currency]}</option>
      {
        Object.entries(currency_dic).filter(([key]) => key != currency).map(([key, value]) => {
          return (<option key={key} value={key}>{value}</option>);
        })
      }
    </select>
  );
};

export default HeaderInEditMode;