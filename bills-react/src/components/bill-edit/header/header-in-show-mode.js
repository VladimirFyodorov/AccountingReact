import React from 'react';
import { useSelector } from 'react-redux';

const HeaderInShowMode = ({toggleEditMode, someBlockIsBeengEdited}) => {
  const [{name, date, lender}] = useSelector((state) => state.billEditData);
  const billName = `${name} ${date} ${lender.first_name}`;
  return (
    <div className="editBill-header">
      <h2 id="editBill-header-name">{ billName }</h2>
      <EditBtn
        toggleEditMode={toggleEditMode}
        someBlockIsBeengEdited={someBlockIsBeengEdited}/>
    </div>
  );
};

const EditBtn = ({someBlockIsBeengEdited, toggleEditMode}) => {
  if (someBlockIsBeengEdited) {
    return (<></>);
  }
  return (
    <div className="editBill-header-btns">
      <h5 className="bold" id="delete-bill-btn">Delete</h5>
      <button 
        id="edit-header-btn"
        onClick={toggleEditMode}>
        Edit
      </button>
    </div>
  );
};

export default HeaderInShowMode;