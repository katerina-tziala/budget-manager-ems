"use strict";
//elements
let noBudgetView, currentBudgetView, addGoalform, actionButtonsContainer, goals_msg, goalsListSection, allforms;
//data
let budgetList, previousBudget, currentBudget, categoriesList, goalsCategories;
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
//render the budget and goals page
const renderBudgetGoal = (budgets)=>{
  self.categoriesList = [];
  self.goalsCategories = [];
  self.goalsList = [];
  self.budgetList = budgets;
  const budgetIndicator = self.userInfo.has_current_budget;
  initPageData(budgetIndicator);
  initPageView(budgetIndicator);
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
//get a goal by id
const getGoalByID = (id) => {
  return getByID(id, self.goalsList)[0];
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
