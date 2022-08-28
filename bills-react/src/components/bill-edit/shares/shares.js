import React, {Component} from 'react';
import {connect} from 'react-redux';
import ShareMenu from '../shares-menu';
import ShareRow from '../share-row/share-row';
import ShareRowEditMode from '../share-row/share-row-edit-mode';

import './shares.css';

class Shares extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filter: this.props.initialFilter,
      editMode: false
    };
    this.toggleFilter = this.toggleFilter.bind(this);
    this.toggleEditMode = this.toggleEditMode.bind(this);
  }

  toggleFilter(user) {
    this.setState({filter: user});
  }

  toggleEditMode() {
    this.props.toggleSomeBlockIsBeengEdited();
    this.setState(({editMode}) =>{
      return {editMode: !editMode};
    });
  }

  render () {
    if (this.props.billEditData.length == 0) {
      return (<></>);
    }

    const [{items, lender}] = this.props.billEditData;
    const filter = this.state.filter;

    return (
      <div className="editBill-shares">
        <div className="editBill-shares-header">
          <h4 className="bold">Share of payments to</h4>
        </div>
        <ShareMenu
          filter={filter}
          editMode={this.state.editMode} 
          toggleFilter={this.toggleFilter}/>
        <SharesBox
          items={items}
          lender={lender}
          filter={filter}
          editMode={this.state.editMode}/>
        <EditBtn
          someBlockIsBeengEdited={this.props.someBlockIsBeengEdited}
          editMode={this.state.editMode}
          toggleEditMode={this.toggleEditMode}/>
      </div>
    );
  }
}

const EditBtn = ({editMode, toggleEditMode, someBlockIsBeengEdited}) => {
  if (someBlockIsBeengEdited && !editMode) {
    return (<></>);
  }

  const btnText = (editMode)? 'Save': 'Edit';
  return (
    <div className="editBill-shares-btns">
      <button onClick={toggleEditMode}>{ btnText }</button>
    </div>
  );
};

const SharesBox = ({items, filter, editMode, lender}) => {
  if (editMode) {
    return (
      <div className="editBill-shares-box">
        {
          items.map((item, index) => {
            if (item.isEditedType == 'DELETE') {
              return (<></>);
            }
            return (
              <ShareRowEditMode 
                key={index} 
                lender={lender} 
                shareData={item}/>
            );
          })
        }
      </div>
    );
  }

  return (
    <div className="editBill-shares-box">
      {
        items.map((item, index) => {
          if (item.isEditedType == 'DELETE') {
            return (<></>);
          }
          return (
            <ShareRow 
              key={index} 
              filter={filter} 
              shareData={item}/>
          );
        })
      }
    </div>
  );
};



const mapStateToProps = (state) => {
  return {
    billEditData: state.billEditData,
    usersData: state.usersData
  };
};


export default connect(mapStateToProps)(Shares);