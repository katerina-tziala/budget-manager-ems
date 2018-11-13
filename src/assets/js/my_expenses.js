"use strict";
//incoming lists
let categoriesList, budgetList, expenseList, goalList;
//variables for display
let registrationDate, goalFilters, amountFilters, symmaryCards, filtersList, updatedGoalList, filteredExpenseList, sortedExpenseList, displayExpenseList;
//elements
let optionsWrapper, basicFiltersContainer, amountFiltersContainer, openSortBtn, goalsSwitcher, selectedSortOptionsContainer, sortIcons, sortopt_msg, sortActionBtnContainer, sortingSection, expenses_msg, expensesContainer;
//initialize my expenses view
const initMyExpensesView = (personalInfo, categories, budgets, expenses, goals) => {
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
  self.registrationDate =  personalInfo.registration_date.split(" ")[0];
  createExpensesHTMLContent();
  prepareViewAndVariables();
  initPageView();
  if (personalInfo.has_current_budget==="no") {
    showBudgetNotification();
  }
};
//create expenses html
const createExpensesHTMLContent = (main = self.main) => {
  const add_exp = createAddLink('add_expense', 'add<br>expense', 'add expense', pages.add_expense.url);
  const expense_section = document.createElement('section');
  expense_section.setAttribute('id', 'expensesContainer');
  expense_section.setAttribute('role', 'region');
  expense_section.setAttribute('aria-label', 'expenses');
  const expenses_msg = document.createElement('p');
  expenses_msg.setAttribute('id', 'expenses_msg');
  expenses_msg.className = "noItemsMessage";
  expenses_msg.innerHTML = "No expenses yet!";
  const expenses_list = document.createElement('ul');
  expenses_list.setAttribute('id', 'expensesList');
  expenses_list.classList.add('expensesList', 'hidden');
  expenses_list.setAttribute('aria-label', 'expenses list');
  expense_section.append(expenses_msg, expenses_list);
  const filters_section = createFiltersSection();
  const sorting_section = createSortingSection();
  main.append(filters_section, sorting_section, expense_section, add_exp);
};
//create filters section
const createFiltersSection = () => {
  const wrapper = document.createElement('section');
  wrapper.setAttribute('id', 'options_wrapper');
  wrapper.setAttribute('role', 'region');
  wrapper.setAttribute('aria-label', 'filters and options');
  wrapper.className = "section_filter_sort";
  const header = document.createElement('h3');
  header.className = "section_header";
  const header_span = document.createElement('h3');
  header_span.innerHTML = "Select Filters";
  const sort_toggle_open = createButton('sort_toggle_open', '', 'open options to sort expenses', toggleSortOptions);
  sort_toggle_open.setAttribute('title', 'sort expenses');
  sort_toggle_open.classList.add('sort_toggle_btn', 'round_btn', 'fas', 'fa-random');
  const switchers = document.createElement('div');
  switchers.className = "filters_wrapper";
  const goal_switch = createSwitcher('goals', 'Goal Filters', 'open goal filters', 'switch_goals', 'goals_switch_container');
  const amounts_switch = createSwitcher('amounts', 'Amount Filters', 'open amount filters', 'switch_amounts');
  const smrcards = createSwitcher('smrcards', 'Summary Card(s)', 'show summary card(s)', 'switch_smrcards', 'smrcards_switch_container');
  switchers.append(goal_switch, amounts_switch, smrcards);
  const basic_filters = document.createElement('div');
  basic_filters.setAttribute('id', 'filtersContainer_basic');
  basic_filters.className = "filters_wrapper";
  const amount_filters = document.createElement('div');
  amount_filters.setAttribute('id', 'filtersContainer_amounts');
  amount_filters.className = "filters_wrapper";
  header.append(header_span, sort_toggle_open);
  wrapper.append(header, switchers, basic_filters, amount_filters);
  return wrapper;
};
//create sorting section
const createSortingSection = () => {
  const wrapper = document.createElement('section');
  wrapper.setAttribute('id', 'sorting_wrapper');
  wrapper.setAttribute('role', 'region');
  wrapper.setAttribute('aria-label', 'sorting options');
  wrapper.classList.add("section_filter_sort", "hidden");
  const header = document.createElement('h3');
  header.classList.add("section_header", "sorting");
  const header_span = document.createElement('h3');
  header_span.innerHTML = "Select Sorting Options";
  const closebtn = createButton('sort_toggle_hide', '', 'close options to sort expenses', toggleSortOptions);
  closebtn.setAttribute('title', 'sort expenses');
  closebtn.classList.add('sort_toggle_btn', 'round_btn', 'fas', 'fa-times');
  header.append(header_span, closebtn);
  const buttons_wrapper = document.createElement('div');
  buttons_wrapper.className = "sort_btns_wrapper";
  const date_text = `<i id='iconsrt_date' class='sortIcon fas fa-sort-amount-down'></i><span id='textsrt_date' class='sort_indicator'>desc</span><span id='sorttag_date' class='sort_tag'>date</span>`;
  const dateButton = createButton('sortBtn_date', date_text, 'sort expenses by date', addSortOption);
  dateButton.className = "sortBtn";
  const amount_text = `<i id='iconsrt_amount' class='sortIcon fas fa-sort-numeric-up'></i><span id='textsrt_amount' class='sort_indicator'>desc</span><span id='sorttag_amount' class='sort_tag'>amount</span>`;
  const amountButton = createButton('sortBtn_amount', amount_text, 'sort expenses by amount', addSortOption);
  amountButton.className = "sortBtn";
  const category_text = `<i id='iconsrt_category' class='sortIcon fas fa-sort-alpha-down'></i><span id='textsrt_category' class='sort_indicator'>asc</span><span id='sorttag_category' class='sort_tag'>category</span>`;
  const categoryButton = createButton('sortBtn_category', category_text, 'sort expenses by category', addSortOption);
  categoryButton.className = "sortBtn";
  const payment_text = `<i id='iconsrt_payment' class='sortIcon fas fa-sort-alpha-down'></i><span id='textsrt_payment' class='sort_indicator'>asc</span><span id='sorttag_payment' class='sort_tag'>payment</span>`;
  const paymentButton = createButton('sortBtn_payment', payment_text, 'sort expenses by payment', addSortOption);
  paymentButton.className = "sortBtn";
  const time_text = `<i id='iconsrt_time' class='sortIcon fas fa-sort-amount-down'></i><span id='textsrt_time' class='sort_indicator'>desc</span><span id='sorttag_time' class='sort_tag'>time</span>`;
  const timeButton = createButton('sortBtn_time', time_text, 'sort expenses by time', addSortOption);
  timeButton.className = "sortBtn";
  const store_text = `<i id='iconsrt_store' class='sortIcon fas fa-sort-alpha-down'></i><span id='textsrt_store' class='sort_indicator'>asc</span><span id='sorttag_store' class='sort_tag'>store</span>`;
  const storeButton = createButton('sortBtn_store', time_text, 'sort expenses by store', addSortOption);
  storeButton.className = "sortBtn";
  const location_text = `<i id='iconsrt_location' class='sortIcon fas fa-sort-alpha-down'></i><span id='textsrt_location' class='sort_indicator'>asc</span><span id='sorttag_location' class='sort_tag'>location</span>`;
  const locationButton = createButton('sortBtn_location', time_text, 'sort expenses by location', addSortOption);
  locationButton.className = "sortBtn";
  buttons_wrapper.append(dateButton, amountButton, categoryButton, paymentButton, timeButton, storeButton, locationButton);
  const header_h4 = document.createElement('h4');
  header_h4.className = "sort_selected";
  header_h4.innerHTML = `Sort Expenses By <span>(order matters!)</span>`;
  const sorting_container  = document.createElement('div');
  sorting_container.setAttribute('id', 'selectedSortContainer');
  const sortopt_msg  = document.createElement('p');
  sortopt_msg.setAttribute('id', 'sortopt_msg');
  sortopt_msg.className = "noItemsMessage";
  sortopt_msg.innerHTML = "No option selected!";
  const sorting_list  = document.createElement('ol');
  sorting_list.setAttribute('id', 'selectedSortOptions');
  sorting_list.className = "centeredFlexbox";
  sorting_container.append(sortopt_msg, sorting_list);
  const sortActionBtnContainer = document.createElement('div');
  sortActionBtnContainer.setAttribute('id', 'sortActionBtnContainer');
  sortActionBtnContainer.classList.add("sortActionBtnContainer", "hidden");
  const clearSortBtn = createButton('clearSortBtn', 'clear options', 'clear sorting options', clearSortOptions);
  clearSortBtn.classList.add("app_btn", "sortActionBtn");
  const applySortBtn = createButton('applySortBtn', 'sort expenses', 'apply sorting options', sortExpenses);
  applySortBtn.classList.add("app_btn", "sortActionBtn");
  sortActionBtnContainer.append(clearSortBtn, applySortBtn);
  wrapper.append(header, buttons_wrapper, header_h4, sorting_container, sortActionBtnContainer);
  return wrapper;
};
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
//update HTML view on selecting filter option
document.addEventListener("change", (event) => {
  filterDataAndInitializeLists();
  renderExpensesHTML();
});
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
//render view
const renderExpensesHTML = (displayExpenseList = self.displayExpenseList, expensesContainer = self.expensesContainer) => {
  if (self.expenseList.length===0) {
    self.expenses_msg.innerHTML = "No expenses yet!";
    displayElement(self.expenses_msg);
    hideElement(self.sumCardsSwitcher);
    hideElement(expensesContainer);
  }else if (displayExpenseList.length===0) {
    self.expenses_msg.innerHTML = "No expenses matching your criteria!<br>Try another combination!";
    displayElement(self.expenses_msg);
    hideElement(self.sumCardsSwitcher);
    hideElement(expensesContainer);
  }else if (displayExpenseList.length>0 && self.expenseList.length>0) {
    hideElement(self.expenses_msg);
    displayElement(self.sumCardsSwitcher);
    expensesContainer.innerHTML="";
    displayExpenseList.forEach(expense => {
      let card = createExpenseCard(expense);
      expensesContainer.append(card);
    });
    displayElement(expensesContainer);
    const icons = document.querySelectorAll('.category_icon');
    loadCategoryIcons(icons);
    setCardsIndexAndUpdateLink();
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
//get overview data
const generateOverviewData = (displayExpenseList = self.displayExpenseList) => {
  let total=0;
  let min=displayExpenseList[0].amount;
  let max=0;
  displayExpenseList.forEach(expense => {
    total = total+expense.amount;
    if (expense.amount<min) {
      min = getDecimalFormat(parseFloat(expense.amount));
    }
    if (expense.amount>max) {
      max = getDecimalFormat(parseFloat(expense.amount));
    }
  });
  const data = {
    "expenses": displayExpenseList.length,
    "total": total,
    "average": getDecimalFormat(total/displayExpenseList.length),
    "min": min,
    "max": max
  };
  return data;
};
//create summary card
const createSummaryCard = (data) => {
  const card = document.createElement('div');
  card.className = 'summaryCard';
  card.setAttribute('id', 'expensesSummaryCard');
  const cardHeader = document.createElement('p');
  cardHeader.className = 'summary_header';
  cardHeader.innerHTML = "Summary of Expenses";
  const expSection = createSummarySection('# of Expenses', parseInt(data.expenses));
  const totalSection = createSummarySection('Total Amount', "&euro;&nbsp;"+getDisplayFormat(data.total));
  const avgSection = createSummarySection('Average Amount', "&euro;&nbsp;"+getDisplayFormat(data.average));
  const maxSection = createSummarySection('Max Amount', "&euro;&nbsp;"+getDisplayFormat(data.max));
  const minSection = createSummarySection('Min Amount', "&euro;&nbsp;"+getDisplayFormat(data.min));
  card.append(cardHeader, expSection, totalSection, avgSection, maxSection, minSection);
  return card;
};
//create goal details card
const createGoalDetailsCard = (goal) => {
  const card = document.createElement('div');
  card.className = 'summaryCard';
  card.setAttribute('id', 'goalSummaryCard');
  const cardHeader = document.createElement('p');
  cardHeader.className = 'summary_header';
  cardHeader.innerHTML = "Goal Details";
  const cardIcon = document.createElement('div');
  cardIcon.classList.add("goalSummaryIcon", "fas", "fa-piggy-bank", goal.icon_class);
  let period = goal.goal_from.split("-").reverse().join("/");
  period = period +" - "+ goal.goal_to.split("-").reverse().join("/");
  const periodSection = createSummarySection('Period', period);
  const categorySection = createSummarySection('Category', decodeEntities(goal.category));
  const maxSection = createSummarySection('Max Goal Amount', "&euro;&nbsp;"+getDisplayFormat(goal.amount));
  let created_date = goal.create_date.split("-").reverse().join("/");
  created_date = `<span class='goal_createday'>${created_date}</span>`;
  const create_time = `<span class='goal_createtime'>${goal.create_time}</span>`;
  const createSection = createSummarySection('Created At', created_date+create_time);
  card.append(cardHeader, cardIcon, periodSection, categorySection, maxSection, createSection);
  return card;
};
//create summary section
const createSummarySection = (tagtext, data) => {
  const section = document.createElement('div');
  section.classList.add("centeredFlexbox", "summary_section");
  const summary_tag = document.createElement('p');
  summary_tag.classList.add("summary_tag");
  summary_tag.innerHTML = tagtext;
  const summary_data = document.createElement('p');
  summary_data.classList.add("summary_data");
  summary_data.innerHTML = data;
  section.append(summary_tag, summary_data);
  return section;
};
//create all filters in HTML page
const populateFiltersHTML = (filtersList = self.filtersList, goalFilters = self.goalFilters, amountFilters = self.amountFilters) => {
  if (self.expenseList.length>0) {
    let selectBoxOptions = {
      "id": "from_date_filter",
      "options": filtersList.all_days,
      "containerClasses": "oneFilterContainer fromDateSelectContainer",
      "select_tag": "from",
      "select_class": "filter_input",
      "placeholder": filtersList.init_days[0]
    };
    let blobOptions = {
      "placeholder":filtersList.init_days[0],
      "placeholderOption":filtersList.init_days[0],
      "search":true
    };
    if (self.goalFilters===false) {
      const goalChecker = document.querySelectorAll('.goalSelectContainer');
      if (goalChecker.length>0) {
        goalChecker[0].remove();
      }
      self.basicFiltersContainer.classList.remove("goals_filters");
      selectBoxOptions.id = "from_date_filter";
      selectBoxOptions.options = filtersList.all_days;
      selectBoxOptions.containerClasses = "oneFilterContainer fromDateSelectContainer";
      selectBoxOptions.select_tag = "from";
      selectBoxOptions.placeholder = filtersList.init_days[0],
      blobOptions.placeholder = filtersList.init_days[0];
      blobOptions.placeholderOption = filtersList.init_days[0];
      createFilterBox(selectBoxOptions, blobOptions, self.basicFiltersContainer, 0);
      selectBoxOptions.id = "to_date_filter";
      selectBoxOptions.containerClasses =  "oneFilterContainer toDateSelectContainer";
      selectBoxOptions.select_tag = "to";
      selectBoxOptions.placeholder = filtersList.init_days[1],
      blobOptions.placeholder = filtersList.init_days[1];
      blobOptions.placeholderOption = filtersList.init_days[1];
      createFilterBox(selectBoxOptions, blobOptions, self.basicFiltersContainer, 1);
      selectBoxOptions.id = "category_filter";
      selectBoxOptions.options = filtersList.categories;
      selectBoxOptions.containerClasses =  "oneFilterContainer categorySelectContainer";
      selectBoxOptions.select_tag = "category";
      selectBoxOptions.placeholder = filtersList.categories[0];
      blobOptions.placeholder = filtersList.categories[0];
      blobOptions.placeholderOption = filtersList.categories[0];
      createFilterBox(selectBoxOptions, blobOptions, self.basicFiltersContainer);
    }else{
      const fromChecker = document.querySelectorAll('.fromDateSelectContainer');
      if (fromChecker.length>0) {
        fromChecker[0].remove();
      }
      const toChecker = document.querySelectorAll('.toDateSelectContainer');
      if (toChecker.length>0) {
        toChecker[0].remove();
      }
      const categoryChecker = document.querySelectorAll('.categorySelectContainer');
      if (categoryChecker.length>0) {
        categoryChecker[0].remove();
      }
      selectBoxOptions.id = "goals filter";
      selectBoxOptions.options = filtersList.goals;
      selectBoxOptions.containerClasses =  "oneFilterContainer goalSelectContainer";
      selectBoxOptions.select_tag = "goals";
      selectBoxOptions.placeholder = filtersList.goals[0],
      blobOptions.placeholder = filtersList.goals[0];
      blobOptions.placeholderOption = filtersList.goals[0];
      self.basicFiltersContainer.classList.add("goals_filters");
      createFilterBox(selectBoxOptions, blobOptions, self.basicFiltersContainer, 0);
    }
    selectBoxOptions.id = "payment_filter";
    selectBoxOptions.options = filtersList.payments;
    selectBoxOptions.containerClasses =  "oneFilterContainer paymentSelectContainer";
    selectBoxOptions.select_tag = "payment";
    selectBoxOptions.placeholder = filtersList.payments[0];
    blobOptions.placeholder = filtersList.payments[0];
    blobOptions.placeholderOption = filtersList.payments[0];
    createFilterBox(selectBoxOptions, blobOptions, self.basicFiltersContainer);
    selectBoxOptions.id = "location_filter";
    selectBoxOptions.options = filtersList.locations;
    selectBoxOptions.containerClasses =  "oneFilterContainer locationSelectContainer";
    selectBoxOptions.select_tag = "location";
    selectBoxOptions.placeholder = filtersList.locations[0];
    blobOptions.placeholder = filtersList.locations[0];
    blobOptions.placeholderOption = filtersList.locations[0];
    createFilterBox(selectBoxOptions, blobOptions, self.basicFiltersContainer);
    selectBoxOptions.id = "store_filter";
    selectBoxOptions.options = filtersList.stores;
    selectBoxOptions.containerClasses = "oneFilterContainer storeSelectContainer";
    selectBoxOptions.select_tag = "store";
    selectBoxOptions.placeholder = filtersList.stores[0];
    blobOptions.placeholder = filtersList.stores[0];
    blobOptions.placeholderOption = filtersList.stores[0];
    createFilterBox(selectBoxOptions, blobOptions, self.basicFiltersContainer);
    selectBoxOptions.id = "min_amount";
    selectBoxOptions.options = filtersList.amounts;
    selectBoxOptions.containerClasses =  "oneFilterContainer min_amountSelectContainer";
    selectBoxOptions.select_tag = "min amount";
    selectBoxOptions.placeholder = filtersList.amounts[0];
    blobOptions.placeholder = filtersList.amounts[0];
    blobOptions.placeholderOption = filtersList.amounts[0];
    createFilterBox(selectBoxOptions, blobOptions, self.amountFiltersContainer);
    selectBoxOptions.id = "max_amount";
    selectBoxOptions.containerClasses =  "oneFilterContainer max_amountSelectContainer";
    selectBoxOptions.select_tag = "max amount";
    selectBoxOptions.placeholder = filtersList.amounts[filtersList.amounts.length-1];
    blobOptions.placeholder = filtersList.amounts[filtersList.amounts.length-1];
    blobOptions.placeholderOption = filtersList.amounts[filtersList.amounts.length-1];
    createFilterBox(selectBoxOptions, blobOptions, self.amountFiltersContainer);
    if (self.amountFilters===false) {
      hideElement(self.amountFiltersContainer);
    }else{
      displayElement(self.amountFiltersContainer);
    }
  }
};
//create a filter box
const createFilterBox = (selectBoxOptions, blobOptions, container, position=null) => {
  const checkclass = selectBoxOptions.containerClasses.split(" ")[1];
  const boxChecker = document.querySelectorAll(`.${checkclass}`);
  if (boxChecker.length>0) {
    boxChecker[0].remove();
  }
  const selectbox = createFilterSelectBox(selectBoxOptions.id, selectBoxOptions.options, selectBoxOptions.containerClasses,
    'select_tag', selectBoxOptions.select_tag, selectBoxOptions.select_class, selectBoxOptions.id, selectBoxOptions.placeholder);
  if (position===null) {
    container.append(selectbox);
  }else{
    if (container.childNodes.length===0) {
      container.append(selectbox);
    }else {
      container.insertBefore(selectbox, container.childNodes[position]);
    }
  }
  const filterBox = document.getElementById(selectBoxOptions.id);
  filterBox.blobSelect.init(blobOptions);
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
//update sorting option
const updateSelectedOption = (id, ordertype) => {
  const ordervalue = document.getElementById(`ordertype_${id}`);
  ordervalue.innerHTML = ordertype;
};
//create sorting option
const createSelectedOption = (id, ordertype, container = self.selectedSortOptionsContainer) => {
  const sortoptcard = document.createElement('li');
  sortoptcard.setAttribute('id', `sortoptcard_${id}`);
  sortoptcard.setAttribute('role', 'list item');
  sortoptcard.className = "sortCard";
  const sortopt = document.createElement('span');
  sortopt.setAttribute('id', `sortopt_${id}`);
  sortopt.className = "sortoptcard_sortopt";
  sortopt.innerHTML = id+":";
  const order_txt = document.createElement('span');
  order_txt.setAttribute('id', `ordertype_${id}`);
  order_txt.className = "sortoptcard_ordertype";
  order_txt.innerHTML = ordertype;
  const removebtn = createButton(`removesort_${id}`, "", `remove option ${id}`, removeSortOption);
  removebtn.classList.add("removeSortBtn", "fas", "fa-times");
  sortoptcard.append(sortopt, order_txt, removebtn);
  container.append(sortoptcard);
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
// create expense card
const createExpenseCard = (expense) => {
  let categoryicon = 'icon_';
  let category_base = expense.category.split(" ")[0];
  categoryicon = categoryicon+category_base;
  const card = document.createElement('li');
  card.setAttribute('role', 'list item');
  card.className = 'expenseCard';
  card.setAttribute('id',`expenseCard_${expense.id}`);
  const expenseHeader = document.createElement('div');
  expenseHeader.className = 'expense_header';
  const expenseIndex = document.createElement('p');
  expenseIndex.className = 'index_header';
  expenseIndex.innerHTML = `Expense #<span class='expense_index'></span>`;
  const dateSpan = document.createElement('span');
  dateSpan.className = 'expense_date';
  dateSpan.innerHTML = expense.expense_date.split("-").reverse().join("/");
  const timeSpan = document.createElement('span');
  timeSpan.className = 'expense_time';
  timeSpan.innerHTML = expense.expense_time;
  expenseHeader.append(expenseIndex, dateSpan, timeSpan);
  const delete_btn = createDeleteButton('expense', expense.id, deleteExpense);
  const category_icon = document.createElement('div');
  category_icon.classList.add("category_icon", categoryicon);
  const category_text = document.createElement('p');
  category_text.classList.add("category_text");
  category_text.innerHTML = decodeEntities(expense.category);
  const expenseAmountContainer = document.createElement('div');
  expenseAmountContainer.classList.add("centeredFlexbox", "expenseAmountContainer");
  const euro_icon = document.createElement('div');
  euro_icon.classList.add("expense_eurosign", "fas", "fa-euro-sign");
  const amount_payment = document.createElement('p');
  amount_payment.className = "expense_amount_payment";
  const expense_amount = document.createElement('span');
  expense_amount.className = "expense_amount";
  expense_amount.innerHTML = getDisplayFormat(expense.amount);
  const expense_payment = document.createElement('span');
  expense_payment.className = "expense_payment";
  expense_payment.innerHTML = expense.payment;
  amount_payment.append(expense_amount, expense_payment);
  expenseAmountContainer.append(euro_icon, amount_payment);
  const details_btn = document.createElement('a');
  details_btn.className = 'expenseDetailsBtn';
  details_btn.setAttribute('role', 'button');
  details_btn.setAttribute('aria-label', 'view details about expense');
  details_btn.innerHTML = 'View Details';
  details_btn.href = pages.expense_details.url+"?expense="+expense.id+"_";
  card.append(expenseHeader, delete_btn, category_icon, category_text, expenseAmountContainer, details_btn);
  return card;
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
/*
* FILTER DATA
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
//filter expenses
const filterExpenseList = (filters, data = self.expenseList) => {
  let results = data;
  results = results.filter((r) => new Date(r.expense_date).getTime() <= new Date(filters.to_date).getTime());
  results = results.filter((r) => new Date(r.expense_date).getTime() >= new Date(filters.from_date).getTime());
  results = results.filter((r) => parseFloat(r.amount) >= parseFloat(filters.min_amount));
  results = results.filter((r) => parseFloat(r.amount) <= parseFloat(filters.max_amount));
  if (filters.category != 'all') { // filter by category
    results = results.filter((r) => r.category === filters.category);
  }
  if (filters.payment != 'all') { // filter by payment
    results = results.filter((r) => r.payment === filters.payment);
  }
  if (filters.location != 'all') { // filter by location
    if (filters.location === 'not empty') {
      results = results.filter((r) => r.location.replace(/\s+/, "") != "");
    }else{
      results = results.filter((r) => r.location === filters.location);
    }
  }
  if (filters.store != 'all') { // filter by store
    if (filters.store === 'not empty') {
      results = results.filter((r) => r.store.replace(/\s+/, "") != "");
    }else{
      results = results.filter((r) => r.store === filters.store);
    }
  }
  return results;
};
//get one goal
const getOneGoal = (filters, data = self.updatedGoalList) => {
  let results = data;
  results = results.filter((r) => new Date(r.goal_from).getTime() >= new Date(filters.from_date).getTime());
  results = results.filter((r) => new Date(r.goal_to).getTime() <= new Date(filters.to_date).getTime());
  results = results.filter((r) => r.category == filters.category);
  return results;
};
/*
* SORT DATA
*/
//sort by time
const sortByTime = (item_a, item_b, order_type)=>{
  let optSort;
  if(order_type==="asc"){
    optSort = (item_a.expense_time).localeCompare(item_b.expense_time);
  }else if (order_type==="desc") {
    optSort = (item_b.expense_time).localeCompare(item_a.expense_time);
  }
  return optSort;
};
//sort by location
const sortByLocation = (item_a, item_b, order_type) => {
  let optSort;
  if(item_a.location.replace(/\s+/, "") === ''){
     optSort = 1;
  }
  else if(item_b.location.replace(/\s+/, "") === ''){
    optSort = -1;
  }
  else if(item_a.location === item_b.location){
    optSort = 0;
  }
  else if(order_type==="asc") {
    optSort = item_a.location < item_b.location ? -1 : 1;
  }
  else if(order_type==="desc") {
    optSort = item_a.location < item_b.location ? 1 : -1;
  }
  return optSort;
};
//sort by store
const sortByStore = (item_a, item_b, order_type) => {
  let optSort;
  if(item_a.store.replace(/\s+/, "") === ''){
     optSort = 1;
  }
  else if(item_b.store.replace(/\s+/, "") === ''){
    optSort = -1;
  }
  else if(item_a.store === item_b.store){
    optSort = 0;
  }
  else if(order_type==="asc") {
    optSort = item_a.store < item_b.store ? -1 : 1;
  }
  else if(order_type==="desc") {
    optSort = item_a.store < item_b.store ? 1 : -1;
  }
  return optSort;
};
/*
* UTILITY FUNCTIONS
*/
//generate all available filters
const generateFilterList = (registration_date = self.registrationDate) => {
  self.filtersList = [];
  const payments = ['all','cash', 'credit card', 'debit card', 'prepaid card', 'gift card', 'bank transfer', 'check', 'mobile payment', 'web payment'];
  const today = new Date();
  let alldays = getAllDays(registration_date, today);
  let init_days = [alldays[0], alldays[alldays.length-1]];
  let categories = [];
  let locations = [];
  let stores = [];
  let amounts = [0];
  if (self.expenseList.length>0) {
    self.expenseList.forEach(expense => {
      if(!alldays.includes(expense.expense_date)){
        alldays[alldays.length] = expense.expense_date;
      }
      if(!locations.includes(expense.location) && expense.location!=""){
        locations[locations.length] = expense.location;
      }
      if(!stores.includes(expense.store) && expense.store!=""){
        stores[stores.length] = expense.store;
      }
      if(!amounts.includes(parseFloat(expense.amount))){
        amounts[amounts.length] = parseFloat(expense.amount);
      }
    });
  }
  alldays.sort();
  locations.sort();
  locations.unshift("all");
  locations[locations.length] ="not empty";
  stores.sort();
  stores.unshift("all");
  stores[stores.length] ="not empty";
  let goals = [];
  if (self.budgetList.length>0) {
    self.budgetList.sort((item_a, item_b)=>{
      return sortByID(item_a, item_b, "desc");
    });
    init_days = [];
    init_days[init_days.length] = self.budgetList[0].budget_from;
    init_days[init_days.length] = self.budgetList[0].budget_to;
    self.budgetList.forEach(budget => {
      if(!alldays.includes(budget.budget_from)){
        alldays[alldays.length] = budget.budget_from;
      }
      if(!alldays.includes(budget.budget_to)){
        alldays[alldays.length] = budget.budget_to;
      }
      if(!amounts.includes(parseFloat(budget.amount))){
        amounts[amounts.length] = parseFloat(budget.amount);
      }
      if (self.goalList.length>0) {
        let budgetGoalList = getByBudgetID(budget.id, self.goalList);
        if (budgetGoalList.length>0) {
          budgetGoalList.sort((item_a, item_b)=>{
            return sortByCategory(item_a, item_b, 'asc');
          });
          budgetGoalList.forEach(goal => {
            let goalfrom = budget.budget_from.split("-").reverse().join("/");
            let goalto = budget.budget_to.split("-").reverse().join("/");
            goals[goals.length] = goal.category+" ("+goalfrom+"&nbsp;-&nbsp;"+goalto+")";
            let create_time = goal.created.split(" ")[1];
            create_time = create_time.split(":");
            create_time = create_time[0]+":"+create_time[1];
            let newGoalItem = {
              "id": goal.id,
              "budget_id": goal.budget_id,
              "amount": goal.amount,
              "category": goal.category,
              "create_date": goal.created.split(" ")[0],
              "create_time": create_time,
              "goal_from": budget.budget_from,
              "goal_to": budget.budget_to
            };
            self.updatedGoalList[self.updatedGoalList.length] =newGoalItem;
          });
        }
      }
    });
  }
  amounts.sort(function(a,b) { return a - b;});
  alldays.sort();
  let filterdays = getAllDays(alldays[0], alldays[alldays.length-1]);
  let filterdays_formated = getDaysFormat(filterdays);
  let filterinit_days = getDaysFormat(init_days);
  let round_to = 5;
  let lastamount = Math.round(amounts[amounts.length-1]);
  let last_rounded = lastamount + (round_to-lastamount%5) + 50;
  amounts[amounts.length] = parseFloat(last_rounded);
  lastamount = amounts[amounts.length-1];
  let filter_amounts = [];
  for (let i = 50; i < lastamount; i+=50){
    filter_amounts[filter_amounts.length] = i;
  }
  filter_amounts.unshift(0, 10, 20);
  self.categoriesList.forEach(category => {
    if(!categories.includes(category.name)){
      categories[categories.length] = category.name;
    }
  });
  categories.sort();
  categories.unshift("all");
  self.filtersList = {
    "all_days":filterdays_formated.reverse(),
    "init_days":filterinit_days,
    "payments":payments,
    "locations":locations,
    "stores":stores,
    "amounts":filter_amounts,
    "categories":categories,
    "goals":goals
  }
};
//get days formats for filters
const getDaysFormat = (days) => {
  let formedDays = [];
  for (let i = 0; i < days.length; i++) {
    formedDays[formedDays.length] = days[i].split("-").reverse().join("/");
  }
  return formedDays;
};
