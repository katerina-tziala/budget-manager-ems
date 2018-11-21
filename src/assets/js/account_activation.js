"use strict";
let account_params;
//render account activation
const renderActivation = () =>{
  prepareMain("clear");
  self.account_params=[];
  const account_id = getParameterByName('id');
  const account_username = getParameterByName('username');
  const accountcode = getParameterByName('code');
  if(account_id==="null" || account_username==="null" || accountcode==="null"){
    redirectUser(pages.index.url);
  }else{
    self.account_params={'id': account_id,'account_username': account_username,'accountcode': accountcode};
    createActivationHTMLContent();
    initPage();
  }
};
/*
* ACTIONS & BEHAVIOR
*/
//initialize page
const initPage = () => {
  const activation_container = document.getElementById('activation_container');
  const activation_msg = document.getElementById('activation_msg');
  const activationGIF = document.getElementById('activationGIF');
  const lastaccountp = document.getElementById('lastaccountp');
  const signinlink = document.getElementById('btnlink_home');
  const signuplink = document.getElementById('btnlink_signup');
  const contactlink = document.getElementById('btnlink_contact');
  const user_greeding = document.getElementById('user_greeding');
  user_greeding.innerHTML = ", "+self.account_params.account_username;
  self.account_params.container = activation_container;
  self.account_params.user_greeding = user_greeding;
  self.account_params.activation_msg = activation_msg;
  self.account_params.activationGIF = activationGIF;
  self.account_params.lastmessage = lastaccountp;
  self.account_params.signinlink = signinlink;
  self.account_params.signuplink = signuplink;
  self.account_params.contactlink = contactlink;
  activateAccount(self.account_params);
  hideLoader();
};
//activate account
const activateAccount = (params=self.account_params) => {
  let activation_type="initial";
  const idparts = params.id.toString().split("_");
  const feedback = self.userInfo.feedback==='regular'?0:1;
  if (idparts.length>1) {
    activation_type="reactivation";
  }
  const data = {
    "id": parseInt(idparts[0]),
    "activationcode": params.accountcode.toString(),
    "username": params.account_username.toString(),
    "activation_type": activation_type,
    "feedback":parseInt(feedback),
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
/*
* CREATE HTML FOR ACCOUNT ACTIVATION INTERFACE
*/
//create view
const createActivationHTMLContent = (main = self.main) => {
  const activation_container = document.createElement('div');
  activation_container.className = "centeredFlexbox";
  activation_container.setAttribute('id', 'activation_container');
  const h2 = document.createElement('h2');
  h2.innerHTML = `Hello<span id='user_greeding'></span>!`;
  const activation_msg = document.createElement('p');
  activation_msg.setAttribute('id', 'activation_msg');
  const activationGIF = document.createElement('img');
  activationGIF.setAttribute('id', 'activationGIF');
  const lastaccountp = document.createElement('p');
  lastaccountp.setAttribute('id', 'lastaccountp');
  activation_container.append(h2, activation_msg, activationGIF, lastaccountp);
  main.append(activation_container);
  const links=['signin', 'signup','contact'];
  createNavigationLinks(links);
};
//activation error view
const activationErrorView = (params=self.account_params) => {
  params.activation_msg.innerHTML = `We could not activate your account!<br/>Please, try again!`;
  params.activationGIF.src = domain+"assets/img/minions_what.gif";
  params.activationGIF.setAttribute('alt', 'confused minions');
  const notice = document.createElement('b');
  notice.innerHTML = "Notice:";
  const span_a = document.createElement('span');
  span_a.innerHTML = "You have to activate your account to be able to use this app!";
  const i = document.createElement('i');
  i.innerHTML = `Follow the instructions in the <b>"Account Activation"</b> email we sent you, and don't forget to check your spam emails too!`;
  const p = document.createElement('p');
  p.className='notice';
  p.append(notice, span_a, i);
  params.lastmessage.innerHTML = 'If you cannot activate your account please contact us immediately!';
  params.container.append(p);
  displayElement(params.container);
  hideElement(params.signuplink);
  hideElement(params.signinlink);
};
//account not found view
const accountNotFoundView = (params=self.account_params) => {
  params.activation_msg.innerHTML = "We could not find your account!";
  params.activationGIF.src = domain+"assets/img/minions_stare.gif";
  params.activationGIF.setAttribute('alt', 'minions staring');
  params.lastmessage.innerHTML = `If you are not a member yet <i>Sign Up now</i>!`;
  displayElement(params.container);
  hideElement(params.signinlink);
};
//account alredy active view
const alreadyActivatedView = (params=self.account_params) => {
  params.activation_msg.innerHTML = "Your account has been allready activated!";
  params.activationGIF.src = domain+"assets/img/minions_thumbs.gif";
  params.activationGIF.setAttribute('alt', 'minions thumbs up');
  params.lastmessage.innerHTML = `Start using the <i>Budget Manager</i> application now!`;
  displayElement(params.container);
  hideElement(params.signuplink);
};
//account activated view
const activeAccountView = (params=self.account_params) => {
  params.activation_msg.innerHTML = "Your account is now active!";
  params.activationGIF.src = domain+"assets/img/minions_yeah.gif";
  params.activationGIF.setAttribute('alt', 'minions excited');
  params.lastmessage.innerHTML = `Start using the <i>Budget Manager</i> application now!`;
  displayElement(params.container);
  hideElement(params.signuplink);
};
