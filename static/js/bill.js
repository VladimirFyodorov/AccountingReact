window.addEventListener('DOMContentLoaded', function () {
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
        importMyDir.getCoordinatesOfBillInBillsData = getCoordinatesOfBillInBillsData;
        importMyDir.getCoordinatesOfPaymentInBillsData = getCoordinatesOfPaymentInBillsData;
        importMyDir.getCoordinatesOfShareInBillsData = getCoordinatesOfShareInBillsData;

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
                lender = billData.lender.first_name,
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

        function getCoordinatesOfBillInBillsData(billId) {
            let billsData = importMyDir.getFromLocalStorage('billsData');

            for (let i = 0; i < billsData.length; i++) {
                if (billsData[i].id == billId) {
                    return i;
                }
            }
        }

        function getCoordinatesOfPaymentInBillsData(billId, itemId) {
            let billsData = importMyDir.getFromLocalStorage('billsData');

            for (let i = 0; i < billsData.length; i++) {
                if (billsData[i].id == billId) {
                    for (let j = 0; j < billsData[i].items.length; j++) {
                        if (billsData[i].items[j].id == itemId) {
                            return [i, j];
                        }
                    }
                }
            }
        }

        function getCoordinatesOfShareInBillsData(billId, itemId, shareId) {
            let billsData = importMyDir.getFromLocalStorage('billsData');

            for (let i = 0; i < billsData.length; i++) {
                if (billsData[i].id == billId) {
                    for (let j = 0; j < billsData[i].items.length; j++) {
                        if (billsData[i].items[j].id == itemId) {
                            for (let k = 0; k < billsData[i].items[j].payments.length; k++) {
                                if (billsData[i].items[j].payments[k].id == shareId) {
                                    return [i, j, k];
                                }
                            }
                        }
                    }
                }
            }
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
                    saveLocallyAddBill(json);

                    ////////// editing bill ////////////
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

        function saveLocallyAddBill(json) {
            addToBillsData();
            startBillsList();
            changeBillsListHtml();
            showBill();

            function addToBillsData() {
                let billsData = importMyDir.getFromLocalStorage('billsData'),
                    usersData = importMyDir.getFromLocalStorage('usersData'),
                    data = {
                        id: json.id,
                        name: json.name,
                        comment: json.comment,
                        date: json.date
                        };
                
                for (let i = 0; i < usersData.length; i++) {
                    if (usersData[i].id == json.lender) {
                        data.lender = usersData[i];
                    }
                }

                data.items = [];
                data.payments_total = [];

                billsData.push(data);

                importMyDir.saveToLocalStorage('billsData', billsData);
            }

            function changeBillsListHtml() {
                let billsList = document.querySelector('.billsList'),
                    billsData = importMyDir.getFromLocalStorage('billsData'),
                    billData = getBillData(json.id, billsData),
                    baseItem = billsList.children[0],
                    clone = baseItem.cloneNode(true);
                
                clone.children[0].textContent = importMyDir.formateBillName(billData, false);
                clone.children[1].textContent = billData.id;

                clone.style.display = 'block';
                clone.children[0].style.color = 'rgba(49, 139, 222, 1)';
                
                // saving the order on 1) baseItem, then else
                baseItem.replaceWith(clone);
                billsList.prepend(baseItem);

            }

            function showBill() {
                let billsData = importMyDir.getFromLocalStorage('billsData'),
                    billData = getBillData(json.id, billsData),
                    usersData = importMyDir.getFromLocalStorage('usersData');

                startBillEdit();
                startBillEdit.showBill(billData, usersData);
                startBillEdit.startEdit(billData);
            }

            function getBillData(id, billsData) {
                for (let i = 0; i < billsData.length; i++) {
                    if (billsData[i].id == id) {
                        return billsData[i];
                    }
                }
            }
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

    function getBillsData() {
        return new Promise(function (resolve, reject) {

            let request = new XMLHttpRequest();

            request.open('GET', `${location.protocol + '//' + location.host}/bills/api/get_bills`);
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

    function fillFilterByUser() {
        let usersData = importMyDir.getFromLocalStorage('usersData');

        function addUser(i) {
            let userDiv = document.createElement('div'),
                user = document.createElement('h5'),
                userName = document.createTextNode(usersData[i]["first_name"]),
                usersList = document.querySelector('.billsList-usersList');

            userDiv.classList.add('billsList-usersList-item');
            user.appendChild(userName);
            userDiv.appendChild(user);
            usersList.appendChild(userDiv);
        }

        for (let i = 0; i < usersData.length; i++) {
            addUser(i);
        }
    }

    function startBillsList() {
        let billsData = importMyDir.getFromLocalStorage('billsData'),
            usersData = importMyDir.getFromLocalStorage('usersData');  
        clean();
        init();

        function clean() {
            let showMoreBtn = document.querySelector('#showMore'),
                showLessBtn = document.querySelector('#showLess'); 

            // cleaning up
            cleanBillsList();
            importMyDir.removeEventListeners(showMoreBtn);
            importMyDir.removeEventListeners(showLessBtn);
            closeUserMenu();

            function closeUserMenu() {
                let usersList = document.querySelector('.billsList-usersList'),
                    usersListArrow = document.querySelector('.arrow');
                // closing menu
                usersList.style.display = 'none';
                usersListArrow.classList.remove('up');
                usersListArrow.classList.add('down');
            }
        }

        function init() {
            startUsersListArrow();

            // starting position is filter ALL
            //showBillsForLender(billsListData);
            startFilteredBillsList(0);


            /////// adding Filter /////
            let usersListItems = document.querySelectorAll('.billsList-usersList-item,.billsList-usersList-item-current');
            for (let i = 0; i < usersListItems.length; i++) {
                usersListItems[i].addEventListener('click', () => {
                    startFilteredBillsList(i);
                });
            }
        }

        function cleanBillsList() {
            let billsListItem = document.querySelector('.billsList-item'),
                billsList = document.querySelector('.billsList'),
                clone = billsListItem.cloneNode(true),
                children = clone.children;


            children[0].textContent = '';
            children[1].textContent = '';

            importMyDir.removeinnerHTML(billsList);

            // saving one hidden item for future cloning
            clone.style.display = 'none';
            billsList.appendChild(clone);
        }
        
        function startUsersListArrow() {
            let usersListArrow = document.querySelector('.arrow'),
                usersList = document.querySelector('.billsList-usersList');

            usersListArrow.addEventListener('click', (event) => {
                let target = event.target;
                if (target.classList.contains('down')) {
                    usersList.style.display = 'block';
                    target.classList.remove('down');
                    target.classList.add('up');
                } else {
                    usersList.style.display = 'none';
                    target.classList.remove('up');
                    target.classList.add('down');
                }
            });
        }

        function startFilteredBillsList(index) {
            clean();
            showBillsList(calculateFilteredBillsData(index));
            resetUserListHeader(index);
            resetUserListCurrentItem(index);

            function showBillsList(FilteredBillsData) {
                let showMoreBtn = document.querySelector('#showMore'),
                    showLessBtn = document.querySelector('#showLess');
    
    
                // show bills
                if (FilteredBillsData.length < 5) {
                    // showing all bills
                    for (let i = 0; i < FilteredBillsData.length; i++) {
                        addBillToBillsList(FilteredBillsData[i]);
                    }
                    // there is no need for this button
                    showMoreBtn.style.display = 'none';
                    showLessBtn.style.display = 'none';
                } else {
                    showMoreBtn.style.display = 'block';
                    showLessBtn.style.display = 'none';
                    // showing 5 bills
                    for (let i = 0; i < 5; i++) {
                        addBillToBillsList(FilteredBillsData[i]);
                    }
    
                    showMoreBtn.addEventListener('click', () => {
    
                        for (let i = 5; i < FilteredBillsData.length; i++) {
                            addBillToBillsList(FilteredBillsData[i]);
                        }
    
                        showMoreBtn.style.display = 'none';
                        showLessBtn.style.display = 'block';
                    });
    
                    showLessBtn.addEventListener('click', () => {
                        cleanBillsList();
    
                        for (let i = 0; i < 5; i++) {
                            addBillToBillsList(FilteredBillsData[i]);
                        }
                        showMoreBtn.style.display = 'block';
                        showLessBtn.style.display = 'none';
                    });
                }
    
                function addBillToBillsList(billData) {
                    let billsList = document.querySelector('.billsList'),
                        billsListItem = document.querySelector('.billsList-item'),
                        clone = billsListItem.cloneNode(true),
                        children = clone.children,
                        billName = importMyDir.formateBillName(billData, false),
                        billId = billData.id;
        
                    clone.style.display = 'block';
        
                    children[0].textContent = billName;
                    children[1].textContent = billId;
                    children[0].color = 'rgba(58, 58, 58, 1)';
        
                    clone.addEventListener('mouseover', () => {
                        clone.style.backgroundColor = 'rgba(248, 248, 248, 1)';
                    });
        
                    clone.addEventListener('mouseout', () => {
                        clone.style.backgroundColor = 'white';
                    });
        
                    billsList.appendChild(clone);
                }
            }

            function resetUserListCurrentItem(index) {
                let usersListItems = document.querySelectorAll('.billsList-usersList-item,.billsList-usersList-item-current'),
                    checkmarkDiv = document.querySelector('.checkMark');
                usersListItems.forEach((element) => {
                    if (element.classList.contains('billsList-usersList-item-current')) {
                        element.classList.remove('billsList-usersList-item-current');
                        element.classList.add('billsList-usersList-item');
                    }
                });
                usersListItems[index].classList.remove('billsList-usersList-item');
                usersListItems[index].classList.add('billsList-usersList-item-current');
                if (checkmarkDiv.parentNode) {
                    checkmarkDiv.parentNode.removeChild(checkmarkDiv);
                    usersListItems[index].prepend(checkmarkDiv);
                }
            }

            function resetUserListHeader(index) {
                let usersListHead = document.querySelector('#billsArePayedBy'),
                    usersData = importMyDir.getFromLocalStorage('usersData');

                if (index == 0) {
                    usersListHead.textContent = `Bills are payed by`;
                } else {
                // changing users list
                    let userFirstName = usersData[index - 1].first_name;
                    usersListHead.textContent = `Bills are payed by ${userFirstName}`;
                }
            }

            function calculateFilteredBillsData(index) {
                let filteredBillsData = [],
                    usersData = importMyDir.getFromLocalStorage('usersData'),
                    billsData = importMyDir.getFromLocalStorage('billsData');
                
                if (index == 0) {
                    return billsData;
                } else {
                    let userId = usersData[index - 1].id;

                    // making bills list
                    for (let j = 0; j < billsData.length; j++) {
                        // cheking if bill's lender is consistent with filter
                        if (billsData[j]["lender"].id == userId) {
                            filteredBillsData.push(billsData[j]);
                        }
                    }
                    return filteredBillsData;
                }
            }
        }
    }

    function startBillPreview() {

        init();
        
        function init() {

            let billsList = document.querySelector('.billsList');

            billsList.addEventListener('mouseover', (event)=>{
                if (getBillId(event) != NaN) {
                    let billId = getBillId(event),
                        billsData = importMyDir.getFromLocalStorage('billsData'),
                        billData = getBillData(billId, billsData);

                    showBill(billData);
                }
            });

            billsList.addEventListener('mouseout', (event)=>{
                if (getBillId(event) != NaN) {
                    hideBill();
                }
            });
        }

        function showBill(billData) {
            let billPreviewBox = document.querySelector('.billPreview'),
                billEditBox = document.querySelector('.editBill'),
                billHeader = document.querySelector('.billPreview-header'),
                billPaymentBoxItem = document.querySelector('.billPreview-paymentBox-item'),
                billPaymentBox = document.querySelector('.billPreview-paymentBox'),
                billName = importMyDir.formateBillName(billData),
                billShareBox = document.querySelector('.billPreview-shareBox'),
                billShareBoxItem = document.querySelector('.billPreview-shareBox-item'),
                total = document.querySelector('.billPreview-shareBox-total'),
                totalAmount = total.children[1],
                totalAmountCalc = 0;
            
            billPreviewBox.style.display = 'block';
            billEditBox.style.display = 'none';

            
            billHeader.textContent = billName;

            ////////// Items ////////////
            // cleaning
            if (billData.items.length != 0) {importMyDir.removeinnerHTML(billPaymentBox);}
            // adding items
            for (let i = 0; i < billData.items.length; i++) {
                let item = billData.items[i],
                    ItemClone = billPaymentBoxItem.cloneNode(true),
                    children = ItemClone.children;

                ItemClone.style.display = 'flex';

                children[0].textContent = item.name;
                children[1].textContent = item.cost_per_exemplar + ' ₽';
                children[2].textContent = 'x' + item.amount;

                billPaymentBox.appendChild(ItemClone);
            }

            ////////// payments ////////////
            // cleaninng
            if (billData.payments_total.length > 0) {importMyDir.removeinnerHTML(billShareBox);}
            // adding total payments
            for (let i = 0; i < billData.payments_total.length; i++) {
                let payment = billData.payments_total[i],
                    ItemClone = billShareBoxItem.cloneNode(true),
                    children = ItemClone.children,
                    colorPayed = 'rgba(113, 113, 113, 1)',
                    colorNotPayed = 'rgba(58, 58, 58, 1)';

                ItemClone.style.display = 'flex';

                children[0].textContent = payment.name;
                children[1].textContent = payment.amount + ' ₽';
                children[2].textContent = ' ₽';

                totalAmountCalc += payment.amount;

                if (payment.is_payed == "False") {
                    children[0].style.color = colorNotPayed;
                    children[1].style.color = colorNotPayed;
                    children[2].style.color = colorNotPayed;
                    children[2].style.borderWidth = '0px';

                } else {
                    children[0].style.color = colorPayed;
                    children[1].style.color = colorPayed;
                    children[2].style.color = colorPayed;
                    children[2].style.borderWidth = '0.5px';
                }

                billShareBox.appendChild(ItemClone);

                //adding total
                total.style.display = 'flex';
                totalAmount.textContent = totalAmountCalc + ' ₽';
            }

        }

        function hideBill() {
            let billPreviewBox = document.querySelector('.billPreview'),
                billEditBox = document.querySelector('.editBill'),
                billEditHeader = document.querySelector('#editBill-header-name'),
                billHeader = document.querySelector('.billPreview-header'),
                billPaymentBoxItem = document.querySelector('.billPreview-paymentBox-item'),
                billPaymentBox = document.querySelector('.billPreview-paymentBox'),
                billShareBox = document.querySelector('.billPreview-shareBox'),
                billShareBoxItem = document.querySelector('.billPreview-shareBox-item'),
                total = document.querySelector('.billPreview-shareBox-total');

            billPreviewBox.style.display = 'none';
            if (billEditHeader.textContent != '') {
                billEditBox.style.display = 'block';
            }
            billHeader.textContent = '';

            // cleaning
            importMyDir.removeinnerHTML(billPaymentBox);
            importMyDir.removeinnerHTML(billShareBox);
            total.style.display = 'none';

            // saving one hidden item for future cloning
            billPaymentBoxItem.style.display = 'none';
            billShareBoxItem.style.display = 'none';
            billPaymentBox.appendChild(billPaymentBoxItem);
            billShareBox.appendChild(billShareBoxItem);
        }

        function getBillId(event) {
            let target = event.target,
                parent = target.parentNode;
            // user can click on div or on text BUT we need only div (parent of text)
            target = (target.tagName != 'DIV') ? parent: target;

            if (target.style.display != 'none' && target.classList.contains('billsList-item')) {
                return +target.children[1].textContent;
            } else {
                return NaN;
            }
        }

        function getBillData(id, billsData) {
            for (let i = 0; i < billsData.length; i++) {
                if (billsData[i].id == id) {
                    return billsData[i];
                }
            }
        }

    }

    function startBillEdit() {
        cleaning();
        init();

        startBillEdit.hideBill = hideBill;
        startBillEdit.showBill = showBill;
        startBillEdit.startEdit = startEdit;

        function cleaning() {
            hideBill();
        }

        function init() {

            let billsList = document.querySelector('.billsList');

            billsList.addEventListener('click', (event)=>{
                if (getBillId(event) != NaN) {
                    let billId = getBillId(event),
                        usersData = importMyDir.getFromLocalStorage('usersData'),
                        billsData = importMyDir.getFromLocalStorage('billsData'),
                        billData = getBillData(billId, billsData);

                    removeHighlightOfBillInBillsList();
                    highlightBillInBillsList(event);

                    showBill(billData, usersData);
                    startEdit(billData);
                }
            });
        }

        function getBillId(event) {
            let target = event.target,
                parent = target.parentNode;
            // user can click on div or on text BUT we need only div (parent of text)
            target = (target.tagName != 'DIV') ? parent: target;

            if (target.style.display != 'none' && target.classList.contains('billsList-item')) {
                return +target.children[1].textContent;
            } else {
                return NaN;
            }
        }

        function highlightBillInBillsList(event) {
            let target = event.target,
                parent = target.parentNode;
            // user can click on div or on text BUT we need only div (parent of text)
            target = (target.tagName != 'DIV') ? parent: target;

            if (target.style.display != 'none' && target.classList.contains('billsList-item')) {
                target.children[0].style.color = 'rgba(49, 139, 222, 1)';
                target.style.backgroundColor = 'rgba(248, 248, 248, 1)';   
            }
        }
    
        function removeHighlightOfBillInBillsList() {
            let billsList = document.querySelector('.billsList');

            for (let i = 0; i < billsList.children.length; i++) {
                //removing from Item
                billsList.children[i].style.backgroundColor = '#FFFFFF';
                // removing from text within the item
                billsList.children[i].children[0].style.color = 'rgba(58, 58, 58, 1)';            
            }
        }

        function getBillData(id, billsData) {
            for (let i = 0; i < billsData.length; i++) {
                if (billsData[i].id == id) {
                    return billsData[i];
                }
            }
        }

        function getNamesInMenu() {
            let sharesMenu = document.querySelector('.editBill-shares-menu'),
                items = sharesMenu.children,
                res = [];
    

            for (let i = 0; i < items.length; i++) {
                if (items[i].style.display != 'none' && items[i].children[0].textContent != '') {
                    res.push(items[i].children[0].textContent);
                }
            }

            return res;
        }

        function hideBill() {
            // hiding
            let billBox = document.querySelector('.editBill');
        
            billBox.style.display = 'none';

            // cleaning
            cleanHeader();
            // Payments
            cleanBoxAndLeftOneHiddenItem('.editBill-payments-box');
            // Shares menu
            cleanBoxAndLeftOneHiddenItem('.editBill-shares-menu');
            // Shares
            cleanBoxAndLeftOneHiddenItem('.editBill-shares-box');

            function cleanBoxAndLeftOneHiddenItem(boxSelector) {
                let box = document.querySelector(boxSelector),
                    element = box.children[0],
                    clone = element.cloneNode(true);
                
                box.innerHTML = '';

                clone.style.display = 'none';
                box.appendChild(clone);
            }

            function cleanHeader() {
                let billHeader = document.querySelector('#editBill-header-name'),
                    billId = document.querySelector('#editBill-header-id');
                
                billHeader.textContent = '';
                billId.textContent = '';
            }
        }

        function showBill(billData, usersData) {

            //cleaning and hiding
            hideBill();

            // showing
            replaceBillPreviewWithEditBill();
            makeHeader();
            makeItemsTable();
            makeSharesMenu();
            makeSharesTable();

            startSharesMenu();


            function replaceBillPreviewWithEditBill() {
                let billBox = document.querySelector('.editBill'),
                    billPreview = document.querySelector('.billPreview');
                
                billPreview.style.display = 'none';
                billBox.style.display = 'block';
            }

            function makeHeader() {
                let billHeader = document.querySelector('#editBill-header-name'),
                    billId = document.querySelector('#editBill-header-id'),
                    billName = importMyDir.formateBillName(billData);
                
                billHeader.textContent = billName;
                billId.textContent = billData.id;
            }

            function makeItemsTable() {
                let itemRow = document.querySelector('.editBill-payment-row'),
                    itemsBox = document.querySelector('.editBill-payments-box');

                // adding items
                for (let i = 0; i < billData.items.length; i++) {
                    let item = billData.items[i],
                        Clone = itemRow.cloneNode(true),
                        children = Clone.children[0].children;
        
                    Clone.style.display = 'flex';

                    children[0].children[0].textContent = item.id;
                    children[1].children[0].textContent = 'false'; //is edited
                    children[2].children[0].textContent = item.name;
                    children[3].children[0].textContent = item.cost_per_exemplar + ' ₽';
                    children[4].children[0].textContent = 'x' + item.amount;
        
                    itemsBox.appendChild(Clone);
                }
            }

            function makeSharesMenu() {
                let sharesMenu = document.querySelector('.editBill-shares-menu'),
                    sharesMenuItem = sharesMenu.children[0],
                    numberOfButtons = 0;

                // cleaning
                sharesMenu.innerHTML = '';

                for (let i = 0; i < usersData.length; i ++) {
                    if (billData.lender.first_name != usersData[i].first_name) {
                        numberOfButtons += 1;

                        let clone = sharesMenuItem.cloneNode(true),
                            child = clone.children[0];

                        clone.style.display = 'block';
                        child.textContent = usersData[i].first_name;

                        if (numberOfButtons == 1) {
                            clone.classList.add('editBill-shares-menu-item-first');
                            clone.style.backgroundColor = '#D7D7D7';
                        } else if (numberOfButtons == usersData.length - 1) {
                            clone.classList.add('editBill-shares-menu-item-last');
                        } else {
                            clone.classList.add('editBill-shares-menu-item-middle');
                        }

                        sharesMenu.appendChild(clone);
                    }
                }
            }

            function makeSharesTable() {
                let sharesBox = document.querySelector('.editBill-shares-box'),
                    shareRow = sharesBox.children[0],
                    menuNames = getNamesInMenu();
                
                // cleaning box
                // if (billData.items.length > 0) {
                //     sharesBox.innerHTML = '';
                // }

                for (let i = 0; i < billData.items.length; i++) {
                    let item = billData.items[i],
                        payments = item.payments,
                        cloneRow = shareRow.cloneNode(true),
                        cellsInRow = cloneRow.children,
                        cellWithName = cellsInRow[0],
                        cellWithAmount = cellsInRow[1];
                    
                    // cleaning row
                    cloneRow.innerHTML = '';

                    // payment name
                    cellWithName.children[0].textContent = item.name;
                    cellWithName.children[1].textContent = item.id;
                    cloneRow.appendChild(cellWithName);

                    // adding shares in correct order
                    for (let i = 0; i < menuNames.length; i++) {
                        for (let j = 0; j < payments.length; j++) {
                            if (payments[j].name == menuNames[i]) {
                                let payment = payments[j],
                                    clone = cellWithAmount.cloneNode(true);

                                clone.children[0].textContent = payment.share;
                                //clone.children[0].textContent = payment.name;
                                clone.children[1].textContent = payment.id;
                                clone.children[2].textContent = payment.name; //payer
                                clone.children[3].textContent = payment.is_payed;
                                clone.children[4].textContent = 'false'; //is edited

                                cloneRow.appendChild(clone);
                            }
                        }
                    }
                    // adding row
                    cloneRow.style.display = 'flex';
                    sharesBox.appendChild(cloneRow);
                }
            }

            function startSharesMenu() {
                // pre-set when
                showShares(0);
                showClickOnMenu(0);

                let menu = document.querySelector('.editBill-shares-menu'),
                    menuItems = menu.children;

                for (let i = 0; i < menuItems.length; i++) {
                    menuItems[i].addEventListener('click', ()=>{
                        showShares(i);
                        showClickOnMenu(i);
                    });
                }

                function showShares(i) {
                    let shareRows = document.querySelectorAll('.editBill-share-row');
                    
                    hideAll();
                    showColumn(i + 1); // because first is name

                
                    function hideAll() {
                        // excluding first None row
                        for (let i = 1; i < shareRows.length; i++){
                            let shareRow = shareRows[i];
                            for (let j = 1; j < shareRow.children.length; j++) {
                                shareRow.children[j].style.display = 'none';
                            }
                        }
                    }

                    function showColumn(index) {
                        // excluding first None row
                        for (let i = 1; i < shareRows.length; i++){
                            let shareRow = shareRows[i];
                            shareRow.children[index].style.display = 'block';
                        }  
                    }
                }

                function showClickOnMenu(index) {
                    let menu = document.querySelector('.editBill-shares-menu'),
                        menuItems = menu.children;

                    unclickAll();
                    clickItem(index);

                    function unclickAll() {
                        for (let i = 0; i < menuItems.length; i++) {
                            menuItems[i].style.backgroundColor = '#FFFFFF';
                        }
                    }
                    function clickItem(index) {
                        menuItems[index].style.backgroundColor = '#D7D7D7';
                    }
                }
            }
        }

        function startEdit(billData) {
            cleaning();
            init();

            function cleaning() {
                let deleteBillBtn = document.querySelector('#delete-bill-btn'),
                    editHeaderBtn = document.querySelector('#edit-header-btn'),
                    saveHeaderBtn = document.querySelector('#save-header-btn'),
                    editSharesBtn = document.querySelector('#edit-shares-btn'),
                    saveSharesBtn = document.querySelector('#save-shares-btn'),
                    editPaymentsBtn = document.querySelector('#edit-payments-btn'),
                    savePaymentsBtn = document.querySelector('#save-payments-btn');
                
                importMyDir.removeEventListeners(deleteBillBtn);
                importMyDir.removeEventListeners(editHeaderBtn);
                importMyDir.removeEventListeners(saveHeaderBtn);
                importMyDir.removeEventListeners(editSharesBtn);
                importMyDir.removeEventListeners(saveSharesBtn);
                importMyDir.removeEventListeners(editPaymentsBtn);
                importMyDir.removeEventListeners(savePaymentsBtn);
            }

            function init() {            
                let deleteBillBtn = document.querySelector('#delete-bill-btn'),
                    editHeaderBtn = document.querySelector('#edit-header-btn'),
                    saveHeaderBtn = document.querySelector('#save-header-btn'),
                    editSharesBtn = document.querySelector('#edit-shares-btn'),
                    saveSharesBtn = document.querySelector('#save-shares-btn'),
                    editPaymentsBtn = document.querySelector('#edit-payments-btn'),
                    savePaymentsBtn = document.querySelector('#save-payments-btn');

                deleteBillBtn.addEventListener('click', ()=>{
                        startDeleteBill();
                    });

                editHeaderBtn.addEventListener('click', ()=>{
                    hideAllBtnBoxesExcept(editHeaderBtn);
                    switchSaveEdit(editHeaderBtn, saveHeaderBtn);
                    // hide delete
                    deleteBillBtn.style.display = 'none';

                    startEditBill();
                });

                saveHeaderBtn.addEventListener('click', ()=>{
                    showAllBtnBoxes();
                    switchSaveEdit(editHeaderBtn, saveHeaderBtn);
                    // unhide delete
                    deleteBillBtn.style.display = 'block';

                    endEditBill();
                });

                editPaymentsBtn.addEventListener('click', ()=>{
                    //hideAllBtnBoxesExcept([editPaymentsBtn, editSharesBtn]);
                    hideAllBtnBoxesExcept(editPaymentsBtn);

                    startEditPayments();
                    startEditShares();
                });

                savePaymentsBtn.addEventListener('click', ()=> {
                    showAllBtnBoxes();
                    hideAllBtnBoxesExcept(editSharesBtn);
                    endEditPayments();
                });

                editSharesBtn.addEventListener('click', ()=>{
                    hideAllBtnBoxesExcept(editSharesBtn);

                    startEditShares();
                });

                saveSharesBtn.addEventListener('click', ()=>{
                    showAllBtnBoxes();
                    endEditShares();
                });
            }

            function startDeleteBill() {
                sendDeleteBill();
                changeHeaderHTMLBack();


                function sendDeleteBill() {
                    let url = `${location.protocol + '//' + location.host}/bills/api/bill`,
                        csrftoken = importMyDir.getCookie('csrftoken'),
                        billId = document.querySelector('#editBill-header-id').textContent,
                        data = {id: billId};
                
                    fetch(url, {
                        method: 'DELETE',
                        headers: {
                            "X-CSRFToken": csrftoken,
                            "content-type": "application/json",
                        },
                        body: JSON.stringify(data)
                    })
                    .then(saveLocallyDeleteBill(billId))
                    .catch(err => console.log(err));
                }

                function saveLocallyDeleteBill(billId) {
                    let billsList = document.querySelector('.billsList');

                    changeBillsData(billId);
                    changeBillsListHTML(billId);
                    startBillsList();
                    importMyDir.removeEventListeners(billsList);
                    startBillPreview();
                    startBillEdit();

                    function changeBillsData(billId) {
                        let billsData = importMyDir.getFromLocalStorage('billsData');
                        
                        for (let i = 0; i < billsData.length; i++) {
                            if (billsData[i].id == billId) {
                                // removing i element
                                billsData.splice(i, 1);
                                importMyDir.saveToLocalStorage('billsData', billsData);

                                i = billsData.length;
                            }
                        }
                    }

                    function changeBillsListHTML(billId) {
                        for (let i = 0; i < billsList.children.length; i++) {
                            if (billsList.children[i].children[1].textContent == billId) {
                                billsList.children[i].remove();
                            }
                        }
                    }

                }

                function changeHeaderHTMLBack() {
                    let headerInputBox = document.querySelector('.editBill-header-input'),
                        headerName = document.querySelector('#editBill-header-name');
                    
                    headerInputBox.remove();
                    headerName.textContent = '';
                    headerName.style.display = 'block';
                }
            }

            function startEditBill() {
                changeHeaderToEditMode();

                function changeHeaderToEditMode() {
                    let headerBox = document.querySelector('.editBill-header'),
                        headerName = document.querySelector('#editBill-header-name'),
                        billId = document.querySelector('#editBill-header-id').textContent,
                        billsData = importMyDir.getFromLocalStorage('billsData'),
                        billData = billsData[importMyDir.getCoordinatesOfBillInBillsData(billId)],
                        headerInputBox = document.createElement('div');

                    headerInputBox.classList.add('editBill-header-input');

                    headerName.style.display = 'none';

                    headerInputBox.appendChild(createInputName(billData.name));
                    headerInputBox.appendChild(createInputDate(billData.date));
                    headerInputBox.appendChild(createInputCostType());
                    headerInputBox.appendChild(createInputPayer(billData.lender));

                    headerBox.prepend(headerInputBox);

                    function createInputName(billName) {
                        let inputName = document.createElement('input');
                    
                        inputName.type = 'text';
                        inputName.classList.add('editBill-header-input-name');
                        inputName.value = billName;

                        return inputName;
                    }

                    function createInputDate(billDate) {
                        let inputDate = document.createElement('input');
                    
                        inputDate.type = 'date';
                        inputDate.classList.add('editBill-header-input-date');
                        inputDate.value = billDate;

                        return inputDate;
                    }

                    function createInputCostType() {
                        let billId = document.querySelector('#editBill-header-id').textContent,
                            billsData = importMyDir.getFromLocalStorage('billsData'),
                            billData = billsData[importMyDir.getCoordinatesOfBillInBillsData(billId)],
                            inputCostType = document.createElement('select'),
                            option = document.createElement('option'),
                            options = ['Food', 'Entertainment', 'Health and Beauty', 'Other'];
                            
                        
                        if (billData.comment == '') {
                            inputCostType.classList.add('editBill-header-input-costType');

                            option.value = 'Other';
                            option.textContent = 'Other';
                            inputCostType.appendChild(option);
                        } else {
                            inputCostType.classList.add('editBill-header-input-costType');

                            option.value = billData.comment;
                            option.textContent = billData.comment;
                            inputCostType.appendChild(option);
                        }
                        

                        for (let i = 0; i < options.length; i++) {
                            if (options[i] != billData.comment || (options[i] = 'Other' && billData.comment == '')) {
                                let option = document.createElement('option');

                                option.value = options[i];
                                option.textContent = options[i];

                                inputCostType.appendChild(option);
                            }
                        }

                        return inputCostType;
                    }

                    function createInputPayer(billPayerData) {
                        let usersData = importMyDir.getFromLocalStorage('usersData'),
                            inputPayer = document.createElement('select'),
                            option = document.createElement('option');
                        
                        inputPayer.classList.add('editBill-header-input-payer');

                        option.value = billPayerData.id;
                        option.textContent = billPayerData.first_name;
                        inputPayer.appendChild(option);
                        

                        for (let i = 0; i < usersData.length; i++) {
                            if (usersData[i].id != billPayerData.id) {
                                let option = document.createElement('option');

                                option.value = usersData[i].id;
                                option.textContent = usersData[i].first_name;

                                inputPayer.appendChild(option);
                            }
                        }

                        return inputPayer;
                    }
                }
            }

            function endEditBill() {
                saveBill();
            }

            function startEditPayments() {
                let editPaymentsBtn = document.querySelector('#edit-payments-btn'),
                    savePaymentsBtn = document.querySelector('#save-payments-btn');
                switchSaveEdit(editPaymentsBtn, savePaymentsBtn);

                changePaymentBoxToEditMode();
            }

            function endEditPayments() {
                let editPaymentsBtn = document.querySelector('#edit-payments-btn'),
                    savePaymentsBtn = document.querySelector('#save-payments-btn');

                switchSaveEdit(editPaymentsBtn, savePaymentsBtn);

                savePayments();
                changePaymentBoxBack();
            }

            function startEditShares() {
                let editSharesBtn = document.querySelector('#edit-shares-btn'),
                    saveSharesBtn = document.querySelector('#save-shares-btn');
                changeSharesBoxToEditMode();
                switchSaveEdit(editSharesBtn, saveSharesBtn);
            }

            function endEditShares() {
                let editSharesBtn = document.querySelector('#edit-shares-btn'),
                saveSharesBtn = document.querySelector('#save-shares-btn');
                
                switchSaveEdit(editSharesBtn, saveSharesBtn);

                changeSharesBoxBack();
                saveShares();
            }

            function changePaymentBoxToEditMode() {
                cleanAddForm();
                startAllEditBtns();
                startAddForm();

                function cleanAddForm() {
                    let addPaymentBtn = document.querySelector('#add-payment-btn');

                    importMyDir.removeEventListeners(addPaymentBtn);
                }

                function startAddForm() {
                    let form = document.querySelector('.editBill-payments-add'),
                        addPaymentBtn = document.querySelector('#add-payment-btn'),
                        name = document.querySelector('#editBill-payments-add-input-name'),
                        cost = document.querySelector('#editBill-payments-add-input-cost'),
                        items = document.querySelector('#editBill-payments-add-input-items');
    
                    form.style.display = 'flex';
                    
                    //pre-set value
                    items.value = 1;
    
                    addPaymentBtn.addEventListener('click', ()=>{
                        let paymentName = addPayment();
                        addShare(paymentName);

                        // adding eventListener to new edit button 
                        startAllEditBtns();
    
                    });
    
                    function addPayment() {
                        let name = document.querySelector('#editBill-payments-add-input-name'),
                            cost = document.querySelector('#editBill-payments-add-input-cost'),
                            items = document.querySelector('#editBill-payments-add-input-items'),
                            itemRow = document.querySelector('.editBill-payment-row'),
                            itemsBox = document.querySelector('.editBill-payments-box'),
                            clone = itemRow.cloneNode(true),
                            children = clone.children[0].children;
        
            
                        clone.style.display = 'flex';
    
                        children[0].children[0].textContent = '';
                        children[1].children[0].textContent = 'new'; //is edited
                        children[2].children[0].textContent = name.value;
                        children[3].children[0].textContent = Number(cost.value) + ' ₽';
                        children[4].children[0].textContent = 'x' + Number(items.value);
                        
                        if (isNaN(cost.value)) {
                            alert('Cost is not a number');
                        }
    
                        if (isNaN(items.value)) {
                            alert('Items is not a number');
                        }
                        if (!isNaN(cost.value) && !isNaN(items.value)) {
                            itemsBox.appendChild(clone);
                            cleanAddPaymentForm();
    
                            return children[2].children[0].textContent;
                        }
    
                        function cleanAddPaymentForm() {
                            name.value = '';
                            cost.value = '';
                            items.value = 1;
                        }
                    }
    
                    function addShare(name) {
                        
                        let shareBox = document.querySelector('.editBill-shares-box'),
                            shareRow = shareBox.children[0].cloneNode(true),
                            nameCell = shareRow.children[0],
                            shareCell = shareRow.children[1],
                            users = getNamesInMenu();
    
                        shareRow.innerHTML = '';
                        shareRow.style.display = 'flex';
                        nameCell.children[0].textContent = name;
                        nameCell.children[1].textContent = ''; //id
                        shareRow.appendChild(nameCell);
    
                        for (let i = 0; i < users.length; i ++) {
                            let cloneCell = shareCell.cloneNode(true);

                            cloneCell.children[0].value = 0; // share
                            cloneCell.children[1].textContent = 'no ids'; //id
                            cloneCell.children[2].textContent = users[i]; //payer name
                            cloneCell.children[3].textContent = 'False'; //isPayed
                            cloneCell.children[4].textContent = 'new'; //isEdited

                            shareRow.appendChild(cloneCell);
                        }
    
                        shareBox.appendChild(shareRow);
                    }
                }

                function startAllEditBtns() {
                    let payments = document.querySelectorAll('.editBill-payment'),
                        paymentRows = document.querySelectorAll('.editBill-payment-row');
                    for (let i = 0; i < payments.length; i ++) {

                        importMyDir.removeEventListeners(payments[i].children[5]);

                        let editBtn = payments[i].children[5];
                        //show edit btn
                        editBtn.style.display = 'flex';

                        editBtn.addEventListener('click', ()=>{
                            startEditPaymentRow(paymentRows[i]); 
                        });
                    }
                }

                function hideAllEditBtns() {
                    let payments = document.querySelectorAll('.editBill-payment'),
                        paymentRows = document.querySelectorAll('.editBill-payment-row');

                    for (let i = 0; i < payments.length; i ++) {
                        //show edit btn
                        payments[i].children[5].style.display = 'none';
                    }
                }

                function showAllEditBtns() {
                    let payments = document.querySelectorAll('.editBill-payment');

                    for (let i = 0; i < payments.length; i ++) {
                        //show edit btn
                        payments[i].children[5].style.display = 'flex';
                    }      
                }

                function startEditPaymentRow(paymentRow) {
                    let payments = document.querySelectorAll('.editBill-payment'),
                        paymentRows = document.querySelectorAll('.editBill-payment-row'),
                        addForm = document.querySelector('.editBill-payments-add'),
                        paymentsBtns = document.querySelector('.editBill-payments-btns'),
                        deleteBtn = paymentRow.children[1].children[0],
                        saveBtn = paymentRow.children[1].children[1];
                        
                    
                    // hiding all
                    hideAllEditBtns();
                    addForm.style.display = 'none';
                    paymentsBtns.style.display = 'none';

                    // show row btns
                    paymentRow.children[1].style.display = 'flex';

                    changeRowToInput(paymentRow);

                    saveBtn.addEventListener('click', ()=>{
                        changeRowBackToRow();
                        // hide row btns
                        paymentRow.children[1].style.display = 'none';

                        // show all
                        showAllEditBtns();
                        addForm.style.display = 'flex';
                        paymentsBtns.style.display = 'flex';

                        // update
                        updatePaymentLocally(paymentRow);
                        updateSharesLocally(paymentRow);
                    });

                    deleteBtn.addEventListener('click', ()=>{
                        changeRowBackToRow();
                        // hide row btns
                        paymentRow.children[1].style.display = 'none';

                        // show all
                        showAllEditBtns();
                        addForm.style.display = 'flex';
                        paymentsBtns.style.display = 'flex';

                        //delete
                        deletePaymentLocally(paymentRow);
                        deleteSharesLocally(paymentRow);
                    });

                    function changeRowToInput(paymentRow) {
                        let children = paymentRow.children[0].children,
                            name = children[2].children[0].textContent,
                            cost = children[3].children[0].textContent.replace(' ₽', ''),
                            items = children[4].children[0].textContent.replace('x', ''),
                            inputName = document.createElement('input'),
                            inputCost = document.createElement('input'),
                            inputItems = document.createElement('input');
                        
                        children[2].children[0].textContent = '';
                        children[3].children[0].textContent = ' ₽';
                        children[4].children[0].textContent = 'items';

                        inputName.value = name;
                        inputCost.value = cost;
                        inputItems.value = items;

                        inputName.classList.add('editBill-payment-name-input');
                        inputCost.classList.add('editBill-payment-cost-input');
                        inputItems.classList.add('editBill-payment-items-input');

                        children[4].children[0].classList.add('editBill-payment-items-input');


                        children[2].prepend(inputName);
                        children[3].prepend(inputCost);
                        children[4].prepend(inputItems);
                    }

                    function changeRowBackToRow() {
                        let children = paymentRow.children[0].children,
                            name = children[2].children[0].value,
                            cost = children[3].children[0].value + ' ₽',
                            items = 'x' + children[4].children[0].value;
                        
                        // saving values
                        children[2].children[1].textContent = name;
                        children[3].children[1].textContent = cost;
                        children[4].children[1].textContent = items;

                        // remove class from h4
                        children[4].children[1].classList.remove('editBill-payment-items-input');

                        // removing inputs
                        children[2].children[0].remove();
                        children[3].children[0].remove();
                        children[4].children[0].remove();
                    }

                    function updatePaymentLocally(paymentRow) {
                        let isChanged = paymentRow.children[0].children[1].children[0];

                        isChanged.textContent = 'update';
                    }

                    function updateSharesLocally(paymentRow) {
                        let paymentRows = document.querySelectorAll('.editBill-payment-row'),
                            shareRows = document.querySelectorAll('.editBill-share-row');
                        
                        for (let i = 0; i < paymentRows.length; i++) {
                            if (paymentRows[i] == paymentRow) {
                                let paymentName = paymentRow.children[0].children[2].children[0].textContent;

                                shareRows[i].children[0].children[0].textContent = paymentName;
                            }
                        }
                    }

                    function deletePaymentLocally(paymentRow) {
                        let isChanged = paymentRow.children[0].children[1].children[0];

                        isChanged.textContent = 'delete';
                        paymentRow.style.display = 'none';
                    }

                    function deleteSharesLocally(paymentRow) {
                        let paymentRows = document.querySelectorAll('.editBill-payment-row'),
                            shareRows = document.querySelectorAll('.editBill-share-row');
                        
                        for (let i = 0; i < paymentRows.length; i++) {
                            if (paymentRows[i] == paymentRow) {
                                let shareRow = shareRows[i];

                                for (let j = 1; j < shareRow.children.length; j++) {
                                    shareRow.children[j].children[4].textContent = 'delete';
                                }

                                shareRow.style.display = 'none';
                            }
                        }
                    }
                }
            }

            function changePaymentBoxBack() {

                hideAddForm();
                hideAllEditBtns();

                function hideAddForm() {
                    let form = document.querySelector('.editBill-payments-add');
    
                    form.style.display = 'none';
                }

                function hideAllEditBtns() {
                    let payments = document.querySelectorAll('.editBill-payment');

                    for (let i = 0; i < payments.length; i ++) {
                        //show edit btn
                        payments[i].children[5].style.display = 'none';
                    }
                }
            }

            function changeSharesBoxToEditMode() {
                changeSharesTableToEditMode();
                changeSharesMenuToEditMode();

                function changeSharesMenuToEditMode() {
                    let menu = document.querySelector('.editBill-shares-menu'),
                        menuEdit = document.querySelector('.editBill-shares-users'),
                        menuEditItem = menuEdit.children[0],
                        users = getNamesInMenu();
                    
                    menu.style.display = 'none';
                    menuEdit.style.display = 'flex';

                    // cleaning
                    menuEdit.innerHTML = '';

                    for (let i = 0; i < users.length; i++){
                        let clone = menuEditItem.cloneNode(true);

                        clone.children[0].textContent = users[i];

                        menuEdit.appendChild(clone);
                    }
                }
                
                function changeSharesTableToEditMode() {
                    let shareBox = document.querySelector('.editBill-shares-box');

                    // for row
                    for (let i = 0; i < shareBox.children.length; i++) {
                        let row = shareBox.children[i];
                        // for cell in row
                        // from 1 because first is name
                        for (let j = 1; j < row.children.length; j++) {
                            let cell = row.children[j],
                                input = document.createElement('input'),
                                amount = cell.children[0];

                            cell.style.display = 'block';
    
                            cell.classList.remove('editBill-share-amount');
                            cell.classList.add('editBill-share-input-amount');
                            
                            input.value = amount.textContent;
                            input.addEventListener('change', ()=>{
                                if (isNumber(input.value) && totalShareIsLessThanOne(cell)) {
                                    input.parentNode.children[4].textContent = 'update'; // isEdited
                                } else if (!isNumber(input.value) && totalShareIsLessThanOne(cell)) {
                                    input.value = 0;
                                    alert('Share is not a number');
                                } else if (isNumber(input.value) && !totalShareIsLessThanOne(cell)) {
                                    input.value = 0;
                                    alert("Total share for item can't be more than one");
                                } else {
                                    input.value = 0;
                                    alert('Share is not a number');
                                    alert("Total share for item can't be more than one");
                                }
                            });

                            amount.replaceWith(input);
                        }
                    }

                    function isNumber(num) {
                        if (!isNaN(num)) {
                            return true;
                        } else {
                            return false;
                        }
                    }

                    function totalShareIsLessThanOne(cell) {
                        let row = cell.parentNode,
                            totalShare = 0;

                        // from 1 because first is name
                        for (let j = 1; j < row.children.length; j++) {
                            let cell = row.children[j],
                                input = cell.children[0];

                            totalShare += Number(input.value);
                        }

                        if (totalShare > 1) {
                            return false;
                        } else {
                            return true;
                        }
                    }
                }
            }

            function changeSharesBoxBack() {
                changeSharesMenuBack();
                changeSharesTableBack();
                showAllBtnBoxes();

                function changeSharesMenuBack() {
                    let menu = document.querySelector('.editBill-shares-menu'),
                        menuItems = menu.children,
                        menuEdit = document.querySelector('.editBill-shares-users'),
                        menuEditItem = menuEdit.children[0];
                    
                    menu.style.display = 'flex';
                    menuEdit.style.display = 'none';

                    // cleaning
                    menuEdit.innerHTML = '';
                    menuEditItem.children[0].textContent = '';
                    menuEdit.appendChild(menuEditItem);



                    unclickAll();
                    clickItem(0);

                    function unclickAll() {
                        for (let i = 0; i < menuItems.length; i++) {
                            menuItems[i].style.backgroundColor = '#FFFFFF';
                        }
                    }

                    function clickItem(index) {
                        menuItems[index].style.backgroundColor = '#D7D7D7';
                    }
                }

                function changeSharesTableBack() {
                    let shareBox = document.querySelector('.editBill-shares-box');

                    // for row
                    for (let i = 0; i < shareBox.children.length; i++) {
                        let row = shareBox.children[i];
                        // for cell in row
                        // from 1 because first is name
                        for (let j = 1; j < row.children.length; j++) {
                            let cell = row.children[j],
                                input = cell.children[0],
                                id = cell.children[1],
                                amount = document.createElement('h4');

                            // show only first column
                            if (j == 1) {
                                cell.style.display = 'block';
                            } else {
                                cell.style.display = 'none';
                            }
    
                            cell.classList.add('editBill-share-amount');
                            cell.classList.remove('editBill-share-input-amount');
                            
                            amount.classList.add('editBill-share-amount-share');
                            amount.textContent =  input.value;

                            input.replaceWith(amount);
                        }
                    }
                }
            }

            function hideAllBtnBoxesExcept(btns) {
                let headerBtns = document.querySelector('.editBill-header-btns'),
                    paymentsBtns = document.querySelector('.editBill-payments-btns'),
                    sharesBtns = document.querySelector('.editBill-shares-btns');
                
                headerBtns.style.display = 'none';
                paymentsBtns.style.display = 'none';
                sharesBtns.style.display = 'none';

                if (btns.length) {
                    for (let i = 0; i < btns.length; i++) {
                        showBtnBox(btns[i]);
                    }
                } else {
                    showBtnBox(btns);
                }
                
                function showBtnBox(btn) {
                    btn.parentNode.style.display = 'flex';
                }
            }

            function showAllBtnBoxes() {

                let headerBtns = document.querySelector('.editBill-header-btns'),
                    paymentsBtns = document.querySelector('.editBill-payments-btns'),
                    sharesBtns = document.querySelector('.editBill-shares-btns');
                
                headerBtns.style.display = 'flex';
                paymentsBtns.style.display = 'flex';
                sharesBtns.style.display = 'flex';
            }

            function switchSaveEdit(editBtn, saveBtn) {
                editBtn.style.display = (editBtn.style.display == 'none')? 'block': 'none';
                saveBtn.style.display = (saveBtn.style.display == 'none')? 'block': 'none';
            }

            function saveBill() {

                sendUpdateBill(createBillObj());

                function createBillObj() {
                    let headerInputBox = document.querySelector('.editBill-header-input'),
                        billData = {};

                    billData.id = document.querySelector('#editBill-header-id').textContent;
                    billData.name = headerInputBox.children[0].value;
                    billData.date = headerInputBox.children[1].value;
                    billData.comment = headerInputBox.children[2].value;
                    billData.lender = headerInputBox.children[3].value;

                    return billData;
                }

                function sendUpdateBill(billData) {
                    let url = `${location.protocol + '//' + location.host}/bills/api/bill`,
                        csrftoken = importMyDir.getCookie('csrftoken'),
                        data = billData;
                
                    fetch(url, {
                            method: 'PUT',
                            headers: {
                                "X-CSRFToken": csrftoken,
                                "content-type": "application/json",
                            },
                            body: JSON.stringify(data)
                        })
                        .then(response => response.json())
                        .then((json) => {
                            saveLocallyUpdateBill(json);
                        })
                        .catch(err => console.log(err));
                }

                function saveLocallyUpdateBill(json) {
                    changeHTML();
                    changeBillsData();

                    function changeHTML() {
                        let billsData = importMyDir.getFromLocalStorage('billsData'),
                            billData = billsData[importMyDir.getCoordinatesOfBillInBillsData(json.id)],
                            headerInputBox = document.querySelector('.editBill-header-input'),
                            headerName = document.querySelector('#editBill-header-name');

                        billData.name = json.name;
                        billData.date = json.date;
                        billData.comment = json.comment;
                        billData.lender = importMyDir.getUserById(json.lender);
                        
                        headerInputBox.remove();
                        headerName.textContent = importMyDir.formateBillName(billData);
                        headerName.style.display = 'block';
                    }

                    function changeBillsData() {
                        let billsData = importMyDir.getFromLocalStorage('billsData'),
                            billData = billsData[importMyDir.getCoordinatesOfBillInBillsData(json.id)];

                        billData.name = json.name;
                        billData.date = json.date;
                        billData.comment = json.comment;
                        billData.lender = importMyDir.getUserById(json.lender);

                        billsData[importMyDir.getCoordinatesOfBillInBillsData(json.id)] = billData;
                        importMyDir.saveToLocalStorage('billsData', billsData);        
                    }
                }

            }

            function savePayments(billsData) {
                let payments = document.querySelectorAll('.editBill-payment'),
                    billId = document.querySelector('#editBill-header-id');
                
                if (payments.length > 0) {
                    for (let i = 0; i < payments.length; i++) {
                        let payment = payments[i],
                            paymentData = createPaymentObj(payment);
                        

                        if (paymentData.isEdited == 'new') {
                            sendAddItem(payment, paymentData);
                        } else if (paymentData.isEdited == 'delete' && paymentData.id > 0) {
                            sendDeletePayment(payment, paymentData);
                        } else if (paymentData.isEdited == 'delete' && paymentData.id == 0) {
                            // delete new element (locally new element)
                            payment.parentNode.remove();
                        } else if (paymentData.isEdited == 'update' && paymentData.id == 0) {
                            sendAddItem(payment, paymentData);
                        } else if (paymentData.isEdited == 'update' && paymentData.id > 0) {
                            sendUpdateItem(payment, paymentData);
                        }
                    }
                }

                function createPaymentObj(payment) {
                    let paymentData = {};

                    paymentData.id = Number(payment.children[0].children[0].textContent);
                    paymentData.isEdited = payment.children[1].children[0].textContent;
                    paymentData.name = payment.children[2].children[0].textContent;
                    paymentData.cost = Number(payment.children[3].children[0].textContent.replace(" ₽", ""));
                    paymentData.items = Number(payment.children[4].children[0].textContent.replace("x", ""));
                    paymentData.billId = Number(billId.textContent);

                    return paymentData;
                }

                function sendAddItem(payment, paymentData) {
                    let url = `${location.protocol + '//' + location.host}/bills/api/item`,
                        csrftoken = importMyDir.getCookie('csrftoken'),
                        data = {
                            name: paymentData.name,
                            cost_per_exemplar: paymentData.cost,
                            amount: paymentData.items,
                            bill: paymentData.billId
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
                            saveLocallyAddItem(payment, json);
                        })
                        .catch(err => console.log(err));
                }

                function sendDeletePayment(payment, paymentData) {
                    let url = `${location.protocol + '//' + location.host}/bills/api/item`,
                        csrftoken = importMyDir.getCookie('csrftoken'),
                        data = {id: paymentData.id};
                    
                    fetch(url, {
                            method: 'DELETE',
                            headers: {
                                "X-CSRFToken": csrftoken,
                                "content-type": "application/json",
                            },
                            body: JSON.stringify(data)
                        })
                        .then(saveLocallyDeleteItem(payment, paymentData))
                        .catch(err => console.log(err));
                }

                function sendUpdateItem(payment, paymentData) {
                    let url = `${location.protocol + '//' + location.host}/bills/api/item`,
                        csrftoken = importMyDir.getCookie('csrftoken'),
                        data = {
                            id: paymentData.id,
                            name: paymentData.name,
                            cost_per_exemplar: paymentData.cost,
                            amount: paymentData.items,
                            bill: paymentData.billId
                        };
                    
        
        
                    fetch(url, {
                            method: 'PUT',
                            headers: {
                                "X-CSRFToken": csrftoken,
                                "content-type": "application/json",
                            },
                            body: JSON.stringify(data)
                        })
                        .then(response => response.json())
                        .then((json) => {
                            saveLocallyUpdateItem(payment, json);
                        })
                        .catch(err => console.log(err));
                }

                function saveLocallyAddItem(payment, json) {
                    changeBillsData();
                    changePaymentHTML();
                    changeSharesHTML();

                    function changeBillsData() {
                        let billId = json.bill,
                            billsData = importMyDir.getFromLocalStorage('billsData'),
                            data = {
                                id: json.id,
                                name: json.name,
                                amount: json.amount,
                                cost_per_exemplar: json.cost_per_exemplar,
                                bill: json.bill,
                                payments: []
                                };

                        for (let i = 0; i < billsData.length; i++) {
                            if (billsData[i].id == billId) {
                                billsData[i].items.push(data);
                                importMyDir.saveToLocalStorage('billsData', billsData);

                                i = billsData.length;
                            }
                        }
                    }

                    function changePaymentHTML() {
                        // isChanged to false
                        payment.children[1].children[0].textContent = 'false';
                        // add ID
                        payment.children[0].children[0].textContent = json.id;
                    }

                    function changeSharesHTML() {
                        let paymentRow = payment.parentNode,
                            paymentRows = paymentRow.parentNode.children,
                            shareRows = document.querySelectorAll('.editBill-share-row');
                            //paymentId = payment.children[0].children[0].textContent;

                        for (let i = 0; i < paymentRows.length; i++) {
                            if (paymentRows[i] == paymentRow) {
                                let shareRow = shareRows[i];
                                
                                shareRow.children[0].children[1].textContent = json.id;
                            }
                        }
                    }
                }

                function saveLocallyDeleteItem(payment, paymentData) {

                    changeBillsData();
                    changeHTML();

                    function changeBillsData() {
                        let billId = paymentData.billId,
                            itemId = paymentData.id,
                            billsData = importMyDir.getFromLocalStorage('billsData');
                        

                        for (let i = 0; i < billsData.length; i++) {
                            if (billsData[i].id == billId) {
                                for (let j = 0; j < billsData[i].items.length; j++) {
                                    if (billsData[i].items[j].id == itemId) {
                                        let allItems = billsData[i].items,
                                            removed = allItems.splice(j, 1);

                                        billsData[i].items = allItems;
                                        importMyDir.saveToLocalStorage('billsData', billsData);

                                        i = billsData.length - 1;
                                        j = billsData[i].items.length;
                                    }
                                }
                            }
                        }
                    }

                    function changeHTML() {
                        // deleting HTML
                        payment.parentNode.remove();
                    }
                }

                function saveLocallyUpdateItem(payment, json) {

                    changeBillsData();
                    changeHTML();

                    function changeBillsData() {
                        let billId = json.bill,
                            itemId = json.id,
                            billsData = importMyDir.getFromLocalStorage('billsData');
                        

                        for (let i = 0; i < billsData.length; i++) {
                            if (billsData[i].id == billId) {
                                for (let j = 0; j < billsData[i].items.length; j++) {
                                    if (billsData[i].items[j].id == itemId) {
                                        json.payments = billsData[i].items[j].payments;
                                        billsData[i].items[j] = json;
                                        importMyDir.saveToLocalStorage('billsData', billsData);

                                        i = billsData.length - 1;
                                        j = billsData[i].items.length;
                                    }
                                }
                            }
                        }
                    }

                    function changeHTML() {
                        // isChanged to false
                        payment.children[1].children[0].textContent = 'false';
                    }
                }
            }

            function saveShares() {
                let shareRows = document.querySelectorAll('.editBill-share-row');
                
                if (shareRows.length > 0) {
                    for (let i = 0; i < shareRows.length; i++) {
                        for (let j = 1; j < shareRows[i].children.length; j++) {
                            let cell = shareRows[i].children[j],
                                shareData = createShareObj(cell);
                            
                            if (shareData.isEdited == '') {
                                // do nothing becuse it is empty row
                            } else if (shareData.isEdited != 'delete' && shareData.id == 0) {
                                sendAddShare(cell, shareData);
                            } else if (shareData.isEdited != 'delete' && shareData.id != 0) {
                                sendUpdateShare(cell, shareData);
                            } else if (shareData.isEdited == 'delete' && shareData.id == 0) {
                                // delete New share - only locally
                                cell.parentNode.remove();
                            } else if (shareData.isEdited == 'delete' && shareData.id != 0) {
                                saveLocallyDeletePayment(cell, shareData);
                            }



                            // if (shareData.isEdited == 'new') {
                            //     sendAddShare(cell, shareData);
                            // } else if (shareData.isEdited == 'false' && shareData.id == 0) {
                            //     sendAddShare(cell, shareData);
                            // } else if (shareData.isEdited == 'false' && shareData.id == 'multiple ids') {
                            //     alert(`Delete payment ${shareData.itemName} and add it again, othewise no shares will be saved`);
                            // } else if (shareData.isEdited == 'update' && shareData.id == 0) {
                            //     sendAddShare(cell, shareData);
                            // } else if (shareData.isEdited == 'update' && shareData.id > 0) {
                            //     sendUpdateShare(cell, shareData);
                            // } else if (shareData.isEdited == 'delete' && shareData.id > 0) {
                            //     saveLocallyDeletePayment(cell, shareData);
                            // } else if (shareData.isEdited == 'delete' && shareData.id == 0) {
                            //     // delete New share - only locally
                            //     cell.parentNode.remove();
                            // }

                        }
                    }
                }

                function createShareObj(cell) {
                    let shareData = {},
                        itemId = cell.parentNode.children[0].children[1].textContent,
                        itemName = cell.parentNode.children[0].children[0].textContent,
                        payer = cell.children[2].textContent,
                        usersData = importMyDir.getFromLocalStorage('usersData');

                    shareData.share = Number(cell.children[0].textContent);


                    if (cell.children[1].textContent == 'multiple ids') {
                        shareData.id = cell.children[1].textContent;
                    } else if (cell.children[1].textContent == 'no ids') {
                        shareData.id = 0;
                    } else {
                        shareData.id = Number(cell.children[1].textContent);
                    }

                    shareData.is_payed = cell.children[3].textContent;
                    shareData.isEdited = cell.children[4].textContent;
                    shareData.itemId = Number(itemId);
                    shareData.itemName = itemName;

                    for (let i = 0; i < usersData.length; i++) {
                        if (usersData[i].first_name == payer) {
                            shareData.payerId = usersData[i].id;
                        }
                    }

                    return shareData;
                }

                function sendAddShare(cell, shareData) {
                    let url = `${location.protocol + '//' + location.host}/bills/api/payment`,
                        csrftoken = importMyDir.getCookie('csrftoken'),
                        data = {
                            item: shareData.itemId,
                            paying_part: shareData.share,
                            payer: shareData.payerId,
                            is_payed: shareData.is_payed
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
                            saveLocallyAddShare(cell, json);
                        })
                        .catch(err => console.log(err));
                }

                function sendUpdateShare(cell, shareData) {
                    let url = `${location.protocol + '//' + location.host}/bills/api/payment`,
                        csrftoken = importMyDir.getCookie('csrftoken'),
                        data = {
                            id: shareData.id,
                            item: shareData.itemId,
                            paying_part: shareData.share,
                            payer: shareData.payerId,
                            is_payed: shareData.is_payed
                        };
                
                
                    fetch(url, {
                            method: 'PUT',
                            headers: {
                                "X-CSRFToken": csrftoken,
                                "content-type": "application/json",
                            },
                            body: JSON.stringify(data)
                        })
                        .then(response => response.json())
                        .then((json) => {
                            console.log(json);
                            saveLocallyUpdateShare(cell, json);
                        })
                        .catch(err => console.log(err));
                }

                function saveLocallyAddShare(cell, json) {
                    changeHTML();
                    changeBillsData();

                    function changeHTML() {
                        cell.children[1].textContent = json.id; //id
                        cell.children[4].textContent = 'false'; //isEdited
                    }

                    function changeBillsData() {

                        let itemId = json.item,
                            billId = document.querySelector('#editBill-header-id').textContent,
                            billsData = importMyDir.getFromLocalStorage('billsData'),
                            data = {
                                name: importMyDir.getUserById(json.payer).first_name,
                                id: json.id,
                                amount: json.paying_part,
                                share: json.paying_part,
                                is_payed: json.is_payed
                                },
                            corrdArr = importMyDir.getCoordinatesOfPaymentInBillsData(billId, itemId),
                            i = corrdArr[0],
                            j = corrdArr[1];
                    

                        let item = billsData[i].items[j];
                        //calc amount
                        data.amount = item.cost_per_exemplar * data.amount;

                        billsData[i].items[j].payments.push(data);
                        importMyDir.saveToLocalStorage('billsData', billsData);
                    }
                }

                function saveLocallyUpdateShare(cell, json) {
                    changeHTML();
                    changeBillsData();

                    function changeHTML() {
                        cell.children[4].textContent = 'false'; //isEdited
                    }

                    function changeBillsData() {
                        let billId = document.querySelector('#editBill-header-id').textContent,
                            itemId = json.item,
                            shareId = json.id,
                            billsData = importMyDir.getFromLocalStorage('billsData'),
                            data = {
                                name: importMyDir.getUserById(json.payer).first_name,
                                id: json.id,
                                amount: json.paying_part,
                                share: json.paying_part,
                                is_payed: json.is_payed
                                },
                            coordArr = importMyDir.getCoordinatesOfShareInBillsData(billId, itemId, shareId),
                            i = coordArr[0], 
                            j = coordArr[1], 
                            k = coordArr[2];
                        
                        data.amount = data.amount * billsData[i].items[j].amount * billsData[i].items[j].cost_per_exemplar;

                        billsData[i].items[j].payments[k] = data;

                        importMyDir.saveToLocalStorage('billsData', billsData);                    
                    }
                }

                function saveLocallyDeletePayment(cell, shareData) {
                    changeHTML();

                    function changeHTML() {
                        cell.parentNode.remove();
                    }
                }
            }
        }
    }

    function receiveRedirectionToBillEdit() {
        let billId = document.querySelector('#redirectedBillId').textContent;

        if (billId > 0) {
            let usersData = importMyDir.getFromLocalStorage('usersData'),
                billsData = importMyDir.getFromLocalStorage('billsData'),
                index = importMyDir.getCoordinatesOfBillInBillsData(billId),
                billData = billsData[index];
            
            startBillEdit();
            startBillEdit.showBill(billData, usersData);
            startBillEdit.startEdit(billData);
            cleanBillIdSlot();
        }

        function cleanBillIdSlot() {
            let billId = document.querySelector('#redirectedBillId');

            billId.textContent = '';
        }
    }

    importMyDir();

    startAccountPopupWindow();

    startAddBillForm();

    getUsersData()
        .then(response => {

            importMyDir.saveToLocalStorage('usersData', JSON.parse(response));

            fillFilterByUser();

            getBillsData()
                .then(response => {
                    
                    importMyDir.saveToLocalStorage('billsData', JSON.parse(response));

                    startBillsList();

                    startBillPreview();

                    startBillEdit();

                    receiveRedirectionToBillEdit();

                })
                .catch(() => console.log("Unable to load bills data"));
        })
        .catch(() => console.log("Unable to load users data"));
});