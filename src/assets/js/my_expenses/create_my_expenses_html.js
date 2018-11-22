/*
* CREATE HTML FOR MY EXPENSES INTERFACE
*/
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
//create switcher
const createSwitcher = (indicator, text, aria, button_id, id=0) => {
  const switch_container = document.createElement('div');
  switch_container.classList.add('centeredFlexbox', 'switch_container');
  if (id!=0) {
    switch_container.setAttribute('id', id);
  }
  const label = createLabel(button_id);
  label.className = 'switch_label';
  label.innerHTML = text;
  const buttontext = `<span id="switch_indicator_${indicator}" class='switch_indicator unswitced' tabindex="0"></span>`;
  const button = createButton(button_id, buttontext, aria, switchOption);
   button.classList.add("switch_button", "unswitced");
   button.setAttribute('role', 'switch');
   button.setAttribute('aria-checked', 'false');
   button.setAttribute('tabindex', -1);
   switch_container.append(label, button);
   return switch_container;
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
  const storeButton = createButton('sortBtn_store', store_text, 'sort expenses by store', addSortOption);
  storeButton.className = "sortBtn";
  const location_text = `<i id='iconsrt_location' class='sortIcon fas fa-sort-alpha-down'></i><span id='textsrt_location' class='sort_indicator'>asc</span><span id='sorttag_location' class='sort_tag'>location</span>`;
  const locationButton = createButton('sortBtn_location', location_text, 'sort expenses by location', addSortOption);
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
//create sorting option
const createSelectedOption = (id, ordertype, container = self.selectedSortOptionsContainer) => {
  const sortoptcard = document.createElement('li');
  sortoptcard.setAttribute('id', `sortoptcard_${id}`);
  sortoptcard.setAttribute('role', 'listitem');
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
// create expense card
const createExpenseCard = (expense) => {
  let categoryicon = 'icon_';
  let category_base = expense.category.split(" ")[0];
  categoryicon = categoryicon+category_base;
  const card = document.createElement('li');
  card.setAttribute('role', 'listitem');
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
