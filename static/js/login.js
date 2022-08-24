window.addEventListener('DOMContentLoaded', ()=>{
    'use strict';

    importMyDir();
    clearLocalStorage();
    startCheckEmail();
    startSeePassword();
    startLogin();

    function importMyDir() {

        importMyDir.removeinnerHTML = removeinnerHTML;
        importMyDir.removeEventListeners = removeEventListeners;
        importMyDir.getCookie = getCookie;
        importMyDir.saveToLocalStorage = saveToLocalStorage;
        importMyDir.getFromLocalStorage = getFromLocalStorage;
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

        function insertAfter(newNode, existingNode) {
            existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling);
        }
    }

    function clearLocalStorage() {
        window.localStorage.clear();
    }

    function startCheckEmail() {
        let checkEmailBtn = document.querySelector('#checkEmailBtn'),
            timer = setInterval(checkEmail, 1000);

        
        checkEmailBtn.addEventListener('click', ()=>{
            submit();
        });

        function checkEmail() {
            sendCheckEmail();

            function sendCheckEmail() {
                let email = document.querySelector('#emailInput').value,
                    url = `${location.protocol + '//' + location.host}/users/api/check_email`,
                    csrftoken = importMyDir.getCookie('csrftoken'),
                    data = {email};
            
                fetch(url, {
                        method: 'PUT',
                        headers: {
                            "X-CSRFToken": csrftoken,
                            "content-type": "application/json",
                        },
                        body: JSON.stringify(data)
                    })
                    .then((response) => response.json())
                    .then((json) => {
                        if (json.email) {
                            importMyDir.saveToLocalStorage('user', json);
                            addCheckTick();
                        }
                    });
            }

            function addCheckTick() {
                let checkMark = document.querySelector('.checkMark');

                checkMark.style.display = 'block';
            }
        }

        function submit() {
            let user = importMyDir.getFromLocalStorage('user');

            if (user) {
                clearInterval(timer);
                redirectToPasswordInput();
            } else {
                sendErrorMsg();
            }

            function redirectToPasswordInput() {
                changeForms();
                fillForm2();

                function changeForms() {
                    let form1 = document.querySelector('#form_1'),
                        form2 = document.querySelector('#form_2');
                    
                    form1.style.display = 'none';
                    form2.style.display = 'block';
                }

                function fillForm2() {
                    let user = importMyDir.getFromLocalStorage('user'),
                        userCircle = document.querySelector('.login-user-box-circle'),
                        userInfo = document.querySelector('.login-user-box-info');
                    
                    userCircle.textContent = user.first_name[0] + user.last_name[0];
                    
                    userInfo.children[0].textContent = `${user.first_name} ${user.last_name}`;
                    userInfo.children[1].textContent = user.email;
                }
            }

            function sendErrorMsg() {
                let errorElement = document.querySelector('#errorMsg_1');
                
                errorElement.textContent = 'Incorrect email';
                errorElement.style.display = 'block';
            }
        }
    }

    function startSeePassword() {
        let seePasswordIcon = document.querySelector('#see-password-icon'),
            inputPassword = document.querySelector('#passwordInput');

        seePasswordIcon.addEventListener('click', ()=>{
            if (inputPassword.type == 'password') {
                inputPassword.type = 'text';
                seePasswordIcon.classList.toggle('bi-eye');
            } else {
                inputPassword.type = 'password';
                seePasswordIcon.classList.toggle('bi-eye');
            }
        });
    }

    function startLogin() {
        init();

        function init() {
            let loginBtn = document.querySelector('#loginBtn');

            loginBtn.addEventListener('click', ()=>{
                tryLogin();
            });
        }

        function tryLogin() {
            sendLogin();

            function sendLogin() {
                let username = importMyDir.getFromLocalStorage('user').username,
                    password = document.querySelector('#passwordInput').value,
                    url = `${location.protocol + '//' + location.host}/users/api/login`,
                    csrftoken = importMyDir.getCookie('csrftoken'),
                    data = {username, password};

            
                fetch(url, {
                        method: 'PUT',
                        headers: {
                            "X-CSRFToken": csrftoken,
                            "content-type": "application/json",
                        },
                        body: JSON.stringify(data)
                    })
                    .then((response) => response.json())
                    .then((json) => {
                        if (json.message == 'Logged in') {
                            redirectAccount();

                        } else {
                            sendErrorMsg();
                        }
                    });
            }

            function redirectAccount() {
                let url = `${location.protocol + '//' + location.host}/users`;
                window.location.href = url;
            }

            function sendErrorMsg() {
                let errorElement = document.querySelector('#errorMsg_2');
                
                errorElement.textContent = 'Incorrect password';
                errorElement.style.display = 'block';
            }
        }
    } 

});