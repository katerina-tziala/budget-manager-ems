"use strict";
window.addEventListener('keydown', (event)=>{
  if(event.keyIdentifier=='U+000A' || event.keyIdentifier=='Enter' || event.keyCode==13){
    event.preventDefault();
    let element = event.target;
    if(element.classList.contains("budget_input")) {
      setBudget(event);
    }else if (element.classList.contains("editBudgetInput")) {
      updateBudgetAmount(event);
    }else if (element.classList.contains("add_goal_input")) {
      setGoal(event);
    }else if (element.classList.contains("editGoalInput")) {
      let id=element.classList[1].split("_").pop();
      updateGoal(event, id);
    }
  }
});
//elements
let noBudgetView, currentBudgetView, addGoalform, actionButtonsContainer, goals_msg, goalsListSection, allforms;
//data
let budgetList, previousBudget, currentBudget, categoriesList, goalsCategories;
const initBudgetGoalView = (personalInfo, budgets)=>{
  self.categoriesList = [];
  self.goalsCategories = [];
  self.goalsList = [];
  self.budgetList = budgets;
  const budgetIndicator = personalInfo.has_current_budget==='no'?false:true;
  initPageData(budgetIndicator);
  initPageView(budgetIndicator);
};
//create html for users without a current budget
const createNoBugetView=(main=self.main)=>{
  const container = document.createElement('div');
  container.setAttribute('id','noBudgetView');
  const pulseMessageContainer = document.createElement('div');
  pulseMessageContainer.setAttribute('id','pulseMessageContainer');
  pulseMessageContainer.className = "pulseMessageContainer";
  const noWeeklyBudget = document.createElement('p');
  noWeeklyBudget.setAttribute('id','noWeeklyBudget');
  noWeeklyBudget.innerHTML = `<b>YOU HAVE NOT SET YOUR WEEKLY BUDGET!</b><br/>It is ESSENTIAL for the <i> Budget Manager </i> app to set your weekly budget!<br/>Please set it now!`;
  pulseMessageContainer.append(noWeeklyBudget);
  const form = document.createElement('form');
  form.setAttribute('id', 'budget_form');
  form.classList.add('form_style');
  const form_tag = document.createElement('p');
  form_tag.innerHTML = "Set your weekly budget";
  form_tag.className = "form_tag";
  const resetBtn =  createButton('resetOvrLimitBtn', 'clear form', 'reset form', resetClearBudget);
  resetBtn.classList.add("formBtn", "ovr_budget_btn");
  const submitBtn =  createButton('saveOvrLimitBtn' , 'set budget', 'set weekly budget', setBudget);
  submitBtn.classList.add("formBtn", "ovr_budget_btn");
  const budgetContainer = document.createElement('div');
  budgetContainer.className = "budgetContainer";
  const budget_tag = document.createElement('span');
  budget_tag.className = "input_tag";
  budget_tag.innerHTML = "Amount";
  const amount_inpt = createAmountInput('enter budget amount', 'budget_amount', 'budget_input', 'budget_amount');
  const label = createLabel('budget_amount');
  label.classList.add("formBtn", "budget_label");
  budgetContainer.append(budget_tag, amount_inpt, label);
  const periodContainer = document.createElement('div');
  periodContainer.className = "budgetContainer";
  const period_tag = document.createElement('span');
  period_tag.className = "input_tag";
  period_tag.innerHTML = "Starting On";
  const picker = document.createElement('div');
  picker.classList.add("pickerContainer");
  picker.setAttribute('id', 'startdayPick');
  picker.setAttribute('tabindex', 0);
  picker.setAttribute('aria-label', 'date picker');
  const pickerinp = document.createElement('span');
  pickerinp.classList.add("budget_input");
  pickerinp.setAttribute('id', 'datepickerInput');
  pickerinp.setAttribute('aria', 'enter starting date');
  pickerinp.setAttribute('name', 'budget_start_date');
  pickerinp.innerHTML = "dd/mm/yyyy";
  const pickercalendar = document.createElement('i');
  pickercalendar.classList.add("calendar", "fas", "fa-calendar-alt");
  picker.append(pickerinp, pickercalendar);
  const label_period = createLabel('budget_start_date');
  label_period.classList.add("formBtn", "budget_label");
  periodContainer.append(period_tag, picker, label_period);
  form.append(form_tag, budgetContainer, periodContainer, resetBtn, submitBtn);
  container.append(form, pulseMessageContainer);
  main.append(container);
};
//create current budget view
const createCurrentBugetView=(main=self.main)=>{
  const container = document.createElement('div');
  container.setAttribute('id','currentBudgetView');
  const actionButtonsContainer = document.createElement('div');
  actionButtonsContainer.setAttribute('id','actionButtonsContainer');
  actionButtonsContainer.classList.add('centeredFlexbox', 'actionButtonsContainer', 'hidden');
  const add_exp = createAddLink('add_expense', 'add<br>expense', 'add expense', pages.add_expense.url);
  add_exp.classList.add('actionBtns');
  const add_goal_btn = createButton('btn_goal_add', `<i id='plusicon_goal_add' class='plus_icon_add fas fa-plus'></i><span id='plustxt_goal_add'>add<br>goal</span>`, 'add new category', toggleForm);
  add_goal_btn.classList.add('add_btn_link', 'actionBtns');
  actionButtonsContainer.append(add_exp, add_goal_btn);
  const h3 = document.createElement('h3');
  h3.className = "goalsHeader";
  h3.innerHTML = "Budget Goals";
  container.append(createBudgetCard(), createAddGoalSection(), actionButtonsContainer, h3, createGoalsSection());
  main.append(container);
};
//create budget card
const createBudgetCard=()=>{
  const budgetCard = document.createElement('div');
  budgetCard.setAttribute('id','budgetCard');
  const budgetCard_title = document.createElement('p');
  budgetCard_title.setAttribute('id','budgetCard_title');
  budgetCard_title.innerHTML = `<span id='budgetAppIcon'></span>My Budget`;
  //create amount section inside card
  const amountSection = document.createElement('div');
  amountSection.className = 'budgetCardSection';
  const amount_tag = document.createElement('p');
  amount_tag.className = 'budget_tag';
  amount_tag.innerHTML = 'Amount';
  const edit_btn_amount = createEditButton('budget', 'amount', toggleForm);
  edit_btn_amount.className = "";
  edit_btn_amount.classList.add('round_btn', 'editBtn', 'fas', 'fa-pencil-alt', 'editBudgetBtn');
  const amountDataContainer = document.createElement('div');
  amountDataContainer.className = 'dataContainer';
  amountDataContainer.setAttribute('id','amountDataContainer');
  amountDataContainer.innerHTML = `<i class='budget_icon fas fa-euro-sign'></i><p class='budget_data'>00.00</p>`;
  const amountform = document.createElement('form');
  amountform.setAttribute('id', 'formbudget_amount');
  amountform.classList.add('budgetForm', 'budgetedit_form', 'hidden');
  const amount_label = createLabel('editamount_input');
  amount_label.classList.add('editamount_label');
  const amount_inpt = createAmountInput('enter amount of budget', 'editamount_input', 'editamount_input', 'edit_amount_budget', 'editBudgetInput');
  amountform.append(amount_inpt, amount_label);
  const cancel_btn_amount = createCancelButton('budget', 'amount', toggleForm);
  cancel_btn_amount.className = "";
  cancel_btn_amount.classList.add('round_btn', 'editBtn', 'fas', 'fa-times', 'cancelBudgetBtn', 'hidden');
  const save_btn_amount = createSaveButton('budget', 'amount', updateBudgetAmount);
  save_btn_amount.className = "";
  save_btn_amount.classList.add('round_btn', 'editBtn', 'fas', 'fa-save', 'saveBudgetBtn', 'hidden');
  amountSection.append(amount_tag, edit_btn_amount, amountDataContainer, amountform, cancel_btn_amount, save_btn_amount);
  //create period section inside card
  const periodSection = document.createElement('div');
  periodSection.className = 'budgetCardSection';
  const period_tag = document.createElement('p');
  period_tag.className = 'budget_tag';
  period_tag.innerHTML = 'Period';
  const edit_btn_period = createEditButton('budget', 'period', toggleForm);
  edit_btn_period.className = "";
  edit_btn_period.classList.add('round_btn', 'editBtn', 'fas', 'fa-pencil-alt', 'editBudgetBtn');
  const periodDataContainer = document.createElement('div');
  periodDataContainer.className = 'dataContainer';
  periodDataContainer.setAttribute('id','periodDataContainer');
  periodDataContainer.innerHTML = `<i class='budget_icon far fa-calendar-alt'></i><p class='budget_data'>dd/mm/yyyy - dd/mm/yyyy</p>`;
  const periodform = document.createElement('form');
  periodform.setAttribute('id', 'formbudget_period');
  periodform.classList.add('budgetForm', 'budgetedit_form', 'hidden');
  const periodformtag = document.createElement('span');
  periodformtag.innerHTML="Starting On";
  const period_label = createLabel('startdayEditPick');
  period_label.classList.add('editperiod_label');
  const picker = document.createElement('div');
  picker.classList.add("pickerContainer", "editBudgetInput");
  picker.setAttribute('id', 'startdayEditPick');
  picker.setAttribute('tabindex', 0);
  picker.setAttribute('aria-label', 'date picker');
  const pickerinp = document.createElement('span');
  pickerinp.classList.add("editperiod_input");
  pickerinp.setAttribute('id', 'editdatepickerInput');
  pickerinp.setAttribute('aria', 'enter starting date');
  pickerinp.setAttribute('name', 'budget_start_date');
  pickerinp.innerHTML = "dd/mm/yyyy";
  const pickercalendar = document.createElement('i');
  pickercalendar.classList.add("calendar", "fas", "fa-calendar-alt");
  picker.append(pickerinp, pickercalendar);
  periodform.append(periodformtag, picker, period_label);
  const cancel_btn_period = createCancelButton('budget', 'period', toggleForm);
  cancel_btn_period.className = "";
  cancel_btn_period.classList.add('round_btn', 'editBtn', 'fas', 'fa-times', 'cancelBudgetBtn', 'hidden');
  const save_btn_period = createSaveButton('budget', 'period', updateBudgetPeriod);
  save_btn_period.className = "";
  save_btn_period.classList.add('round_btn', 'editBtn', 'fas', 'fa-save', 'saveBudgetBtn', 'hidden');
  periodSection.append(period_tag, edit_btn_period, periodDataContainer, periodform, cancel_btn_period, save_btn_period);
  //create goal section inside card
  const goalSection = document.createElement('div');
  goalSection.className = 'budgetCardSection';
  const goal_tag = document.createElement('p');
  goal_tag.className = 'budget_tag';
  goal_tag.innerHTML = 'Goals';
  const goalsDataContainer = document.createElement('div');
  goalsDataContainer.className = 'dataContainer';
  goalsDataContainer.setAttribute('id','goalsDataContainer');
  goalsDataContainer.innerHTML = `<i class='budget_icon fas fa-piggy-bank'></i><p class='budget_data'>0</p>`;
  goalSection.append(goal_tag, goalsDataContainer);
  //add elements to card
  budgetCard.append(budgetCard_title, amountSection, periodSection, goalSection);
  return budgetCard;
};
//create add goal section
const createAddGoalSection = () => {
  const section = document.createElement('div');
  section.setAttribute('id','addGoalFormContainer');
  section.classList.add('centeredFlexbox', 'addGoalFormContainer');
  const form = document.createElement('form');
  form.setAttribute('id', 'formgoal_add');
  form.classList.add('form_style', 'budgetForm', 'hidden');
  const form_tag = document.createElement('p');
  form_tag.innerHTML = "Add goal";
  form_tag.className = "form_tag";
  const cancel_btn = createCancelButton('goal', 'add', toggleForm);
  cancel_btn.classList.add('cancelBudgetBtn');
  cancel_btn.classList.remove('hidden');
  const reset_btn = createButton('resetAddGoalBtn', 'clear form', 'reset form', resetClearGoal);
  reset_btn.classList.add('formBtn', 'add_goal_btn');
  const save_btn = createButton('saveAddGoalBtn', 'save goal', 'save budget goal', setGoal);
  save_btn.classList.add('formBtn', 'add_goal_btn');
  const addGoalContainer = document.createElement('div');
  addGoalContainer.setAttribute('id','addGoalContainer');
  addGoalContainer.className = "addGoalContainer";
  const input_tag = document.createElement('span');
  input_tag.innerHTML = "Amount";
  input_tag.className = "input_tag";
  const amount_inpt = createAmountInput('enter goal amount', 'goal_amount', 'add_goal_input', 'goal_amount');
  const label = createLabel('goal_amount');
  label.classList.add('add_goal_label');
  addGoalContainer.append(input_tag, amount_inpt, label);
  form.append(form_tag, cancel_btn, addGoalContainer, reset_btn, save_btn);
  section.append(form);
  return section;
};
//create goals section
const createGoalsSection = () => {
  const section = document.createElement('section');
  section.setAttribute('id','goalsSection');
  section.setAttribute('role','region');
  section.setAttribute('aria-label','goals section');
  const sort_btns_wrapper = document.createElement('div');
  sort_btns_wrapper.classList.add('sort_btns_wrapper', 'hidden');
  const sorting_tag = document.createElement('p');
  sorting_tag.className = "sorting_tag";
  sorting_tag.innerHTML = "Sort Goals By:";
  const ctgr_txt = `<i id='iconsrt_category' class='sortIcon fas fa-sort-alpha-down'></i><span id='textsrt_category' class='sort_indicator'>asc</span><span id='sorttag_category' class='sort_tag'>category</span>`;
  const sortBtn_category = createButton('sortBtn_category', ctgr_txt, 'sort expenses by category', sortGoals);
  sortBtn_category.classList.add('sortBtn');
  const amnt_txt = `<i id='iconsrt_amount' class='sortIcon fas fa-sort-numeric-up'></i><span id='textsrt_amount' class='sort_indicator'>desc</span><span id='sorttag_amount' class='sort_tag'>amount</span>`;
  const sortBtn_amount = createButton('sortBtn_amount', amnt_txt, 'sort expenses by amount', sortGoals);
  sortBtn_amount.classList.add('sortBtn');
  sort_btns_wrapper.append(sorting_tag, sortBtn_amount, sortBtn_category);
  const goals_msg = document.createElement('p');
  goals_msg.setAttribute('id','goals_msg');
  goals_msg.className = "noItemsMessage";
  goals_msg.innerHTML = "No goals yet!";
  const goalsList = document.createElement('ul');
  goalsList.setAttribute('id','goalsList');
  goalsList.className = "goalsList";
  goalsList.setAttribute('aria-label','goals list');
  section.append(sort_btns_wrapper, goals_msg, goalsList);
  return section;
};
//initialize page view
const initPageView = (budgetIndicator) => {
  prepareMain("clear");
  if (budgetIndicator) {
    createCurrentBugetView();
    self.actionButtonsContainer = document.getElementById('actionButtonsContainer');
    self.goals_msg = document.getElementById('goals_msg');
    self.goalsListSection = document.getElementById('goalsList');
    self.addGoalform = document.getElementById('formgoal_add');
    initCurrentBudgetView();
  }else{
    createNoBugetView();
    self.noBudgetView = document.getElementById('noBudgetView');
    initNobudgetView();
  }
  hideLoader();
};
//initialize page data
const initPageData = (budgetIndicator) => {
  self.previousBudget = [];
  self.currentBudget = [];
  self.budgetPickerDates = [];
  const today = new Date();
  const pastdayStart = getSpecificDate(today, -180);
  const pastdayEnd = getSpecificDate(today, -173);
  const tommorow = getSpecificDate(today, +1);
  let calendarstart = getSpecificDate(today, -6);
  const dummyBudget = {
    "amount": 0,
    "budget_from": pastdayStart,
    "budget_to": pastdayEnd,
    "goals": 0,
    "id": -1,
    "from_display": formatDate(pastdayStart, "-", "/"),
    "to_display": formatDate(pastdayEnd, "-", "/"),
    "from_daytime": new Date(pastdayStart).getTime(),
    "to_daytime": new Date(pastdayEnd).getTime(),
  }
  let numberOfBudgets = self.budgetList.length;
  if (numberOfBudgets>0) {
    self.budgetList.sort((item_a, item_b)=>{
      return sortByID(item_a, item_b, "desc");
    });
    for (let i = 0; i < self.budgetList.length; i++) {
      self.budgetList[i].from_display = formatDate(self.budgetList[i].budget_from, "-", "/");
      self.budgetList[i].to_display = formatDate(self.budgetList[i].budget_to, "-", "/");
      self.budgetList[i].from_daytime = new Date(self.budgetList[i].budget_from).getTime();
      self.budgetList[i].to_daytime = new Date(self.budgetList[i].budget_to).getTime();
    }
  }
  if (numberOfBudgets===0) {
    self.previousBudget = dummyBudget;
  }else if (numberOfBudgets>=1 && budgetIndicator===false) {
    self.previousBudget = self.budgetList[0];
    calendarstart = getSpecificDate(self.previousBudget.budget_to, +1);
  } else if (numberOfBudgets===1 && budgetIndicator===true) {
    self.previousBudget = self.budgetList[0];
    self.currentBudget = self.budgetList[0];
  } else if (numberOfBudgets>1 && budgetIndicator===true) {
    self.previousBudget = self.budgetList[1];
    self.currentBudget = self.budgetList[0];
    calendarstart = getSpecificDate(self.previousBudget.budget_to, +1);
  }
  self.budgetPickerDates = getPickerDates(today, calendarstart, tommorow);
};
//initialize no budget view
const initNobudgetView = (previousBudget = self.previousBudget, pickerDates = self.budgetPickerDates) => {
  const weeklyBudgetNotification = document.getElementById('noWeeklyBudget');
  weeklyBudgetNotification.classList.add('pulseanimation');
  const dayPicker = document.getElementById('startdayPick');
  const dayPickerInput = document.getElementById('datepickerInput');
  const budget_amount = document.getElementById('budget_amount');
  const startdayparts = getDateParts(pickerDates['today']);
  dayPickerInput.innerHTML = startdayparts[0]+"/"+startdayparts[1]+"/"+startdayparts[2];
  budget_amount.placeholder = getDisplayFormat(previousBudget.amount);
  const budget_form = document.getElementById('budget_form');
  initDatePickerCalendar(self.budgetCalendar, dayPicker, pickerDates, dayPickerInput);
  instantAmountValidation(budget_form);
  //displayElement(self.noBudgetView);
  //hideElement(self.currentBudgetView);
};
//initialize current budget view
const initCurrentBudgetView = (previousBudget = self.previousBudget, currentBudget = self.currentBudget, pickerDates = self.budgetPickerDates) => {
  self.allforms = "";
  self.allforms = document.querySelectorAll('.budgetForm');
  initBudgetCard();
  initAddGoalForm();
  initGoalsSectionHtml();
  //hideElement(self.noBudgetView);
  //displayElement(self.currentBudgetView);
};
//initialize goals section
const initGoalsSectionHtml = (currentBudget = self.currentBudget) =>{
  if (currentBudget.goals===0) {
    hideElement(self.goalsListSection);
    displayElement(self.goals_msg);
  }else{
    if (self.goalsList.length==0) {
      fetchGoalsAndDisplay();
    }else{
      populateGoalsHTML();
    }
  }
};
//fetch goals and then display
const fetchGoalsAndDisplay = () => {
  fetchData('getUserGoalList', (error, results) => {
    if (error) { // Got an error!
      showErrorView();
      console.error(error);
    } else {
      self.goalsList = results;
      populateGoalsHTML();
    }
  });
};
//populate goals html
const populateGoalsHTML = (goalsContainer = self.goalsListSection, goalsList = self.goalsList, currentBudget = self.currentBudget) => {
  goalsContainer.innerHTML = "";
  createCategoriesSelectBox();
  const budgetGoalsList = getByBudgetID(currentBudget.id, goalsList);
  const sort_btns_wrapper = document.querySelectorAll('.sort_btns_wrapper')[0];
  if (budgetGoalsList.length>0) {
    budgetGoalsList.forEach(goal => {
    goalsContainer.append(createGoalCard(goal));
      self.goalsCategories[self.goalsCategories.length]=goal.category;
    });
    hideElement(self.goals_msg);
    displayElement(self.goalsListSection);
    displayElement(sort_btns_wrapper);
    createCategoriesSelectBox();
    initializeGoalCardsDisplay();
  }else{
    goalsContainer.innerHTML = "";
    hideElement(self.goalsListSection);
    hideElement(sort_btns_wrapper);
    displayElement(self.goals_msg);
  }
  if (self.goalsCategories.length===self.categoriesList.length) {
    hideElement(document.getElementById('btn_goal_add'));
  }
  self.allforms = "";
  self.allforms = document.querySelectorAll('.budgetForm');
};
//sort goals
const sortGoals = (event) =>{
  const target = event.target.id.split("_").pop();
  const button = document.getElementById(`sortBtn_${target}`);
  const filter_icon = document.getElementById(`iconsrt_${target}`);
  const filter_text = document.getElementById(`textsrt_${target}`);
  const mod_sel_opt = filter_text.innerHTML;
  if (target==="amount") {
    self.goalsList.sort((item_a, item_b)=>{
      return sortByAmount(item_a, item_b, mod_sel_opt);
    });
  }else if (target==="category") {
    self.goalsList.sort((item_a, item_b)=>{
      return sortByCategory(item_a, item_b, mod_sel_opt);
    });
  }
  sortButtonDisplayHandler(filter_icon, filter_text);
  populateGoalsHTML();
};
//handle icon display of sort options
const sortButtonDisplayHandler = (filter_icon, filter_text) => {
  const current_icon = filter_icon.classList[2];
  const icon_parts = current_icon.split("-");
  const new_part = icon_parts[3]!='down'?'down':'up';
  const new_icon = icon_parts[0]+"-"+icon_parts[1]+"-"+icon_parts[2]+"-"+new_part;
  filter_icon.classList.remove(current_icon);
  filter_icon.classList.add(new_icon);
  const current_text = filter_text.innerHTML;
  const new_text = current_text!='desc'?'desc':'asc';
  filter_text.innerHTML = new_text;
};
//initialize display of goal cards
const initializeGoalCardsDisplay = () => {
  self.allforms = "";
  self.allforms = document.querySelectorAll('.budgetForm');
  const indexes = document.querySelectorAll('.goalIndex');
  for (let i = 0; i < indexes.length; i++) {
    indexes[i].innerHTML = i+1;
  }
  const cardicons = document.querySelectorAll('.category_icon');
  loadCategoryIcons(cardicons);
  const goalEditForms = document.querySelectorAll('.goalEditForm');
  for (let i = 0; i < goalEditForms.length; i++) {
    instantAmountValidation(goalEditForms[i]);
  }
};
//open close forms
const toggleForm = (event, allforms=self.allforms) => {
  event.preventDefault();
  const button_stringID = event.target.id;
  const action = button_stringID.split("_")[0];
  const type = button_stringID.split("_")[1];
  const target = button_stringID.split("_").pop();
  const form = document.getElementById(`form${type}_${target}`);
  if(action==="edit"){
    closeAllOtherForms(form.id, allforms, closeOneForm);
    if(type==="budget"){
      hideElement(document.getElementById(`${target}DataContainer`));
      cardButtonHandler('budget', target, 'open', 3);
      if (target=="amount") {
        clearAmountBudgetForm();
      }else{
        clearPeriodBudgetForm();
      }
    }else{
      cardButtonHandler('goal', target, 'open');
      hideElement(document.getElementById(`goalDataContainer_${target}`));
      clearAmountGoalEditForm(target);
    }
    displayElement(form);
  }else if(action==="cancel"){
    if(type==="budget"){
      displayElement(document.getElementById(`${target}DataContainer`));
      cardButtonHandler('budget', target, 'close', 3);
    }else if (type==="goal") {
      displayElement(document.getElementById('btn_goal_add'));
      if(target!= "add" && target!= "amount" && target!= "period"){
        cardButtonHandler('goal', target, 'close');
        displayElement(document.getElementById(`goalDataContainer_${target}`));
      }
      const goals = document.querySelectorAll('.goalCard');
      if (goals.length===0) {
        displayElement(document.getElementById('goals_msg'));
      }
    }
    hideElement(form);
  }else{//add goal
    hideElement(document.getElementById('btn_goal_add'));
    hideElement(document.getElementById('goals_msg'));
    closeAllOtherForms(form.id, allforms, closeOneForm);
    clearAddGoalForm();
    displayElement(form);
  }
};
/*
* CLEAR FORMS
*/
//clear amount budget form
const clearAmountBudgetForm = () => {
  const labels = document.querySelectorAll(`.editamount_label`);
  const fields = document.querySelectorAll(`.editamount_input`);
  clearAppForm(labels, fields);
};
//clear period budget form
const clearPeriodBudgetForm = () => {
  const labels = document.querySelectorAll(`.editperiod_label`);
  const fields = document.querySelectorAll(`.editperiod_input`);
  clearAppForm(labels, fields);
  const dayPickerInput = document.getElementById('editdatepickerInput');
  dayPickerInput.innerHTML = self.currentBudget.from_display;
};
//clear amount budget form
const clearAddGoalForm = () => {
  const labels = document.querySelectorAll(`.add_goal_label`);
  const fields = document.querySelectorAll(`.add_goal_input`);
  clearAppForm(labels, fields);
  createCategoriesSelectBox();
};
//clear goal edit form
const clearAmountGoalEditForm = (id) => {
  const labels = document.querySelectorAll('[for='+`editgoal_input_${id}`+']');
  const fields = document.querySelectorAll(`.editgoal_input_${id}`);
  clearAppForm(labels, fields);
};
//close one form
const closeOneForm = (id) => {
  let form;
  if(id==="amount" || id==="period"){
    form = document.getElementById(`formbudget_${id}`);
    displayElement(document.getElementById(`${id}DataContainer`));
    cardButtonHandler('budget', id, 'close', 3);
  }
  else{
    form = document.getElementById(`formgoal_${id}`);
    if(id==="add"){
      displayElement(document.getElementById('btn_goal_add'));
    }else {
      const goalCards=document.querySelectorAll('.goalCard');
      if (goalCards.length>0) {
        cardButtonHandler('goal', id, 'close');
        displayElement(document.getElementById(`goalDataContainer_${id}`));
      }
    }
  }
  hideElement(form);
};
//reset clear add goal form on click
const resetClearGoal = (event) => {
  event.preventDefault();
  clearAddGoalForm();
};
/*
* ADD, UPDATE, DELETE BUDGET
*/
//set budget
const setBudget = (event, previousBudget = self.previousBudget) => {
  event.preventDefault();
  const labels = document.querySelectorAll('.budget_label');
  const formFields = document.querySelectorAll('.budget_input');
  let amount = formFields[0].value;
  const placeholderBudget = formFields[0].placeholder;
  if (parseFloat(placeholderBudget)>0 && amount.replace(/\s+/, "") === '' || amount === "") {
    amount=placeholderBudget.toString();
  }
  let budget_from = formFields[1].innerHTML;
  budget_from = formatDate(budget_from, "/", "-");
  const valid_amount = simpleAmountValidation(amount, labels[0]);
  if (valid_amount===true) {
    amount=parseFloat(amount);
    const newDateTime = new Date(budget_from).getTime();
    let message = "";
    const toast_options = {
      "message": "",
      "type": "fadeout",
      "timer": 0,
      "buttonsmode": "got_it",
      "container_classes":["show_toast"]
    };
    if (previousBudget.to_daytime>newDateTime) {
      toast_options.message = messageGenerator({initiator:"setbudget", message_type:'overlapping_budget'});
      toast_options.timer = 7000;
      showToaster(toast_options);
    }else{
      const budget_to = getSpecificDate(budget_from, +6);
      const data = {
        "amount": amount,
        "budget_from": budget_from,
        "budget_to": budget_to,
        "request_type": "set_budget"
      }
      showLoader();
      sendData('setBudget', data).then((response)=>{
        if(response.message==="invalid_request"){
          invalidRequestHandler(data);
        } else if(response.message==="success"){
          const newBudget = {
            "id": parseInt(response.added_id),
            "amount": parseFloat(amount),
            "budget_from": budget_from,
            "budget_to": budget_to,
            "goals":0,
            "from_display": formatDate(budget_from, "-", "/"),
            "to_display": formatDate(budget_to, "-", "/"),
            "from_daytime": new Date(budget_from).getTime(),
            "to_daytime": new Date(budget_to).getTime(),
          };
          self.budgetList.unshift(newBudget);
          const budgetIndicator = getBudgetIndicator();
          initPageData(budgetIndicator);
          initPageView(budgetIndicator);
        }else {
          hideLoader();
          clearBudgetForm(labels, formFields);
          if (response.message==="overlapping_budget") {
            toast_options.message = messageGenerator({initiator:"setbudget", message_type:'overlapping_budget'});
            toast_options.timer = 7000;
          }else{
            toast_options.message = messageGenerator({initiator:"setbudget", message_type:"else_error", error_part:"set your weekly budget"});
            toast_options.timer = 10000;
          }
          showToaster(toast_options);
        }
      });
    }
  }
};
//update budget amount
const updateBudgetAmount = (event, currentBudget = self.currentBudget) => {
  event.preventDefault();
  const form = document.getElementById(`formbudget_amount`);
  const labels = document.querySelectorAll(`.editamount_label`);
  const fields = document.querySelectorAll(`.editamount_input`);
  const current_budget = parseFloat(currentBudget.amount);
  let amount = fields[0].value;
  if (amount.replace(/\s+/, "") === '' || amount==="") {
    displayElement(document.getElementById('amountDataContainer'));
    cardButtonHandler('budget', 'amount', 'close', 3);
    hideElement(form);
  }else{
    const valid_amount = simpleAmountValidation(amount.toString(), labels[0]);
    if (valid_amount===true) {
      const goalsTotal = getGoalsTotal(currentBudget.id);
      const toast_options = {
        "message": "",
        "type": "keep_open",
        "timer": 0,
        "buttonsmode": "got_it",
        "container_classes":["show_toast"]
      };
      if (parseFloat(amount)<goalsTotal) {
        toast_options.message = messageGenerator({initiator:"updatebudget", message_type:'goals_more'});
        toast_options.type = "fadeout";
        toast_options.timer = 10000;
        showToaster(toast_options);
      }else{
        const data = {
          "id": parseInt(currentBudget.id),
          "amount": parseFloat(amount),
          "budget_from": currentBudget.budget_from,
          "budget_to": currentBudget.budget_to,
          "request_type": "update_budget_amount"
        }
        const amountDataContainer = document.getElementById(`amountDataContainer`);
        const previousHTML = amountDataContainer.innerHTML;
        amountDataContainer.innerHTML = "";
        amountDataContainer.append(updateBudgetMessageHTML('amount'));
        displayElement(amountDataContainer);
        hideElement(form);
        cardButtonHandler('budget', 'amount', 'close', 3);
        sendData('updateBudgetAmount', data).then((response)=>{
          amountDataContainer.innerHTML = "";
          amountDataContainer.innerHTML = previousHTML;
          if(response.message==="invalid_request"){
            invalidRequestHandler(data);
          } else if(response.message==="success"){
            self.currentBudget.amount=data.amount;
            initBudgetCard();
          }else{
            toast_options.message = messageGenerator({initiator:"updatebudget", message_type:"else_error", error_part:"update your weekly budget"});
            toast_options.type = "fadeout";
            toast_options.timer = 9000;
            showToaster(toast_options);
          }
        });
      }
    }
  }
};
//update budget Period
const updateBudgetPeriod = (event, currentBudget = self.currentBudget, previousBudget = self.previousBudget) => {
  event.preventDefault();
  const form = document.getElementById('formbudget_period');
  const labels = document.querySelectorAll(`.editperiod_label`);
  const fields = document.querySelectorAll(`.editperiod_input`);
  const new_day = formatDate(fields[0].innerHTML, "/", "-");
  const newDayTime = new Date(new_day).getTime();
  const periodDataContainer = document.getElementById(`periodDataContainer`);
  const toast_options = {
    "message": "",
    "type": "keep_open",
    "timer": 0,
    "buttonsmode": "got_it",
    "container_classes":["show_toast"]
  };
  if (newDayTime === currentBudget.from_daytime) {
    displayElement(document.getElementById('periodDataContainer'));
    cardButtonHandler('budget', 'period', 'close', 3);
    hideElement(form);
  }else if (newDayTime<previousBudget.from_daytime) {
    toast_options.message = messageGenerator({initiator:"updatebudget", message_type:"overlapping_budget"});
    toast_options.type = "fadeout";
    toast_options.timer = 7000;
    showToaster(toast_options);
  }else{
    const previousHTML = periodDataContainer.innerHTML;
    periodDataContainer.innerHTML = "";
    periodDataContainer.append(updateBudgetMessageHTML('period'));
    displayElement(periodDataContainer);
    hideElement(form);
    cardButtonHandler('budget', 'period', 'close', 3);
    const data = {
      "amount": parseFloat(currentBudget.amount),
      "id": parseInt(currentBudget.id),
      "budget_from": new_day,
      "budget_to": getSpecificDate(new_day, +6),
      "request_type": "update_budget_period"
    }
    sendData('updateBudgetPeriod', data).then((response)=>{
      periodDataContainer.innerHTML = "";
      periodDataContainer.innerHTML = previousHTML;
      if(response.message==="invalid_request"){
        invalidRequestHandler(data);
      } else if(response.message==="success"){
        self.currentBudget.budget_from = data.budget_from;
        self.currentBudget.budget_to = data.budget_to;
        self.currentBudget.from_daytime = new Date(data.budget_from).getTime();
        self.currentBudget.to_daytime = new Date(data.budget_to).getTime();
        self.currentBudget.from_display = formatDate(data.budget_from, "-", "/");
        self.currentBudget.to_display = formatDate(data.budget_to, "-", "/");
        const budgetIndicator = getBudgetIndicator();
        initPageData(budgetIndicator);
        initPageView(budgetIndicator);
      }else {
        toast_options.message = messageGenerator({initiator:"updatebudget", message_type:"else_error", error_part:"update your weekly budget"});
        toast_options.type = "fadeout";
        toast_options.timer = 9000;
        showToaster(toast_options);
      }
    });
  }
};
//get total of goals of one budget
const getGoalsTotal = (budget_id, goalsList = self.goalsList) => {
  let total = 0;
  const budgetGoalsList = getByBudgetID(budget_id, goalsList);
  budgetGoalsList.forEach(goal => {
    total = total + parseFloat(goal.amount);
  });
  return parseFloat(total);
};
//update message for user
const updateBudgetMessageHTML=(type)=>{
  const message = document.createElement('p');
  message.setAttribute('id', `budgetData_${type}`);
  message.classList.add("budget_data", "update_msg");
  message.innerHTML = `Updating budget ${type}...`;
  return message;
};
//get budget indicator after update or add budget
const getBudgetIndicator = () =>{
  let budgetIndicator = false;
  if (self.budgetList.length>0) {
    let results = self.budgetList;
    results = results.filter((r) => new Date(r.budget_to).getTime() >= new Date().getTime());
    if (results.length>0) {
      budgetIndicator = true;
    }
  }
  return budgetIndicator;
};
//check if goal is added for a category
const goalExistance = (category, budgetid, goals=self.goalsList) => {
  let existance = false;
  const budgetGoalsList = getByBudgetID(budgetid, goalsList);
  let results = budgetGoalsList;
  results = results.filter((r) => r.category === category);
  if (results.length>0) {
    existance = true;
  }
  return existance;
};
/*
* ADD, UPDATE, DELETE GOAL
*/
//set a goal
const setGoal = (event, currentBudget = self.currentBudget, addGoalForm = self.addGoalform) => {
  event.preventDefault();
  const labels = document.querySelectorAll(`.add_goal_label`);
  const formFields = document.querySelectorAll(`.add_goal_input`);
  const amount = formFields[1].value;
  let category = formFields[0].value;
  if(category.replace(/\s+/, "")==='' || category===''){
    const select = document.querySelectorAll('.blobselect-selection')[0];
    category = select.getAttribute('data-value');
  }
  category = decodeEntities(category).toLowerCase();
  const valid_amount = simpleAmountValidation(amount, labels[1]);
  if (valid_amount===true) {
    const goalExistanceCheck = goalExistance(category, currentBudget.id);
    const toast_options = {
      "message": "",
      "type": "keep_open",
      "timer": 0,
      "buttonsmode": "got_it",
      "container_classes":["show_toast"]
    };
    if(goalExistanceCheck===true){
      toast_options.message = messageGenerator({initiator:"setgoal", message_type:"goal_setted"});
      toast_options.type = "fadeout";
      toast_options.timer = 7000;
      showToaster(toast_options);
    }else{
      let goalsTotal = getGoalsTotal(currentBudget.id);
      goalsTotal = goalsTotal + parseFloat(amount);
      if(goalsTotal>currentBudget.amount){
        toast_options.message = messageGenerator({initiator:"setgoal", message_type:"budget_less"});
        toast_options.type = "fadeout";
        toast_options.timer = 10000;
        showToaster(toast_options);
      }else{
        const today = new Date();
        const todayParts = getDateParts(today);
        const time = getNowTime();
        const data = {
          "amount": parseFloat(amount),
          "category": category.toLowerCase(),
          "budget_id": parseInt(currentBudget.id),
          "created": todayParts[2]+"-"+todayParts[1]+"-"+todayParts[0]+" "+time,
          "request_type": "set_goal"
        }
        const addMsg = document.createElement('p');
        addMsg.setAttribute('id', 'adding_goal_msg');
        addMsg.className = "noItemsMessage";
        addMsg.innerHTML = "Adding your goal....";
        const addBtn = document.getElementById('btn_goal_add');
        const container = document.getElementById('addGoalFormContainer');
        container.insertBefore(addMsg, container.childNodes[1]);
        hideElement(addBtn);
        hideElement(addGoalForm);
        sendData('addBudgetGoal', data).then((response)=>{
          document.getElementById('adding_goal_msg').remove();
          displayElement(addBtn);
console.log(response);

          if(response.message==="invalid_request"){
            //invalidRequestHandler(data);
          } else if(response.message==="success"){
            const newGoal = {
              "id": parseInt(response.added_id),
              "amount": data.amount,
              "category": data.category,
              "budget_id": data.budget_id,
              "created": data.created
            }
            self.goalsList.unshift(newGoal);
            self.goalsCategories[self.goalsCategories.length]=data.category;
            initAddGoalForm();
            populateGoalsHTML();
          }else{
            toast_options.message = messageGenerator({initiator:"setgoal", message_type:"else_error", error_part:"set your budget goal"});
            toast_options.type = "fadeout";
            toast_options.timer = 7000;
            showToaster(toast_options);
            populateGoalsHTML();
          }
        });
      }
    }
  }
};
//delete a goal
const deleteGoal = (event) =>{
  event.preventDefault();
  const button = event.target;
  const buttonID = parseInt(button.id.split("_").pop());
  const goalCard = document.getElementById(`goalCard_${buttonID}`);
  for (let i = 3; i < 7; i++) {
    hideElement(goalCard.childNodes[i]);
  }
  const actionmessage = cardGoalMessageHTML(buttonID, 'Deleting');
  goalCard.insertBefore(actionmessage, goalCard.childNodes[3]);
  const currentGoal = getGoalByID(buttonID)[0];
  const data = {
    "id": buttonID,
    "amount": parseFloat(currentGoal.amount),
    "category": decodeEntities(currentGoal.category).toLowerCase(),
    "budget_id": parseInt(currentGoal.budget_id),
    "created": currentGoal.created,
    "request_type": "delete_goal"
  }
  sendData('deleteBudgetGoal', data).then((response)=>{
    if(response.message==="invalid_request"){
      invalidRequestHandler(data);
    } else if(response.message==="success"){
      let newGoalGategories = [];
      for (let i = 0; i < self.goalsCategories.length; i++) {
        if (self.goalsCategories[i]!=data.category) {
          newGoalGategories[newGoalGategories.length] = self.goalsCategories[i];
        }
      }
      self.goalsCategories = [];
      self.goalsCategories = newGoalGategories;
      initAddGoalForm();
      let results = self.goalsList;
      results = results.filter((r) => r.id != data.id);
      self.goalsList = [];
      self.goalsList = results;
      populateGoalsHTML();
    }else{
      document.getElementById(`instantActionMSG_${buttonID}`).remove();
      for (let i = 3; i < 7; i++) {
        displayElement(goalCard.childNodes[i]);
      }
      const toast_options = {
        "message": messageGenerator({initiator:"deletegoal", message_type:"else_error", error_part:"delete this goal"}),
        "type": "fadeout",
        "timer": 9000,
        "buttonsmode": "got_it",
        "container_classes":["show_toast"]
      };
      showToaster(toast_options);
    }
  });
};
//udate a goal
const updateGoal = (event, id=null, currentBudget = self.currentBudget) =>{
  event.preventDefault();
  let buttonID=id;
  if (buttonID===null) {
    buttonID = parseInt(event.target.id.split("_").pop());
  }
  const goalCard = document.getElementById(`goalCard_${buttonID}`);
  const goalDataContainer = document.getElementById(`goalDataContainer_${buttonID}`);
  const currentGoal = getGoalByID(buttonID)[0];
  const form = document.getElementById(`formgoal_${buttonID}`);
  const labels = document.querySelectorAll('[for='+`editgoal_input_${buttonID}`+']');
  const fields = document.querySelectorAll(`.editgoal_input_${buttonID}`);
  let amount = fields[0].value;
  const curr_amount = fields[0].placeholder;
  if(parseFloat(amount)===parseFloat(curr_amount) || amount.replace(/\s+/, "")===''|| amount.replace(/\s+/, "")==='' || amount === ''){
    hideElement(form);
    cardButtonHandler('goal', buttonID, 'close');
    displayElement(goalDataContainer);
  }else{
    const valid_amount = simpleAmountValidation(amount, labels[0]);
    if (valid_amount===true) {
      amount = parseFloat(amount);
      let goalsTotal = getGoalsTotal(currentBudget.id);
      goalsTotal = goalsTotal-curr_amount+amount;
      const toast_options = {
        "message": "",
        "type": "fadeout",
        "timer": 0,
        "buttonsmode": "got_it",
        "container_classes":["show_toast"]
      };
      if (goalsTotal>currentBudget.amount) {
        toast_options.message = messageGenerator({initiator:"updategoal", message_type:"budget_less"});
        toast_options.timer = 10000;
        showToaster(toast_options);
        cardButtonHandler('goal', buttonID, 'close');
        hideElement(form);
        displayElement(goalDataContainer);
      }else{
        hideElement(form);
        for (let i = 3; i < 7; i++) {
          hideElement(goalCard.childNodes[i]);
        }
        const actionmessage = cardGoalMessageHTML(buttonID, 'Updating');
        goalCard.insertBefore(actionmessage, goalCard.childNodes[3]);
        cardButtonHandler('goal', buttonID, 'close');
        const data = {
          "id": buttonID,
          "amount": amount,
          "category": decodeEntities(currentGoal.category).toLowerCase(),
          "budget_id": parseInt(currentGoal.budget_id),
          "created": currentGoal.created,
          "request_type": "update_goal"
        }
        sendData('updateBudgetGoal', data).then((response)=>{
          if(response.message==="invalid_request"){
            invalidRequestHandler(data);
          }else if(response.message==="success"){
            document.getElementById(`instantActionMSG_${buttonID}`).remove();
            for (let i = 3; i < 7; i++) {
              displayElement(goalCard.childNodes[i]);
            }
            let results = self.goalsList;
            results = results.filter((r) => r.id != data.id);
            currentGoal.amount = amount
            self.goalsList = [];
            self.goalsList = results;
            self.goalsList[self.goalsList.length] = currentGoal;
            populateGoalsHTML();
          }else{
            document.getElementById(`instantActionMSG_${buttonID}`).remove();
            for (let i = 3; i < 7; i++) {
              displayElement(goalCard.childNodes[i]);
            }
            toast_options.message = messageGenerator({initiator:"updategoal", message_type:"else_error", error_part:"update this goal"}),
            toast_options.timer = 9000;
            showToaster(toast_options);
          }
        });
      }
    }
  }
};
//update message for user
const cardGoalMessageHTML=(id, type)=>{
  const message = document.createElement('p');
  message.setAttribute('id', `instantActionMSG_${id}`);
  message.className = "instant_action_msg";
  message.innerHTML = `${type} goal...`;
  return message;
};
//get a goal by id
const getGoalByID = (id) => {
  let results = self.goalsList;
  results = results.filter((r) => r.id === parseInt(id));
  return results;
};
//create goal card
const createGoalCard = (goal) => {
  const delete_btn = createDeleteButton('goal', goal.id, deleteGoal);
  const edit_btn = createEditButton('goal', goal.id, toggleForm) ;
  const cancel_btn = createCancelButton('goal', goal.id, toggleForm);
  const save_btn = createSaveButton('goal', goal.id, updateGoal);
  const card = document.createElement('li');
  card.setAttribute('role', 'listitem');
  card.classList.add("goalCard");
  card.setAttribute("id", `goalCard_${goal.id}`);
  const cardHeader = document.createElement('p');
  cardHeader.classList.add("goalCard_header");
  cardHeader.innerHTML = `<i class="goal_target fas fa-piggy-bank"></i>Goal #<span class='goalIndex'></span>`;
  const categoryIcon = document.createElement('div');
  const icon_name = `icon_${goal.category.split(" ")[0]}`;
  categoryIcon.classList.add("category_icon", icon_name);
  const categoryText = document.createElement('p');
  categoryText.className = "goal_category";
  categoryText.innerHTML = decodeEntities(goal.category);
  const spendText = document.createElement('p');
  spendText.className = "goal_spend";
  spendText.innerHTML = "Spend at most";
  const goalDataContainer = document.createElement('div');
  goalDataContainer.className = "dataContainer";
  goalDataContainer.setAttribute("id", `goalDataContainer_${goal.id}`);
  const goalEuroSign = document.createElement('i');
  goalEuroSign.classList.add("goal_euro_icon", "fas", "fa-euro-sign");
  const goalAmount = document.createElement('p');
  goalAmount.setAttribute("id", `goal_amount_${goal.id}`);
  goalAmount.innerHTML = getDisplayFormat(goal.amount);
  goalAmount.className = "goal_data";
  goalDataContainer.append(goalEuroSign, goalAmount);
  const form = document.createElement('form');
  form.setAttribute("id", `formgoal_${goal.id}`);
  form.classList.add("budgetForm", "goaledit_form", "goalEditForm", "hidden");
  const amountSection = createAmountSection(getDisplayFormat(goal.amount), 'enter amount of goal', `editgoal_input_${goal.id}`, `editGoalInput editgoal_input_${goal.id}`, `editamountgoal_label_${goal.id}`);
  form.append(amountSection);
  card.append(delete_btn, edit_btn, cardHeader, categoryIcon, categoryText, spendText, goalDataContainer, form,cancel_btn, save_btn);
  return card;
};
//create amount section
const createAmountSection = (placeholder, aria, name, inputClassList, labelClass) => {
  const amountContainer = document.createElement('div');
  amountContainer.className = "amountContainer";
  const input = createInput('text', placeholder, aria, name);
  input.className = inputClassList;
  input.classList.add("formInputs", "amount_inpt");
  const euroSign = document.createElement('i');
  euroSign.classList.add("amountEuro", "fas", "fa-euro-sign");
  const label = createLabel(name);
  //label.classList.add(labelClass);
  amountContainer.append(input, euroSign, label);
  return amountContainer;
};
//initialize budget card
const initBudgetCard = (budget=self.currentBudget, pickerDates = self.budgetPickerDates) => {
  const budgetCard = document.getElementById('budgetCard');
  const cardData = budgetCard.querySelectorAll('.budget_data');
  const amountInput = document.getElementById('edit_amount_budget');
  const dayPicker = document.getElementById('startdayEditPick');
  const dayPickerInput = document.getElementById('editdatepickerInput');
  cardData[0].innerHTML = getDisplayFormat(budget.amount);
  cardData[1].innerHTML = budget.from_display+" - "+budget.to_display;
  cardData[2].innerHTML = budget.goals;
  amountInput.placeholder = getDisplayFormat(budget.amount);
  dayPickerInput.innerHTML = budget.from_display;
  const amountForm = document.getElementById('formbudget_amount');
  instantAmountValidation(amountForm);
  initDatePickerCalendar(self.budgetEditCalendar, dayPicker, pickerDates, self.editdatepickerInput);
};
//initialize add goal form
const initAddGoalForm = () => {
  instantAmountValidation(self.addGoalform);
  if (self.categoriesList.length===0) {
    fetchData('getUserCategories', (error, results) => {
      if (error) { // Got an error!
        showErrorView();
        console.error(error);
      } else {
        if (results.length>0) {
          let usercategories = [];
          results.forEach(category => {
            if(!usercategories.includes(category.name)){
              usercategories[usercategories.length] = category.name;
            }
          });
          self.categoriesList = usercategories.sort();
        }else{
          const baseList = ["bar & café","bills & fees","clothing", "communication","cosmetics & beauty",
          "donations & charity","education","entertainment","gifts","health","housing","investments","restaurant & delivery",
          "sports & fitness","supermarket","technology","transportation","traveling & vacation","vehicle","miscellaneous"];
          self.categoriesList = baseList.sort();
        }
        createCategoriesSelectBox();
      }
    });
  }else{
    createCategoriesSelectBox();
  }
};
//get available categories for goals
const getSelectBoxOptions = () => {
  let options = [];
  if (self.goalsCategories.length===0) {
    options = self.categoriesList;
  }else{
    for (let i = 0; i < self.categoriesList.length; i++) {
      if(!self.goalsCategories.includes(self.categoriesList[i])){
        options[options.length] = self.categoriesList[i];
      }
    }
    options.sort();
  }
  return options;
};
//create select box for category of goal
const createCategoriesSelectBox = () => {
  const boxChecker = document.querySelectorAll('.addGoalContainer');
  const select_indoc = document.getElementById('category_select');
  if (boxChecker.length>1 || select_indoc!=null) {
    boxChecker[0].remove();
  }
  const options = getSelectBoxOptions();
  if (options.length>0) {
    const selectbox = createSelectBox('category_select', options, 'addGoalContainer', 'input_tag select_tag', 'Select Category', 'add_goal_input', 'goal_category', options[0], 'add_goal_label');
    self.addGoalform.insertBefore(selectbox, self.addGoalform.childNodes[1]);
    const addGoalSelectBox = document.getElementById('category_select');
    initSelectBox(addGoalSelectBox, options[0]);
  }
  displayElement(self.actionButtonsContainer);
};
//reset clear budget form on click
const resetClearBudget = (event) => {
  event.preventDefault();
  const labels = document.querySelectorAll('.budget_label');
  const formFields = document.querySelectorAll('.budget_input');
  clearBudgetForm(labels, formFields);
};
//clear budget form
const clearBudgetForm = (labels, formFields) => {
  clearAppForm(labels, formFields);
  const startdayparts = getDateParts(self.budgetPickerDates['today']);
  formFields[1].innerHTML=startdayparts[0]+"/"+startdayparts[1]+"/"+startdayparts[2];
  formFields[1].classList.remove('has_selected_datetime');
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
//format date strings
const formatDate = (string, splitter, joiner) => {
  return string.split(splitter).reverse().join(joiner);
};
