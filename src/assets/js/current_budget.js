/*
* ACTIONS & BEHAVIOR
*/
//initialize current budget view
const initCurrentBudgetView = (previousBudget = self.previousBudget, currentBudget = self.currentBudget, pickerDates = self.budgetPickerDates) => {
  self.allforms = "";
  self.allforms = document.querySelectorAll('.budgetForm');
  initBudgetCard();
  initAddGoalForm();
  initGoalsSectionHtml();
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
/*
*  UPDATE  BUDGET AMOUNT OR PERIOD
*/
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
//update message for user
const updateBudgetMessageHTML=(type)=>{
  const message = document.createElement('p');
  message.setAttribute('id', `budgetData_${type}`);
  message.classList.add("budget_data", "update_msg");
  message.innerHTML = `Updating budget ${type}...`;
  return message;
};
/*
* CREATE HTML FOR INTERFACE FOR USERS WITH A CURRENT BUDGET
*/
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
