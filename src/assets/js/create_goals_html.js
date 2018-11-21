/*
* CREATE GOALS HTML FOR INTERFACE FOR USERS WITH A CURRENT BUDGET
*/
//populate goals html
const populateGoalsHTML = (goalsContainer = self.goalsListSection, goalsList = self.goalsList, currentBudget = self.currentBudget) => {
  goalsContainer.innerHTML = "";
  createCategoriesSelectBox();
  const budgetGoalsList = getByBudgetID(currentBudget.id, goalsList);
  const sort_btns_wrapper = document.querySelectorAll('.sort_btns_wrapper')[0];
  if (budgetGoalsList.length>0) {
    budgetGoalsList.forEach(goal => {
    goalsContainer.append(createGoalCard(goal));
      self.goalsCategories[self.goalsCategories.length]=goal.category;
    });
    hideElement(self.goals_msg);
    displayElement(self.goalsListSection);
    displayElement(sort_btns_wrapper);
    createCategoriesSelectBox();
    initializeGoalCardsDisplay();
  }else{
    goalsContainer.innerHTML = "";
    hideElement(self.goalsListSection);
    hideElement(sort_btns_wrapper);
    displayElement(self.goals_msg);
  }
  if (self.goalsCategories.length===self.categoriesList.length) {
    hideElement(document.getElementById('btn_goal_add'));
  }
  self.allforms = "";
  self.allforms = document.querySelectorAll('.budgetForm');
};
//create goal card
const createGoalCard = (goal) => {
  const delete_btn = createDeleteButton('goal', goal.id, deleteGoal);
  const edit_btn = createEditButton('goal', goal.id, toggleForm) ;
  const cancel_btn = createCancelButton('goal', goal.id, toggleForm);
  const save_btn = createSaveButton('goal', goal.id, updateGoal);
  const card = document.createElement('li');
  card.setAttribute('role', 'listitem');
  card.classList.add("goalCard");
  card.setAttribute("id", `goalCard_${goal.id}`);
  const cardHeader = document.createElement('p');
  cardHeader.classList.add("goalCard_header");
  cardHeader.innerHTML = `<i class="goal_target fas fa-piggy-bank"></i>Goal #<span class='goalIndex'></span>`;
  const categoryIcon = document.createElement('div');
  const icon_name = `icon_${goal.category.split(" ")[0]}`;
  categoryIcon.classList.add("category_icon", icon_name);
  const categoryText = document.createElement('p');
  categoryText.className = "goal_category";
  categoryText.innerHTML = decodeEntities(goal.category);
  const spendText = document.createElement('p');
  spendText.className = "goal_spend";
  spendText.innerHTML = "Spend at most";
  const goalDataContainer = document.createElement('div');
  goalDataContainer.className = "dataContainer";
  goalDataContainer.setAttribute("id", `goalDataContainer_${goal.id}`);
  const goalEuroSign = document.createElement('i');
  goalEuroSign.classList.add("goal_euro_icon", "fas", "fa-euro-sign");
  const goalAmount = document.createElement('p');
  goalAmount.setAttribute("id", `goal_amount_${goal.id}`);
  goalAmount.innerHTML = getDisplayFormat(goal.amount);
  goalAmount.className = "goal_data";
  goalDataContainer.append(goalEuroSign, goalAmount);
  const form = document.createElement('form');
  form.setAttribute("id", `formgoal_${goal.id}`);
  form.classList.add("budgetForm", "goaledit_form", "goalEditForm", "hidden");
  const amountSection = createAmountSection(getDisplayFormat(goal.amount), 'enter amount of goal', `editgoal_input_${goal.id}`, `editGoalInput editgoal_input_${goal.id}`, `editamountgoal_label_${goal.id}`);
  form.append(amountSection);
  card.append(delete_btn, edit_btn, cardHeader, categoryIcon, categoryText, spendText, goalDataContainer, form,cancel_btn, save_btn);
  return card;
};
//create amount section
const createAmountSection = (placeholder, aria, name, inputClassList, labelClass) => {
  const amountContainer = document.createElement('div');
  amountContainer.className = "amountContainer";
  const input = createInput('text', placeholder, aria, name);
  input.className = inputClassList;
  input.classList.add("formInputs", "amount_inpt");
  const euroSign = document.createElement('i');
  euroSign.classList.add("amountEuro", "fas", "fa-euro-sign");
  const label = createLabel(name);
  //label.classList.add(labelClass);
  amountContainer.append(input, euroSign, label);
  return amountContainer;
};
//create add goal section
const createAddGoalSection = () => {
  const section = document.createElement('div');
  section.setAttribute('id','addGoalFormContainer');
  section.classList.add('centeredFlexbox', 'addGoalFormContainer');
  const form = document.createElement('form');
  form.setAttribute('id', 'formgoal_add');
  form.classList.add('form_style', 'budgetForm', 'hidden');
  const form_tag = document.createElement('p');
  form_tag.innerHTML = "Add goal";
  form_tag.className = "form_tag";
  const cancel_btn = createCancelButton('goal', 'add', toggleForm);
  cancel_btn.classList.add('cancelBudgetBtn');
  cancel_btn.classList.remove('hidden');
  const reset_btn = createButton('resetAddGoalBtn', 'clear form', 'reset form', resetClearGoal);
  reset_btn.classList.add('formBtn', 'add_goal_btn');
  const save_btn = createButton('saveAddGoalBtn', 'save goal', 'save budget goal', setGoal);
  save_btn.classList.add('formBtn', 'add_goal_btn');
  const addGoalContainer = document.createElement('div');
  addGoalContainer.setAttribute('id','addGoalContainer');
  addGoalContainer.className = "addGoalContainer";
  const input_tag = document.createElement('span');
  input_tag.innerHTML = "Amount";
  input_tag.className = "input_tag";
  const amount_inpt = createAmountInput('enter goal amount', 'goal_amount', 'add_goal_input', 'goal_amount');
  const label = createLabel('goal_amount');
  label.classList.add('add_goal_label');
  addGoalContainer.append(input_tag, amount_inpt, label);
  form.append(form_tag, cancel_btn, addGoalContainer, reset_btn, save_btn);
  section.append(form);
  return section;
};
//create goals section
const createGoalsSection = () => {
  const section = document.createElement('section');
  section.setAttribute('id','goalsSection');
  section.setAttribute('role','region');
  section.setAttribute('aria-label','goals section');
  const sort_btns_wrapper = document.createElement('div');
  sort_btns_wrapper.classList.add('sort_btns_wrapper', 'hidden');
  const sorting_tag = document.createElement('p');
  sorting_tag.className = "sorting_tag";
  sorting_tag.innerHTML = "Sort Goals By:";
  const ctgr_txt = `<i id='iconsrt_category' class='sortIcon fas fa-sort-alpha-down'></i><span id='textsrt_category' class='sort_indicator'>asc</span><span id='sorttag_category' class='sort_tag'>category</span>`;
  const sortBtn_category = createButton('sortBtn_category', ctgr_txt, 'sort expenses by category', sortGoals);
  sortBtn_category.classList.add('sortBtn');
  const amnt_txt = `<i id='iconsrt_amount' class='sortIcon fas fa-sort-numeric-up'></i><span id='textsrt_amount' class='sort_indicator'>desc</span><span id='sorttag_amount' class='sort_tag'>amount</span>`;
  const sortBtn_amount = createButton('sortBtn_amount', amnt_txt, 'sort expenses by amount', sortGoals);
  sortBtn_amount.classList.add('sortBtn');
  sort_btns_wrapper.append(sorting_tag, sortBtn_amount, sortBtn_category);
  const goals_msg = document.createElement('p');
  goals_msg.setAttribute('id','goals_msg');
  goals_msg.className = "noItemsMessage";
  goals_msg.innerHTML = "No goals yet!";
  const goalsList = document.createElement('ul');
  goalsList.setAttribute('id','goalsList');
  goalsList.className = "goalsList";
  goalsList.setAttribute('aria-label','goals list');
  section.append(sort_btns_wrapper, goals_msg, goalsList);
  return section;
};
//create select box for category of goal
const createCategoriesSelectBox = () => {
  const boxChecker = document.querySelectorAll('.addGoalContainer');
  const select_indoc = document.getElementById('category_select');
  if (boxChecker.length>1 || select_indoc!=null) {
    boxChecker[0].remove();
  }
  const options = getSelectBoxOptions();
  const add_goal_btn = document.getElementById('btn_goal_add');
  if (options.length>0) {
    const selectbox = createSelectBox('category_select', options, 'addGoalContainer', 'input_tag select_tag', 'Select Category', 'add_goal_input', 'goal_category', options[0], 'add_goal_label');
    self.addGoalform.insertBefore(selectbox, self.addGoalform.childNodes[1]);
    const addGoalSelectBox = document.getElementById('category_select');
    initSelectBox(addGoalSelectBox, options[0]);
    displayElement(add_goal_btn);
  }else {
    hideElement(add_goal_btn);
  }
  displayElement(self.actionButtonsContainer);
};
