/*
* CREATE HTML FOR ADD EXPENSE INTERFACE
*/
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
