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
    this.showSomeBills = this.showSomeBills.bind(this);
    this.showFilter = this.showFilter.bind(this);
    this.filteredBillsData = this.filteredBillsData.bind(this);
    this.toggleFilter = this.toggleFilter.bind(this);
  }


  toggleShowMore() {
    this.setState(state => ({
      showMore: !state.showMore
    }));
  }

  toggleShowFilter() {
    this.setState(state => ({
      showFilter: !state.showFilter
    }));
  }

  filteredBillsData() {
    const {billsData} = this.props;
    const {filter} = this.state;

    if (filter == 'All') {
      return billsData;
    }

    return billsData.filter((billData) => billData.lender.first_name == filter);
  }

  toggleFilter(first_name) {
    this.setState({filter: first_name});
  }

  showSomeBills() {
    const billsMaxNum = this.filteredBillsData().length;
    const billsNum = (this.state.showMore)? billsMaxNum: 5;
    const {showBillPreview, hideBillPreview, startBillEdit} = this.props;

    return (
      <div className="billsList">
        {this.filteredBillsData().slice(0, billsNum).map(billData => {
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
  }

  showFilter() {
    const {showFilter} = this.state;

    if (showFilter) {
      return <BillsFilter 
        filter={this.state.filter}
        toggleFilter={this.toggleFilter}
        toggleShowFilter={this.toggleShowFilter}/>;
    } else {
      return <></>;
    }
  }

  render() {
    const {showMore, showFilter} = this.state;
    const showFilterArrowClass = (showFilter)? 'arrow up': 'arrow down';
    const showMoreText = (showMore)? 'Show less': 'Show more';

    
    return (
      <div className="billsListBox">
        <div className="billsList-head">
          <h3 className="bold" id="billsArePayedBy">Bills are payed by</h3>
          <i onClick={this.toggleShowFilter}
            className={showFilterArrowClass}></i>
        </div> 
        {this.showFilter()}
        {this.showSomeBills()}
        <div className='billsList-showMore'>
          <h5 onClick={this.toggleShowMore}
            className="showMoreBtn bold"> {showMoreText}</h5>
        </div>
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