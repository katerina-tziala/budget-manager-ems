"use strict";
window.addEventListener('keydown', (event)=>{
  if(event.keyIdentifier=='U+000A' || event.keyIdentifier=='Enter' || event.keyCode==13){
    if(event.target.nodeName=='INPUT' && (event.target.type=='text' || event.target.type=='password')){
      sendForgotRequest(event);
    }
  }
});
//initialize forgot password view
const initForgotPasswordView = () =>{
  const h2 = document.createElement('h2');
  h2.innerHTML = "Don't worry!";
  const p = document.createElement('p');
  p.innerHTML = "We are here to help you!<br/>Send us your username and your email and you will receive a link to reset your password.";
  const form = document.createElement('form');
  form.setAttribute('id', 'passForgot_form');
  form.classList.add('centeredFlexbox', 'form_style');
  const form_tag = document.createElement('p');
  form_tag.className = "form_tag";
  form_tag.innerHTML = "Enter your account information";
  const name_inpt = createInput('text', '* Username', 'enter your username', 'username');
  name_inpt.classList.add('passforgot_inpt');
  const name_lbl = createLabel('username');
  name_lbl.classList.add('passforgot_lbl');
  const email_inpt = createInput('text', '* Email', 'enter your email', 'user_email', 'user_email');
  email_inpt.classList.add('passforgot_inpt');
  const email_lbl = createLabel('user_email');
  email_lbl.classList.add('passforgot_lbl');
  const buttonWrapper = document.createElement('div');
  buttonWrapper.className = "btnWrapper";
  const resetBtn = createButton('resetFpBtn', 'clear form', 'reset form', resetClearForm);
  resetBtn.classList.add('formBtn', 'passForgBtn');
  const sendBtn = createButton('sendFpBtn', 'send', 'send request to change password', sendForgotRequest);
  sendBtn.classList.add('formBtn', 'passForgBtn');
  buttonWrapper.append(resetBtn, sendBtn);
  form.append(form_tag, name_inpt, name_lbl, email_inpt, email_lbl, buttonWrapper);
  const linksWrapper = document.createElement('div');
  linksWrapper.className = "btnWrapper";
  linksWrapper.append(createSignInLink(), createSignUpLink(), createContactLink());
  self.main.append(h2, p, form, linksWrapper);
  hideLoader();
};
//send request to reset password
const sendForgotRequest = (event) => {
  event.preventDefault();
  const form = document.getElementById('passForgot_form');
  const labels = document.querySelectorAll('.errorLabel');
  const formFields = document.querySelectorAll('.formInputs');
  const username = formFields[0].value.trim().toString();
  const email = formFields[1].value.trim().toString();
  let valid_username = usernameValidation(username, labels[0]);
  let valid_email = emailValidation(email, labels[1]);
  if(valid_username===true && valid_email===true){
    const data = {
      "apphost": domain,
      "username": username.toString(),
      "email": email.toString(),
      "request_type": "forgotpass"
    };
    showSendingLoader();
    hideElement(form);
    const btnLinks = document.querySelectorAll('.btn_link');
    for (let i = 0; i < btnLinks.length; i++) {
      hideElement(btnLinks[i]);
    }
    clearAppForm(labels, formFields);
    sendData('forgotPasswordRequest', data).then((response)=>{
      if(response.message==="invalid_request"){
        invalidRequestHandler(data);
      }else{
        const toast_options = {
          "message": "",
          "type": "fadeout",
          "timer": 12000,
          "buttonsmode": "got_it",
          "container_classes":["show_toast"]
        };
        hideSendingLoader();
        if(response.message==="success"){
          toast_options.message = messageGenerator({initiator:"passforgot", message_type:response.message, user_email: email});
          toast_options.timer=10000;
        } else if (response.message==="unverified_account") {
          toast_options.message = messageGenerator({initiator:"passforgot", message_type:'unverified_account'});
          toast_options.timer=16000;
        }else if (response.message==="noaccount") {
          toast_options.message = messageGenerator({initiator:"passforgot", message_type:'noaccount', message_part:`an account for the given information!</b><br/>`});
        }else{
          toast_options.message = messageGenerator({initiator:"passforgot", message_type:"else_error", error_part:"send you a link to reset yor password"});
        }
        displayElement(form);
        for (let i = 0; i < btnLinks.length; i++) {
          displayElement(btnLinks[i]);
        }
        showToaster(toast_options);
      }
    });
  }
};
//clear sign up form
const resetClearForm = (event) => {
  event.preventDefault();
  const labels = document.querySelectorAll('.errorLabel');
  const formFields = document.querySelectorAll('.formInputs');
  clearAppForm(labels, formFields);
};
