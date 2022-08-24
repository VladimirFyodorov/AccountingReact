const initialState = {
  loading: true,
  error: false,
  usersData: [],
  billsData: [],
  billPreviewData: [],
  billEditData: [],
  costTypes:['Food', 'Entertainment', 'Health and Beauty', 'Other']
};


const reducer = (state = initialState, action = {}) => {
  switch (action.type) {

  case 'BILLS_DATA_REQUESTED':
    return {
      ...state, loading: true, error: false
    };

  case 'BILLS_DATA_LOADED':
    return {
      ...state, billsData: action.payload, loading: false, error: false
    };

  case 'BILLS_DATA_ERROR':
    return {
      ...state, loading: false, error: true
    };

  case 'USERS_DATA_REQUESTED':
    return {
      ...state, loading: true, error: false
    };

  case 'USERS_DATA_LOADED':
    return {
      ...state, usersData: action.payload, loading: false, error: false
    };

  case 'USERS_DATA_ERROR':
    return {
      ...state, loading: false, error: true
    };

  case 'SHOW_BILL_PREVIEW':
    return {
      ...state, billPreviewData: [action.payload]
    };

  case 'HIDE_BILL_PREVIEW':
    return {
      ...state, billPreviewData: []
    };

  case 'START_BILL_EDIT':
    return {
      ...state, billEditData: [action.payload]
    };

  default:
    return state;
  }
};

export default reducer;