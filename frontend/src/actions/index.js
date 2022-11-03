const billsDataRequested = () => {
  return {type: 'BILLS_DATA_REQUESTED'};
};

const billsDataLoaded = (billsData) => {
  return {type: 'BILLS_DATA_LOADED', payload: billsData};
};

const billsDataError = () => {
  return {type: 'BILLS_DATA_ERROR'};
};

const usersDataRequested = () => {
  return {type: 'USERS_DATA_REQUESTED'};
};

const usersDataLoaded = (usersData) => {
  return {type: 'USERS_DATA_LOADED', payload: usersData};
};

const usersDataError = () => {
  return {type: 'USERS_DATA_ERROR'};
};

const showBillPreview = (billData) => {
  return {type: 'SHOW_BILL_PREVIEW', payload: billData};
};

const hideBillPreview = () => {
  return {type: 'HIDE_BILL_PREVIEW'};
};

const startBillEdit = (billData) => {
  return {type: 'START_BILL_EDIT', payload: billData};
};

const toggleBillInEditMode = () => {
  return {type: 'TOGGLE_BILL_IN_EDIT_MODE'};
};

const toggleLogoutWindow = () => {
  return {type: 'TOGGLE_LOGOUT_WINDOW'};
};

const toggleShowAddBillForm = () => {
  return {type: 'TOGGLE_SHOW_ADD_BILL_FORM'};
};

const saveAddBillFormData = (addBillFormData) => {
  return {type: 'SAVE_ADD_BILL_FORM_DATA', payload: addBillFormData};
};

const clearAddBillFormData = () => {
  return {type: 'CLEAR_ADD_BILL_FORM_DATA'};
};

const postBill = (payload) => {
  return {type: 'POST_BILL', payload: payload};
};

const putBill = (payload) => {
  return {type: 'PUT_BILL', payload: payload};
};

const deleteBill = (payload) => {
  return {type: 'DELETE_BILL', payload: payload};
};

const prePostPayment = (payload) => {
  return {type: 'PRE_POST_PAYMENT', payload: payload};
};

const prePutPayment = (payload) => {
  return {type: 'PRE_PUT_PAYMENT', payload: payload};
};

const preDeletePayment = (payload) => {
  return {type: 'PRE_DELETE_PAYMENT', payload: payload};
};

const postPayments = (payload) => {
  return {type: 'POST_PAYMENTS', payload: payload};
};

const putPayments = (payload) => {
  return {type: 'PUT_PAYMENTS', payload: payload};
};

const deletePayments = (payload) => {
  return {type: 'DELETE_PAYMENTS', payload: payload};
};

const prePutShare = (payload) => {
  return {type: 'PRE_PUT_SHARE', payload: payload};
};

const postShares = (payload) => {
  return {type: 'POST_SHARES', payload: payload};
};

const putShares = (payload) => {
  return {type: 'PUT_SHARES', payload: payload};
};


const userDataLoaded = (payload) => {
  return {type: 'USER_DATA_LOADED', payload};
};

const accountDataLoaded = (payload) => {
  return {type: 'ACCOUNT_DATA_LOADED', payload};
};

const accountStartEditBill = (payload) => {
  return {type: 'ACCOUNT_START_EDIT_BILL', payload};
};

const accountEndEditBill = () => {
  return {type: 'ACCOUNT_END_EDIT_BILL'};
};

const closeSettlements = (payload) => {
  return {type: 'CLOSE_SETTLEMENTS', payload};
};

const exchangeRatesLoaded = (payload) => {
  return {type: 'EXCHANGE_RATES_LOADED', payload};
};

export {
  billsDataRequested,
  billsDataLoaded,
  billsDataError,
  usersDataRequested,
  usersDataLoaded,
  usersDataError,
  showBillPreview,
  hideBillPreview,
  startBillEdit,
  toggleBillInEditMode,
  toggleLogoutWindow,
  toggleShowAddBillForm,
  saveAddBillFormData,
  clearAddBillFormData,
  postBill,
  putBill,
  deleteBill,
  prePostPayment,
  prePutPayment,
  preDeletePayment,
  postPayments,
  putPayments,
  deletePayments,
  prePutShare,
  postShares,
  putShares,
  userDataLoaded,
  accountDataLoaded,
  accountStartEditBill,
  accountEndEditBill,
  closeSettlements,
  exchangeRatesLoaded
};