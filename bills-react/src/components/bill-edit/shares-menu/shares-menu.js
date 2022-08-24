import React, {Component} from 'react';
import {connect} from 'react-redux';
import './shares-menu.css';
import ShareMenuShowMode from './shares-menu-show-mode';
import ShareMenuEditMode from './shares-menu-edit-mode';

class ShareMenu extends Component {

  render() {
    if (this.props.editMode) {
      return (
        <ShareMenuEditMode
          usersData={this.props.usersData}
          billEditData={this.props.billEditData}
        />
      );
    }
    return (
      <ShareMenuShowMode
        filter={this.props.filter}
        usersData={this.props.usersData}
        billEditData={this.props.billEditData}
        toggleFilter={this.props.toggleFilter}
      />
    );
  }
}

const mapStateToProps = (state) => {
  return {
    usersData: state.usersData,
    billEditData: state.billEditData
  };
};

export default connect(mapStateToProps)(ShareMenu);