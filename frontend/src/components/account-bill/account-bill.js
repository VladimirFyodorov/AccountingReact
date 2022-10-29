import React, {Component} from 'react';
import {connect} from 'react-redux';
import {accountEndEditBill} from '../../actions';
import './account-bill.css';

class AccountBill extends Component {
  onEdit(id) {
    const url = `${location.protocol}//${location.host}/bills?id=${id}`;
    window.location.href = url;
  }

  render() {
    if (!this.props.accountHasBillEditData) {
      return (<></>);
    }

    const {accountBillEditData, accountEndEditBill} = this.props;
    const {id, name, date, lender, items, currency} = accountBillEditData;
    const formatedDate = date.slice(5); //without year
    const billName = `${name} ${formatedDate} ${lender.first_name}`;

    return (
      <div className="billBox">
        <div className="billBox-backBtn">
          <i className="arrow left"></i>
          <h5 
            className="bold lightColorText" 
            id="billBox-backBtn"
            onClick={accountEndEditBill}>
            Back
          </h5>
        </div>
        <div className="billBox-header">
          <h4 className="bold">{billName}</h4>
        </div>
        <div className="billBox-paymentsBox">
          {items && 
            items.map((item, index) => <ItemRow key={index} item={item} currency={currency}/>)
          }
        </div>
        <div className="billBox-btnBox">
          <button 
            id="billBox-editBtn"
            onClick={() => this.onEdit(id)}>
            Edit
          </button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    accountBillEditData: state.accountBillEditData,
    accountHasBillEditData: state.accountHasBillEditData
  };
};

const mapDispatchToProps = {accountEndEditBill};

export default connect(mapStateToProps, mapDispatchToProps)(AccountBill);


const ItemRow = ({item, currency}) => {
  const preatyfyNum = (num) => {
    return parseInt(num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  };
  const currency_dic = {'RUB': '₽', 'USD': '$', 'EUR': '€', 'KZT': '₸'};
  const currency_symbol = currency_dic[currency] || '?';
  const {name, cost_per_item, items, paying_amount, share} = item;
  const payingAmountTxt = preatyfyNum(paying_amount) + ' ' + currency_symbol;
  const costPerItemTxt = preatyfyNum(cost_per_item) + currency_symbol + ' x' + items;
  const shareTxt = parseInt(share*100) + '%';
  return (
    <div className="billBox-paymentsBox-row">
      <div className="billBox-paymentsBox-row-name">
        <h5>{name}</h5>
        <h5>{payingAmountTxt}</h5>
      </div>
      <div className="billBox-paymentsBox-row-amount">
        <h6 className="lightColorText">{costPerItemTxt}</h6>
        <h6 className="lightColorText">{shareTxt}</h6>
      </div>
    </div>
  );
};