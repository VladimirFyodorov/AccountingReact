import React from 'react';
import './share-row.css';

const ShareRow = (props) => {
  if (!props.shareData) {
    return (<></>);
  }

  const {id, name, payments} = props.shareData;
  const filter = props.filter;

  return (
    <div key={id} className="editBill-share-row">
      <div className="editBill-share-name">
        <h4 className="name">{ name }</h4>
      </div>
      {
        payments.filter(({name}) => name == filter).map(({name, share}) => {
          return (
            <div key={name} className="editBill-share-amount">
              <h4 className="editBill-share-amount-share">{share}</h4>
            </div>
          );
        })
      }
    </div>
  );
};

export default ShareRow;