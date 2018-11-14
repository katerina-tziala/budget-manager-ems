"use strict";
const domain="APP_DOMAIN";
const app_scope="APP_SCOPE";
const data_url = domain+"models/dataManager.php?action=";
const cssfolder = domain+"assets/css/";
const jsfolder = domain+"assets/js/";
let page_title, menuBtn, menu, closeMenuBtn, opacity_layer, header, main, loader, toaster, notification_msg, footerlinks, toasterButtonsContainer;
let userInfo = [];
let NewWorker = "";
//run javascript when files are loaded
document.addEventListener('DOMContentLoaded', (event) => {
  const host = window.location.hostname;
  const url = window.location.href;
  if (host!='localhost') {
    const http = url.split(":")[0];
    const restlink = url.split(":")[1];
    if (http==="http") {
      const applink = http+"s:"+restlink;
      window.location.replace(applink);
      window.location=applink;
      window.location.href=applink;
    }
  }
  if (url===domain || url===domain.substr(0,domain.length-1)) {
      redirectUser(pages.index.url);
  }else{
    registerServiceWorker();
    basicAppElementSelector();
    showLoader();
    initApp();
  }
});
/*
* FUNCTIONS TO INITIALIZE PAGES
*/
//initialize index page
const initIndexPage = (userInfo = self.userInfo) => {
  clearIndexFiles();
  prepareMain("clear");
  if (userInfo.signed_in===0) {
    loadStyle(pages.index.css, ()=>{
      loadScript(pages.index.js_script, ()=>{
        renderSignIn();
      });
    });
  }else{
    loadStyle(pages.home.css, ()=>{
      createNavMenu();
      styleNavMenu(1);
      let categoriesList = [];
      let budgetList = [];
      let expenseList = [];
      let goalList = [];
      fetchData('getUserExpenseList', (error, expenses) => {
        if (error) { // Got an error!
          hideLoader();
          showErrorView();
          console.error(error);
        }else{
          expenseList = expenses;
          fetchData('getUserBudgetList', (error, budgets) => {
            if (error) { // Got an error!
              hideLoader();
              showErrorView();
              console.error(error);
            }else{
              budgetList = budgets;
              fetchData('getUserGoalList', (error, goals) => {
                if (error) { // Got an error!
                  hideLoader();
                  showErrorView();
                  console.error(error);
                }else{
                  goalList = goals;
                  fetchData('getFeedbackList', (error, feedbackList) => {
                    if (error) { // Got an error!
                      hideLoader();
                      showErrorView();
                      console.error(error);
                    }else{
                        loadScript(pages.home.js_script, ()=>{
                          initHomeView(self.userInfo, budgetList, expenseList, goalList, feedbackList);
                        });
                      }
                    });
                  }
                });
              }
            });
          }
        });
      });
  }
};
//initialize categories page
const initCategoriesPage = (userInfo = self.userInfo) => {
  loadStyle(pages.categories.css, ()=>{
    createNavMenu();
    styleNavMenu(5);
    fetchData('getUserCategories', (error, categories) => {
      if (error) { // Got an error!
        hideLoader();
        showErrorView();
        console.error(error);
      }else{
        if (categories.length>0) {
          loadScript(pages.categories.js_script, ()=>{
            const budgetIndicator = self.userInfo.has_current_budget==='no'?false:true;
            initCategoriesView(budgetIndicator, categories);
          });
        }else{
          hideLoader();
          showErrorView();
        }
      }
    });
  });
};
//initialize profile page
const initProfilePage = (parentNode = self.main) => {
  loadStyle(pages.profile.css, ()=>{
    createNavMenu();
    styleNavMenu(6);
    loadScript(pages.profile.js_script, ()=>{
        initProfileView(self.userInfo);
    });
  });
};
//initialize my expenses page
const initMyExpensesPage = () => {
  loadStyle(pages.my_expenses.css, ()=>{
    createNavMenu();
    styleNavMenu(3);
    const personalInfo = self.userInfo;
    let categoriesList = [];
    let budgetList = [];
    let expenseList = [];
    let goalList = [];
    fetchData('getUserCategories', (error, categories) => {
      if (error) { // Got an error!
        hideLoader();
        showErrorView();
        console.error(error);
      } else {
        if (categories.length>0) {
          categoriesList = categories;
          fetchData('getUserExpenseList', (error, expenses) => {
            if (error) { // Got an error!
              hideLoader();
              showErrorView();
              console.error(error);
            }else{
              expenseList = expenses;
              fetchData('getUserBudgetList', (error, budgets) => {
                if (error) { // Got an error!
                  hideLoader();
                  showErrorView();
                  console.error(error);
                }else{
                  budgetList = budgets;
                  fetchData('getUserGoalList', (error, goals) => {
                    if (error) { // Got an error!
                      hideLoader();
                      showErrorView();
                      console.error(error);
                    }else{
                      goalList = goals;
                      loadScript(pages.my_expenses.js_script, ()=>{
                        initMyExpensesView(personalInfo, categoriesList, budgetList, expenseList, goalList);
                      });
                    }
                  });
                }
              });
            }
          });
        }else{
          hideLoader();
          showErrorView();
        }
      }
    });
  });
};
//initialize add expense page
const initAddExpensePage = () => {
  loadStyle(pages.add_expense.css, ()=>{
    createNavMenu();
    styleNavMenu(2);
    fetchData('getUserCategories', (error, categories) => {
      if (error) { // Got an error!
        hideLoader();
        showErrorView();
        console.error(error);
      }else{
        if (categories.length>0) {
          loadScript(pages.add_expense.js_script, ()=>{
            initAddExpenseView(self.userInfo, categories);
          });
        }else{
          hideLoader();
          showErrorView();
        }
      }
    });
  });
};
//initialize expense details page
const initExpenseDetailsPage = () => {
  const personalInfo = self.userInfo;
  let expenseList = [];
  let categoriesList = [];
  loadStyle(pages.expense_details.css, ()=>{
    createNavMenu();
    fetchData('getUserExpenseList', (error, expenses) => {
      if (error) { // Got an error!
        hideLoader();
        showErrorView();
        console.error(error);
      } else {
        if (expenses.length===0) {
          hideLoader();
          showErrorView();
        }else {
          fetchData('getUserCategories', (error, categories) => {
            if (error) { // Got an error!
              hideLoader();
              showErrorView();
              console.error(error);
            } else {
              if (categories.length>0) {
                loadScript(pages.expense_details.js_script, ()=>{
                  initExpenseDetailsView(personalInfo, expenses, categories);
                });
              }else{
                hideLoader();
                showErrorView();
              }
            }
          });
        }
      }
    });
  });
};
//initialize budget and goals page
const initBudgetGoalsPage = () => {
  const personalInfo = self.userInfo;
  loadStyle(pages.budget_and_goals.css, ()=>{
    createNavMenu();
    styleNavMenu(4);
    fetchData('getUserBudgetList', (error, budgets) => {
      if (error) { // Got an error!
        hideLoader();
        showErrorView();
        console.error(error);
      } else {
        loadScript(pages.budget_and_goals.js_script, ()=>{
          initBudgetGoalView(personalInfo, budgets);
        });
      }
    });
  });
};
//initialize password forgot page
const initForgotPasswordPage = () => {
  loadStyle(pages.forgot_password.css, ()=>{
    loadScript(pages.forgot_password.js_script, ()=>{
      initForgotPasswordView();
    });
  });
};
//initialize password reset page
const initResetPasswordPage = () => {
  loadStyle(pages.reset_password.css, ()=>{
    loadScript(pages.reset_password.js_script, ()=>{
      initResetPasswordView();
    });
  });
};
//initialize account activation page
const initAccountActivationPage = () => {
  loadStyle(pages.account_activation.css, ()=>{
    loadScript(pages.account_activation.js_script, ()=>{
        initActivationView();
    });
  });
};
//initialize terms page
const initTermsPage = (main = self.main, userInfo = self.userInfo) => {
  loadStyle(pages.terms_of_use.css, ()=>{
    main.append(createTermsList());
    if (userInfo.signed_in===0) {
      const linksWrapper = document.createElement('div');
      linksWrapper.className = "btnWrapper";
      linksWrapper.append(createSignInLink(), createSignUpLink(), createContactLink());
      main.append(linksWrapper);
    }else{
      createNavMenu();
      if (userInfo.has_current_budget==="no") {
        showBudgetNotification();
      }
    }
    hideLoader();
    document.getElementById('terms_list').style.display="block";
  });
};



//initialize contact page
const initContactPage = (parentNode = self.main, userInfo = self.userInfo) => {
  loadStyle(pages.contact.css, ()=>{
    loadScript(pages.contact.js_script, ()=>{
      initContactView(userInfo);
    });
  });
};
//initialize sign up page
const initSignUpPage = () => {
  loadStyle(pages.signup.css, ()=>{
    loadScript(pages.signup.js_script, ()=>{
      initSignUpView();
    });
  });
};
//pages array
const pages = [];
pages['index'] = {
  view_title:"budget manager",
  url:domain+`index.html`,
  initFunction:initIndexPage,
  css:cssfolder+"signin.min.css",
  js_script:jsfolder+"signin.min.js"};
pages['forgot_password'] = {
  view_title:"forgot password",
  url:domain+`forgot_password.html`,
  initFunction:initForgotPasswordPage,
  css:cssfolder+"forgot_password.min.css",
  js_script:jsfolder+"forgot_password.min.js"
};
pages['reset_password'] = {
  view_title:"reset password",
  url:domain+`reset_password.html`,
  initFunction:initResetPasswordPage,
  css:cssfolder+"reset_password.min.css",
  js_script:jsfolder+"reset_password.min.js"
};
pages['account_activation'] = {
  view_title:"account activation",
  url:domain+`account_activation.html`,
  initFunction:initAccountActivationPage,
  css:cssfolder+"account_activation.min.css",
  js_script:jsfolder+"account_activation.min.js"
};
pages['terms_of_use'] = {
  view_title:"terms of use",
  url:domain+`terms_of_use.html`,
  initFunction:initTermsPage,
  css:cssfolder+"terms_of_use.min.css"
};
pages['contact'] = {
  view_title:"contact us",
  url:domain+`contact.html`,
  initFunction:initContactPage,
  css:cssfolder+"contact.min.css",
  js_script:jsfolder+"contact.min.js"
};
pages['signup'] = {
  view_title:"sign up",
  url:domain+`signup.html`,
  initFunction:initSignUpPage,
  css:cssfolder+"signup.min.css",
  js_script:jsfolder+"signup.min.js"};
pages['home'] = {
  url:domain+`home.html`,
  css:cssfolder+"home.min.css",
  js_script:jsfolder+"home.min.js"
};
pages['categories'] = {
  view_title:"categories of expenses",
  url:domain+`categories.html`,
  initFunction:initCategoriesPage,
  css:cssfolder+"categories.min.css",
  js_script:jsfolder+"categories.min.js"
};
pages['profile'] = {
  view_title:"profile",
  url:domain+`profile.html`,
  initFunction:initProfilePage,
  css:cssfolder+"profile.min.css",
  js_script:jsfolder+"profile.min.js"
};
pages['my_expenses'] = {
  view_title:"my expenses",
  url:domain+`my_expenses.html`,
  initFunction:initMyExpensesPage,
  css:cssfolder+"my_expenses.min.css",
  js_script:jsfolder+"my_expenses.min.js"
};
pages['add_expense'] = {
  view_title:"add expense",
  url:domain+`add_expense.html`,
  initFunction:initAddExpensePage,
  css:cssfolder+"add_expense.min.css",
  js_script:jsfolder+"add_expense.min.js"
};
pages['expense_details'] = {
  view_title:"expense details",
  url:domain+`expense_details.html`,
  initFunction:initExpenseDetailsPage,
  css: cssfolder+"expense_details.min.css",
  js_script:jsfolder+"expense_details.min.js"
};
pages['budget_and_goals'] = {
  view_title:"budget and goals",
  url:domain+`budget_and_goals.html`,
  initFunction:initBudgetGoalsPage,
  css: cssfolder+"budget_and_goals.min.css",
  js_script:jsfolder+"budget_and_goals.min.js"
};








//function to redirect user
const redirectUser = (url) => {
  setTimeout(() =>{
    window.location.replace(url);
    window.location=url;
    window.location.href=url;
  },500);
};
//refresh app - force reload from server
const refreshApp = (event) => {
  window.location.reload(true);
};
//basic element seletor
const basicAppElementSelector = () => {
  self.menuBtn=null;
  self.menu=null;
  self.closeMenuBtn=null;
  self.page_title = document.getElementById('app_title');
  self.opacity_layer = document.getElementById('opacity_layer');
  self.header = document.getElementById('header');
  self.main = document.getElementById('main');
  self.loader = document.getElementById('loader_container');
  self.toaster = document.getElementById('toaster');
  self.notification_msg = document.getElementById('toast_msg');
  let footer = document.getElementById('footer');
  self.footerlinks = footer.getElementsByTagName("A");
  self.toasterButtonsContainer = document.getElementById('notification_btns');
};
//initialize app
const initApp = () => {
  const url_page = getPageFromUrl();
  const redirectToHome = ["signup", "account_activation", "forgot_password", "reset_password"];
  const redirectToIndex = ["profile", "categories", "add_expense", "my_expenses", "expense_details", "budget_and_goals"];
  self.page_title.innerHTML = pages[url_page].view_title;
  fetchData('getPersonalInfo', (error, results) => {
    if (error) { // Got an error!
      hideLoader();
      showErrorView();
      console.error(error);
    } else {
      self.userInfo = results;
      if (self.userInfo.signed_in===1) {
        let homeRedirect = false;
        homeRedirect = redirectToHome.includes(url_page);
        if (homeRedirect===true) {
          redirectUser(pages.index.url);
        }else{
          pages[url_page].initFunction();
        }
      }else{
        let indexRedirect = false;
        indexRedirect = redirectToIndex.includes(url_page);
        if (indexRedirect===true) {
          redirectUser(pages.index.url);
        }else{
          pages[url_page].initFunction();
        }
      }
    }
  });
};
//clear index css and js scripts
const clearIndexFiles = () =>{
  const existingScripts = document.querySelectorAll("script");
  for (let i = 0; i < existingScripts.length; i++) {
    if (existingScripts[i].src===pages.index.js_script || existingScripts[i].src===pages.home.js_script) {
      document.body.removeChild(existingScripts[i]);
    }
  }
  const links = document.querySelectorAll("link");
  for (let i = 0; i < links.length; i++) {
    if (links[i].href===pages.index.css || links[i].href===pages.home.css) {
      document.head.removeChild(links[i]);
    }
  }
};
//register service worker
const registerServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    // Register the service worker
    navigator.serviceWorker.register('ServiceWorker.js', {scope: self.app_scope}).then(reg => {
      if (!navigator.serviceWorker.controller) {
        return;
      }
      if (reg.waiting) {
        updateReady(reg.waiting);
        return;
      }
      if (reg.installing) {
        trackInstalling(reg.installing);
        return;
      }
      reg.addEventListener('updatefound', () =>{
        trackInstalling(reg.installing);
      });
    }).catch((error) => {
        console.log('Oh No! Service Worker registration failed! Error: ' + error);
      });
  } else {
    console.log('Nooooooooo! Service Workers are not supported!');
  }
};
//Track service worker installation
const trackInstalling = (worker) => {
  worker.addEventListener('statechange', () => {
    if(worker.state == 'installed'){
      updateReady(worker);
    }
  });
};
//When upadate is ready, then display toaster
const updateReady = (worker) => {
  const toast_options = {
    "message": "A new version of this app is available!",
    "type": "keep_open",
    "timer": 0,
    "buttonsmode": "worker_update_btns",
    "container_classes":["show_toast", "worker_toast"],
    "worker":worker
  };
  setTimeout(() =>{showToaster(toast_options);},1500);
};
//dismiss update of service worker
const dismissSWorker = (event) => {
  hideToaster();
};
//handle invalid request
const invalidRequestHandler = (data) => {
  window.location.reload(true);
  redirectUser(pages.index.url);
};
//close menu on click outside the menu
document.addEventListener('click', (event) => {
  if(event.target.id==='opacity_layer'){
    if (self.menu!=null && self.closeMenuBtn!=null && self.menuBtn!=null) {
      closeMenuHandler();
    }
  }
});
/**
** Save user's changes when online.
**/
window.addEventListener('online',(event)=>{
  hideToaster();
  const toast_options = {
    "message": `<b>You are back online!</b><br>Connection was successfully re-established!`,
    "type": "fadeout",
    "timer": 10000,
    "buttonsmode": "got_it",
    "container_classes":["show_toast"]
  };
  showToaster(toast_options);
});
/**
** Notify user's when offline.
**/
window.addEventListener('offline',(event)=>{
  event.preventDefault();
  hideToaster();
  self.toaster.classList.remove("on_off_requests");
  const toast_options = {
    "message": `Unable to connect! Retrying...<br>`,
    "type": "fadeout",
    "timer": 12000,
    "buttonsmode": "got_it",
    "container_classes":["show_toast"]
  };
  showToaster(toast_options);
});
//show loader
const showLoader = (main = self.main, loader = self.loader) => {
  prepareMain();
  const spinner = document.getElementById('spinner');
  spinner.classList.add("spin");
  const loader_image = document.getElementById('loader_image');
  loader_image.className = "loader_image";
  loader_image.classList.add("hidden");
  displayElement(loader);
};
//hide loader
const hideLoader = (main = self.main) => {
  for (let i = 0; i < main.childNodes.length; i++) {
    let node = main.childNodes[i];
    displayElement(node);
  }
  const spinner = document.getElementById('spinner');
  spinner.classList.remove("spin");
  hideElement(self.loader);
};
//show eror view
const showErrorView = (error_view=createErrorView(), main = self.main) => {
  prepareMain();
  main.insertBefore(error_view, main.childNodes[0]);
};
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
  if (buttons==="got_it") {
    const gotit = createButton('btn_gotit', 'got it', 'close notification', closeNotification);
    gotit.classList.add("app_btn", "toasterBtn");
    self.toaster.insertBefore(gotit, self.toaster.childNodes[2]);
  }else if (buttons==="got_it_redirect") {
    const gotit = createButton('btn_gotit', 'got it', 'close notification', redirectAfterNotification);
    gotit.classList.add("app_btn", "toasterBtn");
    self.toaster.insertBefore(gotit, self.toaster.childNodes[2]);
  }else if (buttons==="got_it_signout") {
    const gotit = createButton('btn_gotit', 'got it', 'close notification', signOut);
    gotit.classList.add("app_btn", "toasterBtn");
    self.toaster.insertBefore(gotit, self.toaster.childNodes[2]);
  }else if (buttons==="got_it_gobudget") {
    const gotit = createButton('btn_gotit', 'got it', 'close notification', closeNotification);
    gotit.classList.add("app_btn", "toasterBtn");
    self.toaster.insertBefore(gotit, self.toaster.childNodes[2]);
    const gobutton = createLinkButton('gotobudget_btn', 'go', 'set budget', pages.budget_and_goals.url);
    gobutton.classList.add("app_btn","toasterBtn");
    self.toasterButtonsContainer.append(gobutton);
  }else if (buttons==="myexpenses") {
    const gotit = createButton('btn_gotit', 'got it', 'close notification', closeNotification);
    gotit.classList.add("app_btn", "toasterBtn");
    self.toaster.insertBefore(gotit, self.toaster.childNodes[2]);
    const gobutton = createLinkButton('go_btn_expenses', 'my expenses', 'view expenses', pages.my_expenses.url);
    gobutton.classList.add("app_btn","toasterBtn");
    self.toasterButtonsContainer.append(gobutton);
  }
  else if (buttons==="worker_update_btns") {
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
  }else if (buttons==="refresh") {
    const refresh_btn = createButton('dismiss_btn', 'refresh', 'refresh the app', refreshApp);
    refresh_btn.classList.add("app_btn", "toasterBtn");
    self.toasterButtonsContainer.append(refresh_btn);
  }
};
/*
*  SIGN OUT
*/
//sign out handler
const signOutHandler=()=>{
  self.signOutBtn = document.getElementById('btn_logout');
  self.signOutBtn.addEventListener("keyup", (event) => {
    event.preventDefault();
    if (event.keyCode === 13) {
      signOut();
    }
  });
  self.signOutBtn.addEventListener("click", (event) => {
    event.preventDefault();
    signOut();
  });
};
//sign user out
const signOut=()=>{
  const data = {
    "action": "sign out"
  };
  sendData("signUserOut", data).then((response)=>{
    if(response.message==="signout"){
      redirectUser(pages.index.url);
    }else{
      const toast_options = {
        "message": "",
        "type": "keep_open",
        "timer": 0,
        "buttonsmode": "got_it",
        "container_classes":["show_toast"]
      };
      let message = '';
      message = `<b>This is embarassing!</b><br/>An unexpected error occurred and we couldn't sign you out! Please try again!`;
      message = message+`<br/>If you keep facing this issue, please contact us immediately!`;
      toast_options.message = message;
      showToaster(toast_options);
    }
  });
};
/*
*  NAVIGATION MENU
*/
//displau menu:
const displayMenu = (event, menu = self.menu) => {
  event.preventDefault();
  menu.classList.add("displayMenu");
  self.closeMenuBtn.setAttribute('tabindex','0');
  self.closeMenuBtn.focus();
  setTabIndex(self.menulinks, 0, 1);
  menu.addEventListener('keydown', trapMenuKeys);
  displayElement(self.opacity_layer);
};
//close menu:
const closeMenu = (event) => {
  event.preventDefault();
  closeMenuHandler();
  setTabIndex(self.menulinks, -1, 1);
};
//close menu when clicking the button, outside menu card and when pressing the 'esc' button:
const closeMenuHandler = (menu = self.menu) => {
  menu.classList.remove("displayMenu");
  hideElement(self.opacity_layer);
  self.closeMenuBtn.setAttribute('tabindex','-1');
  self.menuBtn.focus();
};
//trap navigaton inside the menu card:
const trapMenuKeys = (event)=> {
  const focusableElements = self.menulinks;
  const firstTabStop = focusableElements[0];
  const lastTabStop = focusableElements[focusableElements.length - 1];
  // Check for TAB key press
  if (event.keyCode === 9) {
    // SHIFT + TAB
    if (event.shiftKey) {
      if (document.activeElement === firstTabStop) {
        event.preventDefault();
        lastTabStop.focus();
      }
    // TAB
    } else {
      if (document.activeElement === lastTabStop) {
        event.preventDefault();
        firstTabStop.focus();
      }
    }
  }
  // ESCAPE
  if (event.keyCode === 27) {
    closeMenuHandler();
    setTabIndex(focusableElements, -1, 1);
  }
  if (event.keyCode === 13) {
    return;
  }
};
//unfocus the close button when mouse is over lis:
const changeCloseButton = (event) => {
  self.closeMenuBtn.blur();
};
//style navigation menu
const styleNavMenu = (position, menulinks = self.menulinks) => {
  menulinks[position].classList.add("active");
};
