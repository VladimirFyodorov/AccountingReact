import React, {Component} from 'react';
import {connect} from 'react-redux';
import './account-total-box.css';
import { accountStartEditBill, closeSettlements } from '../../actions';
import WithService from '../hoc';
import convertIcon from'./convert_currencies_icon.png';

class AccountTotalBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rowWithShowBills: -1, //index of extended row
      currencyConvertationTypes: ['not', 'RUB', 'USD', 'EUR', 'KZT'],
      indexOfCurrentConvType: 0,
    };
    this.changeRowWithShowBills = this.changeRowWithShowBills.bind(this);
    this.closeSettlements = this.closeSettlements.bind(this);
    this.toggleConv = this.toggleConv.bind(this);
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

  toggleConv() {
    this.setState(({indexOfCurrentConvType, currencyConvertationTypes}) => {
      const newIndex = (indexOfCurrentConvType + 1 < currencyConvertationTypes.length)?indexOfCurrentConvType + 1: 0;
      console.log(newIndex);
      return {indexOfCurrentConvType: newIndex};
    });
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
    const {indexOfCurrentConvType, currencyConvertationTypes} = this.state;
    const currency = currencyConvertationTypes[indexOfCurrentConvType];
    const currency_dic = {'RUB': '₽', 'USD': '$', 'EUR': '€', 'KZT': '₸'};
    const currency_symbol = currency_dic[currency] || '?';

    return (
      <div className="totalBox">
        <h2 onClick={this.toggleConv} style={{cursor: 'pointer'}}>
          Account net 
          { indexOfCurrentConvType != 0 && 
            ` ${currency_symbol}`
          }
          { indexOfCurrentConvType == 0 &&
            <img src={convertIcon} onClick={this.toggleConv} className="convert-currencies" alt="convert currencies icon"/>
          }
        </h2>
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

  // calc totals grouped by currency
  const totalGroupedByCurency = bills.reduce((res, {currency, total}) => {
    res[currency] = (res[currency] || 0) + total;
    return res;
  }, {});
  const currency_dic = {'RUB': '₽', 'USD': '$', 'EUR': '€', 'KZT': '₸'};

  const textArr = Object.entries(totalGroupedByCurency).map(([currency, total]) => {
    const strTotal = total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    const currency_symbol = currency_dic[currency] || '?';
    return strTotal + ' ' + currency_symbol;
  });

  if (textArr.length == 0) {
    textArr.push('0 ₽');
  }


  return (
    <>
      <div className="totalBox-row">
        <div className="totalBox-row-nameAndAmount">
          <div className="totalBox-row-nameAndAmount-name">
            <h4>{name}</h4>
          </div>
          <div className="totalBox-row-NameAndAmount-amount">
            {
              textArr.map(text => {
                return (
                  <h4 className='totalBox-row-NameAndAmount-amount' key={text}>{text}</h4>
                );
              })
            }
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
  const currency_dic = {'RUB': '₽', 'USD': '$', 'EUR': '€', 'KZT': '₸'};
  const currency_symbol = currency_dic[bill.currency] || '?';
  const billCost = bill.total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' ' + currency_symbol;
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
  const totalTotalGroupedByCurency = accountData.reduce((acc, {bills})=> {
    const totalGroupedByCurency = bills.reduce((res, {currency, total}) => {
      res[currency] = (res[currency] || 0) + total;
      return res;
    }, acc);
    return totalGroupedByCurency;
  }, {});

  const currency_dic = {'RUB': '₽', 'USD': '$', 'EUR': '€', 'KZT': '₸'};

  const textArr = Object.entries(totalTotalGroupedByCurency).map(([currency, total]) => {
    const strTotal = total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    const currency_symbol = currency_dic[currency] || '?';
    return strTotal + ' ' + currency_symbol;
  });

  if (textArr.length == 0) {
    textArr.push('0 ₽');
  }


  return (
    <div className="totalBox-totalRow">
      <div className="totalBox-row-nameAndAmount">
        <div className="totalBox-row-nameAndAmount-name">
          <h4 className="bold">Total</h4>
        </div>
        <div className="totalBox-row-NameAndAmount-amount">
          {
            textArr.map(text => {
              return (
                <h4 className='totalBox-row-NameAndAmount-amount bold' key={text}>{text}</h4>
              );
            })
          }
        </div>
      </div>
    </div>
  );
};