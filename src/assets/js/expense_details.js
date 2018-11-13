"use strict";
window.addEventListener('keydown', (event)=>{
  if(event.keyIdentifier=='U+000A' || event.keyIdentifier=='Enter' || event.keyCode==13){
    if(event.target.nodeName=='INPUT' || event.target.nodeName=='TEXTAREA'){
      updateExpense(event);
    }
  }
});
let thisExpense, categoriesOptions, expenseIndex;
//initialize expense details view
const initExpenseDetailsView = (personalInfo, expenses, categories) => {
  const expense_in_url = getParameterByName("expense");
  if (expense_in_url==="null") {
    redirectUser(pages.my_expenses.url);
  }else{
    createExpenseCard();
    const expense_params = expense_in_url.split("_");
    const parameterID = expense_params[0];
    const expense_index = expense_params[1];
    self.expenseIndex = expense_index;
    self.thisExpense = expenses.filter((r) => r.id === parseInt(parameterID))[0];
    let currentCategories = [];
    categories.forEach(category => {
      if(!currentCategories.includes(category.name)){
        currentCategories[currentCategories.length] = category.name;
      }
    });
    self.categoriesOptions = [];
    self.categoriesOptions = currentCategories.sort();
    self.thisExpense.expense_index = expense_index;
    const formFields = document.querySelectorAll('.expense_time_input');
    const timePickerInput = formFields[0];
    const timePicker = document.getElementById('timePicker');
    initTimePicker(timePicker, timePickerInput, self.thisExpense.expense_time);
    initExpenseCard(self.thisExpense);
    hideLoader();
    if (personalInfo.has_current_budget==="no") {
      showBudgetNotification();
    }
  }
};
//create expense card
const createExpenseCard = (main = self.main) => {
  const expenseCard = document.createElement('div');
  expenseCard.setAttribute('id', 'expenseCard');
  expenseCard.classList.add('expenseCard', 'hidden');
  const expense_header = document.createElement('p');
  expense_header.setAttribute('id', 'expense_header');
  expense_header.innerHTML =  `expense #<span id='expense_index' class='cardData'></span>`;
  const categorySection = createCategorySection();
  const amountSection = createAmountSection();
  const paymentSection = createPaymentSection();
  const dateSection = createDateSection();
  const timeSection = createTimeSection();
  const locationSection = createCommonSection("location");
  const storeSection = createCommonSection("store");
  const commentsSection = createCommentsSection();
  expenseCard.append(expense_header, categorySection, amountSection, paymentSection, dateSection, timeSection, locationSection, storeSection, commentsSection);
  main.append(expenseCard);
};
//create catergory section
const createCategorySection = () => {
  const section = document.createElement('div');
  section.classList.add('expenseCardSection');
  const edit_btn = createEditButton('expense', 'category', toggleForm);
  edit_btn.classList.add('editBtn');
  const cancel_btn = createCancelButton('expense', 'category', toggleForm);
  cancel_btn.classList.add('editBtn');
  const save_btn = createSaveButton('expense', 'category', updateExpense);
  save_btn.classList.add('editBtn');
  const section_header = document.createElement('p');
  section_header.classList.add('section_header');
  section_header.innerHTML="category";
  const data_container = document.createElement('div');
  data_container.classList.add('centeredFlexbox', 'cardDataContainer');
  data_container.setAttribute('id', 'cardDataContainer_category');
  const category_icon = document.createElement('div');
  category_icon.classList.add('category_icon');
  const expense_data = document.createElement('p');
  expense_data.classList.add('cardData', 'expense_data');
  expense_data.setAttribute('id', 'expense_data_category');
  data_container.append(category_icon, expense_data);
  const form = document.createElement('form');
  form.setAttribute('id', 'form_category');
  form.classList.add('expenseForm', 'hidden');
  section.append(edit_btn, section_header, data_container, form, cancel_btn, save_btn);
  return section;
};
//create amount section
const createAmountSection = () => {
  const section = document.createElement('div');
  section.classList.add('expenseCardSection');
  const edit_btn = createEditButton('expense', 'amount', toggleForm);
  edit_btn.classList.add('editBtn');
  const cancel_btn = createCancelButton('expense', 'amount', toggleForm);
  cancel_btn.classList.add('editBtn');
  const save_btn = createSaveButton('expense', 'amount', updateExpense);
  save_btn.classList.add('editBtn');
  const section_header = document.createElement('p');
  section_header.classList.add('section_header');
  section_header.innerHTML="amount";
  const data_container = document.createElement('div');
  data_container.classList.add('centeredFlexbox', 'cardDataContainer');
  data_container.setAttribute('id', 'cardDataContainer_amount');
  const icon = document.createElement('div');
  icon.classList.add('fas', 'fa-euro-sign');
  icon.setAttribute('id', 'amountIcon');
  const expense_data = document.createElement('p');
  expense_data.classList.add('cardData', 'expense_data');
  expense_data.setAttribute('id', 'expense_data_amount');
  data_container.append(icon, expense_data);
  const form = document.createElement('form');
  form.setAttribute('id', 'form_amount');
  form.classList.add('expenseForm', 'hidden');
  const expenseFormSection = document.createElement('div');
  expenseFormSection.className = "expenseFormSection";
  const amount_input = createAmountInput('enter expense amount', 'expense_amount', 'expense_amount_input', 'expense_amount');
  const label = createLabel('expense_amount');
  label.classList.add('expense_amount_label');
  expenseFormSection.append(amount_input, label);
  form.append(expenseFormSection);
  section.append(edit_btn, section_header, data_container, form, cancel_btn, save_btn);
  return section;
};
//create payment section
const createPaymentSection = () => {
  const section = document.createElement('div');
  section.classList.add('expenseCardSection');
  const edit_btn = createEditButton('expense', 'payment', toggleForm);
  edit_btn.classList.add('editBtn');
  const cancel_btn = createCancelButton('expense', 'payment', toggleForm);
  cancel_btn.classList.add('editBtn');
  const save_btn = createSaveButton('expense', 'payment', updateExpense);
  save_btn.classList.add('editBtn');
  const section_header = document.createElement('p');
  section_header.classList.add('section_header');
  section_header.innerHTML="payment method";
  const data_container = document.createElement('div');
  data_container.classList.add('centeredFlexbox', 'cardDataContainer');
  data_container.setAttribute('id', 'cardDataContainer_payment');
  const icon = document.createElement('div');
  icon.classList.add('payment_icon');
  icon.setAttribute('id', 'paymentIcon');
  const expense_data = document.createElement('p');
  expense_data.classList.add('cardData', 'expense_data');
  expense_data.setAttribute('id', 'expense_data_payment');
  data_container.append(icon, expense_data);
  const form = document.createElement('form');
  form.setAttribute('id', 'form_payment');
  form.classList.add('expenseForm', 'hidden');
  section.append(edit_btn, section_header, data_container, form, cancel_btn, save_btn);
  return section;
};
//create section location and store
const createCommonSection = (section_name) => {
  const section = document.createElement('div');
  section.classList.add('expenseCardSection');
  const edit_btn = createEditButton('expense', section_name, toggleForm);
  edit_btn.classList.add('editBtn');
  const cancel_btn = createCancelButton('expense', section_name, toggleForm);
  cancel_btn.classList.add('editBtn');
  const save_btn = createSaveButton('expense', section_name, updateExpense);
  save_btn.classList.add('editBtn');
  const section_header = document.createElement('p');
  section_header.classList.add('section_header');
  section_header.innerHTML=section_name;
  const data_container = document.createElement('div');
  data_container.classList.add('centeredFlexbox', 'cardDataContainer');
  data_container.setAttribute('id', `cardDataContainer_${section_name}`);
  const icon = document.createElement('div');
  if (section_name==="location") {
    icon.classList.add('fas', 'fa-map-marker-alt');
  }else {
    icon.classList.add('fas', 'fa-clock');
  }
  icon.setAttribute('id', `${section_name}Icon`);
  const expense_data = document.createElement('p');
  expense_data.classList.add('cardData', 'expense_data');
  expense_data.setAttribute('id', `expense_data_${section_name}`);
  data_container.append(icon, expense_data);
  const form = document.createElement('form');
  form.setAttribute('id', `form_${section_name}`);
  form.classList.add('expenseForm', 'hidden');
  const expenseFormSection = document.createElement('div');
  expenseFormSection.className = "expenseFormSection";
  const input = createInput('text', capitalizeFirstLetter(section_name), 'enter expense '+section_name, `expense_${section_name}`, `${section_name}_inpt_id`);
  input.classList.add(`expense_${section_name}_input`);
  const label = createLabel(`expense_${section_name}`);
  label.classList.add(`expense_${section_name}_label`);
  expenseFormSection.append(input, label);
  form.append(expenseFormSection);
  section.append(edit_btn, section_header, data_container, form, cancel_btn, save_btn);
  return section;
};
//create date section
const createDateSection = () => {
  const section = document.createElement('div');
  section.classList.add('expenseCardSection');
  const edit_btn = createEditButton('expense', 'date', toggleForm);
  edit_btn.classList.add('editBtn');
  const cancel_btn = createCancelButton('expense', 'date', toggleForm);
  cancel_btn.classList.add('editBtn');
  const save_btn = createSaveButton('expense', 'date', updateExpense);
  save_btn.classList.add('editBtn');
  const section_header = document.createElement('p');
  section_header.classList.add('section_header');
  section_header.innerHTML="date";
  const data_container = document.createElement('div');
  data_container.classList.add('centeredFlexbox', 'cardDataContainer');
  data_container.setAttribute('id', 'cardDataContainer_date');
  const icon = document.createElement('div');
  icon.classList.add('far', 'fa-calendar-alt');
  icon.setAttribute('id', 'dateIcon');
  const expense_data = document.createElement('p');
  expense_data.classList.add('cardData', 'expense_data');
  expense_data.setAttribute('id', 'expense_data_date');
  data_container.append(icon, expense_data);
  const form = document.createElement('form');
  form.setAttribute('id', 'form_date');
  form.classList.add('expenseForm', 'hidden');
  const expenseFormSection = document.createElement('div');
  expenseFormSection.className = "expenseFormSection";
  expenseFormSection.setAttribute('id', 'expenseFormSectionDate');
  const picker = document.createElement('div');
  picker.classList.add("pickerContainer");
  picker.setAttribute('id', 'datePick');
  picker.setAttribute('tabindex', 0);
  picker.setAttribute('aria-label', 'date picker');
  const pickerinp = document.createElement('span');
  pickerinp.classList.add("expense_input", "expense_date_input");
  pickerinp.setAttribute('id', 'datepickerInput');
  pickerinp.setAttribute('aria', 'enter date of expense');
  pickerinp.setAttribute('name', 'expense_date');
  pickerinp.innerHTML = "dd/mm/yyyy";
  const pickercalendar = document.createElement('i');
  pickercalendar.classList.add("calendar", "fas", "fa-calendar-alt");
  picker.append(pickerinp, pickercalendar);
  const label = createLabel('datePick');
  label.classList.add('expense_date_label');
  expenseFormSection.append(picker, label);
  form.append(expenseFormSection);
  section.append(edit_btn, section_header, data_container, form, cancel_btn, save_btn);
  return section;
};
//create time section
const createTimeSection = () => {
  const section = document.createElement('div');
  section.classList.add('expenseCardSection');
  const edit_btn = createEditButton('expense', 'time', toggleForm);
  edit_btn.classList.add('editBtn');
  const cancel_btn = createCancelButton('expense', 'time', toggleForm);
  cancel_btn.classList.add('editBtn');
  const save_btn = createSaveButton('expense', 'time', updateExpense);
  save_btn.classList.add('editBtn');
  const section_header = document.createElement('p');
  section_header.classList.add('section_header');
  section_header.innerHTML="time";
  const data_container = document.createElement('div');
  data_container.classList.add('centeredFlexbox', 'cardDataContainer');
  data_container.setAttribute('id', 'cardDataContainer_time');
  const icon = document.createElement('div');
  icon.classList.add('fas', 'fa-clock');
  icon.setAttribute('id', 'timeIcon');
  const expense_data = document.createElement('p');
  expense_data.classList.add('cardData', 'expense_data');
  expense_data.setAttribute('id', 'expense_data_time');
  data_container.append(icon, expense_data);
  const form = document.createElement('form');
  form.setAttribute('id', 'form_time');
  form.classList.add('expenseForm', 'hidden');
  const expenseFormSection = document.createElement('div');
  expenseFormSection.className = "expenseFormSection";
  const picker = document.createElement('div');
  picker.classList.add("pickerContainer");
  picker.setAttribute('id', 'timePicker');
  picker.setAttribute('tabindex', 0);
  picker.setAttribute('aria-label', 'time picker');
  const pickerinp = document.createElement('span');
  pickerinp.classList.add("expense_time_input");
  pickerinp.setAttribute('id', 'timePickerInput');
  pickerinp.setAttribute('aria', 'enter time of expense');
  pickerinp.setAttribute('name', 'expense_time');
  pickerinp.innerHTML = 'hh:mm';
  const pickerClock = document.createElement('i');
  pickerClock.classList.add("pickerClock", "fas", "fa-clock");
  picker.append(pickerinp, pickerClock);
  const label = createLabel('expense_time');
  label.classList.add('expense_time_label');
  expenseFormSection.append(picker, label);
  form.append(expenseFormSection);
  section.append(edit_btn, section_header, data_container, form, cancel_btn, save_btn);
  return section;
};
//create comments section
const createCommentsSection = () => {
  const section = document.createElement('div');
  section.classList.add('expenseCardSection');
  const edit_btn = createEditButton('expense', 'comments', toggleForm);
  edit_btn.classList.add('editBtn');
  const cancel_btn = createCancelButton('expense', 'comments', toggleForm);
  cancel_btn.classList.add('editBtn');
  const save_btn = createSaveButton('expense', 'comments', updateExpense);
  save_btn.classList.add('editBtn');
  const section_header = document.createElement('p');
  section_header.classList.add('section_header');
  section_header.innerHTML="comments";
  const data_container = document.createElement('div');
  data_container.classList.add('centeredFlexbox', 'cardDataContainer');
  data_container.setAttribute('id', 'cardDataContainer_comments');
  const icon = document.createElement('div');
  icon.classList.add('fas', 'fa-font');
  icon.setAttribute('id', 'commentsIcon');
  const expense_data = document.createElement('p');
  expense_data.classList.add('cardData', 'expense_data');
  expense_data.setAttribute('id', 'expense_data_comments');
  data_container.append(icon, expense_data);
  const form = document.createElement('form');
  form.setAttribute('id', 'form_comments');
  form.classList.add('expenseForm', 'hidden');
  const expenseFormSection = document.createElement('div');
  expenseFormSection.classList.add("expenseFormSection", "commentsFormSection");
  const input = createTextareaInput('Write your comments here', 'enter comments for expense', 'exp_comments', 'expComments');
  input.classList.add("expense_comments_input");
  const label = createLabel('exp_comments');
  label.classList.add('expense_comments_label');
  expenseFormSection.append(input, label);
  form.append(expenseFormSection);
  section.append(edit_btn, section_header, data_container, form, cancel_btn, save_btn);
  return section;
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
          "expense_index": self.expenseIndex
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
