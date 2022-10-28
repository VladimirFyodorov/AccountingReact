import React from 'react';

const Item = ({id, name, amount, cost_per_exemplar, currency}) => {
  const currency_dic = {'RUB': '₽', 'USD': '$', 'EUR': '€', 'KZT': '₸'};
  const currency_symbol = currency_dic[currency] || '?';
  return (
    <div key={id} className="billPreview-paymentBox-item">
      <h4 className="billPreview-paymentBox-item-name">{ name }</h4>
      <h4 className="billPreview-paymentBox-item-cost">{cost_per_exemplar} {currency_symbol}</h4>
      <h4 className="billPreview-paymentBox-item-items">{amount}x</h4>
    </div>
  );
};

const Items = ({billData}) => {
  const {items, currency} = billData;
  return (
    <div className="billPreview-paymentBox">
      {
        items.map(item => Item({...item, currency}))
      }
    </div>
  );
};

export default Items;