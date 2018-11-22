/*
* TOAST NOTIFICATIONS
*/
//close notification
const closeNotification = (event) => {
  event.preventDefault();
  hideToaster();
};
//hide - close toaster
const hideToaster = (moreBtnsContainer = self.toasterButtonsContainer) =>{
  self.toaster.classList.remove("show_toast");
  self.toaster.classList.remove("worker_toast");
  setTabIndex(self.footerlinks, 0);
  const toasterBtns = document.querySelectorAll('.toasterBtn');
  setTabIndex(toasterBtns, -1);
};
//redirect after notification
const redirectAfterNotification=(event)=>{
  redirectUser(pages.index.url);
};
//show notification when no budget
const showBudgetNotification = () => {
  let message = `<b>YOU HAVE NOT SET YOUR WEEKLY BUDGET!</b><br/>`;
  message = message+`<span>It is ESSENTIAL for the <b><i>Budget Manager App</i></b> to set your weekly budget!</span>`;
  message = message+`<span>Please set it now!</span>`;
  const toast_options = {
    "message": message,
    "type": "keep_open",
    "timer": 0,
    "buttonsmode": "got_it_gobudget",
    "container_classes":["show_toast"]
  };
  setTimeout(() =>{showToaster(toast_options);},1800);
};
//functions to show notification:
const showToaster = (toast_options, messageContainer=self.notification_msg) =>{
  let newToaster = document.getElementById('toaster');
  if (newToaster.classList.contains("worker_toast")) {
    setTimeout(() =>{showToaster(toast_options);},5000);
  }else if (newToaster.classList.contains("show_toast")) {
    setTimeout(() =>{showToaster(toast_options);},1000);
  } else{
    let toasterBtns = document.querySelectorAll('.toasterBtn');
    setTabIndex(toasterBtns, -1);
    if (toasterBtns.length>0) {
      for (let i = 0; i < toasterBtns.length; i++) {
        toasterBtns[i].remove();
      }
    }
    messageContainer.innerHTML="";
    setTabIndex(self.footerlinks, -1);
    createNotificationButtons(toast_options);
    messageContainer.innerHTML = "";
    messageContainer.innerHTML = toast_options.message;
    toasterBtns = document.querySelectorAll('.toasterBtn');
    setTabIndex(toasterBtns, 0);
    for (let i = 0; i < toast_options.container_classes.length; i++) {
      self.toaster.classList.add(toast_options.container_classes[i]);
    }
    if (toast_options.type==='fadeout') {
      setTimeout(() =>{hideToaster(toast_options);},toast_options.timer);
    }
  }
};
//create notification buttons
const createNotificationButtons = (toast_options) => {
  const buttons = toast_options.buttonsmode;
  const toasterBtns = document.querySelectorAll('.toasterBtn');
  if (toasterBtns.length>0) {
    for (let i = 0; i < toasterBtns.length; i++) {
      toasterBtns[i].remove();
    }
  }
  switch (buttons) {
    case 'got_it':
      createGotItButton();
      break;
    case 'got_it_redirect':
      createGotItButton(redirectAfterNotification);
      break;
    case 'got_it_signout':
      createGotItButton(signOut);
      break;
    case 'got_it_gobudget':
      createGotItButton();
      createGoButton('budget', 'go', 'set budget', pages.budget_and_goals.url);
      break;
    case 'myexpenses':
      createGotItButton();
      createGoButton('expenses', 'my expenses', 'view expenses', pages.my_expenses.url);
      break;
    case 'worker_update_btns':
      const dismiss_btn = createButton('dismiss_btn', 'dismiss', 'dismiss new version of app', dismissSWorker);
      dismiss_btn.classList.add("app_btn", "toasterBtn", "toasterWorkerBtn");
      const update_btn = document.createElement('button');
      update_btn.innerHTML = 'update';
      update_btn.setAttribute('id', 'update_btn');
      update_btn.setAttribute('aria-label', 'update app to new version');
      update_btn.type="button";
      self.NewWorker = toast_options.worker;
      update_btn.addEventListener('click', (event, worker)=>{
        self.NewWorker.postMessage({action: 'skipWaiting' });
        hideToaster();
        self.NewWorker="";
      });
      update_btn.classList.add("app_btn", "toasterBtn", "toasterWorkerBtn");
      self.toasterButtonsContainer.append(dismiss_btn, update_btn);
      break;
    case 'refresh':
      const refresh_btn = createButton('dismiss_btn', 'refresh', 'refresh the app', refreshApp);
      refresh_btn.classList.add("app_btn", "toasterBtn");
      self.toasterButtonsContainer.append(refresh_btn);
      break;
    case 'forgotpass':
      createGotItButton();
      createGoButton('fp', 'new request', 'go to forgot password', pages.forgot_password.url);
      break;
  }
};
//create got it button
const createGotItButton = (functionName=closeNotification) => {
  const gotit = createButton('btn_gotit', 'got it', 'close notification', functionName);
  gotit.classList.add("app_btn", "toasterBtn");
  self.toaster.insertBefore(gotit, self.toaster.childNodes[2]);
};
//create link button in notification
const createGoButton = (id_part, text, aria, url) => {
  const gobutton = createLinkButton('go_btn_'+id_part, text, aria, url);
  gobutton.classList.add("app_btn","toasterBtn");
  self.toasterButtonsContainer.append(gobutton);
};
//generate notification message
const messageGenerator = (params) => {
  const by_type_message = ['unverified_account', 'noaccount', 'else_error', 'signout_error', 'overlapping_budget', 'goals_more', 'goal_setted'];
  const by_initiator = ['contact', 'passforgot', 'passreset', 'signup', 'addexpense', 'email'];
  if (by_type_message.includes(params.message_type)) {
    return getMessageByType(params);
  }else if (by_initiator.includes(params.initiator)) {
    return getMessageByInitiator(params);
  }
};
//get message by type
const getMessageByType = (params) => {
  let message;
  switch (params.message_type) {
    case 'unverified_account':
      message = `<b>Your account is not active!</b><br/>`;
      message += `<span>Follow the instructions in the <i>"Account Activation"</i> email we sent you, `;
      message += `and don't forget to check your spam emails too!</span>`;
      message += `<span><b>Notice: </b>You have to activate your account to be able to use this app!</span>`;
      message += `<span class='contact_indicator'>If you face any issues in activating your account, please contact us immediately!</span>`;
      break;
    case 'noaccount':
      message = `<b>We couldn't find ${params.message_part}`;
      message += `<span>If you are a member ensure that you gave us the right username and the right email!</span>`;
      message += `<span>If you are not a member yet Sign Up now!</span>`;
      break;
    case 'else_error':
      message = `<b>This is embarassing!</b><br/>`;
      message += `<span>An unexpected error occurred and we couldn't ${params.error_part}!</span>`;
      message += `<span>Sorry for the inconvenience!</span><span>Please try again!</span>`;
      message += `<span class='contact_indicator'>If you keep facing this issue, please contact us as soon as possible!</span>`;
      break;
    case 'signout_error':
      message = `<b>Your `+params.message_part+` changed successfully, however...!</b><br/>`;
      message += `<span>An unexpected error occurred and we couldn't sign you out!</span>`;
      message += `<span>You can continue using the app!</span>`;
      break;
    case 'overlapping_budget':
      message = `<b>Ooooooooooooops!</b><br/>`;
      message += `<span>Your starting date already exists in a previous week!</span>`;
      message += `<span>Your weekly budget MUST start from another day!</span>`;
      break;
    case 'goals_more':
      message = `<b>Ooooooooooooops!</b><br/>`;
      message += `<span>You are not allowed to set your budget to this amount!</span>`;
      message += `<span>The total amount of your goals is more than your budget! </span>`;
      message += `Update your goals first and then reset your budget.</span>`;
      break;
    case 'goal_setted':
      message = `<b>Ooooooooooooops!</b><br/>`;
      message = `<span>You have already setted this budget goal!</span>`;
      message = `<span>You cannot set a budget goal twice!</span>`;
      break;
    }
  return message;
};
//get message by initiator and type
const getMessageByInitiator = (params) => {
  const type=params.initiator+"_"+params.message_type;
  let message="test";
  switch (type) {
    case 'contact_success':
      message = `<b>We got your message!</b><br/>`;
      message += `<span>We will get back to you as soon as possible!</span>`;
      message += `<span class='usermail_indicator'>Under the condition that your email is valid!</span>`;
      break;
    case 'passforgot_success':
      message = `<b>You have a new e-mail!</b><br/>`;
      message += `<span>We sent you an email at: <span class='emailcont'>`;
      message += params.user_email;
      message += `</span></span>`;
      message += `<span>Follow the instructions in your email to reset your password.</span>`;
      break;
    case 'passreset_success':
      message = `<b>Your password was successfully changed!</b><br/>`;
      message += `<span>You can now sign in with your new password!</span>`;
      message += `<span>We also sent you a confirmation email.</span>`;
      break;
    case 'passreset_success_no_email':
      message = `<b>Your password was successfully changed!</b><br/>`;
      message += `<span>You can now sign in with your new password!</span>`;
      message += `<span>However, an unexpected error occurred and we couldn't send you a confirmation email.</span>`;
      break;
    case 'passreset_code_error':
      message = `<b>You are not allowed to change your password!</b><br/>`;
      message += `<span>This link is no longer active!</span>`;
      message += `<span>If you still want to change your password, please make a new request!</span>`;
      break;
    case 'signup_success':
      message = `<b>You were successfully Signed Up!</b><br/>`;
      message +=`<span>In order to activate your account and start using the app, follow the instructions in the email we sent you!</span>`;
      message +=`<span class='contact_indicator'>Don't forget to check your spam folder too!</span>`;
      break;
    case 'signup_saved_no_ver_email':
      message = `<b>Account created, but...</b><br/>`;
      message +=`<span>An unexpected error occurred and we couldn't send you an <i>"Account Activation"</i> email!</span>`;
      message += `<span>Please contact us to activate your account!</span>`;
     break;
    case 'addexpense_success':
      message = `<b>Hoorayyyyy!</b><br/>`;
      message += `<span>Your expense was successfully added!</span>`;
      message += `<span>View your expenses or keep adding more!</span>`;
      break;
    case 'email_saved_no_ver_email':
      message = `<b>Your `+params.message_part+` changed successfully, but...!</b><br/>`;
      message += `<span>An unexpected error occurred and we couldn't send you an <i>"Account Activation"</i> email!</span>`;
      message += `<span>Please contact us to activate your account!</span>`;
      break;
  }
  return message;
};
