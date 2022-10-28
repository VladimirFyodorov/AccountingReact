import React from 'react';

const Payment = ({name, amount, is_payed, currency}) => {
  const IsPayedClass = (is_payed == 'True')? 'True': 'False';
  const class_name = 'billPreview-shareBox-item-name' + ' ' +IsPayedClass;
  const class_amount = 'billPreview-shareBox-item-amount' + ' ' + IsPayedClass;
  const class_symbol = 'billPreview-shareBox-item-isPayed' + '-' + IsPayedClass;
  const currency_dic = {'RUB': '₽', 'USD': '$', 'EUR': '€', 'KZT': '₸'};
  const currency_symbol = currency_dic[currency] || '?';

  return (
    <div key={name} className="billPreview-shareBox-item">
      <h4 className={class_name}>{name}</h4>
      <h4 className={class_amount}>{amount} {currency_symbol}</h4>
      <div className={class_symbol}> {currency_symbol}</div>
    </div>
  );
};

const Payments = ({billData}) => {
  const {payments_total, currency} = billData;
  return (
    <div className="billPreview-shareBox">
      {
        payments_total.map(payment => Payment({...payment, currency}))
      }
    </div>
  );
};

export default Payments;