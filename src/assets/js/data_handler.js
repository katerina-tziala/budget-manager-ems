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
//retrieve data from server
const fetchData = (action, callback) => {
  const url = data_url+action;
  fetchHandler(url).then((response)=>{
    callback(null, response);
  }).catch((error) => callback(error, null));

};
//function to handle how dara are send
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
//function to handle how dara are fetched
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
/*
*  GET LISTS
*/
//get item by budget id
const getByBudgetID = (id, list)=>{
  let results = list;
  results = results.filter((r) => r.budget_id === parseInt(id));
  return results;
};
/*
* SORT DATA
*/
//sort by budget_to date
const sortByBudgetDate = (item_a, item_b, order_type)=>{
  let optSort;
  if(order_type==="asc"){
    optSort = (item_a.budget_to).localeCompare(item_b.budget_to);
  }else if (order_type==="desc") {
    optSort = (item_b.budget_to).localeCompare(item_a.budget_to);
  }
  return optSort;
};
//sort by expense_date
const sortByDate = (item_a, item_b, order_type)=>{
  let optSort;
  if(order_type==="asc"){
    optSort = (item_a.expense_date).localeCompare(item_b.expense_date);
  }else if (order_type==="desc") {
    optSort = (item_b.expense_date).localeCompare(item_a.expense_date);
  }
  return optSort;
};
//sort by amount
const sortByAmount = (item_a, item_b, order_type)=>{
  let optSort;
  if(order_type==="asc"){
    optSort =  parseFloat(item_a.amount) - parseFloat(item_b.amount);
  }else if (order_type==="desc") {
    optSort = parseFloat(item_b.amount) - parseFloat(item_a.amount);
  }
  return optSort;
};
//sort by id
const sortByID = (item_a, item_b, order_type)=>{
  let optSort;
  if(order_type==="asc"){
    optSort =  parseFloat(item_a.id) - parseFloat(item_b.id);
  }else if (order_type==="desc") {
    optSort = parseFloat(item_b.id) - parseFloat(item_a.id);
  }
  return optSort;
};
//sort by category
const sortByCategory = (item_a, item_b, order_type)=>{
  let optSort;
  if(order_type==="asc"){
    optSort = (item_a.category).localeCompare(item_b.category);
  }else if (order_type==="desc") {
    optSort = (item_b.category).localeCompare(item_a.category);
  }
  return optSort;
};
//sort by payment
const sortByPayment = (item_a, item_b, order_type)=>{
  let optSort;
  if(order_type==="asc"){
    optSort = (item_a.payment).localeCompare(item_b.payment);
  }else if (order_type==="desc") {
    optSort = (item_b.payment).localeCompare(item_a.payment);
  }
  return optSort;
};
