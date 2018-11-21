"use strict";
let expenseCalendar, today, categoriesOptions, openedSections, addExpenseForm, dayPickerInput;
window.addEventListener('keydown', (event)=>{
  if(event.keyIdentifier=='U+000A' || event.keyIdentifier=='Enter' || event.keyCode==13){
    if(event.target.nodeName=='INPUT' || event.target.nodeName=='TEXTAREA'){
      addExpense(event);
    }
  }
});
//initialize add expense view
const renderAddExpense = (categories) => {
  self.categoriesOptions = [];
  prepareMain("clear");
  categories.sort((item_a, item_b)=>{
    return sortByName(item_a, item_b, 'asc');
  });
  categories.forEach(category => {
    if(!self.categoriesOptions.includes(category.name)){
      self.categoriesOptions[self.categoriesOptions.length] = category.name;
    }
  });
  self.openedSections = 0;
  createAddExpenseHTMLContent();
  self.addExpenseForm = document.getElementById('add_expense');
  hideElement(self.addExpenseForm);
  initializeFormDislay();
  hideLoader();
  if (!self.userInfo.has_current_budget) {
    showBudgetNotification();
  }
};
/*
* ACTIONS & BEHAVIOR
*/
//initialize form
const initializeFormDislay = (personalInfo=self.userInfo) => {
  let pickerDates;
  const today_date = new Date();
  let startday = personalInfo.registration_date.split(" ")[0];
  startday = getSpecificDate(startday, -6);
  pickerDates = getPickerDates(today_date, startday, today_date);
  const todayparts = getDateParts(today_date);
  const dayPickerContainer = document.getElementById('expSection_Date');
  const dayPicker = document.getElementById('expDatePick');
  self.dayPickerInput = document.getElementById('datepickerInput');
  self.today = todayparts[0]+"/"+todayparts[1]+"/"+todayparts[2];
  self.dayPickerInput.innerHTML = todayparts[0]+"/"+todayparts[1]+"/"+todayparts[2];
  initDatePickerCalendar(self.expenseCalendar, dayPicker, pickerDates, self.dayPickerInput);
  intCategorySelectBox();
  initPaymentSelectBox();
  self.moreSectionsContainer = document.getElementById('more_wrapper');
  self.addExpenseForm.addEventListener('keyup', (event) => {
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
//open section menu - actually create it dynamically
const openSectionMenu = (event, addExpenseForm = self.addExpenseForm, moreSectionsContainer = self.moreSectionsContainer) => {
  let menubtns = ['time', 'store', 'location', 'comments'];
  if (moreSectionsContainer.childNodes.length>0) {//some sections are alredy open
    const moreTags = document.querySelectorAll('.more_tag');
    let existingtags = [];
    for (let i = 0; i < moreTags.length; i++) {//create array with existing sections
      existingtags[existingtags.length] = moreTags[i].innerHTML.toLowerCase();
    }
    let menubtns_toshow = [];
    for (let i = 0; i < menubtns.length; i++) {//create array with sections that do not exist
      if (!existingtags.includes(menubtns[i])) {
        menubtns_toshow[menubtns_toshow.length] = menubtns[i];
      }
    }
    //clear menu buttons and display the appropriate ones only
    menubtns = [];
    menubtns = menubtns_toshow;
  }
  const form_opacity = document.createElement('div');
  form_opacity.setAttribute('id', 'form_opacity');
  form_opacity.classList.add('form_opacity');
  addExpenseForm.append(form_opacity);
  const form_menu = createFormMenu(menubtns);
  addExpenseForm.insertBefore(form_menu, addExpenseForm.childNodes[1]);
  const menu = document.getElementById('form_menu');
  menu.focus();
  menu.addEventListener('keydown', trapFormMenuKeys);
};
//trap navigaton inside the menu card:
const trapFormMenuKeys = (event)=> {
  const focusableElements = document.querySelectorAll('.formMenuBtn');
  const firstTabStop = focusableElements[0];
  const lastTabStop = focusableElements[focusableElements.length - 1];
  // Check for TAB key press
  if (event.keyCode === 9) {
    // SHIFT + TAB
    if (event.shiftKey) {
      if (document.activeElement === firstTabStop) {
        event.preventDefault();
        lastTabStop.focus();
      }
    // TAB
    } else {
      if (document.activeElement === lastTabStop) {
        event.preventDefault();
        firstTabStop.focus();
      }
    }
  }
  // ESCAPE
  if (event.keyCode === 27) {
    closeSectionMenu(event);
  }
};
//close section menu in form - actually remove it
const closeSectionMenu = (event, addExpenseForm = self.addExpenseForm) => {
  removeSectionMenu();
};
//remove form menu
const removeSectionMenu = () => {
  const form_menu = document.querySelectorAll('.form_menu');
  const form_opacity = document.querySelectorAll('.form_opacity');
  if (form_menu.length>0 && form_opacity.length>0) {
    form_menu[0].remove();
    form_opacity[0].remove();
  }
};
//add section to form
const addExpSection = (event, moreSectionsContainer = self.moreSectionsContainer) => {
  event.preventDefault();
  const id = event.target.id.split("_").pop();
  const button = document.getElementById(`addExpBtn_${id}`);
  const section = document.querySelectorAll(`.expSection_${id}`);
  if (section.length===0) {
    if(id==="time"){
      moreSectionsContainer.append(createTimeSection());
      const timePicker = document.getElementById('timePicker');
      const timePickerInput = document.getElementById('timePickerInput');
      initTimePicker(timePicker, timePickerInput, getNowTime());
    }else{
      moreSectionsContainer.append(createCommonSection(id));
    }
    self.openedSections++;
    button.remove();
  }
  if (self.openedSections===4) {
    removeSectionMenu();
    hideElement(document.getElementById('formMenuBtn'));
  }
};
//close section from form
const closeExpSection = (event) => {
  event.preventDefault();
  const id = event.target.id.split("_").pop();
  const section = document.querySelectorAll(`.expSection_${id}`);
  section[0].remove();
  self.openedSections--;
  if (self.openedSections!=4) {
    displayElement(document.getElementById('formMenuBtn'));
  }
};
//reset expense form
const resetExpense = (event, main = self.main) => {
  document.getElementById('add_expense').remove();
  main.append(createExpenseForm());
  initializeFormDislay();
};
//reset expense form
const clearExpenseForm = (labels, formFields, moreSectionsContainer = self.moreSectionsContainer) => {
  clearAppForm(labels, [formFields[0]]);
  formFields[3].classList.remove('has_selected_datetime');
  moreSectionsContainer.innerHTML = "";
  self.openedSections = 0;
  displayElement(document.getElementById('formMenuBtn'));
};
//add expense
const addExpense = (event) => {
  event.preventDefault();
  const labels = document.querySelectorAll('.expense_label');
  const formFields = document.querySelectorAll('.expense_input');
  const amount = formFields[0].value.toString();
  let category = formFields[1].value.toString().trim().toLowerCase();
  let payment = formFields[2].value.toString().trim();
  const date = formFields[3].innerHTML.toString().trim();
  let time = getNowTime();
  let store = "";
  let location = "";
  let comments = "";
  const blobselects = document.querySelectorAll('.blobselect-selection');
  if (category.replace(/\s+/, "") === ''){
    category=blobselects[0].getAttribute('data-value').toLowerCase();
  }
  if (payment.replace(/\s+/, "") === ''){
    payment=blobselects[1].getAttribute('data-value').toLowerCase();
  }
  const valid_amount = simpleAmountValidation(amount, labels[0]);
  let valid_store = true;
  let valid_location = true;
  let valid_comments = true;
  if (formFields.length>0) {
    for (var i = 4; i < formFields.length; i++) {
      let fieldname = formFields[i].getAttribute('name');
      let lbl = document.querySelector('[for='+`${fieldname}`+']');
      if (fieldname==="expense_location") {
        location = formFields[i].value.trim();
        valid_location = locationValidation(location, lbl);
      }else if (fieldname==="expense_store") {
        store = formFields[i].value.trim();
        valid_store = optionalTextInputValidation(store, lbl);
      }else if (fieldname==="expense_comments") {
        comments = formFields[i].value.trim();
        valid_comments = optionalTextInputValidation(comments, lbl);
      }
    }
  }
  if(valid_amount===true && valid_location===true && valid_store===true && valid_comments===true){
    const data = {
      "amount": parseFloat(amount),
      "category": decodeEntities(category),
      "payment":payment.toLowerCase(),
      "date": date.split("/").reverse().join("-"),
      "time":time,
      "location":location.toLowerCase(),
      "store":store.toString(),
      "comments":comments.toLowerCase(),
      "request_type": "add_expense"
    }
    clearExpenseForm(labels, formFields);
    sendData('addUserExpense', data).then((response)=>{
      if(response.message==="invalid_request"){
        invalidRequestHandler(data);
      }else{
        const toast_options = {
          "message": "",
          "type": "fadeout",
          "timer": 9000,
          "buttonsmode": "got_it",
          "container_classes":["show_toast"]
        };
        if(response.message==="success"){
          toast_options.message = messageGenerator({initiator:"addexpense", message_type:"success"});
          toast_options.buttonsmode = "myexpenses";
        }else{
          toast_options.message = messageGenerator({initiator:"addexpense", message_type:"else_error", error_part:"add your expense"});
          toast_options.timer = 8000;
        }
        showToaster(toast_options);
      }
    });
  }
};
