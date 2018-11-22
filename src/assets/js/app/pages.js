/*
* FUNCTIONS TO INITIALIZE COMMON INTERFACES
*/
//initialize index page
const initIndexPage = (userInfo = self.userInfo) => {
  clearIndexFiles();
  if (userInfo.signed_in) {
    loadStyle(pages.home.css, ()=>{
      createNavigationMenu();
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
                          renderHome(budgetList, expenseList, goalList, feedbackList);
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
  }else{
    loadStyle(pages.index.css, ()=>{
      loadScript(pages.index.js_script, ()=>{
        renderSignIn();
      });
    });
  }
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
//initialize terms page
const initTermsPage = (main = self.main, userInfo = self.userInfo) => {
  prepareMain("clear");
  loadStyle(pages.terms_of_use.css, ()=>{
    main.append(createTermsList());
    if (userInfo.signed_in) {
      createNavigationMenu();
      if (!userInfo.has_current_budget) {
        showBudgetNotification();
      }
    }else {
      const links=['signin', 'signup','contact'];
      createNavigationLinks(links);
    }
    hideLoader();
    document.getElementById('terms_list').style.display="block";
  });
};
//initialize contact page
const initContactPage = (parentNode = self.main, userInfo = self.userInfo) => {
  loadStyle(pages.contact.css, ()=>{
    loadScript(pages.contact.js_script, ()=>{
      renderContact(userInfo);
    });
  });
};
/*
* FUNCTIONS TO INITIALIZE AUTHORIZED INTERFACES
*/
//initialize profile page
const initProfilePage = (parentNode = self.main) => {
  loadStyle(pages.profile.css, ()=>{
    createNavigationMenu();
    styleNavMenu(6);
    loadScript(pages.profile.js_script, ()=>{
        renderProfile();
    });
  });
};
//initialize categories page
const initCategoriesPage = (userInfo = self.userInfo) => {
  loadStyle(pages.categories.css, ()=>{
    createNavigationMenu();
    styleNavMenu(5);
    fetchData('getUserCategories', (error, categories) => {
      if (error) { // Got an error!
        hideLoader();
        showErrorView();
        console.error(error);
      }else{
        if (categories.length>0) {
          loadScript(pages.categories.js_script, ()=>{
            renderCategories(categories);
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
    createNavigationMenu();
    styleNavMenu(2);
    fetchData('getUserCategories', (error, categories) => {
      if (error) { // Got an error!
        hideLoader();
        showErrorView();
        console.error(error);
      }else{
        if (categories.length>0) {
          loadScript(pages.add_expense.js_script, ()=>{
            renderAddExpense(categories);
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
    createNavigationMenu();
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
                  renderExpenseDetails(expenses, categories);
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
//initialize my expenses page
const initMyExpensesPage = () => {
  loadStyle(pages.my_expenses.css, ()=>{
    createNavigationMenu();
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
                        renderMyExpenses(categoriesList, budgetList, expenseList, goalList);
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
//initialize budget and goals page
const initBudgetGoalsPage = () => {
  loadStyle(pages.budget_and_goals.css, ()=>{
    createNavigationMenu();
    styleNavMenu(4);
    fetchData('getUserBudgetList', (error, budgets) => {
      if (error) { // Got an error!
        hideLoader();
        showErrorView();
        console.error(error);
      } else {
        loadScript(pages.budget_and_goals.js_script, ()=>{
          renderBudgetGoal(budgets);
        });
      }
    });
  });
};
/*
* FUNCTIONS TO INITIALIZE UNAUTHORIZED INTERFACES
*/
//initialize sign up page
const initSignUpPage = () => {
  loadStyle(pages.signup.css, ()=>{
    loadScript(pages.signup.js_script, ()=>{
      renderSignUp();
    });
  });
};
//initialize account activation page
const initAccountActivationPage = () => {
  loadStyle(pages.account_activation.css, ()=>{
    loadScript(pages.account_activation.js_script, ()=>{
      renderActivation();
    });
  });
};
//initialize password forgot page
const initForgotPasswordPage = () => {
  loadStyle(pages.forgot_password.css, ()=>{
    loadScript(pages.forgot_password.js_script, ()=>{
      renderForgotPassword();
    });
  });
};
//initialize password reset page
const initResetPasswordPage = () => {
  loadStyle(pages.reset_password.css, ()=>{
    loadScript(pages.reset_password.js_script, ()=>{
      renderResetPassword();
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
