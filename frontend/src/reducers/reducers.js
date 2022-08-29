const initialState = {
  loading: true,
  error: false,
  usersData: [],
  billsData: [],
  hasBillPreviewData: false,
  billPreviewData: [],
  hasBillEditData: false,
  billEditData: [],
  billInEditMode: false,
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

  case 'SHOW_BILL_PREVIEW': {
    //if bill is currently being edited Preview mode has to be disabled
    if (state.billInEditMode) {  
      return state;
    }
    // calculate totals
    const billData = action.payload;
    const lender = billData.lender.first_name;
    let totalsLayout = {};
    for (const user of state.usersData) {
      totalsLayout[user.first_name] = {amount: 0, is_payed: 'True'};
    }

    for (const item of billData.items) {
      for (const payment of item.payments) {
        totalsLayout[payment.name].amount += item.amount*item.cost_per_exemplar*payment.share;
        if (payment.is_payed == 'False' && payment.share > 0 && payment.name != lender) {
          totalsLayout[payment.name].is_payed = 'False';
        }
      }
    }

    const totals = Object.keys(totalsLayout).map(key => {
      const {amount, is_payed} = totalsLayout[key];
      return {name: key, amount: parseInt(amount), is_payed};
    });

    const billPreviewData = [{...billData, payments_total: totals}];

    return {
      ...state, billPreviewData, hasBillPreviewData: true
    };
  }

  case 'HIDE_BILL_PREVIEW':
    return {
      ...state, billPreviewData: [], hasBillPreviewData: false
    };

  case 'START_BILL_EDIT': {
    //if bill is currently being edited User can't start edit another bill
    if (state.billInEditMode) {  
      return state;
    }
    return {
      ...state, billEditData: [action.payload], hasBillEditData: true,
      billPreviewData: [], hasBillPreviewData: false
    };
  }

  case 'TOGGLE_BILL_IN_EDIT_MODE':
    return {
      ...state, billInEditMode: !state.billInEditMode
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

  //there is no PRE_PUT_SHARE because they are created when Payment is created

  case 'PRE_PUT_SHARE': {
    // when user is trying to enter float (e.g. 0.3) 
    // first shange is 0. which can't be a float and only a string =>
    // when shareStr is 0. pass this as a string
    // else pass float(shareStr)
    const billData = state.billEditData[0];
    const lender = billData.lender.first_name;

    const {itemIndex, payer, share} = action.payload;
    const itemsBefore = billData.items.slice(0, itemIndex);
    const itemsAfter = billData.items.slice(itemIndex + 1);
    const oldShare = billData.items[itemIndex].payments.find(payment => payment.name == payer).share;
    const deltaShare = (share == '0.')? 0 - oldShare: share - oldShare;

    const payments = billData.items[itemIndex].payments
      .map(payment => {
        if (payment.name == payer) {
          const isEditedType = (payment.id > 0)? 'PUT': 'POST'; // if there is no Id => it's new item
          return {...payment, share, isEdited:true, isEditedType};
        } else if (payment.name == lender) {  // re calculate lender's share (1 - sum(shares))
          const isEditedType = (payment.id > 0)? 'PUT': 'POST'; // if there is no Id => it's new item
          const calcShare = payment.share - deltaShare;

          return {...payment, share: calcShare, isEdited:true, isEditedType};
        }
        return payment;
      });
    const item = {...billData.items[itemIndex], payments};
    const items = [...itemsBefore, item, ...itemsAfter];
    const billEditData = [{...billData, items}];

    return {...state, billEditData};
  }

  //there is no PRE_DELETE_SHARE because they are deleted when Payment is deleted
  

  case 'POST_SHARES': {
    const billData = state.billEditData[0];
    const billIndex = state.billsData.findIndex(bill => bill.id == billData.id);
    const billsBefore = state.billsData.slice(0, billIndex);
    const billsAfter = state.billsData.slice(billIndex + 1);
    const lender = billData.lender.first_name;

    const {indexes, response} = action.payload;
    const items = billData.items.map((item, index) => {
      const payments = item.payments.map(payment => {
        const responsePayment = response.find((res, resIndex) => {
          const name = state.usersData.find(user => user.id == res.payment.payer).first_name;
          // same indexes => same Item (Payment)
          // same names => same Payment (Share), because same person
          return index == indexes[resIndex] && payment.name == name;
        });
        if (!responsePayment) {
          return payment;
        } else if (responsePayment.status == 200){
          const {id, paying_part} = responsePayment.payment;
          return {...payment, id, share: paying_part, isEdited:false, isEditedType: '', error: false};
        } else {
          return {...payment, error: true};
        }
      });
      return {...item, payments};
    });

    const ItemsWithCorrectTotalShare = items.map(item => {
      const totalShare = item.payments.reduce((sum, payment) => {
        return sum + payment.share;
      }, 0);

      const payments = item.payments.map(payment => {
        if (payment.name == lender) {
          const correctShare = payment.share - (totalShare - 1);
          return {...payment, share: correctShare};
        } else {
          return payment;
        }
      });
      return {...item, payments};
    });

    const billEditData = [{...billData, items: ItemsWithCorrectTotalShare}];
    const billsData = [...billsBefore, {...billData, items}, ...billsAfter];

    return {...state, billsData, billEditData};
  }

  case 'PUT_SHARES': {
    const billData = state.billEditData[0];
    const billIndex = state.billsData.findIndex(bill => bill.id == billData.id);
    const billsBefore = state.billsData.slice(0, billIndex);
    const billsAfter = state.billsData.slice(billIndex + 1);
    const lender = billData.lender.first_name;

    const {indexes, response} = action.payload;
    const items = billData.items.map((item, index) => {
      const payments = item.payments.map(payment => {
        const responsePayment = response.find((res, resIndex) => {
          const name = state.usersData.find(user => user.id == res.payment.payer).first_name;
          // same indexes => same Item (Payment)
          // same names => same Payment (Share), because same person
          return index == indexes[resIndex] && payment.name == name;
        });
        if (!responsePayment) {
          return payment;
        } else if (responsePayment.status == 200){
          const {id, paying_part} = responsePayment.payment;
          return {...payment, id, share: paying_part, isEdited:false, isEditedType: '', error: false};
        } else {
          return {...payment, error: true};
        }
      });
      return {...item, payments};
    });

    const ItemsWithCorrectTotalShare = items.map(item => {
      const totalShare = item.payments.reduce((sum, payment) => {
        return sum + payment.share;
      }, 0);

      const payments = item.payments.map(payment => {
        if (payment.name == lender) {
          const correctShare = payment.share - (totalShare - 1);
          return {...payment, share: correctShare};
        } else {
          return payment;
        }
      });
      return {...item, payments};
    });

    const billEditData = [{...billData, items: ItemsWithCorrectTotalShare}];
    const billsData = [...billsBefore, {...billData, items}, ...billsAfter];

    return {...state, billsData, billEditData};
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