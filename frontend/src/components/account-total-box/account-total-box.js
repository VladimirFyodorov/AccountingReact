import React, {Component} from 'react';
import {connect} from 'react-redux';
import './account-total-box.css';
import { accountStartEditBill, closeSettlements } from '../../actions';
import WithService from '../hoc';

class AccountTotalBox extends Component {
  constructor(props) {
    super(props);
    this.state = {rowWithShowBills: -1}; //index of extended row
    this.changeRowWithShowBills = this.changeRowWithShowBills.bind(this);
    this.closeSettlements = this.closeSettlements.bind(this);
  }

  changeRowWithShowBills(index) {
    this.setState(({rowWithShowBills}) => {
      const value = (rowWithShowBills == index)? -1: index; // if same => close => -1
      return {rowWithShowBills: value};
    });
  }

  closeSettlements(id) {
    this.props.Service.closeSettlements({counteragentId: id})
      .then(() => this.props.closeSettlements(id))
      .catch(err => console.log(err));
  }

  render() {
    if (!this.props.accountData) {
      return (
        <div className="totalBox">
          <h2>Account net</h2>
        </div>
      );
    }

    const {accountData, accountBillEditData, accountStartEditBill} = this.props;

    return (
      <div className="totalBox">
        <h2>Account net</h2>
        {
          accountData.map((data, index) => {
            return (
              <AccountRow 
                key={data.id}
                index={index}
                data={data}
                closeSettlements={this.closeSettlements}
                accountBillEditData={accountBillEditData}
                accountStartEditBill={accountStartEditBill}
                rowWithShowBills={this.state.rowWithShowBills}
                changeRowWithShowBills={this.changeRowWithShowBills}/>
            );
          })
        }
        <AccountTotalRow accountData={accountData}/>
      </div>
    );
  }   
}


const mapStateToProps = (state) => {
  return {
    accountData: state.accountData,
    accountBillEditData: state.accountBillEditData
  };
};

const mapDispatchToProps = { accountStartEditBill, closeSettlements };


export default WithService()(connect(mapStateToProps, mapDispatchToProps)(AccountTotalBox));





const AccountRow = (props) => {
  const {data, index, rowWithShowBills, changeRowWithShowBills } = props;
  const { accountStartEditBill, accountBillEditData, closeSettlements } = props;
  const {id, name, total, bills} = data;
  const btnText = (total<0)?'Pay':'Receive';
  const showBillsText = (rowWithShowBills==index)?'Hide bills':'Show bills';
  const totalText = total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' ₽';


  return (
    <>
      <div className="totalBox-row">
        <div className="totalBox-row-nameAndAmount">
          <div className="totalBox-row-nameAndAmount-name">
            <h4>{name}</h4>
          </div>
          <div className="totalBox-row-NameAndAmount-amount">
            <h4>{totalText}</h4>
          </div>
        </div>
        <div className="totalBox-row-btns">
          <h5 
            className="totalBox-row-btns-showBills bold" 
            onClick={() => changeRowWithShowBills(index)}>
            {showBillsText}
          </h5>
          <button 
            className="totalBox-row-btns-pay"
            onClick={() => closeSettlements(id)}>{btnText}</button>
        </div>
      </div>
      {rowWithShowBills==index &&
        bills.map(bill => {
          return (
            <BillPreviewRow 
              key={bill.id}
              bill={bill}
              isCurrent={accountBillEditData.id==bill.id}
              onClick={() => accountStartEditBill(bill)}/>
          );
        })
      }
    </>
  );
};



const BillPreviewRow = ({bill, isCurrent, onClick}) => {
  const formatedDate = bill.date.slice(5); //without year
  const billName = `${bill.name} ${formatedDate}`;
  const billCost = bill.total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' ₽';
  const rowClass = isCurrent?'totalBox-billPreviewRow-current':'totalBox-billPreviewRow';
  return (
    <div className={rowClass} onClick={onClick}>
      <div className="totalBox-billPreviewRow-nameAndAmount">
        <div className="totalBox-billPreviewRow-nameAndAmount-name">
          <h5>{billName}</h5>
        </div>
        <div className="totalBox-billPreviewRow-NameAndAmount-amount">
          <h5>{billCost}</h5>
        </div>
      </div>
      <div className="totalBox-billPreviewRow-items">
        <h5>{bill.items_preview}</h5>
      </div>
    </div>
  );
};




const AccountTotalRow = ({accountData}) => {
  const total = accountData.reduce((acc, elem) => acc + elem.total, 0);
  const totalText = total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' ₽';

  return (
    <div className="totalBox-totalRow">
      <div className="totalBox-row-nameAndAmount">
        <div className="totalBox-row-nameAndAmount-name">
          <h4 className="bold">Total</h4>
        </div>
        <div className="totalBox-row-NameAndAmount-amount">
          <h4 className='bold'>{totalText}</h4>
        </div>
      </div>
    </div>
  );
};