import React from 'react';
import { useSelector } from 'react-redux';

const HeaderInShowMode = ({toggleEditMode, someBlockIsBeengEdited, onDelete}) => {
  const [{name, date, lender}] = useSelector((state) => state.billEditData);
  const billName = `${name} ${date} ${lender.first_name}`;

  return (
    <div className="editBill-header">
      <h2 id="editBill-header-name">{ billName }</h2>
      <EditBtn
        onDelete={onDelete}
        toggleEditMode={toggleEditMode}
        someBlockIsBeengEdited={someBlockIsBeengEdited}/>
    </div>
  );
};

const EditBtn = ({someBlockIsBeengEdited, toggleEditMode, onDelete}) => {

  if (someBlockIsBeengEdited) {
    return (<></>);
  }
  return (
    <div className="editBill-header-btns">
      <h5 className="bold" id="delete-bill-btn" onClick={onDelete}>Delete</h5>
      <button 
        id="edit-header-btn"
        onClick={toggleEditMode}>
        Edit
      </button>
    </div>
  );
};

export default HeaderInShowMode;