import React from 'react';
import './share-row.css';

const ShareRowEditMode = (props) => {
  if (!props.shareData) {
    return (<></>);
  }

  const {id, name, payments} = props.shareData;
  const lender = props.lender;

  return (
    <div key={id} className="editBill-share-row">
      <div className="editBill-share-name">
        <h4 className="name">{ name }</h4>
      </div>
      {
        payments.filter(({name}) => name != lender.first_name).map(({name, share}) => {
          return (
            <div key={name} className="editBill-share-input-amount">
              <input defaultValue={share}/>
            </div>
          );
        })
      }
    </div>
  );
};

export default ShareRowEditMode;