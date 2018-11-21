"use strict";
let budgetList, expenseList, goalsList,feedbackList, statistics, feedbackAllowance, feedbackServed,
todayTime, today,
feedbackView, statisticsView,
goalsView, categoriesView, paymentsView,
homeOptionsContainer, budgetWeekSelectBox;
//initialize home view
const renderHome = (budgets, expenses, goals, feedbacks) =>{
  initializeVariables(budgets, expenses, goals, feedbacks);
  initView();
};
//initialize global variables of this interface
const initializeVariables = (budgets, expenses, goals, feedbacks) => {
  self.budgetList = [];
  self.expenseList = [];
  self.goalsList = [];
  self.feedbackList = [];
  self.statistics = [];
  self.feedbackServed = false;
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
  self.feedbackAllowance = self.userInfo.feedback==='regular'?false:true;
  generateStatistics();
};
//initialize view
const initView = (budgetList = self.budgetList, expenseList = self.expenseList, feedbackServed = self.feedbackServed) => {
  const numberOfAllBudgets = self.statistics.all.number_of_budgets;
  const numberOfDisplayBudgets = self.statistics.all.budgets_to_display;
  prepareMain("clear");
  if(numberOfAllBudgets===0) {
    zeroBudgetView();
  }else {
    if (!self.userInfo.has_current_budget && !feedbackServed) {
    self.main.append(renderFeedbackHTML());
    self.feedbackView = document.getElementById('feedbackView');
    initFeedbackView();
    }else{
      self.main.append(createStatisticsView());
      self.statisticsView = document.getElementById('statisticsView');
      self.statisticsView = document.getElementById('statisticsView');
      self.homeOptionsContainer = document.getElementById('homeOptionsContainer');
      self.goalsView = document.getElementById('goalOverviewContainer');
      self.categoriesView = document.getElementById('categoriesOverviewContainer');
      self.paymentsView = document.getElementById('paymentsOverviewContainer');
      self.dailyView = document.getElementById('dailyOverviewContainer');
      initStatisticsView();
      if (!self.userInfo.has_current_budget) {
        showBudgetNotification();
      }
    }
  }
};
/*
*  VIEWS
*/
// show view for the first time
const zeroBudgetView = () => {
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
  hideLoader();
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
//initialize view on week change
const initViewOnWeekChange = (event) => {
  const selectedOptions = getWeekSelectBoxOptions();
  if(selectedOptions['all']===true){
    displayAllOptionView();
  }else{
    renderStatisticsView(selectedOptions);
  }
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
