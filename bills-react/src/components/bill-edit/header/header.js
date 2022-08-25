import React, {Component} from 'react';
import { connect } from 'react-redux';
import './header.css';
import HeaderInShowMode from './header-in-show-mode';
import HeaderInEditMode from './header-in-edit-mode';
import WithService from '../../hoc';
import { deleteBill, putBill } from '../../../actions';

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {editMode: false, unsavedData: {}};
    this.toggleEditMode = this.toggleEditMode.bind(this);
    this.changeUnsavedData = this.changeUnsavedData.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.onPut = this.onPut.bind(this);
  }

  toggleEditMode() {
    this.props.toggleSomeBlockIsBeengEdited();
    this.setState(({editMode}) => {
      return {editMode:!editMode};
    });
  }

  changeUnsavedData(data) {
    this.setState(state => {
      const unsavedData = {...state.unsavedData, ...data};
      return {...state, unsavedData:unsavedData};
    });
  }

  onDelete() {
    const {billEditData, Service, deleteBill} = this.props;
    const [{id}] = billEditData;

    Service.deleteBill({id})
      .then(deleteBill({id}));
  }

  onPut() {
    const { billEditData, Service, putBill} = this.props;
    const dataGlobal = billEditData[0];
    const dataLocal = this.state.unsavedData;
    const {id, name, comment, date} = {...dataGlobal, ...dataLocal};
    const lender = dataLocal.lender || dataGlobal.lender.id;
    const data = {id, name, comment, date, lender};

    Service.putBill(data)
      .then(res => {
        putBill(res);
        this.toggleEditMode();
      })
      .catch(err => console.log(err));
  }

  render () {
    if (this.props.billEditData.length == 0) {
      return (<></>);
    }


    if (this.state.editMode) {
      return (
        <HeaderInEditMode
          onPut={this.onPut}
          changeUnsavedData={this.changeUnsavedData}/>
      );
    }

    if (!this.state.editMode) {
      return (
        <HeaderInShowMode
          onDelete={this.onDelete}
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

const mapDispatchToProps = { deleteBill, putBill };

export default WithService()(connect(mapStateToProps, mapDispatchToProps)(Header));