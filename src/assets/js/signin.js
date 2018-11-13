"use strict";
window.addEventListener('keydown', (event)=>{
  if(event.keyIdentifier=='U+000A' || event.keyIdentifier=='Enter' || event.keyCode==13){
    if(event.target.nodeName=='INPUT' && (event.target.type=='text' || event.target.type=='password')){
      signIn(event);
    }
  }
});
//render sign up
const renderSignIn = () =>{
  prepareMain("clear");
  createView();
  initializePage();
  hideLoader();
};
//create view
const createView = (main = self.main) => {
  const h2 = document.createElement('h2');
  h2.innerHTML = "Welcome to Budget Manager!";
  const p = document.createElement('p');
  p.innerHTML = "The app that helps you monitor your expenses and stay on budget!";
  const form = createSignInForm();
  main.insertBefore(createContactLink(), main.childNodes[0]);
  main.insertBefore(createSignUpLink(), main.childNodes[0]);
  main.insertBefore(form, main.childNodes[0]);
  main.insertBefore(p, main.childNodes[0]);
  main.insertBefore(h2, main.childNodes[0]);
};
//create sign in form
const createSignInForm = () => {
  const form = document.createElement('form');
  form.setAttribute('id', 'signin_form');
  form.classList.add('centeredFlexbox', 'form_style');
  const p = document.createElement('p');
  p.innerHTML = "Sign in to your account";
  p.className = "form_tag";
  const cred_input = createInput('text', 'Email or Username', 'enter email or username', 'credential');
  cred_input.classList.add('sign_ininpt');
  const cred_label = createLabel('credential');
  cred_label.classList.add('si_label');
  const pass_input = createPasswordInput('sipass', 'Password', 'enter password', 'signin_pass', 'sign_ininpt', 'btn_view_sipass');
  const pass_label = createLabel('signin_pass');
  pass_label.classList.add('si_label');
  const a = document.createElement('a');
  a.setAttribute('id', 'psw_forgot');
  a.href=pages.forgot_password.url;
  a.innerHTML = "Forgot your password";
  const cookie = document.createElement('label');
  cookie.classList.add('cookie_container');
  cookie.setAttribute('tabindex', 0);
  const span_a = document.createElement('span');
  span_a.innerHTML = "Remember me";
  const cookie_inpt = createInput('checkbox', '', 'stay signed in checkbox', 'cookie', 'cookie_check');
  cookie_inpt.setAttribute('tabindex', -1);
  cookie_inpt.classList.add('sign_ininpt');
  cookie_inpt.checked = true;
  const checkmark = document.createElement('span');
  checkmark.className = 'cookie_checkmark';
  cookie.append(span_a, cookie_inpt, checkmark);
  const button = createButton('loginBtn', 'sign in', 'sign in', signIn);
  button.classList.add('formBtn');
  form.append(p, cred_input, cred_label, pass_input, pass_label, a, cookie, button);
  return form;
};
//initialize page
const initializePage = () => {
  const siForm = document.getElementById('signin_form');
  siForm.addEventListener('keyup', (event) => {
    const element = event.target;
    const formelement = element.tagName;
    if(formelement==='LABEL'){
      const cookie_check = document.getElementById('cookie_check');
      if(event.keyCode===13 && cookie_check.checked===true){
        cookie_check.checked = false;
      } else if(event.keyCode===13 && cookie_check.checked===false){
        cookie_check.checked = true;
      }
    }
  });
};
//sign in
const signIn = (event) => {
  event.preventDefault();
  const labels = document.querySelectorAll('.si_label');
  const formFields = document.querySelectorAll('.sign_ininpt');
  const user_credential = formFields[0].value;
  const password = formFields[1].value;
  const valid_credential = credentialValidation(user_credential, labels[0]);
  const valid_pass = passwordValidation(password, labels[1]);
  if(valid_credential===true && valid_pass===true){
    const cookie = formFields[2];
    let remember_me = true;
    if(cookie.checked===true){
      remember_me = true;
    }else{
      remember_me = false;
    }
    const data = {
      "credential": user_credential.toString(),
      "password": password.toString(),
      "cookie": remember_me,
      "request_type": "sign_in",
    };
    sendData('signIn', data).then((response)=>{
       if(response.message==="wrong_email_username"){
           labels[0].innerHTML="Wrong email or username!";
           displayElement(labels[0]);
        }else if(response.message==="wrong_password"){
          labels[1].innerHTML="Wrong password!";
          displayElement(labels[1]);
       }else if(response.message==="success"){
         initApp();
       }else{
        clearAppForm(labels, formFields);
        cookie.checked = true;
        const toast_options = {
          "message": "",
          "type": "fadeout",
          "timer": 12000,
          "buttonsmode": "got_it",
          "container_classes":["show_toast"]
        };
        if(response.message==="unverified_account"){
          toast_options.message = messageGenerator({initiator:"signin", message_type:"unverified_account"});
          toast_options.timer=16000;
         } else {
          toast_options.message = messageGenerator({initiator:"signin", message_type:"unverified_account", error_part:"sign you into your account"});
         }
         showToaster(toast_options);
      }
   });
  }
};
