import React from 'react';
import ServiceContext from '../service-context';

const WithService = () => (Wrapped) => {
  const func = (props) => {
    return (
      <ServiceContext.Consumer>
        {
          (Service) => {
            return <Wrapped {...props} Service={Service}/>;
          }
        }
      </ServiceContext.Consumer>
    );
  };
  return func;
};

export default WithService;