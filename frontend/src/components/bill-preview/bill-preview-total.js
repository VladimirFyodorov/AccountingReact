import React from 'react';

const Total = ({billData}) => {
  const {payments_total} = billData;
  const totalAmount = payments_total.reduce((partialSum, a) => partialSum + a.amount, 0);

  return (
    <div className="billPreview-shareBox-total">
      <h4 className="billPreview-shareBox-total-name bold">Total</h4>
      <h4 className="billPreview-shareBox-total-amount bold">{totalAmount} ₽</h4>
    </div>
  );
};

export default Total;