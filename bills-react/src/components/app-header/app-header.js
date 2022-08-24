import React, {Component} from 'react';
import LogoutWindow from '../logout-window';
import './app-header.css';

export default class AppHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {showLogoutWindow: false};
    this.toggleLogoutWindow = this.toggleLogoutWindow.bind(this);
  }

  toggleLogoutWindow() {
    this.setState(state => ({
      showLogoutWindow: !state.showLogoutWindow}
    ));}

  render() {
    const {showLogoutWindow} = this.state;
    let window;

    if (showLogoutWindow) {
      window = <LogoutWindow/>;
    } else {
      window = <></>;
    }

    return (
      <>
        <header>
          <div className="header-menu">
            <div className="header-menu-item">
              <a href="/users/">
                Home
              </a>
            </div>
            <div className="header-menu-item-current">
              <a href="/bills/">
                Bills
              </a>
            </div>
          </div>
          <div className="header-right-menu">
            <div className="header-right-menu-add-bill-box">+$</div>
            <div onClick={this.toggleLogoutWindow} className="header-right-menu-user-box">
              VF
            </div>
          </div>
        </header>
        {window}
      </>
    );
  }
}