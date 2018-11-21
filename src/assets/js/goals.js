/*
* ACTIONS & BEHAVIOR
*/
/*
* CLEAR FORMS
*/
//initialize goals section
const initGoalsSectionHtml = (currentBudget = self.currentBudget) =>{
  if (currentBudget.goals===0) {
    hideElement(self.goalsListSection);
    displayElement(self.goals_msg);
  }else{
    if (self.goalsList.length==0) {
      fetchGoalsAndDisplay();
    }else{
      populateGoalsHTML();
    }
  }
};
//fetch goals and then display
const fetchGoalsAndDisplay = () => {
  fetchData('getUserGoalList', (error, results) => {
    if (error) { // Got an error!
      showErrorView();
      console.error(error);
    } else {
      self.goalsList = results;
      populateGoalsHTML();
    }
  });
};
//initialize display of goal cards
const initializeGoalCardsDisplay = () => {
  self.allforms = "";
  self.allforms = document.querySelectorAll('.budgetForm');
  const indexes = document.querySelectorAll('.goalIndex');
  for (let i = 0; i < indexes.length; i++) {
    indexes[i].innerHTML = i+1;
  }
  const cardicons = document.querySelectorAll('.category_icon');
  loadCategoryIcons(cardicons);
  const goalEditForms = document.querySelectorAll('.goalEditForm');
  for (let i = 0; i < goalEditForms.length; i++) {
    instantAmountValidation(goalEditForms[i]);
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
//sort goals
const sortGoals = (event) =>{
  const target = event.target.id.split("_").pop();
  const button = document.getElementById(`sortBtn_${target}`);
  const filter_icon = document.getElementById(`iconsrt_${target}`);
  const filter_text = document.getElementById(`textsrt_${target}`);
  const mod_sel_opt = filter_text.innerHTML;
  if (target==="amount") {
    self.goalsList.sort((item_a, item_b)=>{
      return sortByAmount(item_a, item_b, mod_sel_opt);
    });
  }else if (target==="category") {
    self.goalsList.sort((item_a, item_b)=>{
      return sortByCategory(item_a, item_b, mod_sel_opt);
    });
  }
  sortButtonDisplayHandler(filter_icon, filter_text);
  populateGoalsHTML();
};
//clear add goal form
const clearAddGoalForm = () => {
  const labels = document.querySelectorAll(`.add_goal_label`);
  const fields = document.querySelectorAll(`.add_goal_input`);
  clearAppForm(labels, fields);
  createCategoriesSelectBox();
};
//clear goal edit form
const clearAmountGoalEditForm = (id) => {
  const labels = document.querySelectorAll('[for='+`editgoal_input_${id}`+']');
  const fields = document.querySelectorAll(`.editgoal_input_${id}`);
  clearAppForm(labels, fields);
};
//reset clear add goal form on click
const resetClearGoal = (event) => {
  event.preventDefault();
  clearAddGoalForm();
};
//get total of goals of one budget
const getGoalsTotal = (budget_id, goalsList = self.goalsList) => {
  let total = 0;
  const budgetGoalsList = getByBudgetID(budget_id, goalsList);
  budgetGoalsList.forEach(goal => {
    total = total + parseFloat(goal.amount);
  });
  return parseFloat(total);
};
/*
* ADD, UPDATE, DELETE GOAL
*/
//set a goal
const setGoal = (event, currentBudget = self.currentBudget, addGoalForm = self.addGoalform) => {
  event.preventDefault();
  const labels = document.querySelectorAll(`.add_goal_label`);
  const formFields = document.querySelectorAll(`.add_goal_input`);
  const amount = formFields[1].value;
  let category = formFields[0].value;
  if(category.replace(/\s+/, "")==='' || category===''){
    const select = document.querySelectorAll('.blobselect-selection')[0];
    category = select.getAttribute('data-value');
  }
  category = decodeEntities(category).toLowerCase();
  const valid_amount = simpleAmountValidation(amount, labels[1]);
  if (valid_amount===true) {
    const goalExistanceCheck = goalExistance(category, currentBudget.id);
    const toast_options = {
      "message": "",
      "type": "keep_open",
      "timer": 0,
      "buttonsmode": "got_it",
      "container_classes":["show_toast"]
    };
    if(goalExistanceCheck===true){
      toast_options.message = messageGenerator({initiator:"setgoal", message_type:"goal_setted"});
      toast_options.type = "fadeout";
      toast_options.timer = 7000;
      showToaster(toast_options);
    }else{
      let goalsTotal = getGoalsTotal(currentBudget.id);
      goalsTotal = goalsTotal + parseFloat(amount);
      if(goalsTotal>currentBudget.amount){
        toast_options.message = messageGenerator({initiator:"setgoal", message_type:"budget_less"});
        toast_options.type = "fadeout";
        toast_options.timer = 10000;
        showToaster(toast_options);
      }else{
        const today = new Date();
        const todayParts = getDateParts(today);
        const time = getNowTime();
        const data = {
          "amount": parseFloat(amount),
          "category": category.toLowerCase(),
          "budget_id": parseInt(currentBudget.id),
          "created": todayParts[2]+"-"+todayParts[1]+"-"+todayParts[0]+" "+time,
          "request_type": "set_goal"
        }
        const addMsg = document.createElement('p');
        addMsg.setAttribute('id', 'adding_goal_msg');
        addMsg.className = "noItemsMessage";
        addMsg.innerHTML = "Adding your goal....";
        const addBtn = document.getElementById('btn_goal_add');
        const container = document.getElementById('addGoalFormContainer');
        container.insertBefore(addMsg, container.childNodes[1]);
        hideElement(addBtn);
        hideElement(addGoalForm);
        sendData('addBudgetGoal', data).then((response)=>{
          document.getElementById('adding_goal_msg').remove();
          displayElement(addBtn);
          if(response.message==="invalid_request"){
            invalidRequestHandler(data);
          } else if(response.message==="success"){
            const newGoal = {
              "id": parseInt(response.added_id),
              "amount": data.amount,
              "category": data.category,
              "budget_id": data.budget_id,
              "created": data.created
            }
            self.goalsList.unshift(newGoal);
            self.goalsCategories[self.goalsCategories.length]=data.category;
            initAddGoalForm();
            populateGoalsHTML();
          }else{
            toast_options.message = messageGenerator({initiator:"setgoal", message_type:"else_error", error_part:"set your budget goal"});
            toast_options.type = "fadeout";
            toast_options.timer = 7000;
            showToaster(toast_options);
            populateGoalsHTML();
          }
        });
      }
    }
  }
};
//delete a goal
const deleteGoal = (event) =>{
  event.preventDefault();
  const button = event.target;
  const buttonID = parseInt(button.id.split("_").pop());
  const goalCard = document.getElementById(`goalCard_${buttonID}`);
  for (let i = 3; i < 7; i++) {
    hideElement(goalCard.childNodes[i]);
  }
  const actionmessage = cardGoalMessageHTML(buttonID, 'Deleting');
  goalCard.insertBefore(actionmessage, goalCard.childNodes[3]);
  const currentGoal = getGoalByID(buttonID);
  const data = {
    "id": buttonID,
    "amount": parseFloat(currentGoal.amount),
    "category": decodeEntities(currentGoal.category).toLowerCase(),
    "budget_id": parseInt(currentGoal.budget_id),
    "created": currentGoal.created,
    "request_type": "delete_goal"
  }
  sendData('deleteBudgetGoal', data).then((response)=>{
    if(response.message==="invalid_request"){
      invalidRequestHandler(data);
    } else if(response.message==="success"){
      let newGoalGategories = [];
      for (let i = 0; i < self.goalsCategories.length; i++) {
        if (self.goalsCategories[i]!=data.category) {
          newGoalGategories[newGoalGategories.length] = self.goalsCategories[i];
        }
      }
      self.goalsCategories = [];
      self.goalsCategories = newGoalGategories;
      initAddGoalForm();
      let results = self.goalsList;
      results = results.filter((r) => r.id != data.id);
      self.goalsList = [];
      self.goalsList = results;
      populateGoalsHTML();
    }else{
      document.getElementById(`instantActionMSG_${buttonID}`).remove();
      for (let i = 3; i < 7; i++) {
        displayElement(goalCard.childNodes[i]);
      }
      const toast_options = {
        "message": messageGenerator({initiator:"deletegoal", message_type:"else_error", error_part:"delete this goal"}),
        "type": "fadeout",
        "timer": 9000,
        "buttonsmode": "got_it",
        "container_classes":["show_toast"]
      };
      showToaster(toast_options);
    }
  });
};
//udate a goal
const updateGoal = (event, id=null, currentBudget = self.currentBudget) =>{
  event.preventDefault();
  let buttonID=id;
  if (buttonID===null) {
    buttonID = parseInt(event.target.id.split("_").pop());
  }
  const goalCard = document.getElementById(`goalCard_${buttonID}`);
  const goalDataContainer = document.getElementById(`goalDataContainer_${buttonID}`);
  const currentGoal = getGoalByID(buttonID);
  const form = document.getElementById(`formgoal_${buttonID}`);
  const labels = document.querySelectorAll('[for='+`editgoal_input_${buttonID}`+']');
  const fields = document.querySelectorAll(`.editgoal_input_${buttonID}`);
  let amount = fields[0].value;
  const curr_amount = fields[0].placeholder;
  if(parseFloat(amount)===parseFloat(curr_amount) || amount.replace(/\s+/, "")===''|| amount.replace(/\s+/, "")==='' || amount === ''){
    hideElement(form);
    cardButtonHandler('goal', buttonID, 'close');
    displayElement(goalDataContainer);
  }else{
    const valid_amount = simpleAmountValidation(amount, labels[0]);
    if (valid_amount===true) {
      amount = parseFloat(amount);
      let goalsTotal = getGoalsTotal(currentBudget.id);
      goalsTotal = goalsTotal-curr_amount+amount;
      const toast_options = {
        "message": "",
        "type": "fadeout",
        "timer": 0,
        "buttonsmode": "got_it",
        "container_classes":["show_toast"]
      };
      if (goalsTotal>currentBudget.amount) {
        toast_options.message = messageGenerator({initiator:"updategoal", message_type:"budget_less"});
        toast_options.timer = 10000;
        showToaster(toast_options);
        cardButtonHandler('goal', buttonID, 'close');
        hideElement(form);
        displayElement(goalDataContainer);
      }else{
        hideElement(form);
        for (let i = 3; i < 7; i++) {
          hideElement(goalCard.childNodes[i]);
        }
        const actionmessage = cardGoalMessageHTML(buttonID, 'Updating');
        goalCard.insertBefore(actionmessage, goalCard.childNodes[3]);
        cardButtonHandler('goal', buttonID, 'close');
        const data = {
          "id": buttonID,
          "amount": amount,
          "category": decodeEntities(currentGoal.category).toLowerCase(),
          "budget_id": parseInt(currentGoal.budget_id),
          "created": currentGoal.created,
          "request_type": "update_goal"
        }
        sendData('updateBudgetGoal', data).then((response)=>{
          if(response.message==="invalid_request"){
            invalidRequestHandler(data);
          }else if(response.message==="success"){
            document.getElementById(`instantActionMSG_${buttonID}`).remove();
            for (let i = 3; i < 7; i++) {
              displayElement(goalCard.childNodes[i]);
            }
            let results = self.goalsList;
            results = results.filter((r) => r.id != data.id);
            currentGoal.amount = amount
            self.goalsList = [];
            self.goalsList = results;
            self.goalsList[self.goalsList.length] = currentGoal;
            populateGoalsHTML();
          }else{
            document.getElementById(`instantActionMSG_${buttonID}`).remove();
            for (let i = 3; i < 7; i++) {
              displayElement(goalCard.childNodes[i]);
            }
            toast_options.message = messageGenerator({initiator:"updategoal", message_type:"else_error", error_part:"update this goal"}),
            toast_options.timer = 9000;
            showToaster(toast_options);
          }
        });
      }
    }
  }
};
/*
* UTILITY FUNCTIONS
*/
//update message for user
const cardGoalMessageHTML=(id, type)=>{
  const message = document.createElement('p');
  message.setAttribute('id', `instantActionMSG_${id}`);
  message.className = "instant_action_msg";
  message.innerHTML = `${type} goal...`;
  return message;
};
//initialize add goal form
const initAddGoalForm = () => {
  instantAmountValidation(self.addGoalform);
  if (self.categoriesList.length===0) {
    fetchData('getUserCategories', (error, results) => {
      if (error) { // Got an error!
        showErrorView();
        console.error(error);
      } else {
        if (results.length>0) {
          let usercategories = [];
          results.forEach(category => {
            if(!usercategories.includes(category.name)){
              usercategories[usercategories.length] = category.name;
            }
          });
          self.categoriesList = usercategories.sort();
        }else{
          const baseList = ["bar & café","bills & fees","clothing", "communication","cosmetics & beauty",
          "donations & charity","education","entertainment","gifts","health","housing","investments","restaurant & delivery",
          "sports & fitness","supermarket","technology","transportation","traveling & vacation","vehicle","miscellaneous"];
          self.categoriesList = baseList.sort();
        }
        createCategoriesSelectBox();
      }
    });
  }else{
    createCategoriesSelectBox();
  }
};
//check if goal is added for a category
const goalExistance = (category, budgetid, goals=self.goalsList) => {
  let existance = false;
  const budgetGoalsList = getByBudgetID(budgetid, goalsList);
  let results = budgetGoalsList;
  results = results.filter((r) => r.category === category);
  if (results.length>0) {
    existance = true;
  }
  return existance;
};
//get available categories for goals
const getSelectBoxOptions = () => {
  let options = [];
  if (self.goalsCategories.length===0) {
    options = self.categoriesList;
  }else{
    for (let i = 0; i < self.categoriesList.length; i++) {
      if(!self.goalsCategories.includes(self.categoriesList[i])){
        options[options.length] = self.categoriesList[i];
      }
    }
    options.sort();
  }
  return options;
};
