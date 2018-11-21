"use strict";
let thisExpense, categoriesOptions, expenseIndex;
window.addEventListener('keydown', (event)=>{
  if(event.keyIdentifier=='U+000A' || event.keyIdentifier=='Enter' || event.keyCode==13){
    if(event.target.nodeName=='INPUT' || event.target.nodeName=='TEXTAREA'){
      updateExpense(event);
    }
  }
});
//initialize expense details view
const renderExpenseDetails = (expenses, categories) => {
    prepareMain("clear");
    const expense_in_url = getParameterByName("expense");
    if (expense_in_url==="null") {
      redirectUser(pages.my_expenses.url);
    }else {
      self.thisExpense = [];
      self.categoriesOptions = [];
      createExpenseCard();
      initVariables(expense_in_url, expenses, categories);
      initExpenseCard(self.thisExpense);
      hideLoader();
      if (!self.userInfo.has_current_budget) {
        showBudgetNotification();
      }
    }
};
/*
* ACTIONS & BEHAVIOR
*/
//initialize page variables
const initVariables = (expense_in_url, expenses, categories) => {
  const expense_params = expense_in_url.split("_");
  const parameterID = expense_params[0];
  const expense_index = expense_params[1];
  self.thisExpense = getByID(parameterID, expenses)[0];
  self.thisExpense.expense_index = expense_index;
  self.categoriesOptions = generatecategoriesFilters(categories);
  const formFields = document.querySelectorAll('.expense_time_input');
  const timePickerInput = formFields[0];
  const timePicker = document.getElementById('timePicker');
  initTimePicker(timePicker, timePickerInput, self.thisExpense.expense_time);
};
//initialize expense card
const initExpenseCard = (expense) => {
  self.cardDataContainers = self.expenseCard.querySelectorAll('.cardData');
  self.expenseForms = document.querySelectorAll('.expenseForm');
  cardDataContainers[0].innerHTML = expense.expense_index;
  let categoryicon = 'icon_';
  let category_base = expense.category.split(" ")[0];
  categoryicon = categoryicon+category_base;
  const cardCategoryIcon = document.querySelectorAll('.category_icon');
  cardCategoryIcon[0].className = "";
  cardCategoryIcon[0].classList.add("category_icon", categoryicon);
  loadCategoryIcons(cardCategoryIcon);
  cardDataContainers[1].innerHTML = decodeEntities(expense.category);
  cardDataContainers[2].innerHTML = getDisplayFormat(expense.amount);
  cardDataContainers[3].innerHTML = decodeEntities(expense.payment);
  loadPaymentIcon(expense.payment);
  cardDataContainers[4].innerHTML = expense.expense_date.split("-").reverse().join("/");
  cardDataContainers[5].innerHTML = expense.expense_time;
  const location = decodeEntities(expense.location)===''?'--':decodeEntities(expense.location);
  cardDataContainers[6].innerHTML = location;
  const store = decodeEntities(expense.store)===''?'--':decodeEntities(expense.store);
  cardDataContainers[7].innerHTML = store;
  const comments = decodeEntities(expense.comments)===''?'--':decodeEntities(expense.comments);
  cardDataContainers[8].innerHTML = comments;
  let currentCategories = self.categoriesOptions;
  initCategoryForm(decodeEntities(expense.category));
  initAmountForm(expense);
  initPaymentSelectBox(expense.payment);
  initDateForm(expense);
  initTimeForm(expense);
  initLocationForm(expense);
  initStoreForm(expense);
  initCommentsForm(expense);
  const amountForm = expenseForms[1];
  amountForm.addEventListener('keyup', (event) => {
    const element = event.target;
    const formelement = element.tagName;
    if(formelement==='INPUT'){
      const inputname = element.name;
      const inputvalue = element.value;
      const lbl = document.querySelector('[for='+`${inputname}`+']');
      if(inputname==='expense_amount'){
        amountValidation(inputvalue, element, lbl);
      }
    }
  });
};
//update the expense
const updateExpense = (event, expense = self.thisExpense) => {
  event.preventDefault();
  const button = event.target;
  const buttonID = button.id;
  const target = buttonID.split("_").pop();
  const cardDataContainer = document.getElementById(`cardDataContainer_${target}`);
  const previousHTML = cardDataContainer.innerHTML;
  const form = document.getElementById(`form_${target}`);
  const inputField = form.querySelectorAll(`.expense_${target}_input`)[0];
  const label = form.querySelectorAll(`.expense_${target}_label`)[0];
  let data = {
    "id": expense.id,
    "amount": parseFloat(expense.amount),
    "category": expense.category.toString().toLowerCase(),
    "payment": expense.payment.toString().toLowerCase(),
    "date": expense.expense_date,
    "time": expense.expense_time,
    "location": expense.location.toString().toLowerCase(),
    "store": expense.store.toString(),
    "comments": expense.comments.toString().toLowerCase(),
    "request_type": "update_expense"
  }
  const updateData = updateDataHandler(target, inputField, label);
  if(updateData['is_current']===true){
    cardButtonHandler('expense', target, 'close', 3);
    hideElement(form);
    displayElement(cardDataContainer);
  }else if (updateData['is_current']===false && updateData['is_valid']===true) {
    data[target]=updateData['newvalue'];
    cardDataContainer.innerHTML="";
    hideElement(form);
    const update_message = document.createElement('p');
    update_message.setAttribute('id', `update_msg_${target}`);
    update_message.classList.add("update_expense_msg");
    update_message.innerHTML = `Updating ${target} of expense...`;
    cardDataContainer.append(update_message);
    displayElement(cardDataContainer);
    sendData('updateUserExpense', data).then((response)=>{
      document.getElementById(`update_msg_${target}`).remove();
      cardDataContainer.innerHTML = previousHTML;
      if(response.message==="invalid_request"){
        invalidRequestHandler(data);
      } else if(response.message==="success"){
        const newExpense = {
          "id": data.id,
          "amount": data.amount,
          "category": data.category,
          "payment": data.payment,
          "expense_date": data.date,
          "expense_time": data.time,
          "location": data.location,
          "store": data.store,
          "comments": data.comments,
          "expense_index": expense.expense_index
        }
        self.thisExpense = [];
        self.thisExpense = newExpense;
        cardButtonHandler('expense', target, 'close', 3);
        initExpenseCard(self.thisExpense);
      }else{
        cardButtonHandler('expense', target, 'close', 3);
        const toast_options = {
          "message": messageGenerator({initiator:"editexpense", message_type:"else_error", error_part:`update the ${target} of this expense`}),
          "type": "fadeout",
          "timer": 10000,
          "buttonsmode": "got_it",
          "container_classes":["show_toast"]
        };
        showToaster(toast_options);
      }
      hideElement(form);
      displayElement(cardDataContainer);
    });
  }
};
//update expense data handler
const updateDataHandler = (update_field, inputField, label, expense = self.thisExpense) => {
  let valid_data = [];
  let newvalue;
  let currentvalue;
  let isvalid = true;
  let is_current = false;
  if(update_field==="category"){
    newvalue = decodeEntities(inputField.value).toLowerCase();
    currentvalue = expense.category;
  }else if (update_field==="amount") {
    newvalue = inputField.value;
    if(newvalue === '' || isNaN(newvalue)){
      newvalue = inputField.placeholder;
    }
    isvalid = simpleAmountValidation(newvalue, label);
    if (isvalid) {
      newvalue = parseFloat(newvalue);
    }
    currentvalue = expense.amount;
  }else if (update_field==="payment") {
    newvalue = decodeEntities(inputField.value).toLowerCase();
    currentvalue = expense.payment;
  }else if (update_field==="date") {
    newvalue = inputField.innerHTML.split("/").reverse().join("-");
    currentvalue = expense.expense_date;
  }else if (update_field==="time") {
    newvalue = inputField.innerHTML;
    currentvalue = expense.expense_time;
  }else if (update_field==="location") {
    newvalue = decodeEntities(inputField.value).toLowerCase();
    isvalid = optionalLocationValidation(newvalue, label);
    currentvalue = expense.location;
    if (newvalue.replace(/\s+/, "") === '') {
      newvalue = "--";
    }
  }else if (update_field==="store") {
    newvalue = decodeEntities(inputField.value).toLowerCase();
    isvalid = optionalAdvancedTextInputValidation(newvalue, label);
    currentvalue = expense.store;
    if (newvalue.replace(/\s+/, "") === '') {
      newvalue = "--";
    }
  }else if (update_field==="comments") {
    newvalue = decodeEntities(inputField.value).toLowerCase();
    isvalid = optionalAdvancedTextInputValidation(newvalue, label);
    currentvalue = expense.comments;
    if (newvalue.replace(/\s+/, "") === '') {
      newvalue = "--";
    }
  }
  if(newvalue===currentvalue){
    is_current = true;
  }
  valid_data['newvalue'] = newvalue;
  valid_data['is_valid'] = isvalid;
  valid_data['is_current'] = is_current;
  return valid_data;
};
//open close forms
const toggleForm = (event, allforms = self.expenseForms, expense = self.thisExpense) => {
  event.preventDefault();
  const targetID = event.target.id;
  const action = targetID.split("_")[0];
  const target = targetID.split("_").pop();
  const openForm = document.getElementById(`form_${target}`);
  const cardDataContainer = document.getElementById(`cardDataContainer_${target}`);
  if (action==="edit") {
    if (target==="category") {
      const selectedOption = decodeEntities(expense.category);
      initCategorySelectBox(selectedOption);
      const label = document.querySelectorAll('.expense_category_label')[0];
      hideElement(label);
    }else if (target==="amount") {
      initAmountForm(expense);
    }else if (target==="payment") {
      initPaymentForm(decodeEntities(expense.payment));
    }else if (target==="date") {
      initDateForm(expense);
    }else if (target==="time") {
      initTimeForm(expense);
    }else if (target==="location") {
      initLocationForm(expense);
    }else if (target==="store") {
      initStoreForm(expense);
    }else if (target==="comments") {
      initCommentsForm(expense);
    }
    hideElement(cardDataContainer);
    displayElement(openForm);
    cardButtonHandler('expense', target, 'open', 3);
    closeAllOtherForms(`form_${target}`, allforms, closeOneForm);
  }else{
    closeOneForm(target);
  }
};
//close one form
const closeOneForm = (id) => {
  const form = document.getElementById(`form_${id}`);
  const cardDataContainer = document.getElementById(`cardDataContainer_${id}`);
  hideElement(form);
  displayElement(cardDataContainer);
  cardButtonHandler('expense', id, 'close', 3);
};
//initialize category form
const initCategoryForm = (selectedOption, categoriesOptions = self.categoriesOptions) => {
  initCategorySelectBox(categoriesOptions, selectedOption);
  const label = document.querySelectorAll('.expense_category_label')[0];
  hideElement(label);
};
//initialize category select box
const initCategorySelectBox = (selectedOption, categoriesOptions = self.categoriesOptions, expenseForms = self.expenseForms) => {
  const categoryForm = expenseForms[0];
  const categoryFormElements = categoryForm.childNodes;
  if (categoryFormElements.length>0) {
    categoryFormElements[0].remove();
  }
  const selectbox = createSelectBox('category_select', categoriesOptions, 'selectBoxContainer', 'input_tag select_tag', '', 'expense_category_input',  'category', selectedOption, 'expense_category_label');
  categoryForm.insertBefore(selectbox, categoryForm.childNodes[0]);
  const categorySelectBox = document.getElementById('category_select');
  initSelectBox(categorySelectBox, selectedOption);
};
//initialize amount form
const initAmountForm = (expense, expenseForms = self.expenseForms) => {
  const labels = document.querySelectorAll('.expense_amount_label');
  const formFields = document.querySelectorAll('.expense_amount_input');
  clearAppForm(labels, formFields);
  formFields[0].placeholder = getDisplayFormat(expense.amount);
};
//initialize payment form
const initPaymentForm = (selectedOption, categoriesOptions = self.categoriesOptions) => {
  initPaymentSelectBox(selectedOption);
  const label = document.querySelectorAll('.expense_payment_label')[0];
  hideElement(label);
};
//initialize category select box
const initPaymentSelectBox = (selectedOption, expenseForms = self.expenseForms) => {
  const paymentMethods = ['cash', 'credit card', 'debit card', 'prepaid card', 'gift card', 'bank transfer', 'check', 'mobile payment', 'web payment'];
  const paymentForm = expenseForms[2];
  const paymentFormElements = paymentForm.childNodes;
  if (paymentFormElements.length>0) {
    paymentFormElements[0].remove();
  }
  const selectbox = createSelectBox('payment_select', paymentMethods, 'selectBoxContainer', 'input_tag select_tag', '', 'expense_payment_input',  'payment', selectedOption, 'expense_payment_label');
  paymentForm.insertBefore(selectbox, paymentForm.childNodes[0]);
  const paymentSelectBox = document.getElementById('payment_select');
  initSelectBox(paymentSelectBox, selectedOption);
};
//initialize date form
const initDateForm = (expense, expenseForms = self.expenseForms) => {
  const labels = document.querySelectorAll('.expense_date_label');
  const formFields = document.querySelectorAll('.expense_date_input');
  clearAppForm(labels, formFields);
  formFields[0].placeholder = expense.expense_date.split("-").reverse().join("/");
  const dayPicker = document.getElementById('datePick');
  const dayPickerInput = document.getElementById('datepickerInput');
  dayPickerInput.innerHTML = expense.expense_date.split("-").reverse().join("/");
  dayPickerInput.classList.remove('has_selected_datetime');
  const today = new Date();
  const startingDay = new Date(expense.expense_date);
  const pickerDates = getPickerDates(startingDay, getSpecificDate(today, -60), today);
  initDatePickerCalendar(self.expenseCalendar, dayPicker, pickerDates, dayPickerInput);
};
//initialize time form
const initTimeForm = (expense) => {
  const labels = document.querySelectorAll('.expense_time_label');
  const formFields = document.querySelectorAll('.expense_time_input');
  formFields[0].classList.remove('has_selected_datetime');
  formFields[0].innerHTML=getNowTime();
  clearAppForm(labels, formFields);
};
//initialize location form
const initLocationForm = (expense) => {
  let location = decodeEntities(expense.location)===''?'Add Location':decodeEntities(expense.location);
  const labels = document.querySelectorAll('.expense_location_label');
  const formFields = document.querySelectorAll('.expense_location_input');
  clearAppForm(labels, formFields);
  formFields[0].placeholder = location;
};
//initialize store form
const initStoreForm = (expense) => {
  const store = decodeEntities(expense.store)===''?'Add Store':decodeEntities(expense.store);
  const labels = document.querySelectorAll('.expense_store_label');
  const formFields = document.querySelectorAll('.expense_store_input');
  clearAppForm(labels, formFields);
  formFields[0].placeholder = store;
};
//initialize _comments form
const initCommentsForm = (expense) => {
  const comments = decodeEntities(expense.comments)===''?'Write your comments here':decodeEntities(expense.comments);
  const labels = document.querySelectorAll('.expense_comments_label');
  const formFields = document.querySelectorAll('.expense_comments_input');
  clearAppForm(labels, formFields);
  formFields[0].placeholder = comments;
};
//load payment icon
const loadPaymentIcon = (expensePayment) => {
  const paymentIcon = document.getElementById('paymentIcon');
  paymentIcon.className = "payment_icon";
  if (expensePayment==="cash") {
    paymentIcon.classList.add("fas", "fa-coins", "cashpayment");
  }else if (expensePayment.split(" ").pop()==="card") {
    paymentIcon.classList.add("far", "fa-credit-card", "cardpayment");
  }else if (expensePayment.split(" ")[0]==="mobile") {
    paymentIcon.classList.add("fas", "fa-mobile-alt", "mobilepayment");
  }else if (expensePayment.split(" ")[0]==="web") {
    paymentIcon.classList.add("fas", "fa-globe", "webpayment");
  }else{
    paymentIcon.classList.add("fas", "fa-money-check", "checkpayment");
  }
};
//instant amount validation for amount forms
const instantAmountValidation = (form) => {
  form.addEventListener('keyup', (event) => {
    const element = event.target;
    const formelement = element.tagName;
    if(formelement==='INPUT'){
      const inputname = element.name;
      const inputvalue = element.value;
      const id = inputname.split("_").pop();
      const lbl = document.querySelector('[for='+`${inputname}`+']');
      if(inputname==='budget_amount' || inputname==='editamount_input' || inputname==='goal_amount'){
        amountValidation(inputvalue, element, lbl);
      }else if (inputname===`editgoal_input_${id}`) {
        amountValidation(inputvalue, element, lbl);
      }
    }
  });
};
