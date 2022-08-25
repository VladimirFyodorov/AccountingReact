const initialState = {
  loading: true,
  error: false,
  usersData: [],
  billsData: [],
  billPreviewData: [],
  billEditData: [],
  costTypes:['Food', 'Entertainment', 'Health and Beauty', 'Other'],
  showAddBillForm: false,
  addBillFormData: {}
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

  case 'TOGGLE_SHOW_ADD_BILL_FORM':
    return {
      ...state, showAddBillForm: !state.showAddBillForm
    };

  case 'SAVE_ADD_BILL_FORM_DATA':
    return {
      ...state, addBillFormData: {...state.addBillFormData, ...action.payload}
    };
  
  case 'CLEAR_ADD_BILL_FORM_DATA':
    return {
      ...state, addBillFormData: {}
    };
  
  case 'POST_BILL': {
    const bill = action.payload;
    const lender = state.usersData.find(user => user.id == bill.lender);
    const billData = {...bill, lender, items: [], payments_total: []};
    return {
      ...state, billsData: [billData, ...state.billsData], billEditData: [billData]
    };
  }

  case 'PUT_BILL': {
    const newBill = action.payload;
    const lender = state.usersData.find(user => user.id == newBill.lender);
    const oldBill = state.billsData.find(bill => bill.id == newBill.id);
    const billIndex = state.billsData.findIndex(bill => bill.id == newBill.id);
    const billsBefore = state.billsData.slice(0, billIndex);
    const billsAfter = state.billsData.slice(billIndex + 1);
    const billData = {...oldBill, ...newBill, lender};
    return {
      ...state, billsData: [...billsBefore, billData, ...billsAfter], billEditData: [billData]
    };
  }
  
  case 'DELETE_BILL': {
    const billId = action.payload.id;
    const billIndex = state.billsData.findIndex(bill => bill.id == billId);
    const billsBefore = state.billsData.slice(0, billIndex);
    const billsAfter = state.billsData.slice(billIndex + 1);
    return {
      ...state, billsData: [...billsBefore, ...billsAfter], billEditData: []
    };
  }

  default:
    return state;
  }
};

export default reducer;