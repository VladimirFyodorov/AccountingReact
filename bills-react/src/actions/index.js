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
  toggleShowAddBillForm,
  saveAddBillFormData,
  clearAddBillFormData,
  postBill,
  putBill,
  deleteBill
};