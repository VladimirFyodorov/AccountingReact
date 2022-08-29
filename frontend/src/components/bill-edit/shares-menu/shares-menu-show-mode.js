import React from 'react';


const ShareMenuShowMode = (props) => {

  const {usersData} = props;
  const [{lender}] = props.billEditData;
  const otherUsers = usersData.filter(({first_name}) => first_name != lender.first_name);

  return (
    <div className="editBill-shares-menu">
      {
        otherUsers.map((userData, index, array) => {
          return <MenuItem
            key={userData.id}
            userData={userData}
            index={index}
            maxIndex={array.length - 1}
            filter={props.filter}
            toggleFilter={props.toggleFilter}
          />;
        })
      }
    </div>
  );
};


const MenuItem = ({userData, index, maxIndex, filter, toggleFilter}) => {
  const {id, first_name} = userData;
  let itemClass = 'editBill-shares-menu-item';
  itemClass += (index == 0)? '-first': '';
  itemClass += (index == maxIndex)? '-last': '';
  itemClass += (index != 0 && index != maxIndex)? '-middle': '';
  itemClass += (first_name == filter)? ' shares-menu-item-current': '';


  return (
    <div 
      key={id} 
      onClick={() => toggleFilter(first_name)}
      className={itemClass}>
      <h5>{first_name}</h5>
    </div>
  );
};


export default ShareMenuShowMode;