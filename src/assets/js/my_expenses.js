"use strict";
//incoming lists
let categoriesList, budgetList, expenseList, goalList;
//variables for display
let registrationDate, goalFilters, amountFilters, symmaryCards, filtersList, updatedGoalList, filteredExpenseList, sortedExpenseList, displayExpenseList;
//elements
let optionsWrapper, basicFiltersContainer, amountFiltersContainer, openSortBtn, goalsSwitcher, selectedSortOptionsContainer, sortIcons, sortopt_msg, sortActionBtnContainer, sortingSection, expenses_msg, expensesContainer;
//initialize my expenses view
const renderMyExpenses = (categories, budgets, expenses, goals) => {
  self.categoriesList = [];
  self.expenseList = [];
  self.budgetList = [];
  self.goalList = [];
  self.updatedGoalList = [];
  self.categoriesList = categories;
  self.expenseList = expenses;
  self.budgetList = budgets;
  self.budgetList.sort((item_a, item_b)=>{
    return sortByID(item_a, item_b, "desc");
  });
  self.goalList = goals;
  self.goalFilters = false;
  self.amountFilters = false;
  self.symmaryCards = false;
  self.filteredExpenseList = [];
  self.sortedExpenseList = [];
  self.displayExpenseList = [];
  self.registrationDate =  self.userInfo.registration_date.split(" ")[0];
  prepareMain("clear");
  createExpensesHTMLContent();
  prepareViewAndVariables();
  initPageView();
  if (!self.userInfo.has_current_budget) {
    showBudgetNotification();
  }
};
//update HTML view on selecting filter option
document.addEventListener("change", (event) => {
  filterDataAndInitializeLists();
  renderExpensesHTML();
});
/*
* ACTIONS & BEHAVIOR
*/
//function to prepare view
const prepareViewAndVariables = () => {
  self.optionsWrapper = document.getElementById('options_wrapper');
  self.goalsSwitcher = document.getElementById('goals_switch_container');
  self.sumCardsSwitcher = document.getElementById('smrcards_switch_container');
  self.basicFiltersContainer = document.getElementById('filtersContainer_basic');
  self.amountFiltersContainer = document.getElementById('filtersContainer_amounts');
  self.openSortBtn = document.getElementById('sort_toggle_open');
  self.selectedSortOptionsContainer = document.getElementById('selectedSortOptions');
  self.sortIcons = document.querySelectorAll('.sortIcon');
  self.sortopt_msg = document.getElementById('sortopt_msg');
  self.sortActionBtnContainer = document.getElementById('sortActionBtnContainer');
  self.expenses_msg = document.getElementById('expenses_msg');
  self.sortingSection = document.getElementById('sorting_wrapper');
  self.expensesContainer = document.getElementById('expensesList');
  hideLoader();
  if (self.goalList.length===0) {
    hideElement(self.goalsSwitcher);
  }
  if (self.expenseList.length===0) {
    hideElement(self.optionsWrapper);
  }
  hideElement(self.sortingSection);
  hideElement(self.sumCardsSwitcher);
};
//initialize page view
const initPageView = () => {
  generateFilterList();
  populateFiltersHTML();
  filterDataAndInitializeLists();
  renderExpensesHTML();
};
//delete expense
const deleteExpense = (event) => {
  event.preventDefault();
  const id = event.target.id.split("_").pop();
  const expenseCard = document.getElementById(`expenseCard_${id}`);
  const previousHTML = expenseCard.innerHTML;
  for (let i = 5; i > 1; i--) {
    expenseCard.childNodes[i].remove();
  }
  const delete_msg = document.createElement('p');
  delete_msg.classList.add("delete_expense_msg");
  delete_msg.innerHTML = `Deleting expense...`;
  expenseCard.append(delete_msg);
  let thisExpense = self.expenseList;
  thisExpense = thisExpense.filter((r) => r.id === parseInt(id));
  thisExpense = thisExpense[0];
  const data = {
    "id": thisExpense.id,
    "amount": parseFloat(thisExpense.amount),
    "category": decodeEntities(thisExpense.category),
    "payment":thisExpense.payment,
    "date": thisExpense.expense_date,
    "time":thisExpense.expense_time,
    "location":thisExpense.location,
    "store":thisExpense.store,
    "comments":thisExpense.comments,
    "request_type": "delete_expense"
  }
  sendData('deleteUserExpense', data).then((response)=>{
    if(response.message==="invalid_request"){
      invalidRequestHandler(data);
     }
    else if(response.message==="success"){
      let updateList = self.expenseList;
      updateList = updateList.filter((expense) => expense.id != parseInt(id));
      self.expenseList = [];
      self.expenseList = updateList;
      initPageView();
    }else{
      expenseCard.innerHTML = previousHTML;
      const toast_options = {
        "message": messageGenerator({initiator:"delete_expense", message_type:"else_error", error_part:"delete this expense"}),
        "type": "fadeout",
        "timer": 10000,
        "buttonsmode": "got_it",
        "container_classes":["show_toast"]
      };
      showToaster(toast_options);
    }
  });
};
//switch option
const switchOption = (event) => {
  const option = event.target.id.split("_").pop();
  const switchButton = document.getElementById(`switch_${option}`);
  const switch_next_status = switchButton.classList[1]!='unswitced'?'off':'on';
  const selfStatus = switch_next_status==='off'?false:true;
  switchDisplayHandler(switchButton, option, switch_next_status);
  if (option==="goals") {
    self.goalFilters = selfStatus;
    const cardsButton = document.getElementById('switch_smrcards');
    const cardsButtonStatus = "off";
    switchDisplayHandler(cardsButton, "smrcards", cardsButtonStatus);
    self.symmaryCards = false;
    populateFiltersHTML();
    filterDataAndInitializeLists();
    renderExpensesHTML();
  }else if (option==="amounts") {
    self.amountFilters = selfStatus;
    if (self.amountFilters===false) {
      hideElement(self.amountFiltersContainer);
    }else{
      displayElement(self.amountFiltersContainer);
    }
  }
  else{
    self.symmaryCards = selfStatus;
    summaryCardHandler();
  }
};
//display hide summary cards
const summaryCardHandler = (displayExpenseList = self.displayExpenseList, expensesContainer = self.expensesContainer) => {
  const cardsChecker = document.querySelectorAll('.summaryCard');
  if (cardsChecker.length>0) {
    for (let i = 0; i < cardsChecker.length; i++) {
      cardsChecker[i].remove();
    }
  }
  if (self.symmaryCards===true) {//cards toggle open
    const overviewData = generateOverviewData();
    const overviewCard = createSummaryCard(overviewData);
    expensesContainer.insertBefore(overviewCard, expensesContainer.childNodes[0]);
    if (self.goalFilters===true) {
      const filterInputs = document.querySelectorAll('.filter_input');
      const goal = filterInputs[0].value;
      const category = goal.split(" (")[0];
      const goal_dates = goal.split("(")[1].split("&nbsp;-&nbsp;");
      const from_date = goal_dates[0].split("/").reverse().join("-");
      let to_date = goal_dates[1].split(")")[0];
      to_date = to_date.split("/").reverse().join("-");
      const filters = {
        "from_date": from_date,
        "to_date": to_date,
        "category": category
      }
      const goalItems = getOneGoal(filters);
      const goalFound  = goalItems[0];
      let icon_class = "success";
      if (parseFloat(overviewData.total)>parseFloat(goalFound.amount)) {
         icon_class = "fail";
      }else if (parseFloat(overviewData.total)===parseFloat(goalFound.amount)) {
         icon_class = "balance";
      }
      goalFound.icon_class = icon_class;
      const goalOverviewCard = createGoalDetailsCard(goalFound);
      expensesContainer.insertBefore(goalOverviewCard, expensesContainer.childNodes[0]);
    }
  }else{
    const cardsChecker = document.querySelectorAll('.summaryCard');
    if (cardsChecker.length>0) {
      for (let i = 0; i < cardsChecker.length; i++) {
        cardsChecker[i].remove();
      }
    }
  }
};
//set index of expenses and update link
const setCardsIndexAndUpdateLink = () => {
  const expense_index = document.querySelectorAll('.expense_index');
  const expenseDetailsBtns = document.querySelectorAll('.expenseDetailsBtn');
  for (let i = 0; i < expense_index.length; i++) {
    expense_index[i].innerHTML = i+1;
    expenseDetailsBtns[i].href=expenseDetailsBtns[i].href+(i+1);
  }
};
//open close sorting section
const toggleSortOptions = (event, sortingSection = self.sortingSection, openSortBtn = self.openSortBtn) => {
  const buttonID = event.target.id;
  const action = buttonID.split("_").pop();
  if (action==="hide") {
    hideElement(sortingSection);
    displayElement(openSortBtn);
  }else{
    displayElement(sortingSection);
    hideElement(openSortBtn);
  }
};
//add sorting option
const addSortOption = (event, sortIcons = self.sortIcons, container = self.selectedSortOptionsContainer) => {
  const id = event.target.id.split("_").pop();
  const button = document.getElementById(`sortBtn_${id}`);
  const filter_icon = document.getElementById(`iconsrt_${id}`);
  const filter_text = document.getElementById(`textsrt_${id}`);
  const mod_sel_opt = filter_text.innerHTML;
  sortButtonDisplayHandler(filter_icon, filter_text);
  const selected_srt = filter_icon.classList[2].split("-")[3];
  if(container.childNodes.length > 7){
    updateSelectedOption(id, mod_sel_opt);
  }else{
    const list_item = document.getElementById(`sortoptcard_${id}`);
    if(list_item===null){
      createSelectedOption(id, mod_sel_opt);
    }
    else{
      updateSelectedOption(id, mod_sel_opt);
    }
    if(container.childNodes.length>0){
      hideElement(self.sortopt_msg);
      displayElement(self.sortActionBtnContainer);
    }
  }
};
//update sorting option
const updateSelectedOption = (id, ordertype) => {
  const ordervalue = document.getElementById(`ordertype_${id}`);
  ordervalue.innerHTML = ordertype;
};
//remove sorting option
const removeSortOption = (event, container = self.selectedSortOptionsContainer) => {
  const id = event.target.id.split("_").pop();
  const sortcard = document.getElementById(`sortoptcard_${id}`);
  sortcard.remove();
  if(container.childNodes.length<1){
    resetAndClearSortingOptions();
  }
};
//clear sorting options
const clearSortOptions = (event) => {
  resetAndClearSortingOptions();
  const expenseCards = document.querySelectorAll('.expenseCard');
  const results = self.filteredExpenseList;
  for (let i = 0; i < expenseCards.length; i++) {
    expenseCards[i].remove();
  }
  renderExpensesHTML();
};
//resert and clear sorting options
const resetAndClearSortingOptions = (container = self.selectedSortOptionsContainer) => {
  container.innerHTML="";
  displayElement(self.sortopt_msg);
  hideElement(self.sortActionBtnContainer);
  filterDataAndInitializeLists();
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
//manage display of switchers
const switchDisplayHandler = (switchButton, switchOption, status) => {
  const switchCircle = document.getElementById(`switch_indicator_${switchOption}`);
  let base_aria = "close";
  if (status==="off") {
    switchButton.classList.remove("switced");
    switchCircle.classList.remove("switced");
    switchButton.classList.add("unswitced");
    switchCircle.classList.add("unswitced");
    switchButton.setAttribute('aria-checked', false);
    base_aria = "open";
  }else{
    switchButton.classList.remove("unswitced");
    switchCircle.classList.remove("unswitced");
    switchButton.classList.add("switced");
    switchCircle.classList.add("switced");
    switchButton.setAttribute('aria-checked', true);
  }
  if (switchOption!="smrcards") {
    const baseEnd = switchOption.length-1;
    const base_text = switchOption.substr(0, baseEnd);
    switchButton.setAttribute('aria-label', `${base_aria} ${base_text} filters`);
  }else{
    base_aria = base_aria==='open'?'show':'hide';
    switchButton.setAttribute('aria-label', `${base_aria} summary card(s)`);
  }
  switchButton.blur();
  switchCircle.blur();
};
/*
* FILTER AND SORT DATA
*/
//filter data and initialize lists
const filterDataAndInitializeLists = (goalFilters = self.goalFilters, expenseList = self.expenseList) =>{
  self.budgetList.sort((item_a, item_b)=>{
    return sortByID(item_a, item_b, "desc");
  });
  self.categoriesList.sort((item_a, item_b)=>{
    return sortByID(item_a, item_b, "desc");
  });
  const filterInputs = document.querySelectorAll('.filter_input');
  if (expenseList.length>0) {
    let filters;
    if (goalFilters===true) {
      const goal = filterInputs[0].value;
      const category = goal.split(" (")[0];
      const goal_dates = goal.split("(")[1].split("&nbsp;-&nbsp;");
      const from_date = goal_dates[0].split("/").reverse().join("-");
      let to_date = goal_dates[1].split(")")[0];
      to_date = to_date.split("/").reverse().join("-");
      filters = {
        "from_date": from_date,
        "to_date": to_date,
        "category": category,
        "payment": filterInputs[1].value,
        "location": filterInputs[2].value,
        "store": filterInputs[3].value,
        "min_amount": parseFloat(filterInputs[4].value),
        "max_amount": parseFloat(filterInputs[5].value)
      }
    }else{
      filters = {
        "from_date": filterInputs[0].value.split("/").reverse().join("-"),
        "to_date": filterInputs[1].value.split("/").reverse().join("-"),
        "category": filterInputs[2].value,
        "payment": filterInputs[3].value,
        "location": filterInputs[4].value,
        "store": filterInputs[5].value,
        "min_amount": parseFloat(filterInputs[6].value),
        "max_amount": parseFloat(filterInputs[7].value)
      }
    }
    self.filteredExpenseList = [];
    self.sortedExpenseList = [];
    self.displayExpenseList = [];
    const filtered_results = filterExpenseList(filters);
    self.filteredExpenseList = filtered_results;
    self.sortedExpenseList = self.filteredExpenseList;
    self.displayExpenseList = self.filteredExpenseList;
    sortDisplayList();
  }
};
//short display list based on user's selected options
const sortDisplayList = () => {
  const shortoptions = self.selectedSortOptionsContainer.childNodes;
  if (shortoptions.length>0) {
    let sorting_by = [];
      for (let i = 0; i<shortoptions.length; i++) {
      let id = shortoptions[i].childNodes[0].id.split("_").pop();
      let orderby = shortoptions[i].childNodes[1].innerHTML;
      let functionName;
      if(id==="date"){
       functionName = sortByDate;
      }else if(id==="time"){
        functionName = sortByTime;
      }else if(id==="amount"){
        functionName = sortByAmount;
      }else if(id==="category"){
        functionName = sortByCategory;
      }else if(id==="payment"){
        functionName = sortByPayment;
      }else if(id==="location"){
        functionName = sortByLocation;
      }else if(id==="store"){
       functionName = sortByStore;
      }
      let item = {"sort_opt": id, "sortby": orderby, "function":functionName};
      sorting_by[sorting_by.length] = item;
    }
    if(sorting_by.length===1){
      self.sortedExpenseList.sort((item_a, item_b)=>{
        return sorting_by[0]["function"](item_a, item_b, sorting_by[0]["sortby"]);
      });
    }
    if(sorting_by.length===2){
      self.sortedExpenseList.sort((item_a, item_b)=>{
        let sort_one = sorting_by[0]["function"](item_a, item_b, sorting_by[0]["sortby"]);
        let sort_two = sorting_by[1]["function"](item_a, item_b, sorting_by[1]["sortby"]);
        return  sort_one || sort_two;
      });
    }
    if(sorting_by.length===3){
      self.sortedExpenseList.sort((item_a, item_b)=>{
        let sort_one = sorting_by[0]["function"](item_a, item_b, sorting_by[0]["sortby"]);
        let sort_two = sorting_by[1]["function"](item_a, item_b, sorting_by[1]["sortby"]);
        let sort_three = sorting_by[2]["function"](item_a, item_b, sorting_by[2]["sortby"]);
        return  sort_one || sort_two || sort_three;
      });
    }
    if(sorting_by.length===4){
      self.sortedExpenseList.sort((item_a, item_b)=>{
        let sort_one = sorting_by[0]["function"](item_a, item_b, sorting_by[0]["sortby"]);
        let sort_two = sorting_by[1]["function"](item_a, item_b, sorting_by[1]["sortby"]);
        let sort_three = sorting_by[2]["function"](item_a, item_b, sorting_by[2]["sortby"]);
        let sort_four = sorting_by[3]["function"](item_a, item_b, sorting_by[3]["sortby"]);
        return  sort_one || sort_two || sort_three || sort_four;
      });
    }
    if(sorting_by.length===5){
      self.sortedExpenseList.sort((item_a, item_b)=>{
        let sort_one = sorting_by[0]["function"](item_a, item_b, sorting_by[0]["sortby"]);
        let sort_two = sorting_by[1]["function"](item_a, item_b, sorting_by[1]["sortby"]);
        let sort_three = sorting_by[2]["function"](item_a, item_b, sorting_by[2]["sortby"]);
        let sort_four = sorting_by[3]["function"](item_a, item_b, sorting_by[3]["sortby"]);
        let sort_five = sorting_by[4]["function"](item_a, item_b, sorting_by[4]["sortby"]);
        return  sort_one || sort_two || sort_three || sort_four || sort_five;
      });
    }
    if(sorting_by.length===6){
      self.sortedExpenseList.sort((item_a, item_b)=>{
        let sort_one = sorting_by[0]["function"](item_a, item_b, sorting_by[0]["sortby"]);
        let sort_two = sorting_by[1]["function"](item_a, item_b, sorting_by[1]["sortby"]);
        let sort_three = sorting_by[2]["function"](item_a, item_b, sorting_by[2]["sortby"]);
        let sort_four = sorting_by[3]["function"](item_a, item_b, sorting_by[3]["sortby"]);
        let sort_five = sorting_by[4]["function"](item_a, item_b, sorting_by[4]["sortby"]);
        let sort_six = sorting_by[5]["function"](item_a, item_b, sorting_by[5]["sortby"]);
        return  sort_one || sort_two || sort_three || sort_four || sort_five || sort_six;
      });
    }
    if(sorting_by.length===7){
      self.sortedExpenseList.sort((item_a, item_b)=>{
        let sort_one = sorting_by[0]["function"](item_a, item_b, sorting_by[0]["sortby"]);
        let sort_two = sorting_by[1]["function"](item_a, item_b, sorting_by[1]["sortby"]);
        let sort_three = sorting_by[2]["function"](item_a, item_b, sorting_by[2]["sortby"]);
        let sort_four = sorting_by[3]["function"](item_a, item_b, sorting_by[3]["sortby"]);
        let sort_five = sorting_by[4]["function"](item_a, item_b, sorting_by[4]["sortby"]);
        let sort_six = sorting_by[5]["function"](item_a, item_b, sorting_by[5]["sortby"]);
        let sort_seven = sorting_by[6]["function"](item_a, item_b, sorting_by[6]["sortby"]);
        return sort_one || sort_two || sort_three || sort_four || sort_five || sort_six || sort_seven;
      });
    }
    const results = self.sortedExpenseList;
    self.displayExpenseList = [];
    self.displayExpenseList = results;
  }
};
//sort expenses and display results
const sortExpenses = (event) => {
  sortDisplayList();
  renderExpensesHTML();
};
