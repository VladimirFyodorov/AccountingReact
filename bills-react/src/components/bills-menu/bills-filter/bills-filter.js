import React, {Component} from 'react';
import {connect} from 'react-redux';
import BillsFilterItem from '../bills-filter-item';

class BillsFilter extends Component {

  render() {
    const {showFilter, usersData, filter, toggleFilter, toggleShowFilter} = this.props;
    if (!showFilter) {
      return (<></>);
    }

    return (
      <div className="billsList-usersList">
        <BillsFilterItem 
          key={0} 
          first_name='All'
          filter={filter}
          toggleFilter={toggleFilter}
          toggleShowFilter={toggleShowFilter}
        />
        {
          usersData.map(({id, first_name}) => {
            return <BillsFilterItem 
              key={id} 
              first_name={first_name}
              filter={filter}
              toggleFilter={toggleFilter}
              toggleShowFilter={toggleShowFilter}
            />;
          })
        }
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    usersData: state.usersData
  };
};


export default connect(mapStateToProps)(BillsFilter);