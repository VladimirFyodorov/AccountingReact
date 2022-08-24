import React from 'react';

const Header = ({billData}) => {
  const {name, date, lender} = billData;
  const billName = `${name} ${date} ${lender.first_name}`;
  return (
    <h2 className="billPreview-header">{billName}</h2>
  );
};

export default Header;