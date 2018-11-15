"use strict";
let budgetList, expenseList, goalsList,feedbackList, statistics, budget_indicator, feedbackAllowance, feedbackServed,
todayTime, today,
feedbackView, statisticsView,
goalsView, categoriesView, paymentsView,
homeOptionsContainer, budgetWeekSelectBox;
//initialize home view
const initHomeView = (personalInfo, budgets, expenses, goals, feedbacks) =>{
  prepareMain("clear");
  self.main.append(renderFeedbackHTML(), renderStatisticsHTML());
  self.feedbackAllowance = parseInt(personalInfo.feedback)===0?false:true;
  self.budget_indicator = personalInfo.has_current_budget==='no'?false:true;
  self.budgetList = [];
  self.expenseList = [];
  self.goalsList = [];
  self.feedbackList = [];
  self.statistics = [];
  self.feedbackServed = false;
  initializeVariables(budgets, expenses, goals, feedbacks);
  initView();
};
//initialize global variables of this interface
const initializeVariables = (budgets, expenses, goals, feedbacks) => {
  if (budgets.length>0) {
    self.budgetList = budgets;
    self.budgetList.sort((item_a, item_b)=>{
      return sortByID(item_a, item_b, "desc");
    });
  }
  if (expenses.length>0) {
    self.expenseList = expenses;
  }
  if (goals.length>0) {
    self.goalsList = goals;
  }
  if(feedbacks.length>0){
    self.feedbackList = feedbacks;
    self.feedbackList.sort((item_a, item_b)=>{
      return sortByID(item_a, item_b, "desc");
    });
    const budgetfeedback = getByBudgetID(self.budgetList[0].id, self.feedbackList);
    if(budgetfeedback.length===1){
      self.feedbackServed = true;
    }
  }
  self.todayTime = new Date().getTime();
  const todayparts = getDateParts(self.todayTime);
  self.today = todayparts[2]+"-"+todayparts[1]+"-"+todayparts[0];
  generateStatistics();
  self.feedbackView = document.getElementById('feedbackView');
  self.statisticsView = document.getElementById('statisticsView');
  self.homeOptionsContainer = document.getElementById('homeOptionsContainer');
  self.goalsView = document.getElementById('goalOverviewContainer');
  self.categoriesView = document.getElementById('categoriesOverviewContainer');
  self.paymentsView = document.getElementById('paymentsOverviewContainer');
  self.dailyView = document.getElementById('dailyOverviewContainer');
};
//initialize view
const initView = (budgetList = self.budgetList, expenseList = self.expenseList, feedbackServed = self.feedbackServed) => {
  const numberOfAllBudgets = self.statistics.all.number_of_budgets;
  const numberOfDisplayBudgets = self.statistics.all.budgets_to_display;
  hideLoader();
  hideElement(self.statisticsView);
  hideElement(self.feedbackView);
  if(numberOfAllBudgets===0) {
    zeroBudgetView();
  }else if (numberOfDisplayBudgets===0) {
    budgetStartingDayView(budgetList[0].budget_from);
  }else{
    if (self.budget_indicator===false && feedbackServed===false) {
      initFeedbackView();
    }else{
      initStatisticsView();
      if (self.budget_indicator===false) {
        showBudgetNotification();
      }
    }
  }
};
/*
*  VIEWS
*/
// show view for the first time
const zeroBudgetView = (feedbackView = self.feedbackView, statisticsView = self.statisticsView) => {
  showErrorView();
  const container = document.getElementById('error_container');
  const errorMessage = document.getElementById('app_error');
  let errorTxt = "It seems that you have not set your WEEKLY BUDGET!<br>";
  errorTxt = errorTxt+`Set your budget, add your expenses and come back to view statistics!<br><br><br>`;
  errorMessage.innerHTML = "";
  errorMessage.innerHTML = errorTxt;
  const btnTxt = `<i class="setBudgetWallet fas fa-wallet"></i><span class="btn_link_txt">set budget</span>`;
  const setBudgetBtn = createLinkButton('setBudgetBtn', btnTxt, 'set budget', pages.budget_and_goals.url);
  setBudgetBtn.classList.add("centeredFlexbox", "app_btn", "btn_link");
  const linksWrapper = document.createElement('div');
  linksWrapper.className = "btnWrapper";
  linksWrapper.append(setBudgetBtn);
  container.append(linksWrapper);
  hideToaster();
  hideElement(feedbackView);
  hideElement(statisticsView);
};
//initialize statistics view
const initStatisticsView = (statistics = self.statistics) => {
  hideElement(self.feedbackView);
  displayElement(self.statisticsView);
  populateWeeksSelectBox(statistics.all.budget_weeks[0], statistics.all.budget_weeks);
  const options = getWeekSelectBoxOptions();
  renderStatisticsView(options);
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
      if (self.budget_indicator===true) {
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
//initialize view on week change
const initViewOnWeekChange = (event) => {
  const selectedOptions = getWeekSelectBoxOptions();
  if(selectedOptions['all']===true){
    displayAllOptionView();
  }else{
    renderStatisticsView(selectedOptions);
  }
};
//display cards for option all weeks
const displayAllOptionView = ()=>{
  clearStatisticsView();
  const numberOfDisplayBudgets = self.statistics.all.budgets_to_display;
  let displayBudget = numberOfDisplayBudgets;
  const budget_weeks=self.statistics.all.budget_weeks;
  for (let i = 1; i <= numberOfDisplayBudgets; i++) {
    let wrapper = document.createElement("div");
    wrapper.classList.add("flexRowWrapStartCenter", "allWeeksContainers");
    let header = document.createElement("h2");
    header.className="sectionHeaderAll";
    header.innerHTML=budget_weeks[i-1];
    wrapper.append(header);
    wrapper.append(createBudgetOverviewCard(getMode(displayBudget)));
    wrapper.append(createExpensesOverviewCard(getMode(displayBudget)));
    self.statisticsView.append(wrapper);
    displayBudget--;
  }
  const allWeeksContainers = document.querySelectorAll('.allWeeksContainers');
  allWeeksContainers[0].style.marginTop="-20px";
  displayBudget = numberOfDisplayBudgets;
  for (let i = 0; i < allWeeksContainers.length; i++) {
    let mode=getMode(displayBudget);
    let budgetStatistics = self.statistics[`budget${displayBudget}`];
    initializeBudgetOverviewCard(mode, budgetStatistics, allWeeksContainers[i]);
    initializeExpenseOverviewCard(budgetStatistics, allWeeksContainers[i]);
    displayBudget--;
  }
};
//close feedback view and save in db
const closeFeedbackView = (event, statistics = self.statistics, budget=self.budgetList[0], feedbackView = self.feedbackView, statisticsView = self.statisticsView) =>{
  showLoader();
  const fullbudgetNumb = statistics.all.number_of_budgets;
  const fullBudget = statistics[`budget${fullbudgetNumb}`];
  const user_performance = fullBudget.overall_stats.achieved ===false?'fail':'success';
  const type = self.feedbackAllowance ===true?'affective gifs':'regular';
  const data = {
    "budget_id": parseInt(fullBudget.id),
    "user_performance": user_performance,
    "type": type,
    "request_type": "save_feedback"
  }
  sendData('saveFeedbackDisplay', data).then((response)=>{
    if(response.message==="success"){
      const today = new Date();
      const dateparts = getDateParts(today);
      const newFeedbackItem = {
        "budget_id": parseInt(budget.id),
        "user_performance": user_performance,
        "type": type,
        "id": parseInt(response.added_id),
        "served_at": dateparts[2]+"-"+dateparts[1]+"-"+dateparts[0]+" "+getNowTime()+":"+"00"
      }
      self.feedbackList[self.feedbackList.length] = newFeedbackItem;
      self.feedbackServed=true;
      initView();
    }else{
      hideElement(self.loader);
      showErrorView();
    }
  });
};
//display feedback view
const initFeedbackView = (feedbackView = self.feedbackView, statistics = self.statistics, budget = self.budgetList[0], statisticsView = self.statisticsView) => {
  const feedbackSummaryCard = document.getElementById('feedbackSummaryCard');
  const feedbackHeader = document.getElementById('feedbackHeader');
  const feedbackParagraph = document.getElementById('feedbackParagraph');
  const feedbackOverviewData = document.querySelectorAll('.feedbackOverviewData');
  const fo_perc = document.querySelectorAll('.fo_perc');
  const feedbackProgressBars = document.querySelectorAll('.feedbackProgressBar');
  const fromMonth = getMonthName(budget.budget_from);
  const toMonth = getMonthName(budget.budget_to);
  let period = budget.budget_from.split("-")[2]+" "+fromMonth+" "+budget.budget_from.split("-")[0]+" - ";
  period = period+budget.budget_to.split("-")[2]+" "+toMonth+" "+budget.budget_to.split("-")[0];
  const fullbudgetNumb = statistics.all.number_of_budgets;
  const fullBudget = statistics[`budget${fullbudgetNumb}`];
  const budget_spend_perc = getPercentage(fullBudget.overall_stats.budget_spend, fullBudget.amount);
  let budget_left_perc = getPercentage(fullBudget.overall_stats.budget_left, fullBudget.amount);
  const spendProgress = getProgress(budget_spend_perc);
  const leftProgress = getProgress(budget_left_perc);
  let user_performance;
  if(spendProgress === "success"){
    feedbackHeader.innerHTML = `<span>Congratulations!</span><span>You made it!</span>`;
    feedbackParagraph.innerHTML = `You managed to stay on budget during the period: <span>${period}!</span>`;
    feedbackHeader.classList.add("success");
    user_performance="success";
  }else{
    feedbackHeader.innerHTML = `<span>Oh no!</span><span>You did not made it!</span>`;
    feedbackParagraph.innerHTML = `You did NOT manage to stay on budget during the period: <span>${period}!</span>`;
    feedbackHeader.classList.add("fail");
    user_performance="fail";
  }
  addData(feedbackOverviewData[0], fullBudget.amount);
  addData(feedbackOverviewData[1], fullBudget.overall_stats.budget_spend);
  addData(feedbackOverviewData[2], fullBudget.overall_stats.budget_left);
  if(budget_left_perc<0){
    budget_left_perc=0;
  }
  addData(fo_perc[0], budget_spend_perc);
  addData(fo_perc[1], budget_left_perc);
  displayProgressBar(100-getDecimalFormat(Math.ceil(budget_left_perc)), feedbackProgressBars[0]);
  setTimeout(() =>{displayProgressBar(getDecimalFormat(Math.ceil(budget_left_perc)), feedbackProgressBars[1]);},200);
  if(self.feedbackAllowance===true){
    const feedbackImageCard = populateAffectiveCard(user_performance);
    feedbackView.insertBefore(feedbackImageCard, feedbackView.childNodes[0]);
  }
  hideElement(self.statisticsView);
  displayElement(self.feedbackView);
};
//change chart
const changeChart = (event) => {
  const target = event.target.id.split("_").pop();
  let params = getChartParams(target);
  if (params.target==="goals") {//dynamically change select boxes for goals charts
    initializeGoalChartFilters(params.chart_type, params.chart_option);
    //the view is updated so get again the new getChartParameters
    params = getChartParams(target);
  }
  chartDisplayHandler(params);
};
//open close chart on button press
const toggleChart = (event) => {
  const button = event.target;
  const buttonID = button.id;
  const action = buttonID.split("_")[1];
  const target = buttonID.split("_")[2];
  const newvalue = action!='view'?'view':'hide';
  let params = getChartParams(target);
  params.viewmode=action;
  changeToggleChartButton(button, newvalue, target);
  chartDisplayHandler(params);
};
/*
* FUNCTIONS TO HANDLE DISPLAY OF CHARTS
*/
//get parameters for chart based on user's view
const getChartParams = (target) => {
  const container = document.getElementById(`chartOptions_${target}`);
  let chart_type = container.querySelectorAll('.chartTypeSelectBox')[0].value;
  const chart_option = container.querySelectorAll('.chartOptionSelectBox')[0].value;
  const weekOptions = getWeekSelectBoxOptions();
  const budgetNumber = weekOptions['budgetNumber'];
  const params = {
    "target":target,
    "budgetNumber":budgetNumber,
    "chart_type":chart_type,
    "chart_option":chart_option,
  }
  return params;
};
//initialize select boxes for goal charts
const initializeGoalChartFilters = (viewmode) => {
  const container = document.getElementById('chartOptions_goals');
  if (viewmode==="comparison") {//if we have comparison chart display chart comparison types
    const statsOptions = container.querySelectorAll('.compareOptionContainer');
    if (statsOptions.length===0) {//initialize the view only if it is not initialized
    populateChartComparisonsSelectBox(container, "goals");
    }
  }else{//display available statistics for charts
    const statsOptions = container.querySelectorAll('.goalStatsOptionContainer');
    if (statsOptions.length===0) {//initialize the view only if it is not initialized
      populateChartOptionsSelectBox(container, "goals");
    }
  }
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
//get options to create chart
const getChartConfiguration = (params) => {
  const budgetStatistics = self.statistics[`budget${params.budgetNumber}`];
  const datasets = getDataForChart(budgetStatistics, params.target, params.chart_type, params.chart_option);
  const labels = getChartLabels(budgetStatistics, params.target);
  const title = getChartTitle(params.target, params.chart_type, params.chart_option);
  const legends = getChartLegend(params.chart_type, params.chart_option);
  let charts = [params.chart_type];
  const display_labels = getLabelsForChartDisplay(labels);
  if (params.chart_type==="comparison") {
    charts = getChartTypes(params.chart_option);
    const basicStyles = getBasicChartStyles(charts[0], "amount_total", datasets[0].length);
    const compareStyles = getBasicChartStyles(charts[1], "amount_total", datasets[1].length);
    const options = {
      "target": params.target,
      "type": charts[0],
      "basic_type": charts[0],
      "compare_type": charts[1],
      "title": title,
      "labels": display_labels,
      "basic_legend": "goal amounts",
      "compare_legend": "amount spent",
      "basic_data": datasets[0],
      "compare_data": datasets[1],
      "basic_fills": basicStyles['backgroundColors'],
      "compare_fills":compareStyles['backgroundColors'],
      "basic_borders": basicStyles['borderColors'],
      "compare_borders":compareStyles['borderColors'],
      "borderwidth": 2,
      "cutout_percentage": basicStyles['cutoutPercentage']
    }
    const chartOptions = updateComparisonChartOptions(options);
    const chartConfig = {
      "chartOptions":chartOptions,
      "chartCreator":getChartCreator(charts)
    };
    return chartConfig;
  }else{
    let color_param = params.chart_option;
    if (params.chart_option==="amount_avg_categories" || params.chart_option==="amount_avg_payments" || params.chart_option==="amount_avg_goals") {
      color_param="amount_avg_per";
    }else if(params.chart_option==="expnumb_avg_categories" || params.chart_option==="expnumb_avg_payments" || params.chart_option==="expnumb_avg_goals"){
      color_param="expnumb_avg_per";
    }
    const chartStyles = getBasicChartStyles(params.chart_type, color_param, datasets[0].length);
    const chartOptions = {
      "target": params.target,
      "type": charts[0],
      "title": title,
      "legend": legends[0],
      "labels": display_labels,
      "data": datasets[0],
      "fills": chartStyles['backgroundColors'],
      "borders": chartStyles['borderColors'],
      "borderwidth": chartStyles['borderWidth'],
      "cutout_percentage": chartStyles['cutoutPercentage']
    }
    if (params.target==="goals" || params.target==="categories") {
      if (charts[0]==="bar" || charts[0]==="pie" || charts[0]==="doughnut") {
        const categoryColors = getChartCategoryColors(labels);
        chartOptions.fills=categoryColors;
      }
    }
    if (charts[0]==="filled_line") {
      chartOptions.type="line";
    }
    const chartConfig = {
      "chartOptions":chartOptions,
      "chartCreator":getChartCreator(charts)
    };
    return chartConfig;
  }
};
//get function to create chart
const getChartCreator = (charts) => {
  let functionName = createLinearChart;
  if (charts.length===1 && (charts[0]==="doughnut" || charts[0]==="pie")) {
    functionName = createRoundChart;
  }else if(charts.length>1){
    if (charts[0]==="radar") {
      functionName = createRadarChart;
    }else{
      functionName = createMixedChart;
    }
  }
  return functionName;
};
//get chart types for comparison chart
const getChartTypes = (option) =>{
  option = option.split(" ")[0];
  let charts=["bar", "bar"];
  if (option==="bar_line") {
    charts=["bar", "line"];
  }else if (option==="lines") {
    charts=["line", "line"];
  }else if (option==="radar") {
    charts=["radar", "radar"];
  }
  return charts;
};
//get basic chart styles
const getBasicChartStyles = (chart, color_param, iterationNumber) => {
  let colors = [];
  colors["amount_total"]='#009933';
  colors["amount_total_0"]='rgba(0, 153, 51, 0.2)';
  colors["amount_total_1"]='rgba(0, 153, 51, 0.4)';
  colors["amount_total_2"]='rgba(0, 153, 51, 0.6)';
  colors["amount_total_3"]='rgba(0, 153, 51, 0.8)';
  colors["amount_total_4"]='rgba(0, 102, 0, 0.8)';
  colors["amount_total_5"]='rgba(0, 102, 0, 0.6)';
  colors["amount_total_6"]='rgba(0, 102, 0, 0.4)';
  colors["amount_total_7"]='rgba(0, 102, 0, 0.2)';
  colors["amount_total_8"]='rgba(0, 153, 51, 1)';
  colors["amount_total_9"]='rgba(0, 102, 0, 1)';
  colors["amount_total_full"]='rgba(0, 153, 51, 1)';
  colors["expnumb"]='#ff6600';
  colors["expnumb_0"]='rgba(255, 102, 0, 0.2)';
  colors["expnumb_1"]='rgba(255, 102, 0, 0.4)';
  colors["expnumb_2"]='rgba(255, 102, 0, 0.6)';
  colors["expnumb_3"]='rgba(255, 102, 0, 0.8)';
  colors["expnumb_4"]='rgba(230, 184, 0, 0.8)';
  colors["expnumb_5"]='rgba(230, 138, 0, 0.6)';
  colors["expnumb_6"]='rgba(230, 138, 0, 0.4)';
  colors["expnumb_7"]='rgba(230, 138, 0, 0.8)';
  colors["expnumb_8"]='rgba(255, 102, 0, 1)';
  colors["expnumb_9"]='rgba(230, 138, 0, 1)';
  colors["expnumb_full"]='rgba(255, 102, 0, 1)';
  colors["amount_avg_daily"]='#008b8b';
  colors["amount_avg_daily_0"]='rgba(0, 139, 139, 0.2)';
  colors["amount_avg_daily_1"]='rgba(0, 139, 139, 0.4)';
  colors["amount_avg_daily_2"]='rgba(0, 139, 139, 0.6)';
  colors["amount_avg_daily_3"]='rgba(0, 139, 139, 0.8)';
  colors["amount_avg_daily_4"]='rgba(0, 102, 102, 0.8)';
  colors["amount_avg_daily_5"]='rgba(0, 102, 102, 0.6)';
  colors["amount_avg_daily_6"]='rgba(0, 102, 102, 0.4)';
  colors["amount_avg_daily_7"]='rgba(0, 102, 102, 0.2)';
  colors["amount_avg_daily_8"]='rgba(0, 139, 139, 1)';
  colors["amount_avg_daily_9"]='rgba(0, 102, 102, 1)';
  colors["amount_avg_daily_full"]='rgba(0, 139, 139, 1)';
  colors["amount_max"]='#dc143c';
  colors["amount_max_0"]='rgba(220, 20, 60, 0.2)';
  colors["amount_max_1"]='rgba(220, 20, 60, 0.4)';
  colors["amount_max_2"]='rgba(220, 20, 60, 0.6)';
  colors["amount_max_3"]='rgba(220, 20, 60, 0.8)';
  colors["amount_max_4"]='rgba(255, 0, 0, 0.8)';
  colors["amount_max_5"]='rgba(255, 0, 0, 0.6)';
  colors["amount_max_6"]='rgba(255, 0, 0, 0.4)';
  colors["amount_max_7"]='rgba(255, 0, 0, 0.2)';
  colors["amount_max_8"]='rgba(220, 20, 60, 1)';
  colors["amount_max_9"]='rgba(255, 0, 0, 1)';
  colors["amount_max_full"]='rgba(220, 20, 60, 1)';
  colors["amount_min"]='#1e90ff';
  colors["amount_min_0"]='rgba(30, 144, 255, 0.2)';
  colors["amount_min_1"]='rgba(30, 144, 255, 0.4)';
  colors["amount_min_2"]='rgba(30, 144, 255, 0.6)';
  colors["amount_min_3"]='rgba(30, 144, 255, 0.8)';
  colors["amount_min_4"]='rgba(0, 45, 179, 0.8)';
  colors["amount_min_5"]='rgba(0, 45, 179, 0.6)';
  colors["amount_min_6"]='rgba(0, 45, 179, 0.4)';
  colors["amount_min_7"]='rgba(20, 45, 179, 0.2)';
  colors["amount_min_8"]='rgba(30, 144, 255, 1)';
  colors["amount_min_9"]='rgba(20, 45, 179, 1)';
  colors["amount_min_full"]='rgba(30, 144, 255, 1)';
  colors["expnumb_avg_per"]='#e600e6';
  colors["expnumb_avg_per_0"]='rgba(230, 0, 230, 0.2)';
  colors["expnumb_avg_per_1"]='rgba(230, 0, 230, 0.4)';
  colors["expnumb_avg_per_2"]='rgba(230, 0, 230, 0.6)';
  colors["expnumb_avg_per_3"]='rgba(230, 0, 230, 0.8)';
  colors["expnumb_avg_per_4"]='rgba(115, 0, 153, 0.8)';
  colors["expnumb_avg_per_5"]='rgba(115, 0, 153, 0.6)';
  colors["expnumb_avg_per_6"]='rgba(115, 0, 153, 0.4)';
  colors["expnumb_avg_per_7"]='rgba(115, 0, 153, 0.2)';
  colors["expnumb_avg_per_8"]='rgba(230, 0, 230, 1)';
  colors["expnumb_avg_per_9"]='rgba(115, 0, 153, 1)';
  colors["expnumb_avg_per_full"]='rgba(230, 0, 230, 1)';
  colors["amount_avg_per"]='#336699';
  colors["amount_avg_per_0"]='rgba(51, 102, 153, 0.2)';
  colors["amount_avg_per_1"]='rgba(51, 102, 153, 0.4)';
  colors["amount_avg_per_2"]='rgba(51, 102, 153, 0.6)';
  colors["amount_avg_per_3"]='rgba(51, 102, 153, 0.8)';
  colors["amount_avg_per_4"]='rgba(38, 38, 38, 0.8)';
  colors["amount_avg_per_5"]='rgba(38, 38, 38, 0.6)';
  colors["amount_avg_per_6"]='rgba(38, 38, 38, 0.4)';
  colors["amount_avg_per_7"]='rgba(38, 38, 38, 0.2)';
  colors["amount_avg_per_8"]='rgba(51, 102, 153, 1)';
  colors["amount_avg_per_9"]='rgba(38, 38, 38, 1)';
  colors["amount_avg_per_full"]='rgba(51, 102, 153, 1)';
  colors["white_full"]='rgba(255, 255, 255, 1)';
  colors["transparent"]='rgba(255, 255, 255, 0.0)';
  let results = [];
  let backgroundColors = [];
  let borderColors = [];
  let borderWidth = [];
  let cutoutPercentage = 0;
  for (let i = 0; i < iterationNumber; i++) {
    if (chart==="line") {
      backgroundColors = colors["transparent"];
      borderColors[borderColors.length] = colors[`${color_param}_full`];
      borderWidth[borderWidth.length] = 2;
    }else{
      if(chart==="bar"){
        backgroundColors[backgroundColors.length] = colors[`${color_param}_2`];
        borderColors[borderColors.length] = colors["transparent"];
        borderWidth[borderWidth.length] = 0;
      }else if (chart==="filled_line") {
        backgroundColors[backgroundColors.length] = colors[`${color_param}_0`];
        borderColors[borderColors.length] = colors[`${color_param}_full`];
        borderWidth[borderWidth.length] = 1;
      }else if (chart==="doughnut" || chart==="pie") {
        let number_selector = 0;
        number_selector = (i%iterationNumber);
        backgroundColors[backgroundColors.length] = colors[`${color_param}_${number_selector}`];
        borderColors[borderColors.length] = colors["white_full"];
        if (chart==="doughnut") {
          cutoutPercentage=50;
          borderWidth[borderWidth.length] = 4;
        }else{
          borderWidth[borderWidth.length] = 2;
        }
      }
    }
  }
  results['backgroundColors']=backgroundColors;
  results['borderColors']=borderColors;
  results['borderWidth']=borderWidth;
  results['cutoutPercentage']=cutoutPercentage;
  return results;
};
//capitalize labels for proper display
const getLabelsForChartDisplay =(labels)=>{
  let capitalized = [];
  for (let i = 0; i < labels.length; i++) {
    capitalized[capitalized.length]=capitalizeText(labels[i]);
  }
  return capitalized;
};
//get legend for chart
const getChartLegend = (chart_type, chart_option) => {
  let legend="";
  const legends = {
    "expnumb":'# of expenses',
    "amount_total":'total amount',
    "amount_avg_daily":'avg daily amount',
    "amount_max":'max amount',
    "amount_min":'min amount',
    "amount_avg_categories":'avg amount per category',
    "expnumb_avg_categories":'avg # of exp per category',
    "amount_avg_payments":'avg amount per payment',
    "expnumb_avg_payments":'avg # of exp per payment',
    "amount_avg_goals":'avg amount of exp per goal',
    "expnumb_avg_goals":'avg # of exp per goal',
    "legend_goals":'goals max amount',
    "legend_amount":'amount spent'
  }
  if (chart_type==="comparison") {
    return legend=[legends["legend_goals"],legends["legend_amount"]];
  }else{
    return legend=[legends[`${chart_option}`]];
  }
};
//get data for charts
const getDataForChart = (budgetStatistics, target, chart_type, chart_option) => {
  let data = [];
  if (chart_type==="comparison") {
    const spend_on_goal = budgetStatistics.goals_stats.amount_total;
    const goals_amounts = budgetStatistics.goals_stats.goals_amounts;
    return data = [goals_amounts, spend_on_goal];
  }else{
    return data = [budgetStatistics[`${target}_stats`][`${chart_option}`]];
  }
};
//get labels for chart
const getChartLabels = (budgetStatistics, target)=>{
  let labels = [];
  if(target==="categories" || target==="payments"){
    labels = budgetStatistics[`${target}_stats`][`${target}`];
  } else if (target==="goals") {
    labels = budgetStatistics[`${target}_stats`].categories;
  }else{
    let budget_days = budgetStatistics.overall_stats.budget_days;
    for (var i = 0; i < budget_days.length; i++) {
      let dayNumber = budget_days[i].split("-").pop();
      let daymonth = budget_days[i].split("-")[1];
      labels[labels.length] = dayNumber+" / "+daymonth;
    }
  }
  return labels;
};
//get title for chart
const getChartTitle = (target, chart_type, chart_option) => {
  let title="";
  const titles = {
    "expnumb":'number of expenses per',
    "amount_total":'total amount of expenses per',
    "amount_avg_daily":'average daily amount of expenses per',
    "amount_max":'max amount of expenses per',
    "amount_min":'min amount of expenses per',
  }
  if (chart_type==="comparison") {
    title = 'total amount of expenses per goal';
  }else{
    if (target==="daily") {
      if (chart_option==="amount_avg_daily") {
        title = 'average amount of expenses per day';
      }else{
        title=titles[chart_option]+" "+"day";
      }
    }else if (target==="categories") {
      if (chart_option==="amount_avg_categories") {
        title="average amount of expenses per category";
      }else if (chart_option==="expnumb_avg_categories") {
        title="average number of expenses per category";
      }else {
        title=titles[chart_option]+" "+"category";
      }
    }else if (target==="payments") {
      if (chart_option==="amount_avg_payments") {
        title="average amount of expenses per payment method";
      }else if (chart_option==="expnumb_avg_payments") {
        title="average number of expenses per payment method";
      }else {
        title=titles[chart_option]+" "+"payment method";
      }
    }else if (target==="goals") {
      if (chart_option==="amount_avg_goals") {
        title="average amount of expenses per goal";
      }else if (chart_option==="expnumb_avg_goals") {
        title="average number of expenses per goal";
      }else {
        title=titles[chart_option]+" "+"goal";
      }
    }
  }
  return capitalizeText(title);
};
//capitalize text
const capitalizeText = (str) => {
  return str.replace(/\w\S*/g, (txt)=> {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
};
//update comparison charts options
const updateComparisonChartOptions =(options) => {
  let colors = [];
  colors["transparent"]='rgba(255, 255, 255, 0.0)';
  colors["green"]='rgba(0, 153, 51, 1)';
  colors["green7"]='rgba(0, 153, 51, 0.7)';
  colors["black7"]='rgba(26, 26, 26, 0.7)';
  colors["black"]='rgba(26, 26, 26, 1)';
  colors["green5"]='rgba(0, 153, 51, 0.5)';
  colors["black6"]='rgba(26, 26, 26, 0.6)';
  let results = [];
  let goals_fills = [];
  let spent_fills = [];
  let goals_borders = [];
  let spent_borders = [];
  let compare_legend = options.compare_legend;
  let legend_goals = options.basic_legend;
  let spent_amounts = options.basic_data;
  let compare_data = options.compare_data;
  if (options.basic_type==="bar" && options.compare_type==="bar") {
    options.borderwidth=0;
    for (let i = 0; i < options.basic_data.length; i++) {
      goals_fills[goals_fills.length] = colors["green7"];
      goals_borders[goals_borders.length] = colors["transparent"];
      spent_fills[spent_fills.length] = colors["black7"];
      spent_borders[spent_borders.length] = colors["transparent"];
    }
    options.basic_fills=goals_fills;
    options.basic_borders=goals_borders;
    options.compare_fills=spent_fills;
    options.compare_borders=spent_borders;
  }else if (options.basic_type==="bar"&& options.compare_type==="line") {
    options.basic_legend=compare_legend;
    options.compare_legend=legend_goals;
    options.basic_data=spent_amounts;
    options.compare_data=compare_data;
    for (let i = 0; i < options.basic_data.length; i++) {
      goals_fills[goals_fills.length] = colors["transparent"];
      goals_borders[goals_borders.length] = colors["black"];
      spent_fills[spent_fills.length] = colors["green5"];
      spent_borders[spent_borders.length] = colors["transparent"];
    }
    options.basic_fills=spent_fills;
    options.basic_borders=spent_borders;
    options.compare_fills=goals_fills;
    options.compare_borders=goals_borders;
  }else if (options.basic_type==="line" && options.compare_type==="line") {
    for (let i = 0; i < options.basic_data.length; i++) {
      goals_fills[goals_fills.length] = colors["transparent"];
      goals_borders[goals_borders.length] = colors["green"];
      spent_fills[spent_fills.length] = colors["transparent"];
      spent_borders[spent_borders.length] = colors["black"];
    }
    options.basic_fills=goals_fills;
    options.basic_borders=goals_borders;
    options.compare_fills=spent_fills;
    options.compare_borders=spent_borders;
  }else if (options.basic_type==="radar") {
    options.basic_legend=compare_legend;
    options.compare_legend=legend_goals;
    options.basic_data=spent_amounts;
    options.compare_data=compare_data;
    for (let i = 0; i < options.basic_data.length; i++) {
      goals_fills[goals_fills.length] = colors["green5"];
      goals_borders[goals_borders.length] = colors["green"];
      spent_fills[spent_fills.length] = colors["black6"];
      spent_borders[spent_borders.length] = colors["black"];
    }
    options.basic_fills=spent_fills;
    options.basic_borders=spent_borders;
    options.compare_fills=goals_fills;
    options.compare_borders=goals_borders;
  }
  return options;
};
//get comparison charts
const getComparisonCharts = (option) => {
  option = option.split(" ")[0];
  let charts=["bar", "bar"];
  if (option==="bar-line") {
    charts=["bar", "line"];
  }else if (option==="lines") {
    charts=["line", "line"];
  }else if (option==="radar") {
    charts=["radar", "radar"];
  }
  return charts;
};
//get category colors for chart
const getChartCategoryColors = (categories) =>{
  let colors = [];
  colors["bar"]='rgba(255, 102, 0, 1)';
  colors["bills"]='rgba(179, 0, 0, 1)';
  colors["clothing"]='rgba(71, 107, 107, 1)';
  colors["communication"]='rgba(30, 144, 255, 1)';
  colors["cosmetics"]='rgba(255, 102, 153, 1)';
  colors["donations"]='rgba(153, 0, 204, 1)';
  colors["education"]='rgba(0, 102, 153, 1)';
  colors["entertainment"]='rgba(255, 165, 0, 1)';
  colors["gifts"]='rgba(255, 136, 77, 1)';
  colors["health"]='rgba(0, 128, 43, 1)';
  colors["housing"]='rgba(179, 89, 0, 1)';
  colors["investments"]='rgba(0, 128, 96, 1)';
  colors["restaurant"]='rgba(204, 0, 0, 1)';
  colors["sports"]='rgba(255, 26, 117, 1)';
  colors["supermarket"]='rgba(255, 64, 0, 1)';
  colors["technology"]='rgba(31, 64, 96, 1)';
  colors["transportation"]='rgba(179, 134, 0, 1)';
  colors["traveling"]='rgba(0, 153, 77, 1)';
  colors["vehicle"]='rgba(38, 38, 38, 1)';
  colors["miscellaneous"]='rgba(115, 77, 38, 1)';
  colors["etiq_0"]='rgba(46, 184, 46, 1)';
  colors["etiq_1"]='rgba(0, 255, 0, 1)';
  let results = [];
  for (let i = 0; i < categories.length; i++) {
    let colorname = categories[i].split(" ")[0];
    let color = colors[`${colorname}`];
    if (color === undefined || color === null) {
      let numberselector = (i%2);
      color = colors[`etiq_${numberselector}`];
    }
    results[results.length] = color;
  }
  return results;
};
/*
*  STATISTICS GENERATORS
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
/*
*  GET LISTS
*/
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
* UTILITY FUNCTIONS
*/
//add data to html
const addData = (container, value) => {
  if (value<0) {
    container.innerHTML = "- "+getDisplayFormat(getDecimalFormat(Math.abs(value)));
  }else{
    container.innerHTML = getDisplayFormat(getDecimalFormat(value));
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
//get mode
const getMode=(budgetNumber)=>{
    let mode="last";
  if (self.statistics.all.number_of_budgets===budgetNumber && self.statistics.all.budgets_to_display===budgetNumber && self.budget_indicator===true ) {
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
//get percentage
const getPercentage = (comparedvalue, basevalue) =>{
  let percentage=0;
  if (basevalue>0) {
    percentage = comparedvalue/basevalue*100;
    percentage = Math.round(percentage * 100) / 100;
  }
  return percentage;
};
//get progress
const getProgress = (percentage) =>{
  let progress;
  if(parseFloat(percentage)>parseFloat(100)){
    progress = "fail";
  }else{
    progress = "success";
  }
  return progress;
};
//animate progress bar
const displayProgressBar = (percentage, element) => {
  if (percentage>100) {
    percentage===100;
  }
  let width = 0;
  let id = setInterval(frame, 20);
  function frame(){
    if (width >= percentage) {
      clearInterval(id);
    } else {
      width++;
      element.style.width = width + '%';
    }
  }
};
//display success bookmark
const displaySuccessBookmark = (element)=>{
  element.classList.add("performanceStatusSuccess");
};
//change toggle chart button
const changeToggleChartButton=(button, newvalue, type)=>{
  button.setAttribute('id', `toggleChart_${newvalue}_${type}`);
  button.innerHTML=newvalue+" "+"chart";
  button.setAttribute('aria-label', newvalue+" "+type+" "+"chart");
};
// remove charts
const removeChart = (container, target) => {
  const charts = container.querySelectorAll('.chartjs-size-monitor');
  const canvas = container.querySelectorAll('.chartCanvas');
  if (charts.length>0) {
    for (let i = 0; i < charts.length; i++) {
      charts[i].remove();
    }
  }
  if(canvas.length>0){
    for (let i = 0; i < canvas.length; i++) {
      canvas[i].remove();
    }
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
/*
* CREATE HTML NECESSARY FOR THIS PAGE
*/
//create feedback html
const renderFeedbackHTML = () => {
  const feedbackView = document.createElement('div');
  feedbackView.setAttribute("id", "feedbackView");
  feedbackView.classList.add("flexRowWrapStartCenter", "hidden");
  const feedbackSummaryCard = document.createElement('div');
  feedbackSummaryCard.setAttribute("id", "feedbackSummaryCard");
  feedbackSummaryCard.classList.add("feedbackcard");
  const h3_a = document.createElement('h3');
  h3_a.setAttribute("id", "feedbackHeader");
  h3_a.classList.add("feedbackHeader");
  const p = document.createElement('p');
  p.setAttribute("id", "feedbackParagraph");
  const h3_b = document.createElement('h3');
  h3_b.setAttribute("id", "feedbackOverview");
  h3_b.innerHTML = "Overview";
  const feedbackOverviewContainer_a = document.createElement('div');
  feedbackOverviewContainer_a.classList.add("feedbackOverviewContainer");
  const feedbackOverviewIcon_a = document.createElement('div');
  feedbackOverviewIcon_a.classList.add("feedbackOverviewIcon", "fas", "fa-wallet");
  const feedbackOverviewText_a = document.createElement('div');
  feedbackOverviewText_a.classList.add("feedbackOverviewText");
  const p_a = document.createElement('p');
  p_a.classList.add("feedbackOverviewHeader");
  p_a.innerHTML = "Budget";
  const p_b = document.createElement('p');
  p_b.classList.add("centeredFlexbox", "feedbackOverviewDataContainer");
  p_b.innerHTML = `<span>&euro;</span><span class='feedbackOverviewData'>0.00</span>`;
  feedbackOverviewText_a.append(p_a, p_b);
  feedbackOverviewContainer_a.append(feedbackOverviewIcon_a, feedbackOverviewText_a);
  const feedbackOverviewContainer_b = document.createElement('div');
  feedbackOverviewContainer_b.classList.add("feedbackOverviewContainer");
  const feedbackOverviewIcon_b = document.createElement('div');
  feedbackOverviewIcon_b.classList.add("feedbackOverviewIcon", "fas", "fa-money-bill-wave");
  const feedbackOverviewText_b = document.createElement('div');
  feedbackOverviewText_b.classList.add("feedbackOverviewText");
  const p_c = document.createElement('p');
  p_c.classList.add("feedbackOverviewHeader");
  p_c.innerHTML = `<span>Money Spent</span><span><span class='perc_separator'>|</span><span id='fo_spend_perc' class='fo_perc'>00.00</span>%</span>`;
  const p_d = document.createElement('p');
  p_d.classList.add("centeredFlexbox", "feedbackOverviewDataContainer");
  p_d.innerHTML = `<span>&euro;</span><span class='feedbackOverviewData'>0.00</span>`;
  feedbackOverviewText_b.append(p_c, p_d);
  feedbackOverviewContainer_b.append(feedbackOverviewIcon_b, feedbackOverviewText_b);
  const feedbackOverviewContainer_c = document.createElement('div');
  feedbackOverviewContainer_c.classList.add("feedbackOverviewContainer");
  const feedbackOverviewIcon_c = document.createElement('div');
  feedbackOverviewIcon_c.classList.add("feedbackOverviewIcon", "fas", "fa-piggy-bank");
  const feedbackOverviewText_c = document.createElement('div');
  feedbackOverviewText_c.classList.add("feedbackOverviewText");
  const p_e = document.createElement('p');
  p_e.classList.add("feedbackOverviewHeader");
  p_e.innerHTML = `<span>Money Saved</span><span><span class='perc_separator'>|</span><span id='fo_saved_perc' class='fo_perc'>00.00</span>%</span>`;
  const p_f = document.createElement('p');
  p_f.classList.add("centeredFlexbox", "feedbackOverviewDataContainer");
  p_f.innerHTML = `<span>&euro;</span><span class='feedbackOverviewData'>0.00</span>`;
  feedbackOverviewText_c.append(p_e, p_f);
  feedbackOverviewContainer_c.append(feedbackOverviewIcon_c, feedbackOverviewText_c);
  const feedbackProgressBar = document.createElement('div');
  feedbackProgressBar.setAttribute("id", "feedbackProgressBar");
  feedbackProgressBar.innerHTML = `<span class='feedbackProgressBar spend'></span><span class='feedbackProgressBar saved'></span>`;
  feedbackSummaryCard.append(h3_a, p, h3_b, feedbackOverviewContainer_a, feedbackOverviewContainer_b,  feedbackOverviewContainer_c, feedbackProgressBar);
  const btnWrapper = document.createElement('div');
  btnWrapper.classList.add("btnWrapper");
  const btntext = `<i class='fas fa-chart-bar'></i><span>view statistics</span>`;
  const btn = createButton('viewStatisticsBtn', btntext, 'view statistics', closeFeedbackView);
  btn.classList.add("app_btn", "centeredFlexbox", "statisticsBtn");
  btnWrapper.append(btn);
  feedbackView.append(feedbackSummaryCard, btnWrapper);
  return feedbackView;
};
//statistics html
const renderStatisticsHTML = () => {
  const statisticsView = document.createElement('div');
  statisticsView.setAttribute("id", "statisticsView");
  statisticsView.classList.add("flexRowWrapStartCenter", "hidden");
  const homeOptionsContainer = document.createElement('div');
  homeOptionsContainer.setAttribute("id", "homeOptionsContainer");
  homeOptionsContainer.classList.add("centeredFlexbox");
  const add_exp = createAddLink('add_expense', 'add<br>expense', 'add expense', pages.add_expense.url);
  homeOptionsContainer.append(add_exp);
  const daycontainer = createOverviewContainer('daily', 'daily', 'Daily Overview');
  const goalcontainer = createOverviewContainer('goal', 'goals', 'Goals Overview');
  const catcontainer = createOverviewContainer('categories', 'categories', 'Categories Overview');
  const paycontainer = createOverviewContainer('payments', 'payments', 'Payment Methods Overview');
  statisticsView.append(homeOptionsContainer, daycontainer, goalcontainer, catcontainer, paycontainer);
  return statisticsView;
};
//create overview card
const createOverviewContainer = (containerClass, type, header) =>{
  const container = document.createElement('div');
  container.setAttribute("id", containerClass+"OverviewContainer");
  container.classList.add("flexRowWrapStartCenter", containerClass+"OverviewContainer", "hidden");
  const h3 = document.createElement('h3');
  h3.classList.add("sectionHeader", "sectionHeader_"+type);
  h3.innerHTML=`<span>${header}</span>`;
  const btn = createButton("toggleChart_view_"+type, '', "view "+type+" chart", toggleChart);
  btn.classList.add("app_btn", "chartToggleBtn", "hidden");
  h3.append(btn);
  const chartContainer = document.createElement('div');
  chartContainer.setAttribute("id", "chartContainer_"+type);
  chartContainer.classList.add("chartContainer", "hidden");
  const chartOptions = document.createElement('div');
  chartOptions.setAttribute("id", "chartOptions_"+type);
  chartOptions.classList.add("centeredFlexbox", "chartOptionsContainer");
  chartContainer.append(chartOptions);
  container.append(h3, chartContainer);
  return container;
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
//create budget overview card
const createBudgetOverviewCard=(mode) => {
  let budget_spent_tag = "budget spent";
  let budget_avail_tag = "budget available";
  let budget_avg_tag = "average amount spent";
  if(mode==="current"){
    budget_spent_tag = budget_spent_tag+" "+"so far";
    budget_avail_tag = budget_avail_tag+" "+"so far";
    budget_avg_tag = budget_avg_tag+" "+"so far";
  }
  const card = document.createElement('div');
  card.classList.add("flexRowWrapStartCenter", "card", "budgetOverviewCard");
  const cardHeader = document.createElement('h3');
  cardHeader.className = "cardHeader";
  cardHeader.innerHTML = "Budget Overview";
  const cardHeaderSection = createCardHeaderSection("budget", "bo", "00.00");
  const budgetSpentRow = createCardRow(budget_spent_tag, "bo", "00.00");
  const budgetAvailableRow = createCardRow(budget_avail_tag, "bo", "00.00");
  const budgetAvgRow = createCardRow(budget_avg_tag, "bo", "00.00");
  card.append(cardHeader, cardHeaderSection, budgetSpentRow, budgetAvailableRow, budgetAvgRow);
  if(mode!="current"){
    const progressIndicator = createProgressBookmark();
    progressIndicator.classList.add("overallBudgetCup");
    card.append(progressIndicator);
  }
  return card;
};
//create expenses overview card
const createExpensesOverviewCard=(mode) => {
  let avg_tag = "average number of expenses";
  let max_tag = "maximum amount of expenses";
  let min_tag = "minimum amount of expenses";
  if(mode==="current"){
    avg_tag = avg_tag+" "+"so far";
    max_tag = max_tag+" "+"so far";
    min_tag = min_tag+" "+"so far";
  }
  const card = document.createElement('div');
  card.classList.add("flexRowWrapStartCenter", "card", "expOverviewCard");
  const cardHeader = document.createElement('h3');
  cardHeader.className = "cardHeader";
  cardHeader.innerHTML = "Expenses Overview";
  const cardHeaderSection = createCardHeaderSection("expenses", "expo", "0", "no");
  const avgRow = createCardRow(avg_tag, "expo", "0", "no");
  const maxRow = createCardRow(max_tag, "expo", "00.00");
  const minRow = createCardRow(min_tag, "expo", "00.00");
  card.append(cardHeader, cardHeaderSection, avgRow, maxRow, minRow);
  return card;
};
//creare header section
const createCardHeaderSection = (tagtext, dataclass, startdata, euroentity="yes", iconaddClass="no") => {
  const section = document.createElement('div');
  section.classList.add("flexRowNoWrapStartCenter", "cardRow");
  const sectionIcon = document.createElement('div');
  sectionIcon.classList.add("cardHeaderIcon", `cardHeaderIcon_${dataclass}`);
  if(dataclass==="expo" || dataclass==="day"){
    sectionIcon.classList.add("fas", "fa-money-bill-wave");
  }else if(iconaddClass==="piggy"){
    sectionIcon.classList.add("fas", "fa-piggy-bank");
  }else if(iconaddClass==="goaltick"){
    sectionIcon.classList.add("fas", "fa-check", "success");
  }else if(iconaddClass==="goalx"){
    sectionIcon.classList.add("fas", "fa-times", "fail");
  }
  const cardHeaderData = createCardHeaderData(tagtext, dataclass, startdata, euroentity);
  section.append(sectionIcon, cardHeaderData);
  return section;
};
//create card row
const createCardRow = (tagtext, dataclass, startdata, euroentity="yes", perc="yes") =>{
  const cardRow = document.createElement('div');
  cardRow.className = "cardRow";
  const statisticsTag = document.createElement('p');
  statisticsTag.classList.add("centeredFlexbox", "statisticsTag");
  const statisticsTagText = document.createElement('span');
  statisticsTagText.innerHTML = tagtext;
  if(tagtext.substr(0,7)==="average"){
    const statisticsPerDay = document.createElement('span');
    statisticsPerDay.className="perDaySpan";
    statisticsPerDay.innerHTML = "(per day)";
    statisticsTagText.append(statisticsPerDay);
  }
  statisticsTag.append(statisticsTagText);
  if(perc==="yes"){
    const statisticsPerc = document.createElement('span');
    statisticsPerc.className="percTag";
    const percSpan = document.createElement('span');
    percSpan.className=`percTag_${dataclass}`;
    percSpan.innerHTML="00.00";
    const span = document.createElement('span');
    span.innerHTML = " %";
    statisticsPerc.append(percSpan, span);
    statisticsTag.append(statisticsPerc);
  }
  const progressBar = progressBarCreator(dataclass);
  const statisticsContainer = createStatisticsContainer(dataclass, startdata, euroentity);
  cardRow.append(statisticsTag, progressBar, statisticsContainer);
  return cardRow;
};
//create statistics contaainer
const createStatisticsContainer = (dataclass, startdata, euroentity) => {
  const statisticsContainer = document.createElement('p');
  statisticsContainer.classList.add("flexRowNoWrapStartCenter", "statisticsContainer");
  const statsData = document.createElement('span');
  statsData.classList.add("statsData", `statsData_${dataclass}`);
  statsData.innerHTML = startdata;
  if(euroentity==="yes") {
    const euroentity = createEuroEntity("");
    statisticsContainer.append(euroentity, statsData);
  }else{
    statisticsContainer.append(statsData);
  }
  return statisticsContainer;
};
//create progress bookmark
const createProgressBookmark = (mode="cup") => {
  const progressBookmark = document.createElement('div');
  progressBookmark.classList.add("performanceStatusTag", "fas", "fa-bookmark");
  const progressIcon = document.createElement('div');
  if(mode==="cup"){
    progressIcon.classList.add("performanceStatusCup", "fas", "fa-trophy");
  }else if(mode==="goal_fail"){
    progressIcon.classList.add("performanceStatusGoal", "fas", "fa-times", "goalFailBookMark");
  }else if(mode==="goal_success"){
    progressIcon.classList.add("performanceStatusGoal", "fas", "fa-check", "goalSuccessBookMark");
  }
  progressBookmark.append(progressIcon);
  return progressBookmark;
};
//create header icon and data
const createCardHeaderData = (tagtext, dataclass, startdata, euroentity) => {
  const section = document.createElement('div');
  section.className = "statisticsBox";
  const statisticsTag = document.createElement('p');
  statisticsTag.className = "statisticsTag";
  statisticsTag.innerHTML = tagtext;
  const statisticsContainer = createStatisticsContainer(dataclass, startdata, euroentity);
  section.append(statisticsTag, statisticsContainer);
  return section;
};
//create euro entity
const createEuroEntity = (mode)=>{
  const euroEntity = document.createElement('span');
  euroEntity.classList.add("euroEntity", `${mode}EuroEntity`);
  euroEntity.innerHTML="&euro;";
  return euroEntity;
};
//create progress bar
const progressBarCreator = (barclass, mode="single") => {
  const progressBarBase = document.createElement('div');
  progressBarBase.classList.add("progressBarBase", "flexRowNoWrapStartCenter");
  if(mode==="single"){
    const progressBar = document.createElement('span');
    progressBar.classList.add("progressBarIndicator", `progressBar_${barclass}`);
    progressBarBase.append(progressBar);
  }
  return progressBarBase;
};
//create category cards
const createCategoryCards=(categories, categoriesView = self.categoriesView)=>{
  for (let i = 0; i < categories.length; i++) {
    let data=[];
    let category=categories[i];
    data["category"] =  category;
    data["category_icon"] = "icon_"+ category.split(" ")[0];
    data["progress_bar_class"] = "progressBar_"+ category.split(" ")[0];
    let card = createStatisticalCard("category", data);
    categoriesView.append(card);
  }
  const category_icons = categoriesView.querySelectorAll('.category_icon');
  loadCategoryIcons(category_icons);
};
//create payment cards
const createPaymentCards=(payments, paymentsView = self.paymentsView)=>{
  for (let i = 0; i < payments.length; i++) {
    let data=[];
    let category=payments[i];
    data["category"] = category;
    data["category_icon"] = category.split(" ")[0]+"icon";
    data["progressBar_payment"] = "progressBar_"+ category.split(" ")[0];
    data["progress_bar_class"] = "progressBar_payment";
    let card = createStatisticalCard("payment", data);
    paymentsView.append(card);
  }
  const payments_icons = paymentsView.querySelectorAll('.category_icon');
  loadPaymentIcons(payments_icons);
};
//create goals summary card
const createGoalsSummaryCard=()=>{
  const card = document.createElement('div');
  card.classList.add("flexColumnCenter", "card", "goalsOverviewCard");
  const cardHeader = document.createElement('h3');
  cardHeader.className = "cardHeader";
  cardHeader.innerHTML = "Goals Summary";
  const total = createCardHeaderSection("goals", "goalso", "0", "no", "piggy");
  const success = createCardHeaderSection("succeeded", "goalso", "0", "no", "goaltick");
  const exceeded = createCardHeaderSection("exceded", "goalso", "0", "no", "goalx");
  card.append(cardHeader, total, success, exceeded);
  return card;
};
//create goal cards
const createGoalCards=(goals_stats, goalsView = self.goalsView)=>{
  goalsView.append(createGoalsSummaryCard());
  for (let i = 0; i < goals_stats.goals_achieved.length; i++) {
    let data=[];
    let category=goals_stats.categories[i];
    data["category"] =  category;
    data["category_icon"] = "icon_"+ category.split(" ")[0];
    data["progress_bar_class"] = "progressBar_"+ category.split(" ")[0];
    let card = createStatisticalCard("goal", data);
    goalsView.append(card);
  }
  const category_icons = goalsView.querySelectorAll('.category_icon');
  loadCategoryIcons(category_icons);
};
//create daily cards
const createDailyCards=(budgetStatistics, days, dailyView = self.dailyView)=>{
  for (var i = 1; i <=days; i++) {
    let day = budgetStatistics[`day${i}`];
    let date = day.date;
    let monthname = getMonthName(date);
    let headertext = date.split("-")[2]+" "+monthname+" "+date.split("-")[0];
    let card = createDailyCard(headertext);
    dailyView.append(card);
  }
};
//create daily card
const createDailyCard=(headertext)=>{
  const card = document.createElement('div');
  card.classList.add("flexColumnCenter", "card", "dailyOverviewCard");
  const cardHeader = document.createElement('h3');
  cardHeader.className = "cardHeader";
  cardHeader.innerHTML = headertext;
  const cardSectionOne = createCardHeaderSection("expenses", "day", "0", "no");
  const tagbase = " amount of expenses";
  const totalRow = createCardRow("total"+tagbase, "day", "00.00");
  const maxRow = createCardRow("maximum"+tagbase, "day", "00.00");
  const minRow = createCardRow("minimum"+tagbase, "day", "00.00");
  card.append(cardHeader, cardSectionOne, totalRow, maxRow, minRow);
  return card;
};
//create statistical card for goals, categories and payments
const createStatisticalCard = (cardname, data) =>{
  const card = document.createElement('div');
  card.classList.add("flexRowWrapStartCenter", "card", `${cardname}OverviewCard`);
  const categoryTag = createCategoryContainer(cardname, data["category_icon"], data["category"], data["progress_bar_class"]);
  const expensesTotalSection=createExpensesTotalSection(cardname);
  if(cardname==="goal"){
    const header = document.createElement('h3');
    header.className="cardHeader";
    header.innerHTML=cardname+" #<span class='"+cardname+"Index'></span>";
    card.append(header, categoryTag, expensesTotalSection);
  }else{
    card.append(categoryTag, expensesTotalSection);
  }
  return card;
}
//create category container
const createCategoryContainer = (cardname, categoryicon, category, progress_bar_class) =>{
  const categoryContainer = document.createElement('div');
  categoryContainer.className="cardRow";
  const tag = document.createElement('p');
  tag.classList.add("centeredFlexbox", `${cardname}Tag`);
  const spanWrapperIconName = document.createElement('span');
  spanWrapperIconName.className="flexRowNoWrapStartCenter";
  const icon = document.createElement('span');
  icon.classList.add(`${cardname}CategoryIcon`, "category_icon", categoryicon);
  const categoryname = document.createElement('span');
  categoryname.className=`${cardname}Category`;
  categoryname.innerHTML = category;
  spanWrapperIconName.append(icon, categoryname);
  const percentage = document.createElement('span');
  percentage.className="percTag";
  const percentagetext = document.createElement('span');
  percentagetext.className=`percTag_${cardname}`;
  percentagetext.innerHTML="00.00";
  const percentageind = document.createElement('span');
  percentageind.innerHTML=" %";
  percentage.append(percentagetext, percentageind);
  tag.append(spanWrapperIconName, percentage);
  const progressBar = document.createElement('div');
  progressBar.classList.add("flexRowNoWrapStartCenter", "progressBarBase");
  const progressBarIndicator = document.createElement('span');
  progressBarIndicator.classList.add("progressBarIndicator", `${cardname}ProgressIndicator`, progress_bar_class);
  progressBar.append(progressBarIndicator);
  const progressData = createProgressData(cardname);
  categoryContainer.append(tag, progressBar, progressData);
  return categoryContainer;
}
//create total expenses section
const createExpensesTotalSection = (mode) => {
  const cardrow = document.createElement('div');
  cardrow.classList.add("flexRowNoWrapStartCenter", "cardRow");
  const sectionIcon = document.createElement('div');
  sectionIcon.classList.add("cardHeaderIcon", "totalexpensesicon", "fas", "fa-money-bill-wave");
  const statisticsBox = document.createElement('div');
  statisticsBox.classList.add("flexRowNoWrapStartCenter", "statisticsBox");
  const statisticsTag = document.createElement('p');
  statisticsTag.classList.add("statisticsTag", "centeredFlexbox");
  statisticsTag.innerHTML ="Expenses";
  const statsData = document.createElement('p');
  statsData.classList.add("statsData", "statsDataExpNumb", `statsDataExp_${mode}`);
  statsData.innerHTML ="0";
  statisticsBox.append(statisticsTag, statsData);
  cardrow.append(sectionIcon, statisticsBox);
  return cardrow;
};
//create progress data
const createProgressData = (mode)=>{
  const p = document.createElement('p');
  p.classList.add("flexRowNoWrapStartCenter", "statisticsContainer", `${mode}StatisticsContainer`);
  const dataSpan = document.createElement('span');
  const dataContainer = document.createElement('span');
  dataContainer.classList.add(`${mode}Data`, `statsDataCurr_${mode}`);
  dataContainer.innerHTML="00.00";
  const leftDataContainer = document.createElement('span');
  leftDataContainer.classList.add("flexRowNoWrapStartCenter", `${mode}DataCurrentContainer`);
  leftDataContainer.append(createEuroEntity(mode), dataContainer);
  const rightDataContainer = document.createElement('span');
  rightDataContainer.classList.add("flexRowNoWrapStartCenter");
  if(mode=="goal"){
    const currdataContainer = document.createElement('span');
    currdataContainer.classList.add(`${mode}Data`, `statsDataMax_${mode}`);
    currdataContainer.innerHTML="00.00";
    rightDataContainer.append(currdataContainer, createEuroEntity(mode));
  }
  p.append(leftDataContainer, rightDataContainer);
  return p;
};
//create card with gif images
const populateAffectiveCard = (user_performance) => {
  const card = document.createElement('div');
  card.setAttribute('id', 'feedbackCard');
  card.classList.add("centeredFlexbox", "card", "feedbackCard");
  const imageOne = document.createElement('div');
  imageOne.classList.add("feedbackIcons", "mainFeedbackIcon", user_performance);
  const imageTwo = document.createElement('div');
  imageTwo.classList.add("feedbackIcons", "secondaryFeedbackIcon", user_performance);
  const imageGroup = document.createElement('div');
  imageGroup.classList.add("thirdFeedbackIcons");
  const imageGroupOne = document.createElement('div');
  imageGroupOne.classList.add("feedbackIcons", "thirdOne", user_performance);
  const imageGroupTwo = document.createElement('div');
  imageGroupTwo.classList.add("feedbackIcons", "thirdTwo", user_performance);
  imageGroup.append(imageGroupOne, imageGroupTwo);
  card.append(imageOne, imageTwo, imageGroup);
  return card;
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
//populate chart options for statistics type
const populateChartOptionsSelectBox = (container, sectionname) => {
  let sectiontype = {categories:"category", payments:"payment", goals:"goal", daily:"day"}
  let options = {
    "values":["amount_total", "expnumb", "amount_avg_daily", "amount_max", "amount_min"],
    "texts":["total amount","number of expenses", "average amount", "max amount", "min amount"]
  };
  if (sectionname!="daily") {
    options.texts[2]="average amount (per day)";
    options.values.splice(3, 0, "amount_avg_"+sectionname, "expnumb_avg_"+sectionname);
    options.texts.splice(3, 0, "average amount (per "+sectiontype[sectionname]+")", "average number of expenses");
  }
  const selectBoxChecker = document.getElementById(`selectChartOption_${sectionname}`);
  if(selectBoxChecker != null){
    container.querySelectorAll('.chartOptionContainer')[0].remove();
  }
  const selectbox_element = createChartSelectBox(`selectChartOption_${sectionname}`, options, 'chartOptionContainer',
  'chartOptionSelectBox', `chartOption_${sectionname}`, options.values[0]);
  container.append(selectbox_element);
  if(sectionname==="goals"){
    const selectContainer = container.querySelectorAll('.chartOptionContainer')[0];
    selectContainer.classList.add("goalStatsOptionContainer");
  }
  const selectBox = document.getElementById(`selectChartOption_${sectionname}`);
  selectBox.blobSelect.init({
    "placeholder": options.texts[0],
    "placeholderOption": options.values[0],
    "search":false});
  selectBox.addEventListener('change', changeChart);
};
//populate available chart types
const populateChartTypeSelectBox = (container, sectionname) => {
  let options = {
    "values":["bar", "doughnut", "line", "filled_line", "pie"],
    "texts":["bar chart", "doughnut chart", "line chart", "filled line chart", "pie chart"]
  };
  if(sectionname === "goals"){
    options.values.unshift("comparison");
    options.texts.unshift("comparison chart");
  }
  const selectBoxChecker = document.getElementById(`selectChartType_${sectionname}`);
  if(selectBoxChecker != null){
    container.querySelectorAll('.chartTypeContainer')[0].remove();
  }
  const selectbox_element = createChartSelectBox(`selectChartType_${sectionname}`, options,'chartTypeContainer', 'chartTypeSelectBox', `chartOption_${sectionname}`, options.values[0]);
  container.append(selectbox_element);
  const selectBox = document.getElementById(`selectChartType_${sectionname}`);
  selectBox.blobSelect.init({
    "orderType":"string",
    "order":"ASC",
    "placeholder": options.texts[0],
    "placeholderOption": options.values[0],
    "search":false});
  selectBox.addEventListener('change', changeChart);
};
//create chart select box
const createChartSelectBox = (selectid, options, containerclass, selectclass, selectname, placeholder) => {
  const selectContainer = document.createElement('div');
  selectContainer.className = containerclass;
  const selectBox = document.createElement('select');
  selectBox.setAttribute('id',selectid);
  selectBox.classList.add("formInputs", selectclass);
  selectBox.name = selectname;
  let selectedoption = document.createElement('option');
  selectedoption.value = placeholder;
  selectedoption.innerHTML = placeholder;
  selectBox.append(selectedoption);
  for (var i = 0; i < options.values.length; i++) {
    if(options.values[i]!=placeholder){
      let option = document.createElement('option');
      option.value = options.values[i];
      option.innerHTML = options.texts[i];
      selectBox.append(option);
    }
  }
  selectContainer.append(selectBox);
  return selectContainer;
};
//populate chart comparison select box
const populateChartComparisonsSelectBox = (container, sectionname) => {
  let options = {
    "values":["bar", "bar_line", "lines", "radar"],
    "texts":["bar chart", "bar-line chart", "lines chart", "radar chart"]
  };
  const selectBoxChecker = document.getElementById(`selectChartOption_${sectionname}`);
  if(selectBoxChecker != null){
    container.querySelectorAll('.chartOptionContainer')[0].remove();
  }
  const selectbox_element = createChartSelectBox(`selectChartOption_${sectionname}`, options, 'chartOptionContainer',
  'chartOptionSelectBox', `chartOption_${sectionname}`, options.values[0]);
  container.append(selectbox_element);
  const selectBox = document.getElementById(`selectChartOption_${sectionname}`);
  const selectContainer = container.querySelectorAll('.chartOptionContainer')[0];
  selectContainer.classList.add("compareOptionContainer");
  selectBox.blobSelect.init({
    "placeholder": options.texts[0],
    "placeholderOption": options.values[0],
    "search":false});
  selectBox.addEventListener('change', changeChart);
};
//initialize chart sections
const initializeChartSections = () => {
  const chartContainers = document.querySelectorAll('.chartContainer');
  const chartToggleBtn = document.querySelectorAll('.chartToggleBtn');
  const no_goals_indicator = document.querySelectorAll('.no_goals_indicator');
  const charts = document.querySelectorAll('.chartCanvas');
  for (let i = 0; i < chartContainers.length; i++) {
    let id = chartContainers[i].getAttribute('id');
    let target = id.split("_")[1];
    hideElement(chartContainers[i]);
    changeToggleChartButton(chartToggleBtn[i], "view", target);
    displayElement(chartToggleBtn[i]);
    if (target==="goals" && no_goals_indicator.length>0) {
      hideElement(chartToggleBtn[i]);
    }else{
      initializeOneChartSelectBoxes(target);
    }
  }
};
//initialize chart options for one section
const initializeOneChartSelectBoxes = (target) => {
  const chartContainer = document.getElementById(`chartContainer_${target}`);
  const container = document.getElementById(`chartOptions_${target}`);
  removeChart(chartContainer, target);
  populateChartTypeSelectBox(container, target);
  if (target==="goals") {
    populateChartComparisonsSelectBox(container, target);
  }else{
    populateChartOptionsSelectBox(container, target);
  }
};
//create canvas for chart
const createChartCanvas = (type) => {
  const canvas = document.createElement('canvas');
  canvas.setAttribute('id', `chartCanvas_${type}`);
  canvas.classList.add("chartCanvas");
  canvas.setAttribute('width', '400');
  canvas.setAttribute('height', '400');
  return canvas;
};
/*
* CREATE CHARTS
*/
//create bar, line and filled line chart
const createLinearChart = (chartOptions) => {
  const chart = document.getElementById(`chartCanvas_${chartOptions.target}`).getContext('2d');
  let linearChart = new Chart(chart, {
    type: chartOptions.type,
      data: {
        labels: chartOptions.labels,
          datasets: [{
            label: chartOptions.legend,
            data: chartOptions.data,
            backgroundColor: chartOptions.fills,
            borderColor: chartOptions.borders,
            borderWidth:chartOptions.borderwidth[0],
            pointBorderWidth: 2,
            pointRadius: 4,
            pointBackgroundColor:chartOptions.borders,
        }]
      },
      options: {
        title: {
          display: true,
          text: chartOptions.title,
          fontSize: 20,
          fontColor:"#1a1a1a",
          fontFamily:"'Roboto', 'Helvetica', 'Verdana', sans-serif"
        },
        tooltips :{
          backgroundColor: "#1a1a1a",
          titleFontFamily:"'Roboto', 'Helvetica', 'Verdana', sans-serif",
          titleFontSize:16,
          bodyFontFamily:"'Roboto', 'Helvetica', 'Verdana', sans-serif",
          bodyFontSize:16
        },
        legend: {
          display: false
        },
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero:true
            }
          }]
        }
    }
  });
};
//create pie and doughnut chart
const createRoundChart = (chartOptions) => {
  const chart = document.getElementById(`chartCanvas_${chartOptions.target}`).getContext('2d');
  let roundChart = new Chart(chart, {
        type: chartOptions.type,
        data: {
            labels: chartOptions.labels,
            datasets: [{
                label: chartOptions.legend,
                data: chartOptions.data,
                backgroundColor: chartOptions.fills,
                borderColor: chartOptions.borders,
                borderWidth:chartOptions.borderwidth
            }]
        },
        options: {
          title: {
            display: true,
            text: chartOptions.title,
            fontSize: 20,
            fontColor:"#1a1a1a",
            fontFamily:"'Roboto', 'Helvetica', 'Verdana', sans-serif"
          },
          cutoutPercentage:chartOptions.cutout_percentage,
          tooltips :{
            backgroundColor: "#1a1a1a",
            titleFontFamily:"'Roboto', 'Helvetica', 'Verdana', sans-serif",
            titleFontSize:16,
            bodyFontFamily:"'Roboto', 'Helvetica', 'Verdana', sans-serif",
            bodyFontSize:16
          },
          legend: {
            display: true,
            labels:{
              fontSize:16
            }
          },
        }
    });
};
//create comaprison chart
const createMixedChart = (chartOptions) => {
  const target = "goals";
  const chart = document.getElementById(`chartCanvas_${chartOptions.target}`).getContext('2d');
  let mixedChart = new Chart(chart, {
    type: chartOptions.basic_type,
    data: {
      datasets: [{
        label: chartOptions.basic_legend,
        data: chartOptions.basic_data,
        backgroundColor: chartOptions.basic_fills,
        borderColor: chartOptions.basic_borders,
        borderWidth:chartOptions.borderwidth,
        pointBorderWidth: 2,
        pointRadius: 4,
        pointBackgroundColor:chartOptions.basic_borders,
      }, {
        label: chartOptions.compare_legend,
        data: chartOptions.compare_data,
        backgroundColor: chartOptions.compare_fills,
        borderColor: chartOptions.compare_borders,
        borderWidth:chartOptions.borderwidth,
        type: chartOptions.compare_type,
        pointBorderWidth: 2,
        pointRadius: 4,
        pointBackgroundColor:chartOptions.compare_borders,
      }],
    labels: chartOptions.labels
  },
  options: {
    title: {
      display: true,
      text: chartOptions.title,
      fontSize: 20,
      fontColor:"#1a1a1a",
      fontFamily:"'Roboto', 'Helvetica', 'Verdana', sans-serif"
    },
    tooltips :{
        backgroundColor: "#1a1a1a",
        titleFontFamily:"'Roboto', 'Helvetica', 'Verdana', sans-serif",
        titleFontSize:16,
        bodyFontFamily:"'Roboto', 'Helvetica', 'Verdana', sans-serif",
        bodyFontSize:16
      },
    legend: {
        display: true,
        labels:{
          fontSize:16
        }
      },
    scales: {
        yAxes: [{
          ticks: {
            beginAtZero:true
          }
        }],
      }
  }
  });
};
//create radar chart
const createRadarChart = (chartOptions) => {
  const chart = document.getElementById(`chartCanvas_${chartOptions.target}`).getContext('2d');
  let radarChart = new Chart(chart, {
    type: 'radar',
    data: {
      datasets: [{
        label: chartOptions.basic_legend,
        data: chartOptions.basic_data,
        backgroundColor: chartOptions.basic_fills,
        borderColor: chartOptions.basic_borders,
        borderWidth:chartOptions.borderwidth,
        pointBorderWidth: 2,
        pointRadius: 4,
        pointBackgroundColor:chartOptions.basic_borders,
        pointLabelFontSize: 20
      }, {
      label: chartOptions.compare_legend,
      data: chartOptions.compare_data,
      backgroundColor: chartOptions.compare_fills,
      borderColor: chartOptions.compare_borders,
      borderWidth:chartOptions.borderwidth,
      pointBorderWidth: 2,
      pointRadius: 4,
      pointBackgroundColor:chartOptions.compare_borders,
      pointLabelFontSize: 20
    }],
    labels: chartOptions.labels
    },
    options: {
      title: {
        display: true,
        text: chartOptions.title,
        fontSize: 20,
        fontColor:"#1a1a1a",
        fontFamily:"'Roboto', 'Helvetica', 'Verdana', sans-serif"
      },
      tooltips :{
        backgroundColor: "#1a1a1a",
        titleFontFamily:"'Roboto', 'Helvetica', 'Verdana', sans-serif",
        titleFontSize:16,
        bodyFontFamily:"'Roboto', 'Helvetica', 'Verdana', sans-serif",
        bodyFontSize:16
      },
      legend: {
        display: true,
        labels:{
          fontSize:16,
          padding:8
        }
      },
      scale: {
        pointLabels: {
          fontSize: 15,
          fontColor:'#000'
        }
      }
    }
  });
};
