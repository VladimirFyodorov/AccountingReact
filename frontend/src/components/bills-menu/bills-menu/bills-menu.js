import React, {Component} from 'react';
import {connect} from 'react-redux';
import WithService from '../../hoc';
import { showBillPreview, hideBillPreview, startBillEdit } from '../../../actions';
import BillsMenuItem from '../bills-menu-item';
import BillsFilter from '../bills-filter';

import './bills-menu.css';


class BillsMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showFilter: false,
      showMore: false,
      filter: 'All'
    };
    this.toggleShowMore = this.toggleShowMore.bind(this);
    this.toggleShowFilter = this.toggleShowFilter.bind(this);
    this.toggleFilter = this.toggleFilter.bind(this);
  }


  toggleShowMore() {
    this.setState(state => ({
      showMore: !state.showMore
    }));
  }

  toggleFilter(first_name) {
    this.setState({filter: first_name});
  }

  toggleShowFilter() {
    this.setState(state => ({
      showFilter: !state.showFilter
    }));
  }

  filterBillsData(billsData, filter) {
    if (filter == 'All') {
      return billsData;
    }
    return billsData.filter((billData) => billData.lender.first_name == filter);
  }


  render() {
    const {showMore, showFilter, filter} = this.state;
    const {billsData, showBillPreview, hideBillPreview, startBillEdit} = this.props;
    const filteredBillsData = this.filterBillsData(billsData, filter);

    
    return (
      <div className="billsListBox">
        <BillsMenuHeader
          showFilter={showFilter}
          toggleShowFilter={this.toggleShowFilter}/>
        <BillsFilter 
          filter={filter}
          showFilter={showFilter}
          toggleFilter={this.toggleFilter}
          toggleShowFilter={this.toggleShowFilter}/>
        <Bills
          showMore={showMore}
          startBillEdit={startBillEdit}
          showBillPreview={showBillPreview}
          hideBillPreview={hideBillPreview}
          filteredBillsData={filteredBillsData}/>
        <ShowMore
          showMore={showMore}
          toggleShowMore={this.toggleShowMore}
          filteredBillsData={filteredBillsData}/>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    billsData: state.billsData,
    usersData: state.usersData,
    billPreviewData: state.billPreviewData,
    billEditData: state.billEditData
  };
};


const mapDispatchToProps = { showBillPreview, hideBillPreview, startBillEdit };

export default WithService()(connect(mapStateToProps, mapDispatchToProps)(BillsMenu));



const BillsMenuHeader = ({showFilter, toggleShowFilter}) => {
  const showFilterArrowClass = (showFilter)? 'arrow up': 'arrow down';
  return (
    <div className="billsList-head">
      <h3 className="bold" id="billsArePayedBy">Bills are payed by</h3>
      <i onClick={toggleShowFilter}
        className={showFilterArrowClass}></i>
    </div> 
  );
};



const Bills = (props) => {
  const {filteredBillsData, showMore} = props;
  const {showBillPreview, hideBillPreview, startBillEdit} = props;
  const billsMaxNum = filteredBillsData.length;
  const billsNum = (showMore)? billsMaxNum: 5;

  return (
    <div className="billsList">
      {filteredBillsData.slice(0, billsNum).map(billData => {
        return (
          <BillsMenuItem 
            key={billData.id} 
            billData={billData}
            showBillPreview={showBillPreview}
            hideBillPreview={hideBillPreview}
            startBillEdit={startBillEdit}
          />
        );
      })
      }
    </div>
  );
};



const ShowMore = ({showMore, toggleShowMore, filteredBillsData}) => {
  if (filteredBillsData.length <= 5) {
    return (<></>);
  }
  const showMoreText = (showMore)? 'Show less': 'Show more';

  return (
    <div className='billsList-showMore'>
      <h5 onClick={toggleShowMore}
        className="showMoreBtn bold"> {showMoreText}</h5>
    </div>
  );
};