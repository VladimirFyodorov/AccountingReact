import React, {Component} from 'react';
import {connect} from 'react-redux';
import ShareMenu from '../shares-menu';
import ShareRow from '../share-row/share-row';
import ShareRowEditMode from '../share-row/share-row-edit-mode';
import { prePutShare, postShares, putShares } from '../../../actions';
import WithService from '../../hoc';


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
    this.onSave = this.onSave.bind(this);
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

  onSave() {
    const { Service } = this.props;
    const items = this.props.billEditData[0].items;
    const postShares = items
      .map(item => {
        return item.payments
          .filter(({isEditedType}) => isEditedType == 'POST')
          .map(({share, name, is_payed}) => {
            const payer = this.props.usersData.find(user => user.first_name == name).id;
            return {item: item.id, paying_part: share, payer, is_payed};
          });
      })
      .flat();
    
    const postSharesIndexes = items
      .map(({payments}, index) => {
        return payments
          .filter(({isEditedType}) => isEditedType == 'POST')
          .map(() => {
            return index;
          });
      })
      .flat();
    
    const putShares = items
      .map(item => {
        return item.payments
          .filter(({isEditedType}) => isEditedType == 'PUT')
          .map(({id, share, name, is_payed}) => {
            const payer = this.props.usersData.find(user => user.first_name == name).id;
            return {item: item.id, id, paying_part: share, payer, is_payed};
          });
      })
      .flat();
    
    const putSharesIndexes = items
      .map(({payments}, index) => {
        return payments
          .filter(({isEditedType}) => isEditedType == 'PUT')
          .map(() => {
            return index;
          });
      })
      .flat();



    if (postShares.length > 0) {

      Service.postShares(postShares)
        .then(res => {
          this.props.postShares({indexes:postSharesIndexes, ...res});
          const error = (res.response.filter(({status}) => status == 400).length > 0);
          if (error && !this.state.editMode) {
            this.toggleEditMode();
          }
        })
        .catch(err => console.log(err));
    }

    if (putShares.length > 0) {

      Service.putShares(putShares)
        .then(res => {
          this.props.putShares({indexes:putSharesIndexes, ...res});
          const error = (res.response.filter(({status}) => status == 400).length > 0);
          if (error && !this.state.editMode) {
            this.toggleEditMode();
          }
        })
        .catch(err => console.log(err));
    }
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
          prePutShare={this.props.prePutShare}
          editMode={this.state.editMode}/>
        <EditBtn
          onSave={this.onSave}
          someBlockIsBeengEdited={this.props.someBlockIsBeengEdited}
          editMode={this.state.editMode}
          toggleEditMode={this.toggleEditMode}/>
      </div>
    );
  }
}


const mapStateToProps = (state) => {
  return {
    billEditData: state.billEditData,
    usersData: state.usersData
  };
};

const mapDispatchToProps = { prePutShare, postShares, putShares };


export default WithService()(connect(mapStateToProps, mapDispatchToProps)(Shares));



const EditBtn = ({onSave, editMode, toggleEditMode, someBlockIsBeengEdited}) => {
  if (someBlockIsBeengEdited && !editMode) {
    return (<></>);
  }

  const onClick = () => {
    if (editMode) {
      onSave();
    }
    toggleEditMode(); 
  };

  const btnText = (editMode)? 'Save': 'Edit';
  return (
    <div className="editBill-shares-btns">
      <button onClick={onClick}>{ btnText }</button>
    </div>
  );
};

const SharesBox = ({items, filter, editMode, lender, prePutShare}) => {
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
                index={index}
                prePutShare={prePutShare}
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