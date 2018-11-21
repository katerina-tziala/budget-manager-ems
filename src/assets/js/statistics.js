/*
*  GENERATE STATISTICS FROM DATA
*/
// general and basic statistics
const getBasicStatistics = (list, days) => {
  const total_items = list.length;
  let total_amount = 0;
  let max_amount = 0;
  let min_amount = 0;
  let avg_daily_amount = 0;
  let avg_daily_numb = 0;
  if(total_items>0 && days.length>0){
    max_amount = list[0].amount;
    min_amount = list[0].amount;
    list.forEach(item => {
      total_amount = total_amount + getDecimalFormat(item.amount);
      if(max_amount < getDecimalFormat(item.amount)){
        max_amount = getDecimalFormat(item.amount);
      }
      if(min_amount > getDecimalFormat(item.amount)){
        min_amount = getDecimalFormat(item.amount);
      }
    });
  }
  const basic_statistics = {
    "amount_total":getDecimalFormat(total_amount),
    "amount_max":getDecimalFormat(max_amount),
    "amount_min":getDecimalFormat(min_amount),
    "amount_avg_daily":getDecimalFormat(total_amount/days.length),
    "expnumb_avg_daily":getDecimalFormat(total_items/days.length)
  };
  return basic_statistics;
};
//get overview data
const generateOverviewData = (displayExpenseList = self.displayExpenseList) => {
  const expenses=displayExpenseList.length;
  let avg=0;
  const basic_stats = getBasicStatistics(displayExpenseList, [1]);
  if (expenses>0) {
    avg=getDecimalFormat(basic_stats.amount_total/expenses);
  }
  const data = {
    "expenses": expenses,
    "total": basic_stats.amount_total,
    "average": avg,
    "min": basic_stats.amount_min,
    "max": basic_stats.amount_max
  };
  return data;
};
//get average amount based on each category, payment, etc.
const averageAmountInType = (amount, expenses) => {
  let result = 0;
  if(parseFloat(amount)>0 && expenses>0){
    result = getDecimalFormat(amount/expenses);
  }
  return result;
};
//get average number of expenses based on each category, payment, etc.
const averageNumberOfExpensesInType = (type_expenses, budget_expenses) => {
  let result = 0;
  if(type_expenses>0 && budget_expenses>0){
    result = getDecimalFormat(type_expenses/budget_expenses);
  }
  return result;
};
//generate statistics
const generateStatistics = (budgetList = self.budgetList, expenseList = self.expenseList, goalsList = self.goalsList, feedbackList = self.feedbackList) => {
  let budgetsNumb = budgetList.length;
  let budgetsNumbForDisplay = 0;
  let full_budgeting_period = [];
  let budgetWeeks = [];
  let current_budgeting_period = [];
  if (budgetsNumb>0) {
    full_budgeting_period = getAllDays(budgetList[budgetList.length-1].budget_from, budgetList[0].budget_to);
    let budget_end_day = budgetList[0].budget_to;
    const lastDayTime = new Date(budget_end_day).getTime();
    if(lastDayTime>self.todayTime){
      budget_end_day = self.today;
    }
    current_budgeting_period = getAllDays(budgetList[0].budget_from, budget_end_day);
    let budgetIndex = budgetsNumb;
    budgetList.forEach(budget => {//budgets are shorted by id in descenting order
      let budgetFromTime = new Date(budget.budget_from).getTime();
      if(budgetFromTime<self.todayTime){
        let budgetWeekOption = "";
        let from = budget.budget_from.split("-").reverse().join("/");
        let to = budget.budget_to.split("-").reverse().join("/");
        budgetWeekOption = "Budget Week #"+budgetIndex+": "+from+" - "+to;
        budgetWeeks[budgetWeeks.length] = budgetWeekOption;
        self.statistics[`budget${budgetIndex}`] = generateBudgetWithStatistics(budget);
        budgetsNumbForDisplay++;
      }
      budgetIndex--;
    });
  }
  budgetWeeks[budgetWeeks.length] = "all weeks";
  const allStats = {
    "number_of_budgets": budgetList.length,
    "number_of_expenses": expenseList.length,
    "budget_weeks": budgetWeeks,
    "full_budgeting_period": full_budgeting_period,
    "current_budgeting_period": current_budgeting_period,
    "budgets_to_display": budgetsNumbForDisplay,
  }
  self.statistics["all"] = allStats;
};
//get budget with all essential statistics
const generateBudgetWithStatistics = (budget, expenseList = self.expenseList, goalsList = self.goalsList, feedbackList = self.feedbackList) => {
  const budgetExpenseList = getExpenseListByPeriod(expenseList, budget.budget_from, budget.budget_to);
  const budgetGoalList = getByBudgetID(budget.id, goalsList);
  const budgetFeedback = getByBudgetID(budget.id, feedbackList);
  const lastDayTime = new Date(budget.budget_to).getTime();
  let fullBudget = budget;
  let budget_achieved = true;
  let budget_end_day = budget.budget_to;
  let budget_days = [];
  let daily_stats = {
     "amount_total":[],
     "amount_max":[],
     "amount_min":[],
     "amount_avg_daily":[],
     "expnumb":[]
   };
  let days = [];
  if(lastDayTime>self.todayTime){
    budget_end_day = self.today;
  }
  budget_days = getAllDays(budget.budget_from, budget_end_day);
  const overall_stats = getBasicStatistics(budgetExpenseList, budget_days);
  if(parseFloat(overall_stats["amount_total"])>parseFloat(budget.amount)){
    budget_achieved = false;
  }
  overall_stats.achieved=budget_achieved;
  overall_stats.expnumb=budgetExpenseList.length;
  overall_stats.budget_days=budget_days;
  overall_stats.budget_left=getDecimalFormat(budget.amount - overall_stats["amount_total"]);
  overall_stats.budget_spend=getDecimalFormat(overall_stats["amount_total"]);
  fullBudget.overall_stats=overall_stats;
  fullBudget.categories_stats = generateTypeStatistics(budgetExpenseList, budget_days, "categories", "category", getByCategory);
  fullBudget.payments_stats = generateTypeStatistics(budgetExpenseList, budget_days, "payments", "payment", getByPayment);
  fullBudget.goals_stats = getGoalsStatistics(budgetGoalList, budgetExpenseList, budget_days);
  for (let i = 0; i < budget_days.length; i++) {
    let dailyExpenseList = getExpenseListByPeriod(budgetExpenseList, budget_days[i], budget_days[i]);
    let dayexpenses = dailyExpenseList.length;
    let day_stats = getBasicStatistics(dailyExpenseList, [budget_days[i]]);
    day_stats.date=budget_days[i];
    fullBudget[`day${i+1}`] = day_stats;
    daily_stats.amount_total[daily_stats.amount_total.length] = day_stats.amount_total;
    daily_stats.amount_max[daily_stats.amount_max.length] = day_stats.amount_max;
    daily_stats.amount_min[daily_stats.amount_min.length] = day_stats.amount_min;
    daily_stats.amount_avg_daily[daily_stats.amount_avg_daily.length] = day_stats.amount_avg_daily;
    daily_stats.expnumb[daily_stats.expnumb.length] = day_stats.expnumb_avg_daily;
  }
  fullBudget.daily_stats = daily_stats;
  return fullBudget;
};
// generate statistics from budget expense list for categories, payments, etc
const generateTypeStatistics = (list, days, mode, type, getFunction) => {
  let mode_avg_amount = "amount_avg_"+mode;
  let mode_avg_expenses = "expnumb_avg_"+mode;
  let results = {
    [mode]: [],
    "expnumb": [],
    "expnumb_avg_daily": [],
    "amount_total": [],
    "amount_max": [],
    "amount_min": [],
    "amount_avg_daily": [],
    [mode_avg_expenses]: [],
    [mode_avg_amount]: []
  };
  if(days.length>0 && list.length>0){
    list.forEach(expense => {//get from expenses expenses, payments, etc
      if(results[mode].includes(expense[type])===false){
        results[mode][results[mode].length] = expense[type];
      }
    });
    //sort categories, payments, etc
    results[mode].sort();
    for (let i = 0; i < results[mode].length; i++) {//for each type (category, payment, etc) generate statistics
      let typeExpenseList = getFunction(results[mode][i], list);
      results.expnumb[results.expnumb.length] = typeExpenseList.length;
      let type_results = getBasicStatistics(typeExpenseList, days);
      results.amount_total[results.amount_total.length] = type_results.amount_total;
      results.amount_max[results.amount_max.length] = type_results.amount_max;
      results.amount_min[results.amount_min.length] = type_results.amount_min;
      results.amount_avg_daily[results.amount_avg_daily.length] = type_results.amount_avg_daily;
      results.expnumb_avg_daily[results.expnumb_avg_daily.length] = type_results.expnumb_avg_daily;
      results[mode_avg_amount][results[mode_avg_amount].length] = averageAmountInType(type_results.amount_total, typeExpenseList.length);
      results[mode_avg_expenses][results[mode_avg_expenses].length] = averageNumberOfExpensesInType(typeExpenseList.length, list.length);
    }
  }
  return results;
};
//get goal statistics
const getGoalsStatistics = (goalsList, budgetExpenseList, days) => {
  let results = {
    "categories": [],
    "expnumb": [],
    "expnumb_avg_daily": [],
    "amount_total": [],
    "amount_max": [],
    "amount_min": [],
    "amount_avg_daily": [],
    "expnumb_avg_goals": [],
    "amount_avg_goals": [],
    "goals_amounts": [],
    "goals_achieved": [],
    "goals_summary": []
  };
  if (goalsList.length>0 && budgetExpenseList.length>0) {
    goalsList.sort((item_a, item_b)=>{
      return sortByCategory(item_a, item_b, 'asc');
    });
    goalsList.forEach(goal => {
      results.categories[results.categories.length] = goal.category;
      let goal_amount = getDecimalFormat(goal.amount);
      results.goals_amounts[results.goals_amounts.length] = goal_amount;
      let goalExpenseList = getByCategory(goal.category, budgetExpenseList);
      let goal_stats = generateTypeStatistics(goalExpenseList, days, "categories", "category", getByCategory);
      results.expnumb[results.expnumb.length] = goalExpenseList.length;
      if (goalExpenseList.length>0) {
        results.expnumb_avg_daily[results.expnumb_avg_daily.length] = goal_stats.expnumb_avg_daily[0];
        results.amount_total[results.amount_total.length] = goal_stats.amount_total[0];
        results.amount_max[results.amount_max.length] = goal_stats.amount_max[0];
        results.amount_min[results.amount_min.length] = goal_stats.amount_min[0];
        results.amount_avg_daily[results.amount_avg_daily.length] = goal_stats.amount_avg_daily[0];
        results.expnumb_avg_goals[results.expnumb_avg_goals.length] = goal_stats.expnumb_avg_categories[0];
        results.amount_avg_goals[results.amount_avg_goals.length] = goal_stats.amount_avg_categories[0];
      }else{
        results.expnumb_avg_daily[results.expnumb_avg_daily.length] = 0;
        results.amount_total[results.amount_total.length] = 0;
        results.amount_max[results.amount_max.length] = 0;
        results.amount_min[results.amount_min.length] = 0;
        results.amount_avg_daily[results.amount_avg_daily.length] = 0;
        results.expnumb_avg_goals[results.expnumb_avg_goals.length] = 0;
        results.amount_avg_goals[results.amount_avg_goals.length] = 0;
      }
      if (goal_stats.amount_total[0]>0 && goal_stats.amount_total[0]>goal_amount) {
        results.goals_achieved[results.goals_achieved.length] = false;
      }else{
        results.goals_achieved[results.goals_achieved.length] = true;
      }
    });
    let succeeded=0;
    let exceded=0;
    for (let i = 0; i < results.goals_achieved.length; i++) {
      if (results.goals_achieved[i]===true) {
        succeeded++;
      }else{
        exceded++;
      }
    }
    results.goals_summary['succeeded']=succeeded;
    results.goals_summary['exceded']=exceded;
  }
  return results;
};
