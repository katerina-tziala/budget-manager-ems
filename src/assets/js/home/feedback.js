/*
* ACTIONS & BEHAVIOR
*/
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
  displayElement(self.feedbackView);
  hideLoader();
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
/*
* CREATE HTML FEEDBACK INTERFACE
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
