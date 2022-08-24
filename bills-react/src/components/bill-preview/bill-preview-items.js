import React from 'react';

const Item = ({id, name, amount, cost_per_exemplar}) => {
  return (
    <div key={id} className="billPreview-paymentBox-item">
      <h4 className="billPreview-paymentBox-item-name">{ name }</h4>
      <h4 className="billPreview-paymentBox-item-cost">{cost_per_exemplar} ₽</h4>
      <h4 className="billPreview-paymentBox-item-items">{amount}x</h4>
    </div>
  );
};

const Items = ({billData}) => {
  const {items} = billData;
  return (
    <div className="billPreview-paymentBox">
      {
        items.map(item => Item(item))
      }
    </div>
  );
};

export default Items;