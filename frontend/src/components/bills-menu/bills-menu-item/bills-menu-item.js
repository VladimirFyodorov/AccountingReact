import React, {Component} from 'react';
import {connect} from 'react-redux';
import './bills-menu-item.css';

class BillsMenuItem extends Component {
  constructor(props) {
    super(props);
    this.getItemClass = this.getItemClass.bind(this);
  }

  getItemClass() {
    if (this.props.billEditData.length == 0) {
      return ['billsList-item', ''];
    }
    const isCurrent = this.props.billData.id == this.props.billEditData[0].id;
    let itemClass = 'billsList-item';
    itemClass += (isCurrent)? '-current': '';
    const nameClass = (isCurrent)? 'billsList-item-current-name': '';

    return [itemClass, nameClass];
  }

  render() {
    const {name, date} = this.props.billData;

    if (!date) {
      console.log('error bill', this.props.billData);
    }

    const dateWithoutYear = date.substring(5);
    const {showBillPreview, hideBillPreview, startBillEdit} = this.props;
    const [itemClass, nameClass] = this.getItemClass();

    return (
      <div 
        className={itemClass}
        onClick={() => startBillEdit(this.props.billData)}
        onMouseOver={() => showBillPreview(this.props.billData)}
        onMouseOut={() => hideBillPreview()}
      >
        <h4 className={nameClass}>{name} {dateWithoutYear}</h4>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    billEditData: state.billEditData
  };
};

export default connect(mapStateToProps)(BillsMenuItem);