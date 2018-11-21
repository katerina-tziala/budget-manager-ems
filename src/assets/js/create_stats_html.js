/*
* CREATE HTML HOME INTERFACE FOR STATISTICS VIEW
*/
//statistics html
const createStatisticsView = () => {
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
