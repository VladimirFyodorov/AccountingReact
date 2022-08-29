import React from 'react';

const BillsFilterItem = ({first_name, filter, toggleFilter, toggleShowFilter}) => {
  const itemClass = (filter === first_name)? 'billsList-usersList-item-current': 'billsList-usersList-item';
  const checkMark = (filter === first_name)? <div className="checkMark"></div>: <></>;
  return (
    <div 
      className={itemClass}
      onClick={() => {
        toggleShowFilter();
        toggleFilter(first_name);
      }}
    >
      { checkMark }
      <h5>{first_name}</h5>
    </div>
  );
};

export default BillsFilterItem;