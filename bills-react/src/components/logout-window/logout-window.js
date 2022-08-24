import React from 'react';
import './logout-window.css';

const LogoutWindow = () => {
  return (
    <div className="account-popup-window">
      <div className="account-popup-window-textbox">
        <h5 className="bold">Vladimir Fyodorov</h5>
        <h6>vfyodorov@nes.ru</h6>
      </div>
      <a href="/users/logout/">
        <div className="account-popup-window-signountbox">
          <h6>Sign out</h6>
        </div>
      </a>
    </div>
  );
};

export default LogoutWindow;