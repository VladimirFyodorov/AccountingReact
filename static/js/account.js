window.addEventListener('DOMContentLoaded', function() {
    'use strict';

    function importMyDir() {

        importMyDir.removeinnerHTML = removeinnerHTML;
        importMyDir.removeEventListeners = removeEventListeners;
        importMyDir.getCookie = getCookie;
        importMyDir.saveToLocalStorage = saveToLocalStorage;
        importMyDir.getFromLocalStorage = getFromLocalStorage;
        importMyDir.formateBillName = formateBillName;
        importMyDir.getUserById = getUserById;
        importMyDir.getUserByName = getUserByName;
        importMyDir.getCoordinatesOfCounteragentInData = getCoordinatesOfCounteragentInData;
        importMyDir.getCoordinatesOfBillInData = getCoordinatesOfBillInData;
        importMyDir.insertAfter = insertAfter;

        function removeinnerHTML(element) {
            element.innerHTML = '';
        }

        function removeEventListeners(element) {
            element.replaceWith(element.cloneNode(true));
        }

        function getCookie(name) {
            // using jQuery
            // https://stackoverflow.com/questions/46008318/csrf-token-in-ajax-post-api
            var cookieValue = null;
            if (document.cookie && document.cookie !== '') {
                var cookies = document.cookie.split(';');
                for (var i = 0; i < cookies.length; i++) {
                    var cookie = jQuery.trim(cookies[i]);
                    // Does this cookie string begin with the name we want?
                    if (cookie.substring(0, name.length + 1) === (name + '=')) {
                        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                        break;
                    }
                }
            }
            return cookieValue;
        }

        function saveToLocalStorage(key, value) {
            // Put the object into storage
            localStorage.setItem(key, JSON.stringify(value));
        }

        function getFromLocalStorage(key) {
            // Retrieve the object from storage
            var value = localStorage.getItem(key);
            return value && JSON.parse(value);
        }

        function formateBillName(billData, withLender = true) {
            function fomatDate(date) {
                function getTwoDigitDate(number) {
                    return (number < 10) ? 0 + number.toString() : number.toString();
                }
                return `${getTwoDigitDate(date.getDate())}-${getTwoDigitDate(date.getMonth() + 1)}`;
            }
    
            let date = new Date(billData.date),
                dateFormated = fomatDate(date),
                lender = getUserById(billData.lender).first_name,
                billNameW = `${billData.name} ${dateFormated} ${lender}`,
                billNameWo = `${billData.name} ${dateFormated}`,
                formatedbillName = (withLender)? billNameW: billNameWo;
    
            return formatedbillName;
        }

        function getUserById(id) {
            let usersData = getFromLocalStorage('usersData');

            for (let i = 0; i < usersData.length; i++) {
                if (usersData[i].id == id) {
                    return usersData[i];
                }
            }
        }

        function getUserByName(first_name) {
            let usersData = getFromLocalStorage('usersData');

            for (let i = 0; i < usersData.length; i++) {
                if (usersData[i].first_name == first_name) {
                    return usersData[i];
                }
            }
        }

        function getCoordinatesOfCounteragentInData(counteragentId) {
            let data = importMyDir.getFromLocalStorage('data');

            for (let i = 0; i < data.length; i++) {
                if (data[i].id == counteragentId) {
                    return i;
                }
            }
        }

        function getCoordinatesOfBillInData(counteragentId, billId) {
            let data = importMyDir.getFromLocalStorage('data');

            for (let i = 0; i < data.length; i++) {
                if (data[i].id == counteragentId) {
                    for (let j = 0; j < data[i].bills.length; j++) {
                        if (data[i].bills[j].id == billId) {
                            return [i, j];
                        }
                    }
                }
            }
        }

        function insertAfter(newNode, existingNode) {
            existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling);
        }
    }

    function startAccountPopupWindow() {
        let headerUserBox = document.querySelector('.header-right-menu-user-box'),
            accountPopupWindow = document.querySelector('.account-popup-window'),
            signout = document.querySelector('.account-popup-window-signountbox');

        headerUserBox.addEventListener('click', function () {
            if (accountPopupWindow.style.display == 'none') {
                accountPopupWindow.style.display = 'block';
            } else {
                accountPopupWindow.style.display = 'none';
            }
        });

        signout.addEventListener('mouseover', function () {
            this.style.backgroundColor = '#F8F8F8';
        });

        signout.addEventListener('mouseout', function () {
            this.style.backgroundColor = '#FFFFFF';
        });
    }

    function startAddBillForm() {
        let addBillBox = document.querySelector('.header-right-menu-add-bill-box'),
            addBillForm = document.querySelector('.add-bill-form'),
            inputBillName = document.querySelector('#input-bill-name'),
            inputBillDate = document.querySelector('#input-bill-date'),
            inputBillType = document.querySelector('#input-bill-type'),
            inputBillPayer = document.querySelector('#input-bill-payer'),
            addBillBtn = document.querySelector('#add-bill-btn'),
            cancelBillBtn = document.querySelector('#cancel-bill-btn'),
            today = new Date().toISOString().slice(0, 10);


        // pre-set values
        inputBillName.value = (inputBillName.value == '') ? 'New bill' : inputBillName.value;
        inputBillDate.value = (inputBillDate.value == '') ? today : inputBillDate.value;


        addBillBox.addEventListener('click', () => {
            if (addBillForm.style.display == 'none') {
                addBillForm.style.display = 'flex';
            } else {
                addBillForm.style.display = 'none';
            }
        });
    
        addBillBtn.addEventListener('click', (event) => {
            // останавливаем перезагрузку страницы
            event.preventDefault();
            sendBill();
        });

        cancelBillBtn.addEventListener('click', ()=>{
            resetFormAndClose();
        });

        function sendBill() {
            let url = `${location.protocol + '//' + location.host}/bills/api/bill`,
                csrftoken = importMyDir.getCookie('csrftoken'),
                data = {
                    name: inputBillName.value,
                    comment: inputBillType.value,
                    date: inputBillDate.value,
                    lender: inputBillPayer.value
                };

            fetch(url, {
                    method: 'POST',
                    headers: {
                        "X-CSRFToken": csrftoken,
                        "content-type": "application/json",
                    },
                    body: JSON.stringify(data)
                })
                .then(response => response.json())
                .then((json) => {
                    resetFormAndClose();
                    redirectToBill(json);
                })
                .catch(err => console.log(err));
        }

        function resetFormAndClose() {
            //reseting values
            inputBillName.value = 'New bill';
            inputBillDate.value = today;
            inputBillType.value = inputBillType.options[0].value;
            inputBillPayer.value = inputBillPayer.options[0].value;

            // closing form
            addBillForm.style.display = 'none';
        }

        function redirectToBill(json) {
            let billId = json.id,
                url = `${location.protocol + '//' + location.host}/bills/${billId}`;
            window.location.href = url;
        }
    }

    function getUsersData() {
        return new Promise(function (resolve, reject) {

            let request = new XMLHttpRequest();

            request.open('GET', `${location.protocol + '//' + location.host}/bills/api/get_all_users`);
            request.setRequestHeader('Content-type', 'application/json; charset=utf-8');
            request.send();

            request.onload = function () {
                if (request.readyState === 4) {
                    if (request.status == 200) {
                        resolve(this.response);
                    } else {
                        reject();

                    }
                }
            };
        });
    }

    function getData() {
        return new Promise(function (resolve, reject) {

            let request = new XMLHttpRequest();

            request.open('GET', `${location.protocol + '//' + location.host}/users/api/get_account_data`);
            request.setRequestHeader('Content-type', 'application/json; charset=utf-8');
            request.send();

            request.onload = function () {
                if (request.readyState === 4) {
                    if (request.status == 200) {
                        resolve(this.response);
                    } else {
                        reject();

                    }
                }
            };
        });
    }

    function startTable() {
        makeMainTable();
        startShowBills();

        function makeMainTable() {
            let table = document.querySelector('.totalBox'),
                row = document.querySelector('.totalBox-row'),
                data = importMyDir.getFromLocalStorage('data'),
                total = 0;
            
            //removing empty row
            row.remove();
            
            for (let i = 0; i < data.length; i++) {
                let clone = row.cloneNode(true);

                clone.children[0].children[0].children[0].textContent = data[i].id; //payer id
                clone.children[0].children[0].children[1].textContent = data[i].name; //payer name
                clone.children[0].children[1].children[0].textContent = data[i].total + ' ₽';
                total += data[i].total;

                if (data[i].total > 0) {
                    clone.children[1].children[2].textContent = 'Receive';
                } else {
                    clone.children[1].children[2].textContent = 'Pay';
                }

                clone.style.display = 'flex';
                table.appendChild(clone);
            }

            makeTotalRow(total);

            function makeTotalRow(total) {
                let row = document.querySelector('.totalBox-row'),
                    clone = row.cloneNode(true);
                
                clone.children[0].children[0].children[0].textContent = ''; //payer id
                clone.children[0].children[0].children[1].textContent = 'Total'; //payer name
                clone.children[0].children[1].children[0].textContent = total + ' ₽';

                clone.children[0].children[0].children[1].classList.add('bold');
                clone.children[0].children[1].children[0].classList.add('bold');

                // changing class
                clone.classList.remove('totalBox-row');
                clone.classList.add('totalBox-totalRow');

                // remove btns
                clone.children[1].remove();

                table.appendChild(clone);
            }
        }

        function startShowBills() {
            init();

            function init() {
                let totalRows = document.querySelectorAll('.totalBox-row');
            
                for (let i = 0; i < totalRows.length; i++) {
                    let totalRow = totalRows[i],
                        showBillsBtn = totalRow.children[1].children[0],
                        hideBillsBtn = totalRow.children[1].children[1];

                    showBillsBtn.addEventListener('click', ()=>{
                        hideAllBills();
                        hideAllHideBtnsAndShowAllShowBtns();
                        showBills(totalRow);
                        switchBtns(showBillsBtn, hideBillsBtn);
                    });

                    hideBillsBtn.addEventListener('click', ()=>{
                        hideAllBills();
                        hideAllHideBtnsAndShowAllShowBtns();
                    });
                }
            }

            function showBills(totalRow) {
                let data = importMyDir.getFromLocalStorage('data'),
                    counteragentId = totalRow.children[0].children[0].children[0].textContent,
                    index = importMyDir.getCoordinatesOfCounteragentInData(counteragentId),
                    dataOfCounteragent = data[index];

                for (let i = dataOfCounteragent.bills.length - 1; i >= 0; i--) {
                    let billData = dataOfCounteragent.bills[i];
                    addBill(totalRow, billData);
                }

                function createBillRow(billData) {
                    let billRow = document.createElement('div'),
                        nameAndAmountBox = document.createElement('div'),
                        nameBox = document.createElement('div'),
                        counteragentIdHTML = document.createElement('h5'),
                        billId = document.createElement('h5'),
                        name = document.createElement('h5'),
                        amountBox = document.createElement('div'),
                        amount = document.createElement('h5'),
                        itemsBox = document.createElement('div'),
                        items = document.createElement('h5');

                    billRow.classList.add('totalBox-billPreviewRow');
                    nameAndAmountBox.classList.add('totalBox-billPreviewRow-nameAndAmount');
                    nameBox.classList.add('totalBox-billPreviewRow-nameAndAmount-name');
                    amountBox.classList.add('totalBox-billPreviewRow-NameAndAmount-amount');
                    itemsBox.classList.add('totalBox-billPreviewRow-items');

                    counteragentIdHTML.style.display = 'none';
                    billId.style.display = 'none';

                    counteragentIdHTML.textContent = counteragentId;
                    billId.textContent = billData.id;
                    name.textContent = importMyDir.formateBillName(billData, false);
                    amount.textContent = billData.total + ' ₽';
                    items.textContent = billData.items_preview;

                    nameBox.appendChild(counteragentIdHTML);
                    nameBox.appendChild(billId);
                    nameBox.appendChild(name);
                    amountBox.appendChild(amount);
                    itemsBox.appendChild(items);
                    
                    nameAndAmountBox.appendChild(nameBox);
                    nameAndAmountBox.appendChild(amountBox);

                    billRow.appendChild(nameAndAmountBox);
                    billRow.appendChild(itemsBox);

                    return billRow;
                }

                function addBill(totalRow, billData) {
                    let billRow = createBillRow(billData);
                    
                    importMyDir.insertAfter(billRow, totalRow);
                }
                
            }

            function switchBtns(btn1, btn2) {
                if (btn1.style.display == 'none') {
                    btn1.style.display = 'block';
                    btn2.style.display = 'none';
                } else {
                    btn1.style.display = 'none';
                    btn2.style.display = 'block';
                }
            }

            function hideAllHideBtnsAndShowAllShowBtns() {
                let totalRows = document.querySelectorAll('.totalBox-row');

                for (let i = 0; i < totalRows.length; i++) {
                    let totalRow = totalRows[i],
                        showBillsBtn = totalRow.children[1].children[0],
                        hideBillsBtn = totalRow.children[1].children[1];
                    
                    showBillsBtn.style.display = 'block';
                    hideBillsBtn.style.display = 'none';
                }
            }

            function hideAllBills() {
                let totalBox = document.querySelector('.totalBox');
                for (let i = 0; i < totalBox.children.length; i++) {
                    if (totalBox.children[i].classList.contains('totalBox-billPreviewRow')) {
                        totalBox.children[i].remove();
                        i--;
                    }
                }
            }
        }
    }

    function startMakePayment() {
        init();

        function init() {
            let rows = document.querySelectorAll('.totalBox-row');

            for (let i = 0; i < rows.length; i++) {
                let payBtn = rows[i].children[1].children[2],
                counteragentId = rows[i].children[0].children[0].children[0].textContent;


                payBtn.addEventListener('click', ()=>{
                    sendClosesettlements(counteragentId);
                });
            }
        }

        function sendClosesettlements(counteragentId) {
            let url = `${location.protocol + '//' + location.host}/users/api/close_settlements`,
                csrftoken = importMyDir.getCookie('csrftoken'),
                data = {"counteragentId": counteragentId};
        
            fetch(url, {
                    method: 'PUT',
                    headers: {
                        "X-CSRFToken": csrftoken,
                        "content-type": "application/json",
                    },
                    body: JSON.stringify(data)
                })
                .then(saveChangesLocally(counteragentId))
                // .then(response => response.json())
                // .then((json) => {saveLocallyUpdateBill(json);})
                .catch(err => console.log(err));
        }

        function saveChangesLocally(counteragentId) {
            changeData();
            changeHTML();

            function changeData() {
                let data = importMyDir.getFromLocalStorage('data');

                for (let i = 0; i < data.length; i++) {
                    if (data[i].id == counteragentId) {
                        data[i].total = 0;
                        importMyDir.saveToLocalStorage('data', data);

                        i = data.length;
                    }
                }
            }

            function changeHTML() {
                let rows = document.querySelectorAll('.totalBox-row');

                for (let i = 0; i < rows.length; i++) {
                    let payBtn = rows[i].children[1].children[1],
                        //btnsBox = rows[i].children[1],
                        someAgentId = rows[i].children[0].children[0].children[0].textContent;

                    if (someAgentId == counteragentId) {
                        importMyDir.removeEventListeners(payBtn);
                        //btnsBox.style.display = 'none';
                        rows[i].children[0].children[1].children[0].textContent = '0 ₽';
                        
                        i = rows.length;
                    }
                }
            }
        }
    }

    function startShowBill() {
        init();

        function init() {
            let totalBox = document.querySelector('.totalBox'),
                hideBillBtn = document.querySelector('#billBox-backBtn'),
                hideBillArrow = document.querySelector('.arrow');

            totalBox.addEventListener('click', (event)=>{
                if (getBillPreviewRow(event)) {
                    let billPreviewRow = getBillPreviewRow(event),
                        billId = getBillId(billPreviewRow),
                        counteragentId = getCounteragentId(billPreviewRow);

                    hideBill();
                    billPreviewRow.style.backgroundColor = '#F8F8F8';
                    showBill(counteragentId, billId);
                }
            });

            hideBillBtn.addEventListener('click', ()=>{
                hideBill();
            });

            hideBillArrow.addEventListener('click', ()=>{
                hideBill();
            });

            function getBillPreviewRow(event) {
                let target = event.target,
                    treeLength = getTreeLength(target);

                if (getParentN(target, treeLength - 1).classList.contains('totalBox-billPreviewRow')) {
                    return getParentN(target, treeLength - 1);
                }

                
                function getTreeLength(target) {
                    let treeLength = 1;

                    for (let i = 0; i < 1; i++) {
                        if (getParentN(target, treeLength).classList.contains('totalBox')) {
                            return treeLength;
                        } else {
                            treeLength++;
                            i--;
                        }
                    }
                }

                function getParentN(e, n) {
                    let element = e;

                    for (let i = 0; i < n; i++) {
                        element = element.parentNode;
                    }

                    return element;
                }
            }

            function getCounteragentId(billPreviewRow) {
                return billPreviewRow.children[0].children[0].children[0].textContent;
            }

            function getBillId(billPreviewRow) {
                return billPreviewRow.children[0].children[0].children[1].textContent;
            }
        }

        function showBill(counteragentId, billId) {
            let billBox = document.querySelector('.billBox'),
                data = importMyDir.getFromLocalStorage('data'),
                arr = importMyDir.getCoordinatesOfBillInData(counteragentId, billId),
                i = arr[0], j = arr[1],
                billData = data[i].bills[j];

            billBox.style.display = 'block';

            makeHeader();
            makePaymentsTable();

            function makeHeader() {
                let header = document.querySelector('.billBox-header'),
                    billName = importMyDir.formateBillName(billData, true);

                header.children[0].textContent = billData.id; // bill id
                header.children[1].textContent = billName; // bill name
            }

            function makePaymentsTable() {
                let box = document.querySelector('.billBox-paymentsBox'),
                    row = document.querySelector('.billBox-paymentsBox-row');

                if (billData.items.length > 0) {
                    importMyDir.removeinnerHTML(box);
                }

                for (let i = 0; i < billData.items.length; i++) {
                    addRow(i);
                }
                
                function addRow(index) {
                    let item = billData.items[index],
                        clone = row.cloneNode(true);
                    
                    clone.children[0].children[0].textContent = item.name; //item name
                    clone.children[0].children[1].textContent = item.paying_amount.toFixed(0) + ' ₽'; //paying amount
                    clone.children[1].children[0].textContent = Math.round(item.cost_per_item) + '₽ x' + item.items; //cost_per_item times items
                    clone.children[1].children[1].textContent = item.share.toFixed(2)*100 + '%'; //share

                    box.appendChild(clone);
                }
            }
        }

        function hideBill() {
            let billBox = document.querySelector('.billBox'),
                rows = document.querySelectorAll('.totalBox-billPreviewRow');

            billBox.style.display = 'none';

            for (let i = 0; i < rows.length; i++) {
                rows[i].style.backgroundColor = 'white';
            }
        }
    }

    function startRedirectToBill() {
        let editBtn = document.querySelector('#billBox-editBtn');

        editBtn.addEventListener('click', ()=>{
            redirectToBill();
        });

        function redirectToBill() {
            let billId = document.querySelector('.billBox-header').children[0].textContent,
                url = `${location.protocol + '//' + location.host}/bills/${billId}`;
            
            console.log(billId);
            console.log(url);


            window.location.href = url;
        }
    }

    importMyDir();

    startAccountPopupWindow();

    startAddBillForm();

    getUsersData()
        .then(response => {

            importMyDir.saveToLocalStorage('usersData', JSON.parse(response));

            getData()
                .then(response => {

                    importMyDir.saveToLocalStorage('data', JSON.parse(response));

                    startTable();

                    startMakePayment();

                    startShowBill();

                    startRedirectToBill();

                })
                .catch(() => console.log("Unable to load data"));
        })
        .catch(() => console.log("Unable to load data"));
});