import React from 'react';
import './logout-window.css';

const LogoutWindow = ({logout, userData}) => {
  const fullName = `${userData.first_name} ${userData.last_name}`;
  return (
    <div className="account-popup-window">
      <div className="account-popup-window-textbox">
        <h5 className="bold">{fullName}</h5>
        <h6>{userData.email}</h6>
      </div>
      <div className="account-popup-window-signountbox" onClick={logout}>
        <h6>Sign out</h6>
      </div>
    </div>
  );
};

export default LogoutWindow;