// import jQuery from 'jquery';

// function getCookie(name) {
//   // using jQuery
//   // https://stackoverflow.com/questions/46008318/csrf-token-in-ajax-post-api
//   var cookieValue = null;
//   if (document.cookie && document.cookie !== '') {
//     var cookies = document.cookie.split(';');
//     for (var i = 0; i < cookies.length; i++) {
//       var cookie = jQuery.trim(cookies[i]);
//       // Does this cookie string begin with the name we want?
//       if (cookie.substring(0, name.length + 1) === (name + '=')) {
//         cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
//         break;
//       }
//     }
//   }
//   return cookieValue;
// }

// const fetchWithCRF = fetch(url, {
//   method: 'POST',
//   headers: {
//       "X-CSRFToken": csrftoken,
//       "content-type": "application/json",
//   },
//   body: JSON.stringify(data)
// })
// .then(response => response.json())
// .then((json) => {
//   resetFormAndClose();
//   saveLocallyAddBill(json);

//   ////////// editing bill ////////////
// })
// .catch(err => console.log(err));


export default class Service {

  getBillsData() {
    return new Promise(function (resolve, reject) {
  
      let request = new XMLHttpRequest();
  
      request.open('GET', `${location.protocol + '//' + location.host}/bills/api/get_bills`);
      // request.open('GET', `${location.protocol + '//' + 'localhost:8000'}/bills/api/get_bills`);
      request.setRequestHeader('Content-type', 'application/json; charset=utf-8');
      request.send();
  
      request.onload = function () {
        if (request.readyState === 4) {
          if (request.status == 200) {
            resolve(JSON.parse(this.response));
          } else {
            reject();
          }
        }
      };
    });
  }

  getUsersData() {
    return new Promise(function (resolve, reject) {
  
      let request = new XMLHttpRequest();
  
      request.open('GET', `${location.protocol + '//' + location.host}/bills/api/get_all_users`);
      request.setRequestHeader('Content-type', 'application/json; charset=utf-8');
      request.send();
  
      request.onload = function () {
        if (request.readyState === 4) {
          if (request.status == 200) {
            resolve(JSON.parse(this.response));
          } else {
            reject();
          }
        }
      };
    });
  }
}

// // _apiBase = 'http://localhost:3001';
// // csrftoken = getCookie('csrftoken');
// _apiBase = 'http://localhost:8000';

// async getResource(url) {
//   const response = await fetch(`${this._apiBase}${url}`, {
//     method: 'GET',
//     headers: {
//       'X-CSRFToken': getCookie('csrftoken'),
//       'content-type': 'application/json; charset=utf-8',
//       mode: 'no-cores'
//     }});
//   if (!response.ok){
//     throw new Error(`Could not fetch ${url}, received ${response.status}`);
//   }
//   return await response.json();
// }

// async getBillsData() {
//   // return await this.getResource('/billsData/');
//   return await this.getResource('/bills/api/get_bills');
// }

// async getUsersData() {
//   // return await this.getResource('/usersData/');
//   return await this.getResource('/bills/api/get_all_users');
// }