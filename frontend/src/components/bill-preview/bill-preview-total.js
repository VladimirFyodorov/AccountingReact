import React from 'react';

const Total = ({billData}) => {
  const {payments_total, currency} = billData;
  const totalAmount = payments_total.reduce((partialSum, a) => partialSum + a.amount, 0);
  const currency_dic = {'RUB': '₽', 'USD': '$', 'EUR': '€', 'KZT': '₸'};
  const currency_symbol = currency_dic[currency] || '?';

  return (
    <div className="billPreview-shareBox-total">
      <h4 className="billPreview-shareBox-total-name bold">Total</h4>
      <h4 className="billPreview-shareBox-total-amount bold">{totalAmount} {currency_symbol}</h4>
    </div>
  );
};

export default Total;