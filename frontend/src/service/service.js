import jQuery from 'jquery';

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


export default class Service {
  _apiBase = location.protocol + '//' + location.host;

  getBillsData() {
    return new Promise(function (resolve, reject) {
  
      let request = new XMLHttpRequest();
  
      request.open('GET', `${location.protocol + '//' + location.host}/bills_api/get_bills`);
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
  
      request.open('GET', `${location.protocol + '//' + location.host}/bills_api/get_all_users`);
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

  async makeGetRequest(apiPath) {
    return new Promise(function (resolve, reject) {
  
      let request = new XMLHttpRequest();
  
      request.open('GET', `${location.protocol + '//' + location.host}${apiPath}`);
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


  async makePostPutDeleteRequest(method, apiPath, data) {
    const url = `${this._apiBase}${apiPath}`,
      csrftoken = getCookie('csrftoken');

    const response = await fetch(url, {
      method: method,
      headers: {
        'X-CSRFToken': csrftoken,
        'content-type': 'application/json',
      },
      body: JSON.stringify(data)
    });

    if (!response.ok){
      return new Error(`Could not ${method.toLowerCase()} from ${url}, received ${response.status}`);
    }

    return await response.json();
  }

  async makeDeleteRequest(method, apiPath, data) {
    const url = `${this._apiBase}${apiPath}`,
      csrftoken = getCookie('csrftoken');

    const response = await fetch(url, {
      method: method,
      headers: {
        'X-CSRFToken': csrftoken,
        'content-type': 'application/json',
      },
      body: JSON.stringify(data)
    });

    if (!response.ok){
      throw new Error(`Could not ${method.toLowerCase()} from ${url}, received ${response.status}`);
    }

    return 'ok';
  }

  async postBill(data) {
    return await this.makePostPutDeleteRequest('POST', '/bills_api/bill', data);
  }

  async putBill(data) {
    return await this.makePostPutDeleteRequest('PUT', '/bills_api/bill', data);
  }

  async deleteBill(data) {
    return await this.makeDeleteRequest('DELETE', '/bills_api/bill', data);
  }

  async postPayments(data) {
    return await this.makePostPutDeleteRequest('POST', '/bills_api/payment', data);
  }

  async putPayments(data) {
    return await this.makePostPutDeleteRequest('PUT', '/bills_api/payment', data);
  }

  async deletePayments(data) {
    return await this.makePostPutDeleteRequest('DELETE', '/bills_api/payment', data);
  }

  async postShares(data) {
    return await this.makePostPutDeleteRequest('POST', '/bills_api/share', data);
  }

  async putShares(data) {
    return await this.makePostPutDeleteRequest('PUT', '/bills_api/share', data);
  }

  async checkEmail(data) {
    return await this.makePostPutDeleteRequest('PUT', '/users_api/check_email', data);
  }

  async login(data) {
    return await this.makePostPutDeleteRequest('PUT', '/users_api/login', data);
  }

  async logout(data) {
    return await this.makePostPutDeleteRequest('PUT', '/users_api/logout', data);
  }

  async getUser() {
    return await this.makeGetRequest('/users_api/get_user');
  }

  async getAccountData() {
    return await this.makeGetRequest('/users_api/get_account_data');
  }

  async closeSettlements(data) {
    return await this.makePostPutDeleteRequest('PUT', '/users_api/close_settlements', data);
  }

  async getExchangeRates() {
    return await this.makeGetRequest('/users_api/get_exchange_rates');
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