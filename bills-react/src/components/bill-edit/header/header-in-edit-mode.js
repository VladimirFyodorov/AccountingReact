import React from 'react';
import { useSelector } from 'react-redux';

const HeaderInEditMode = ({toggleEditMode}) => {
  const {billEditData, usersData, costTypes} = useSelector((state) => state);

  const [{name, date}] = billEditData;
  return (
    <div className="editBill-header">
      <div className='editBill-header-input'>
        <input type="text" className='editBill-header-input-name' defaultValue={name}/>
        <input type="date" className='editBill-header-input-date' defaultValue={date}/>
        <CostTypeInput
          costTypes={costTypes}
          billEditData={billEditData}/>
        <PayerInput
          usersData={usersData}
          billEditData={billEditData}/>
      </div>

      <div className="editBill-header-btns">
        <button 
          id="edit-header-btn"
          onClick={toggleEditMode}
        >
          Save
        </button>
      </div>
    </div>
  );
};
  
  
const CostTypeInput = ({costTypes, billEditData}) => {
  let [{comment}] = billEditData;
  comment = (comment == '')? costTypes[0]: comment;
  return (
    <select className='editBill-header-input-costType'>
      <option value={comment}>{comment}</option>
      {
        costTypes.filter(type => type != comment).map(type => {
          return (<option key={type} value={type}>{type}</option>);
        })
      }
    </select>
  );
};


const PayerInput = ({usersData, billEditData}) => {
  const [{lender}] = billEditData;

  return (
    <select className='editBill-header-input-payer'>
      <option value={lender.id}>{lender.first_name}</option>
      {
        usersData.filter(user => user.id != lender.id).map(user => {
          return (<option key={user.id} value={user.id}>{user.first_name}</option>);
        })
      }
    </select>
  );
};

export default HeaderInEditMode;