const initialState = {
  loading: true,
  error: false,
  usersData: [],
  billsData: [],
  billPreviewData: [],
  billEditData: [],
  costTypes:['Food', 'Entertainment', 'Health and Beauty', 'Other'],
  showLogoutWindow: false,
  showAddBillForm: false,
  addBillFormData: {},
  userData:{first_name: '', last_name: '', email:''},
  accountData:[],
  accountHasBillEditData: false,
  accountBillEditData: {}
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
  
  case 'TOGGLE_LOGOUT_WINDOW':
    return {
      ...state, showLogoutWindow: !state.showLogoutWindow, showAddBillForm:false
    };

  case 'TOGGLE_SHOW_ADD_BILL_FORM':
    return {
      ...state, showAddBillForm: !state.showAddBillForm, showLogoutWindow:false
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

  case 'PRE_POST_PAYMENT': {
    const billData = state.billEditData[0];
    const lender = billData.lender.first_name;
    const payments = state.usersData.map(({first_name}) => {
      if (first_name == lender) {
        return {name:first_name, id:0, share:1, is_payed: 'False', isEdited:true, isEditedType:'POST'};
      }
      return {name:first_name, id:0, share:0, is_payed: 'False', isEdited:true, isEditedType:'POST'};
    });
    const newItem = {id:0, ...action.payload, payments, isEdited:true, isEditedType:'POST'};
    billData.items.push(newItem);
    return {...state, billEditData: [billData]};
  }

  case 'PRE_PUT_PAYMENT': {
    const billData = state.billEditData[0];
    const index = action.payload.index;
    delete action.payload.index; // removing Index to keep only item data
    const newItem = action.payload;
    const oldItem = billData.items[index];
    const isEditedType = (oldItem.id)? 'PUT': 'POST'; //if there is no Id => it's new item
    const item = {...oldItem, ...newItem, isEdited:true, isEditedType};
    const itemsBefore = billData.items.slice(0, index);
    const itemsAfter = billData.items.slice(index + 1);
    return {...state, billEditData: [{...billData, 'items':[...itemsBefore, item, ...itemsAfter]}]};
  }

  case 'PRE_DELETE_PAYMENT': {
    const billData = state.billEditData[0];
    const index = action.payload.index;
    const oldItem = billData.items[index];
    const item = {...oldItem, isEdited:true, isEditedType: 'DELETE'};
    const itemsBefore = billData.items.slice(0, index);
    const itemsAfter = billData.items.slice(index + 1);
    if (oldItem.id) { //if there is no Id => it's new item => delete locally
      return {...state, billEditData: [{...billData, 'items':[...itemsBefore, item, ...itemsAfter]}]};
    } else {
      return {...state, billEditData: [{...billData, 'items':[...itemsBefore, ...itemsAfter]}]};
    }
  }

  case 'POST_PAYMENTS': {
    const billData = state.billEditData[0];
    const billIndex = state.billsData.findIndex(bill => bill.id == billData.id);
    const billsBefore = state.billsData.slice(0, billIndex);
    const billsAfter = state.billsData.slice(billIndex + 1);
    
    const indexes = action.payload.indexes;
    const payments = action.payload.response;
    const items = billData.items.map((item, index) => {
      if (indexes.includes(index)) {
        const paymentIndex = indexes.findIndex(elem => elem == index);
        if (payments[paymentIndex].status == 200) {
          return {...item, ...payments[paymentIndex].item, isEdited:false, isEditedType: '', error: false};
        } else {
          return {...item, error: true};
        }
      } else {
        return item;
      }
    });

    const billsData = [...billsBefore, {...billData, items}, ...billsAfter];
    const billEditData = [{...billData, items}];

    return {...state, billsData, billEditData};
  }

  case 'PUT_PAYMENTS': {
    const billData = state.billEditData[0];
    const billIndex = state.billsData.findIndex(bill => bill.id == billData.id);
    const billsBefore = state.billsData.slice(0, billIndex);
    const billsAfter = state.billsData.slice(billIndex + 1);
    
    const indexes = action.payload.indexes;
    const payments = action.payload.response;
    const items = billData.items.map((item, index) => {
      if (indexes.includes(index)) {
        const paymentIndex = indexes.findIndex(elem => elem == index);
        if (payments[paymentIndex].status == 200) {
          return {...item, ...payments[paymentIndex].item, isEdited:false, isEditedType: '', error: false};
        } else {
          return {...item, error: true};
        }
      } else {
        return item;
      }
    });

    const billsData = [...billsBefore, {...billData, items}, ...billsAfter];
    const billEditData = [{...billData, items}];

    return {...state, billsData, billEditData};
  }

  case 'DELETE_PAYMENTS': {
    const billData = state.billEditData[0];
    const billIndex = state.billsData.findIndex(bill => bill.id == billData.id);
    const billsBefore = state.billsData.slice(0, billIndex);
    const billsAfter = state.billsData.slice(billIndex + 1);
    
    const indexes = action.payload.indexes;
    const payments = action.payload.response;
    const items = billData.items.map((item, index) => {
      if (indexes.includes(index)) {
        const paymentIndex = indexes.findIndex(elem => elem == index);
        if (payments[paymentIndex].status == 200) {
          return {shouldBeFilteredOut:true};
        } else {
          return {...item, isEdited:false, isEditedType: '', error: true};
        }
      } else {
        return item;
      }
    }).filter(({shouldBeFilteredOut}) => !shouldBeFilteredOut);

    const billsData = [...billsBefore, {...billData, items}, ...billsAfter];
    const billEditData = [{...billData, items}];

    return {...state, billsData, billEditData};
  }

  case 'POST_SHARE': {
    console.log('Post', action.payload);
    return state;
  }

  case 'PUT_SHARE': {
    console.log('Put', action.payload);
    return state;
  }

  case 'USER_DATA_LOADED':
    return {
      ...state, userData: action.payload, loading: false, error: false
    };
  
  case 'ACCOUNT_DATA_LOADED':
    return {
      ...state, accountData: action.payload, loading: false, error: false
    };
  
  case 'ACCOUNT_START_EDIT_BILL': {
    const lender = state.usersData.find(user => user.id == action.payload.lender);
    return {
      ...state, accountBillEditData: {...action.payload, lender}, accountHasBillEditData: true
    };
  }

  case 'ACCOUNT_END_EDIT_BILL':
    return {
      ...state, accountBillEditData: {}, accountHasBillEditData: false
    };

  case 'CLOSE_SETTLEMENTS': {
    const index = state.accountData.findIndex(user => user.id == action.payload);
    const beforeData = state.accountData.slice(0, index);
    const data = {...state.accountData[index], total: 0, bills:[]};
    const afterData = state.accountData.slice(index + 1);
    return {
      ...state, accountData:[...beforeData, data, ...afterData]
    };
  }

  default:
    return state;
  }
};

export default reducer;