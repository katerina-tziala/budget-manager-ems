/*
* ACTIONS & BEHAVIOR
*/
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
};
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
//clear budget form
const clearBudgetForm = (labels, formFields) => {
  clearAppForm(labels, formFields);
  const startdayparts = getDateParts(self.budgetPickerDates['today']);
  formFields[1].innerHTML=startdayparts[0]+"/"+startdayparts[1]+"/"+startdayparts[2];
  formFields[1].classList.remove('has_selected_datetime');
};
//reset clear budget form on click
const resetClearBudget = (event) => {
  event.preventDefault();
  const labels = document.querySelectorAll('.budget_label');
  const formFields = document.querySelectorAll('.budget_input');
  clearBudgetForm(labels, formFields);
};
/*
* CREATE HTML FOR INTERFACE FOR USERS WITHOUT A CURRENT BUDGET
*/
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
  label.classList.add("budget_label");
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
