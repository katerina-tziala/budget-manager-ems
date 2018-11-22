/*
* ACTIONS & BEHAVIOR
*/
//initialize statistics view
const initStatisticsView = (statistics = self.statistics) => {
  hideLoader();
  populateWeeksSelectBox(statistics.all.budget_weeks[0], statistics.all.budget_weeks);
  const options = getWeekSelectBoxOptions();
  renderStatisticsView(options);
};
//populate and initialize weeks select box
const populateWeeksSelectBox = (init_week, budgetWeeks, homeOptionsContainer = self.homeOptionsContainer) => {
  const selectBoxChecker = document.getElementById('selectBudgetWeek');
  if(selectBoxChecker != null){
    document.querySelectorAll('.budgetWeekFilterContainer')[0].remove();
  }
  const selectbox = createFilterSelectBox('selectBudgetWeek', budgetWeeks,'budgetWeekFilterContainer', 'budget_filter_tag', 'View statistics for', 'budgetWeekSelectBox', 'budgetWeek', init_week);
  homeOptionsContainer.append(selectbox);
  const budgetWeekFilterBox = document.getElementById('selectBudgetWeek');
  budgetWeekFilterBox.blobSelect.init({
    "orderType":"string",
    "order":"DESC",
    "placeholder": init_week,
    "placeholderOption": init_week,
    "search":true});
  budgetWeekFilterBox.addEventListener('change', initViewOnWeekChange);
};
//render statistics view
const renderStatisticsView = (options, statisticsView = self.statisticsView) => {
  clearStatisticsView();
  const budgetStatistics = self.statistics[`budget${options.budgetNumber}`];
  if(budgetStatistics.overall_stats.expnumb==0){
    const message = document.createElement('p');
    message.setAttribute('id', "no_expense_indicator");
    message.classList.add("no_expense_indicator");
    message.innerHTML = `There are no expenses for this week!`;
    statisticsView.insertBefore(message, statisticsView.childNodes[1]);
  }else{
    statisticsView.insertBefore(createBudgetOverviewCard(options.mode), statisticsView.childNodes[1]);
    statisticsView.insertBefore(createExpensesOverviewCard(options.mode), statisticsView.childNodes[2]);
    createCategoryCards(budgetStatistics.categories_stats.categories);
    createPaymentCards(budgetStatistics.payments_stats.payments);
    createDailyCards(budgetStatistics, budgetStatistics.overall_stats.budget_days.length);
    displayElement(self.dailyView);
    displayElement(self.goalsView);
    displayElement(self.categoriesView);
    displayElement(self.paymentsView);
    if(budgetStatistics.goals>0){
      createGoalCards(budgetStatistics.goals_stats);
      initializeGoalSummary(budgetStatistics.goals_stats.goals_summary);
      addDataInCards('goal', budgetStatistics.goals_stats, self.categoriesView);
      displayElement(document.getElementById('toggleChart_view_goals'));
    }else{
      const message = document.createElement('p');
      message.setAttribute('id', "no_goals_indicator");
      message.classList.add("no_goals_indicator");
      message.innerHTML = `No goals setted for this week!`;
      self.goalsView.append(message);
      if (self.userInfo.has_current_budget===true) {
        const add_exp = createAddLink('add_goal', 'add<br>goal', 'add goal', pages.budget_and_goals.url);
        self.goalsView.append(add_exp);
      }
    }
    addDataInCards('category', budgetStatistics.categories_stats, self.categoriesView);
    addDataInCards('payment', budgetStatistics.payments_stats, self.paymentsView);
    initializeBudgetOverviewCard(options.mode, budgetStatistics, statisticsView);
    initializeExpenseOverviewCard(budgetStatistics, statisticsView);
    initializeDailyCards(budgetStatistics);
    initializeChartSections();
  }
};
//clear statistics view
const clearStatisticsView = () => {
  const statisticsView = self.statisticsView;
  const cards = document.querySelectorAll('.card');
  const expensesindicator = document.querySelectorAll('.no_expense_indicator');
  const goalsindicator = document.querySelectorAll('.no_goals_indicator');
  const allWeeksContainers = document.querySelectorAll('.allWeeksContainers');
  if (allWeeksContainers.length>0) {
    for (let i = 0; i < allWeeksContainers.length; i++) {
      allWeeksContainers[i].remove();
    }
  }
  if (cards.length>0) {
    for (let i = 0; i < cards.length; i++) {
      cards[i].remove();
    }
  }
  if (expensesindicator.length>0) {
    expensesindicator[0].remove();
    document.getElementById('add_expense').remove();
  }
  if (goalsindicator.length>0) {
    goalsindicator[0].remove();
    document.getElementById('add_goal').remove();
  }
  hideElement(self.dailyView);
  hideElement(self.goalsView);
  hideElement(self.categoriesView);
  hideElement(self.paymentsView);
};
//display success bookmark
const displaySuccessBookmark = (element)=>{
  element.classList.add("performanceStatusSuccess");
};
//initialize progress bars for categories and payments
const progressBarInitializer = (elements, card) => {
  const basicBars = ["progressBar_bar", "progressBar_bills", "progressBar_clothing", "progressBar_communication","progressBar_cosmetics", "progressBar_donations",
  "progressBar_education", "progressBar_entertainment", "progressBar_gifts", "progressBar_health", "progressBar_housing", "progressBar_investments", "progressBar_miscellaneous",
  "progressBar_restaurant", "progressBar_sports", "progressBar_supermarket", "progressBar_technology", "progressBar_transportation", "progressBar_traveling", "progressBar_vehicle"]
  for (let i = 0; i < elements.length; i++) {
    elements[i].classList.remove("progressBarIndicator");
    elements[i].classList.remove(`${card}ProgressIndicator`);
    if (!basicBars.includes(elements[i].classList[0])) {
      elements[i].className="";
      elements[i].classList.add("progressBar_ettiquete");
    }
    elements[i].classList.add("progressBarIndicator");
    elements[i].classList.remove(`${card}ProgressIndicator`);
  }
};
//get mode
const getMode=(budgetNumber)=>{
    let mode="last";
  if (self.statistics.all.number_of_budgets===budgetNumber && self.statistics.all.budgets_to_display===budgetNumber && self.userInfo.has_current_budget===true ) {
    mode = "current";
  }
  return mode;
}
//initialize payment icons
const loadPaymentIcons = (icons) => {
  for (let i = 0; i < icons.length; i++) {
    if (icons[i].classList.contains("cashicon")) {
      icons[i].classList.add("fas","fa-coins");
    }else if (icons[i].classList.contains("crediticon") || icons[i].classList.contains("gifticon") || icons[i].classList.contains("debiticon") || icons[i].classList.contains("prepaidicon")) {
      icons[i].classList.add("fas","fa-credit-card");
    }else if (icons[i].classList.contains("crediticon") || icons[i].classList.contains("gifticon") || icons[i].classList.contains("debiticon") || icons[i].classList.contains("prepaidicon")) {
      icons[i].classList.add("fas","fa-credit-card");
    }else if (icons[i].classList.contains("bankicon") || icons[i].classList.contains("checkicon")) {
      icons[i].classList.add("fas","fa-money-check");
    }else if (icons[i].classList.contains("mobileicon")){
      icons[i].classList.add("fas","fa-mobile-alt");
    }else if (icons[i].classList.contains("webicon")){
      icons[i].classList.add("fas","fa-globe");
    }
  }
};
//get week from select box
const getWeekSelectBoxOptions = () => {
  let budgetNumber=0;
  let startDay="no_day";
  let endDay="no_day";
  let results=[];
  results['budgetNumber'] = budgetNumber;
  results['startDay'] = startDay;
  results['endDay'] = endDay;
  const selectBudgetWeek = document.getElementById('selectBudgetWeek').value;
  const optionParts = selectBudgetWeek.split(" ");
  if (optionParts.length>2) {
    const hashednumber = optionParts[2];
    budgetNumber = hashednumber.substr(1,);
    budgetNumber = budgetNumber.split(":")[0];
    budgetNumber = parseInt(budgetNumber);
    startDay=optionParts[3];
    endDay=optionParts[5];
    results['budgetNumber'] = budgetNumber;
    results['startDay'] = startDay;
    results['endDay'] = endDay;
    results['mode'] = getMode(budgetNumber);
    results['all'] = false;
  }else{
    results['all'] = true;
  }
  return results;
};
//function to display appropriately the chart
const chartDisplayHandler=(params)=>{
  const container = document.getElementById(`chartContainer_${params.target}`);
  if (params.viewmode==="hide") {
    hideElement(container);
    initializeOneChartSelectBoxes(params.target);
    removeChart(container, params.target);
  }else{
    removeChart(container, params.target);
    container.append(createChartCanvas(params.target));
    displayElement(container);
    const chart_config = getChartConfiguration(params);
    chart_config.chartCreator(chart_config.chartOptions);
  }
};
/*
* ADD DATA TO CARDS
*/
//initialize goals summary
const initializeGoalSummary=(goals_summary)=>{
  const statsContainers = document.querySelectorAll('.statsData_goalso');
  statsContainers[0].innerHTML = parseInt(statsContainers.length);
  statsContainers[1].innerHTML = parseInt(goals_summary['succeeded']);
  statsContainers[2].innerHTML = parseInt(goals_summary['exceded']);
};
//add data in cards
const addDataInCards=(type, modestats, container)=>{
  const cards = document.querySelectorAll(`.${type}OverviewCard`);
  const percTag = document.querySelectorAll(`.percTag_${type}`);
  const statsDataCurr = document.querySelectorAll(`.statsDataCurr_${type}`);
  const statsDataExp = document.querySelectorAll(`.statsDataExp_${type}`);
  const progressBars = document.querySelectorAll(`.${type}ProgressIndicator`);
  progressBarInitializer(progressBars, type);
  let sum = modestats.amount_total.reduce((a, b) => a + b, 0);
  for (let i = 0; i < cards.length; i++) {
    let statisticsContainer = cards[i].querySelectorAll('.statisticsContainer');
    let total = getDecimalFormat(modestats.amount_total[i])
    let percentage = getPercentage(total, sum);
    let progress = getProgress(percentage);
    if (type==="goal") {
      const goalIndex = document.querySelectorAll('.goalIndex');
      goalIndex[i].innerHTML=i+1;
      sum = getDecimalFormat(modestats.goals_amounts[i]);
      percentage = getPercentage(total, sum);
      progress = getProgress(percentage);
      const statsDataMax_goal = document.querySelectorAll('.statsDataMax_goal');
      addData(statsDataMax_goal[i], sum);
      if(progress==="fail"){
        let bookmark = createProgressBookmark("goal_fail");
        cards[i].append(bookmark);
      }else{
        let bookmark = createProgressBookmark("goal_success");
        cards[i].append(bookmark);
      }
    }
    statsDataExp[i].innerHTML = modestats.expnumb[i];
    addData(statsDataCurr[i], total);
    addPercentageData(percTag[i], percentage);
    displayProgressBar(percentage, progressBars[i]);
  }
};
//add data to budget overview card
const initializeBudgetOverviewCard = (viewmode, budgetdStats, container) => {
  const overviewCard = container.querySelectorAll('.budgetOverviewCard')[0];
  const overalstatsData = container.querySelectorAll('.statsData_bo');
  const percentageData = container.querySelectorAll('.percTag_bo');
  const progressBars = container.querySelectorAll('.progressBar_bo');
  const statisticsContainer = overviewCard.querySelectorAll('.statisticsContainer');
  const totalamount = getDecimalFormat(budgetdStats.amount);
  const budget_spend = getDecimalFormat(budgetdStats.overall_stats.budget_spend);
  const spend_perc = getPercentage(budget_spend, budgetdStats.amount);
  const spendProgressClass = getProgress(spend_perc);
  const budget_left = getDecimalFormat(budgetdStats.overall_stats.budget_left);
  let avail_perc = 100-spend_perc;
  const avg_per_day = getDecimalFormat(budgetdStats.overall_stats.amount_avg_daily);
  let avg_perc = getPercentage(avg_per_day, budgetdStats.amount);
  addData(overalstatsData[0], totalamount);
  addPercentageData(percentageData[0], spend_perc);
  addData(overalstatsData[1], budget_spend);
  progressBars[0].classList.add(spendProgressClass);
  displayProgressBar(spend_perc, progressBars[0]);
  let availProgressClass = getProgress(avail_perc);
  addPercentageData(percentageData[1], avail_perc);
  if (avail_perc===0) {
    availProgressClass = "fail";
  }
  progressBars[1].classList.add(availProgressClass);
  addData(overalstatsData[2], budget_left);
  displayProgressBar(avail_perc, progressBars[1]);
  addPercentageData(percentageData[2], avg_perc);
  addData(overalstatsData[3], avg_per_day);
  const avgProgressClass = getProgress(avg_perc);
  if (avg_perc>100) {
    progressBars[2].classList.add("fail");
    displayProgressBar(100, progressBars[2]);
  }else{
    progressBars[2].classList.add(avgProgressClass);
    displayProgressBar(avg_perc, progressBars[2]);
  }
  if (viewmode==="last") {
    if(spendProgressClass==="success"){
      const bookmark = container.querySelectorAll('.overallBudgetCup')[0].childNodes[0];
      displaySuccessBookmark(bookmark);
    }
  }
};
//add data to expenses overview card
const initializeExpenseOverviewCard = (budgetdStats, container) => {
  const overviewCard = container.querySelectorAll('.expOverviewCard')[0];
  const overalData = container.querySelectorAll('.statsData_expo');
  const percentageData = container.querySelectorAll('.percTag_expo');
  const progressBars = container.querySelectorAll('.progressBar_expo');
  const statisticsContainer = overviewCard.querySelectorAll('.statisticsContainer');
  const numb_of_expenses = budgetdStats.overall_stats.expnumb;
  let expnumb_avg_daily = budgetdStats.overall_stats.expnumb_avg_daily;
  const amount_max = budgetdStats.overall_stats.amount_max;
  const amount_min = budgetdStats.overall_stats.amount_min;
  const budget_spend = budgetdStats.overall_stats.budget_spend;
  const avg_perc = getPercentage(expnumb_avg_daily, numb_of_expenses);
  const max_perc = getPercentage(amount_max, budgetdStats.amount);
  const min_perc = getPercentage(amount_min, budgetdStats.amount);
  overalData[0].innerHTML = numb_of_expenses;
  if(Number.isInteger(expnumb_avg_daily)===false){
    const exp_avg_start = Math.floor(expnumb_avg_daily);
    const exp_avg_end = Math.ceil(expnumb_avg_daily);
    overalData[1].innerHTML="";
    const start = document.createElement('span');
    start.innerHTML = exp_avg_start;
    const separator = document.createElement('span');
    separator.innerHTML=" - ";
    const end = document.createElement('span');
    end.innerHTML = exp_avg_end;
    overalData[1].append(start, separator, end);
  }else{
    overalData[1].innerHTML=expnumb_avg_daily;
  }
  addPercentageData(percentageData[0], avg_perc);
  const avgClass = getProgress(avg_perc);
  progressBars[0].classList.add(avgClass);
  displayProgressBar(avg_perc, progressBars[0]);
  addData(overalData[2], amount_max);
  addPercentageData(percentageData[1], max_perc);
  const maxClass = getProgress(max_perc);
  progressBars[1].classList.add(maxClass);
  displayProgressBar(max_perc, progressBars[1]);
  addData(overalData[3], amount_min);
  addPercentageData(percentageData[2], min_perc);
  const minClass = getProgress(min_perc);
  progressBars[2].classList.add(minClass);
  displayProgressBar(min_perc, progressBars[2]);
};
//initialize daily cards
const initializeDailyCards = (budgetStats) => {
  const dailyStats = budgetStats.daily_stats;
  const cards = document.querySelectorAll('.dailyOverviewCard');
  const total = getDecimalFormat(budgetStats.amount);
  for (let i = 0; i < cards.length; i++) {
    let percentageData = cards[i].querySelectorAll('.percTag_day');
    let statsData = cards[i].querySelectorAll('.statsData_day');
    let progressBars = cards[i].querySelectorAll('.progressBar_day');
    let statisticsContainer = cards[i].querySelectorAll('.statisticsContainer');
    statsData[0].innerHTML = dailyStats.expnumb[i];
    addData(statsData[1], dailyStats.amount_total[i]);
    addData(statsData[2], dailyStats.amount_max[i]);
    addData(statsData[3], dailyStats.amount_min[i]);
    let amount_perc = getPercentage(getDecimalFormat(dailyStats.amount_total[i]), total);
    let max_perc = getPercentage(getDecimalFormat(dailyStats.amount_max[i]), total);
    let min_perc = getPercentage(getDecimalFormat(dailyStats.amount_min[i]), total);
    let amountProgressClass = getProgress(amount_perc);
    let maxProgressClass = getProgress(max_perc);
    let minProgressClass = getProgress(min_perc);
    progressBars[0].classList.add(amountProgressClass);
    progressBars[1].classList.add(maxProgressClass);
    progressBars[2].classList.add(minProgressClass);
    addPercentageData(percentageData[0], amount_perc);
    displayProgressBar(amount_perc, progressBars[0]);
    addPercentageData(percentageData[1], max_perc);
    displayProgressBar(max_perc, progressBars[1]);
    addPercentageData(percentageData[2], min_perc);
    displayProgressBar(min_perc, progressBars[2]);
  }
};
//add percentage in html
const addPercentageData = (container, perc) => {
  let display_perc = getDisplayFormat(getDecimalFormat(perc));
  if (perc>100) {
    display_perc = "> "+getDisplayFormat(getDecimalFormat(100));
  } else if (perc<0) {
    display_perc = "< "+getDisplayFormat(getDecimalFormat(0));
  }
  container.innerHTML = display_perc;
};
