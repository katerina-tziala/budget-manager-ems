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
//sort by name
const sortByName = (item_a, item_b, order_type)=>{
  let optSort;
  if(order_type==="asc"){
    optSort = (item_a.name).localeCompare(item_b.name);
  }else if (order_type==="desc") {
    optSort = (item_b.name).localeCompare(item_a.name);
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
//sort by time
const sortByTime = (item_a, item_b, order_type)=>{
  let optSort;
  if(order_type==="asc"){
    optSort = (item_a.expense_time).localeCompare(item_b.expense_time);
  }else if (order_type==="desc") {
    optSort = (item_b.expense_time).localeCompare(item_a.expense_time);
  }
  return optSort;
};
//sort by location
const sortByLocation = (item_a, item_b, order_type) => {
  let optSort;
  if(item_a.location.replace(/\s+/, "") === ''){
     optSort = 1;
  }
  else if(item_b.location.replace(/\s+/, "") === ''){
    optSort = -1;
  }
  else if(item_a.location === item_b.location){
    optSort = 0;
  }
  else if(order_type==="asc") {
    optSort = item_a.location < item_b.location ? -1 : 1;
  }
  else if(order_type==="desc") {
    optSort = item_a.location < item_b.location ? 1 : -1;
  }
  return optSort;
};
//sort by store
const sortByStore = (item_a, item_b, order_type) => {
  let optSort;
  if(item_a.store.replace(/\s+/, "") === ''){
     optSort = 1;
  }
  else if(item_b.store.replace(/\s+/, "") === ''){
    optSort = -1;
  }
  else if(item_a.store === item_b.store){
    optSort = 0;
  }
  else if(order_type==="asc") {
    optSort = item_a.store < item_b.store ? -1 : 1;
  }
  else if(order_type==="desc") {
    optSort = item_a.store < item_b.store ? 1 : -1;
  }
  return optSort;
};
