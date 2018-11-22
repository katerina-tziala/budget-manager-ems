/*
*  GET LISTS
*/
//get item by budget id
const getByBudgetID = (id, list)=>{
  let results = list;
  results = results.filter((r) => r.budget_id === parseInt(id));
  return results;
};
//filter expenses
const filterExpenseList = (filters, data = self.expenseList) => {
  let results = data;
  results = getExpenseListByPeriod(results, filters.from_date, filters.to_date);
  results = results.filter((r) => parseFloat(r.amount) >= parseFloat(filters.min_amount));
  results = results.filter((r) => parseFloat(r.amount) <= parseFloat(filters.max_amount));
  if (filters.category != 'all') { // filter by category
    results = getByCategory(filters.category, results);
  }
  if (filters.payment != 'all') { // filter by payment
    results = getByPayment(filters.payment, results);
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
//get item by budget id
const getByID = (id, list)=>{
  let results = list;
  results = results.filter((r) => r.id === parseInt(id));
  return results;
};
//get expenses of a specific budget
const getExpenseListByPeriod = (data, start_day, end_day) => {
  let results = data;
  results = results.filter((r) => new Date(r.expense_date).getTime() >= new Date(start_day).getTime());
  results = results.filter((r) => new Date(r.expense_date).getTime() <= new Date(end_day).getTime());
  return results;
};
//get item by category
const getByCategory = (category, list)=>{
  let results = list;
  results = results.filter((r) => decodeEntities(r.category) === decodeEntities(category));
  return results;
};
//get item by payment
const getByPayment = (payment, list)=>{
  let results = list;
  results = results.filter((r) => decodeEntities(r.payment).toLowerCase() === decodeEntities(payment).toLowerCase());
  return results;
};



/*
*  GENERATE FILTERS FROM DATA
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
//generate all available categories
const generatecategoriesFilters = (categories) => {
  let currentCategories = [];
  categories.forEach(category => {
    if(!currentCategories.includes(category.name)){
      currentCategories[currentCategories.length] = category.name;
    }
  });
  currentCategories.sort();
  return currentCategories;
};
