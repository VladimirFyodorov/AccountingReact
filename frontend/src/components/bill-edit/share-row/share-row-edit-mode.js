import React from 'react';
import './share-row.css';

const ShareRowEditMode = (props) => {
  if (!props.shareData) {
    return (<></>);
  }

  const {index, lender, prePutShare, shareData} = props;
  const {name, payments} = shareData;

  const onChange = (payer, shareStr) => {
    // when user is trying to enter float (e.g. 0.3) 
    // first shange is 0. which can't be a float and only a string =>
    // when shareStr is 0. pass this as a string
    // else pass float(shareStr)
    const share = (shareStr == '0.')?shareStr: +shareStr || 0;

    const data = {itemIndex: index, payer, share};
    prePutShare(data);
  };


  return (
    <div key={index} className="editBill-share-row">
      <div className="editBill-share-name">
        <h4 className="name">{ name }</h4>
      </div>
      {
        payments.filter(({name}) => name != lender.first_name).map(({name, share, error}) => {
          const shareClass = error? 'editBill-share-input-amount-error':'';
          return (
            <div key={name} className="editBill-share-input-amount">
              <input
                className={shareClass}
                value={share}
                onChange={e => onChange(name, e.target.value)}/>
            </div>
          );
        })
      }
    </div>
  );
};

export default ShareRowEditMode;