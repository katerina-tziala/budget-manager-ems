"use strict";
//send data to server
const sendData = (action, data) => {
  const url = data_url+action;
  const send_data = JSON.stringify(data);
  const send_promise = sendHandler(url, send_data);
  return new Promise((resolve, reject) => {
    send_promise.then(send_data => {
      resolve(send_data);
    }).catch((error) => {
      const retundata = {
        "message":"app_error",
        "error":error
      }
      //console.log(retundata);
      return retundata;
      //reject(error);
    });
  });
};
//function to handle how data are send to the server
async function sendHandler(url, data) {
  const headers = new Headers();
  headers.append('Content-Type', 'application/json; charset=utf-8');
  const request = new Request(url, {method: 'POST', mode: 'no-cors', credentials: 'same-origin', headers: headers, body:data});
  try {
    const fetchResult = fetch(request);
    const response = await fetchResult;
    const jsonData = await response.json();
    return jsonData;
  } catch(error){
    const retundata = {
      "message":"app_error",
      "error":error
    }
    return retundata;
    //throw Error(error);
  }
}
//retrieve data from server
const fetchData = (action, callback) => {
  const url = data_url+action;
  fetchHandler(url).then((response)=>{
    callback(null, response);
  }).catch((error) => callback(error, null));
};
//function to handle how data are fetched from the server
async function fetchHandler(URL) {
  const headers = new Headers();
  headers.append('Accept', 'application/json; charset=utf-8');
  const request = new Request(URL, {method: 'GET', mode: 'no-cors', cache: 'reload', headers: headers});
  try {
    const fetchResult = fetch(request);
    const response = await fetchResult;
    const jsonData = await response.json();
    return Promise.resolve(jsonData);
  } catch(error){
    throw Error(error);
  }
}
