import React, {Component} from 'react';
import './add-payment-form.css';
import {connect} from 'react-redux';
import {prePostPayment} from '../../../actions';

class AddBillForm extends Component {
  constructor(props) {
    super(props);
    this.state = {name:'', cost: '', items: 1};
    this.onChange = this.onChange.bind(this);
    this.onSave = this.onSave.bind(this);
    this.clearState = this.clearState.bind(this);
  }

  onChange(data) {
    this.setState({...data});
  }

  clearState() {
    this.setState({name:'', cost: '', items: 1});
  }

  onSave() {
    const {name, cost, items} = this.state;
    let errMsg = '';
    errMsg += (!name)? 'Name is not valid. ': '';
    errMsg += (!cost)? 'Cost is not valid. ': '';
    errMsg += (!items)? 'Items are not valid. ': '';
    if (errMsg) {
      alert(errMsg);
    } else {
      const bill = this.props.billEditData[0].id;
      const data = {bill, name, cost_per_exemplar:cost, amount:items};
      this.props.prePostPayment(data);
      this.clearState();
    }
  }

  render() {
    if (!this.props.editMode || this.props.rowIsBeeingEdited) {
      return (<></>);
    }
    const {name, cost, items} = this.state;
    const onChange = this.onChange;
    return (
      <div className="editBill-payments-add">
        <div className="editBill-payments-add-input">
          <div className="editBill-payments-add-input-name">
            <input 
              type="text"
              value={name}
              onChange={(e) => onChange({name: e.target.value})}
              className="editBill-payments-add-input-name"/>
          </div>
          <div className="editBill-payments-add-input-cost">
            <input 
              type="text"
              value={cost}
              onChange={(e) => onChange({cost: +e.target.value || ''})}
              className="editBill-payments-add-input-cost"/>
            <h5> ₽</h5>
          </div>
          <div className="editBill-payments-add-input-items">
            <input 
              type="text"
              value={items}
              onChange={(e) => onChange({items: +e.target.value || ''})}
              className="editBill-payments-add-input-items"/>
            <h4 className="editBill-payment-items-input"> items</h4>
          </div>
          <div className="editBill-payments-add-input-add-btn">
            <button onClick={this.onSave}>Add payment</button>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    billEditData: state.billEditData
  };
};

const mapDispatchToProps = {prePostPayment};

export default connect(mapStateToProps, mapDispatchToProps)(AddBillForm);