import React, {Component} from 'react';
import {connect} from 'react-redux';
import './header.css';
import HeaderInShowMode from './header-in-show-mode';
import HeaderInEditMode from './header-in-edit-mode';

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {editMode: false};
    this.toggleEditMode = this.toggleEditMode.bind(this);
  }

  toggleEditMode() {
    this.props.toggleSomeBlockIsBeengEdited();
    this.setState(({editMode}) => {
      return {editMode:!editMode};
    });
  }

  render () {
    if (this.props.billEditData.length == 0) {
      return (<></>);
    }
    if (this.state.editMode) {
      return (
        <HeaderInEditMode
          // billEditData={this.props.billEditData}
          // usersData={this.props.usersData}
          // costTypes={this.props.costTypes}
          toggleEditMode={this.toggleEditMode}/>
      );
    }

    if (!this.state.editMode) {
      return (
        <HeaderInShowMode
          // billEditData={this.props.billEditData}
          toggleEditMode={this.toggleEditMode}
          someBlockIsBeengEdited={this.props.someBlockIsBeengEdited}/>
      );
    }
  }
}

const mapStateToProps = (state) => {
  return {
    billEditData: state.billEditData,
    usersData: state.usersData,
    costTypes: state.costTypes
  };
};


export default connect(mapStateToProps)(Header);