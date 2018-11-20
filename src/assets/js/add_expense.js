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
const initAddExpenseView = (personalInfo, categories) => {
  self.categoriesOptions = [];
  categories.forEach(category => {
    if(!self.categoriesOptions.includes(category.name)){
      self.categoriesOptions[self.categoriesOptions.length] = category.name;
    }
  });
  self.openedSections = 0;
  self.userInfo = personalInfo;
  createAddExpenseHTMLContent();
  self.addExpenseForm = document.getElementById('add_expense');
  hideElement(self.addExpenseForm);
  initializeFormDislay();
  hideLoader();
  const budgetIndicator = personalInfo.has_current_budget==='no'?false:true;
  if (budgetIndicator===false) {
    showBudgetNotification();
  }
};
//create view
const createAddExpenseHTMLContent = (main = self.main) => {
  const h2 = document.createElement('h2');
  h2.innerHTML = "Add your expenses here by completing the following form";
  const p = document.createElement('p');
  const p_span = document.createElement('span');
  p_span.innerHTML = 'Amount, category, payment method and date are required!';
  const pia = document.createElement('i');
  pia.innerHTML = 'If you wish to keep a more detailed record of your expenses, add and complete sections in the form!';
  pia.className = "noteForForm";
  const pib = document.createElement('i');
  pib.innerHTML = '(add a section by selecting one from the form menu)';
  pib.className = "noteForSec";
  p.append(p_span, pia, pib);
  main.append(h2, p, createExpenseForm());
};
//create expense form with basic and necessary elements
const createExpenseForm = () => {
  const form = document.createElement('form');
  form.setAttribute('id', 'add_expense');
  form.classList.add('centeredFlexbox', 'form_style');
  const form_tag = document.createElement('p');
  form_tag.innerHTML = "Add expense";
  form_tag.className = "form_tag";
  const basic_container = document.createElement('div');
  basic_container.setAttribute('id', 'basic_wrapper');
  basic_container.classList.add('form_wrapper');
  const amount_section = createAmountSection();
  const date_section = createDateSection();
  const more_container = document.createElement('div');
  more_container.setAttribute('id', 'more_wrapper');
  const resetExpBtn = createButton('resetExpBtn', 'clear form', 'reset form', resetExpense);
  resetExpBtn.classList.add("formBtn", "expFormBtn");
  const saveExpBtn = createButton('saveExpBtn', 'save expense', 'save expense', addExpense);
  saveExpBtn.classList.add("formBtn", "expFormBtn");
  const menuBtn = createButton('formMenuBtn', '', 'open menu to add new section', openSectionMenu);
  menuBtn.classList.add("round_btn", "fas", "fa-ellipsis-v");
  menuBtn.setAttribute('title', 'open menu to add new section');
  basic_container.append(amount_section, date_section);
  form.append(menuBtn, form_tag, basic_container, more_container, resetExpBtn, saveExpBtn);
  return form;
};
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
//create amount section in form
const createAmountSection = () => {
  const container = document.createElement('div');
  container.classList.add('expenseFormSection');
  const tag = document.createElement('p');
  tag.innerHTML = "Amount";
  tag.classList.add('input_tag');
  const amountinput = createAmountInput('enter amount of expense', 'expense_amount', 'expense_input', 'expense_amount');
  const label = createLabel('expense_amount');
  label.classList.add('expense_label');
  container.append(tag, amountinput, label);
  return container;
};
//create date section in form
const createDateSection = () => {
  const container = document.createElement('div');
  container.classList.add('expenseFormSection');
  const tag = document.createElement('p');
  tag.innerHTML = "Date";
  tag.classList.add('input_tag');
  const picker = document.createElement('div');
  picker.classList.add("pickerContainer");
  picker.setAttribute('id', 'expDatePick');
  picker.setAttribute('tabindex', 0);
  picker.setAttribute('aria-label', 'date picker');
  const pickerinp = document.createElement('span');
  pickerinp.classList.add("expense_input");
  pickerinp.setAttribute('id', 'datepickerInput');
  pickerinp.setAttribute('aria', 'enter date of expense');
  pickerinp.setAttribute('name', 'expense_date');
  pickerinp.innerHTML = "dd/mm/yyyy";
  const pickercalendar = document.createElement('i');
  pickercalendar.classList.add("calendar", "fas", "fa-calendar-alt");
  picker.append(pickerinp, pickercalendar);
  const label = createLabel('expense_date');
  label.classList.add('expense_label');
  container.append(tag, picker, label);
  return container;
};
//initialize category select box
const intCategorySelectBox = (categories = self.categoriesOptions) => {
  const selectbox = createSelectBox('category_select', categories.sort(), 'expenseCategoryContainer', 'input_tag select_tag', 'Category', 'expense_input', 'category', categories[0], 'expense_label');
  const container = document.getElementById('basic_wrapper');
  container.insertBefore(selectbox, container.childNodes[1]);
  const addCategorySelectBox = document.getElementById('category_select');
  initSelectBox(addCategorySelectBox, categories[0]);
};
//initialize payment select box
const initPaymentSelectBox = () => {
  const paymentMethods = ['cash', 'credit card', 'debit card', 'prepaid card', 'gift card', 'bank transfer', 'check', 'mobile payment', 'web payment'];
  const selectbox = createSelectBox('payment_select', paymentMethods,'expensePaymentContainer', 'input_tag select_tag', 'Payment', 'expense_input', 'category', paymentMethods[0], 'expense_label');
  const container = document.getElementById('basic_wrapper');
  container.insertBefore(selectbox, container.childNodes[2]);
  const addPaymentSelectBox = document.getElementById('payment_select');
  initSelectBox(addPaymentSelectBox, paymentMethods[0]);
};
//create time section in form
const createTimeSection = () => {
  const container = document.createElement('div');
  container.classList.add('expenseFormSection','additionalFormSection', "expSection_time");
  const tag = document.createElement('p');
  tag.innerHTML = "Time";
  tag.classList.add('input_tag', 'more_tag');
  const cancelbtn = createCancelButton('sectionbtn', 'time', closeExpSection);
  cancelbtn.className = "";
  cancelbtn.classList.add("closeExpSectionBtn","fas", "fa-times");
  cancelbtn.setAttribute('aria-label', 'close time section');
  const picker = document.createElement('div');
  picker.classList.add("pickerContainer");
  picker.setAttribute('id', 'timePicker');
  picker.setAttribute('tabindex', 0);
  picker.setAttribute('aria-label', 'time picker');
  const pickerinp = document.createElement('span');
  pickerinp.classList.add("expense_input");
  pickerinp.setAttribute('id', 'timePickerInput');
  pickerinp.setAttribute('aria', 'enter time of expense');
  pickerinp.setAttribute('name', 'expense_time');
  pickerinp.innerHTML = getNowTime();
  const pickerClock = document.createElement('i');
  pickerClock.classList.add("pickerClock", "fas", "fa-clock");
  picker.append(pickerinp, pickerClock);
  const label = createLabel('expense_time');
  label.classList.add('expense_label');
  container.append(cancelbtn, tag, picker, label);
  return container;
};
//create section in form for store, location and comments
const createCommonSection = (section_name) => {
  const title = capitalizeFirstLetter(section_name);
  const container = document.createElement('div');
  container.classList.add('expenseFormSection','additionalFormSection', `expSection_${section_name}`);
  const tag = document.createElement('p');
  tag.innerHTML = title;
  tag.classList.add('input_tag', 'more_tag');
  const cancelbtn = createCancelButton('sectionbtn', section_name, closeExpSection);
  cancelbtn.className = "closeExpSectionBtn";
  cancelbtn.classList.add("fas", "fa-times");
  cancelbtn.setAttribute('aria-label', `close ${section_name} section`);
  let input;
  if (section_name==="comments") {
    input = createTextareaInput('Write your comments here' , 'enter comments for expense', 'expense_comments', 'message');
  }else{
    input = createInput('text', title, `enter expense ${section_name}`, `expense_${section_name}`, `${section_name}_inpt_id`);
  }
  input.classList.add('expense_input');
  const label = createLabel(`expense_${section_name}`);
  label.classList.add('expense_label');
  container.append(cancelbtn, tag, input, label);
  return container;
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
//create form menu
const createFormMenu = (createbtns) => {
  const menubtns = [];
  menubtns['time'] = {
    name:`<span id='exptxt_time' class='morebtntext'>time</span>`,
    icon:`<i id='expIcon_time' class='expMoreIcon fas fa-clock'></i>`
  };
  menubtns['store'] = {
    name:`<span id='exptxt_store' class='morebtntext'>store</span>`,
    icon:`<i id='expIcon_store' class='expMoreIcon fas fa-store-alt'></i>`
  };
  menubtns['location'] = {
    name:`<span id='exptxt_location' class='morebtntext'>location</span>`,
    icon:`<i id='expIcon_location' class='expMoreIcon fas fa-map-marker-alt'></i>`
  };
  menubtns['comments'] = {
    name:`<span id='exptxt_comments' class='morebtntext'>comments</span>`,
    icon:`<i id='expIcon_comments' class='expMoreIcon fas fa-font'></i>`
  };
  const form_menu = document.createElement('div');
  form_menu.setAttribute('id', 'form_menu');
  form_menu.classList.add('form_menu');
  const menu_tag = document.createElement('p');
  menu_tag.innerHTML = "add section";
  menu_tag.className = "menu_tag";
  const closebutton =  createButton("closeFormMenu", '', "close menu to add new section", closeSectionMenu);
  closebutton.classList.add('round_btn','formMenuBtn', 'fas', 'fa-times');
  form_menu.append(menu_tag, closebutton);
  for (let i = 0; i < createbtns.length; i++) {
    let button_text = menubtns[createbtns[i]].icon+menubtns[createbtns[i]].name;
    let button =  createButton("addExpBtn_"+createbtns[i], button_text, "add "+createbtns[i]+" section in form", addExpSection);
    button.classList.add('addSecBtn', 'formMenuBtn');
    form_menu.append(button);
  }
  return form_menu;
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
