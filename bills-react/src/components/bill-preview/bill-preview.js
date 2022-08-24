import React, {Component} from 'react';
import {connect} from 'react-redux';
import Header from './bill-preview-header';
import Items from './bill-preview-items';
import Payments from './bill-preview-payments';
import Total from './bill-preview-total';

import './bill-preview.css';



class BillPreview extends Component {
  

  render() {
    // disable Preview for Bill Edit development
    // if (this.props.billPreviewData.length != 0) {
    if (this.props.billPreviewData.length < 0) {
      const [billData] = this.props.billPreviewData;
      return (
        <div className="billPreview">
          <Header billData={billData}/>
          <Items billData={billData}/>
          <Payments billData={billData}/>
          <Total billData={billData}/>
        </div>
      );
    }
    return (<></>);
  }
}

const mapStateToProps = (state) => {
  return {
    billPreviewData: state.billPreviewData
  };
};

export default connect(mapStateToProps)(BillPreview);