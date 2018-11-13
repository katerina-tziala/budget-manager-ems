"use strict";
let account_id, account_username, accountcode, activation_container, user_greeding, activation_msg, activationGIF, lastaccountp, signinlink, signuplink;
//render account activation
const initActivationView = () =>{
  self.account_id = getParameterByName('id');
  self.account_username = getParameterByName('username');
  self.accountcode = getParameterByName('code');
  if(self.account_username==="null" || self.accountcode==="null" || self.account_id==="null"){
    redirectUser(pages.index.url);
  }else{
    createActivationHTMLContent();
    initPage();
  }
};
//create view
const createActivationHTMLContent = (main = self.main) => {
  const activation_container = document.createElement('div');
  activation_container.className = "centeredFlexbox";
  activation_container.setAttribute('id', 'activation_container');
  const h2 = document.createElement('h2');
  h2.innerHTML = `Hello, <span id='user_greeding'></span>!`;
  const activation_msg = document.createElement('p');
  activation_msg.setAttribute('id', 'activation_msg');
  const activationGIF = document.createElement('img');
  activationGIF.setAttribute('id', 'activationGIF');
  const lastaccountp = document.createElement('p');
  lastaccountp.setAttribute('id', 'lastaccountp');
  activation_container.append(h2, activation_msg, activationGIF, lastaccountp);
  const linksWrapper = document.createElement('div');
  linksWrapper.classList.add("btnWrapper");
  linksWrapper.append(createSignInLink(), createSignUpLink(), createContactLink());
  main.append(activation_container, linksWrapper);
};
//initialize page
const initPage = () => {
  setTimeout(() =>{//delay display for one sec to ensure that elements are ready before selection
    self.activation_container = document.getElementById('activation_container');
    self.user_greeding = document.getElementById('user_greeding');
    self.activation_msg = document.getElementById('activation_msg');
    self.activationGIF = document.getElementById('activationGIF');
    self.lastaccountp = document.getElementById('lastaccountp');
    self.signinlink = document.getElementById('btnlink_home');
    self.signuplink = document.getElementById('btnlink_signup');
    self.user_greeding.innerHTML = self.account_username;
    activateAccount();
  },1000);
};
//activate account
const activateAccount = (id = self.account_id, username = self.account_username, code = self.accountcode) => {
  const data = {
    "id": parseInt(id),
    "activationcode": code.toString(),
    "username": username.toString(),
    "request_type": "account_activation"
  };
  sendData("activateAccount", data).then((response)=>{
    hideLoader();
    if(response.message==="invalid_request"){
      invalidRequestHandler(data);
    }else if(response.message==="success"){
      activeAccountView();
    }else if(response.message==="activation_error"){
      activationErrorView();
    }else if(response.message==="already_active"){
      alreadyActivatedView();
    }else if(response.message==="account_not_found"){
      accountNotFoundView();
    }
  });
};
//account activated
const activeAccountView = (container = self.activation_container, activation_msg = self.activation_msg, activationGIF = self.activationGIF, lastaccountp = self.lastaccountp) => {
  activation_msg.innerHTML = "Your account is now active!";
  activationGIF.src = domain+"assets/img/minions_yeah.gif";
  activationGIF.setAttribute('alt', 'minions excited');
  lastaccountp.innerHTML = `Start using the <i>Budget Manager</i> application now!`;
  displayElement(container);
  hideElement(self.signuplink);
};
//account alredy active
const alreadyActivatedView = (container = self.activation_container, activation_msg = self.activation_msg, activationGIF = self.activationGIF, lastaccountp = self.lastaccountp) => {
  activation_msg.innerHTML = "Your account has been allready activated!";
  activationGIF.src = domain+"assets/img/minions_thumbs.gif";
  activationGIF.setAttribute('alt', 'minions thumbs up');
  lastaccountp.innerHTML = `Start using the <i>Budget Manager</i> application now!`;
  displayElement(container);
  hideElement(self.signuplink);
};
//account not found
const accountNotFoundView = (container = self.activation_container, activation_msg = self.activation_msg, activationGIF = self.activationGIF, lastaccountp = self.lastaccountp) => {
  activation_msg.innerHTML = "We could not find your account!";
  activationGIF.src = domain+"assets/img/minions_stare.gif";
  activationGIF.setAttribute('alt', 'minions staring');
  lastaccountp.innerHTML = `If you are not a member yet <i>Sign Up now</i>!`;
  displayElement(container);
  hideElement(self.signinlink);
};
//activation error
const activationErrorView = (container = self.activation_container, activation_msg = self.activation_msg, activationGIF = self.activationGIF, lastaccountp = self.lastaccountp) => {
  activation_msg.innerHTML = `We could not activate your account!<br/>Please, try again!`;
  activationGIF.src = domain+"assets/img/minions_what.gif";
  activationGIF.setAttribute('alt', 'confused minions');
  const notice = document.createElement('br');
  notice.innerHTML = "Notice:";
  const span_a = document.createElement('span');
  span_a.innerHTML = "You have to activate your account to be able to use this app!";
  const i = document.createElement('i');
  i.innerHTML = `Follow the instructions in the <b>"Account Activation"</b> email we sent you, and don't forget to check your spam emails too!`;
  const p = document.createElement('p');
  p.append(notice, span_a, i);
  lastaccountp.innerHTML = 'If you cannot activate your account please contact us immediately!';
  displayElement(container);
  hideElement(self.signuplink);
  hideElement(self.signinlink);
};
