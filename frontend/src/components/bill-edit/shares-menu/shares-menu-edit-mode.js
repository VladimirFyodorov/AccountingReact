import React from 'react';

const ShareMenuEditMode = ({usersData, billEditData}) => {
  const [{lender}] = billEditData;
  const otherUsers = usersData.filter(({first_name}) => first_name != lender.first_name);

  return (
    <div className="editBill-shares-users">
      {
        otherUsers.map(({id, first_name}) => {
          return (
            <div key={ id } className='editBill-shares-user'>
              <h4>{ first_name }</h4>
            </div>
          );
        })
      }
    </div>
  );
};

export default ShareMenuEditMode;