"use strict";
let account_username, accountcode, signinlink, signuplink;
window.addEventListener('keydown', (event)=>{
  if(event.keyIdentifier=='U+000A' || event.keyIdentifier=='Enter' || event.keyCode==13){
    if(event.target.nodeName=='INPUT' && (event.target.type=='text' || event.target.type=='password')){
      sendResetPassword(event);
    }
  }
});
//initialize reset password view
const initResetPasswordView = () =>{
  self.account_username = getParameterByName('account');
  self.accountcode = getParameterByName('code');
  if(self.account_username==="null" || self.accountcode==="null"){
    redirectUser(pages.index.url);
  }else{
    const form = document.createElement('form');
    form.setAttribute('id', 'passReset_form');
    form.classList.add('centeredFlexbox', 'form_style');
    const form_tag = document.createElement('p');
    form_tag.className = "form_tag";
    form_tag.innerHTML = "Change your password here";
    const newpass_section = createPasswordInput('newpass', '* New Password', 'enter your new password', 'new_pass', 'reset_pass', 'btn_newpass');
    const newpass_lbl = createLabel('new_pass');
    newpass_lbl.classList.add('passreset_lbl');
    const confpass_section = createPasswordInput('newpassconf', '* Confirm New Password', 'enter your new password again', 'conf_new_pass', 'reset_pass', 'btn_newpassconf');
    const confpass_lbl = createLabel('conf_new_pass');
    confpass_lbl.classList.add('passreset_lbl');
    const buttonWrapper = document.createElement('div');
    buttonWrapper.className = "btnWrapper";
    const resetBtn = createButton('resetRpBtn', 'clear form', 'reset form', resetClearForm);
    resetBtn.classList.add('formBtn', 'passForgBtn');
    const sendBtn = createButton('sendRpBtn', 'change password', 'save changes', sendResetPassword);
    sendBtn.classList.add('formBtn', 'passForgBtn');
    buttonWrapper.append(resetBtn, sendBtn);
    form.append(form_tag, newpass_section, newpass_lbl, confpass_section, confpass_lbl, buttonWrapper);
    const linksWrapper = document.createElement('div');
    linksWrapper.className = "btnWrapper";
    linksWrapper.append(createSignInLink(), createSignUpLink(), createContactLink());
    self.main.append(form, linksWrapper);
    hideLoader();
    self.signinlink = document.getElementById('btnlink_home');
    hideElement(self.signinlink);
    self.signuplink = document.getElementById('btnlink_signup');
    hideElement(self.signuplink);
    const resetForm = document.getElementById('passReset_form');
    let send_new_pass;
    resetForm.addEventListener('keyup', (event) => {
      const element = event.target;
      const formelement = element.tagName;
      if(formelement==='INPUT'){
        const inputname = element.name;
        const inputvalue = element.value;
        const lbl = document.querySelector('[for='+`${inputname}`+']');
        if(inputname==='new_pass'){
          passwordValidation(inputvalue, lbl);
          send_new_pass = inputvalue;
        }else if (inputname==='conf_new_pass') {
          passwordValidation(inputvalue, lbl, send_new_pass);
        }
      }
    });
  }
};
//reset form
const resetClearForm = (event) => {
 event.preventDefault();
 const labels = document.querySelectorAll('.errorLabel');
 const formFields = document.querySelectorAll('.formInputs');
 clearPassResetForm(labels, formFields);
};
//clear sign up form
const clearPassResetForm = (labels, formFields) => {
  clearAppForm(labels, formFields);
  formFields[0].type = "text";
  formFields[1].type = "text";
  passwordVisibilityHandler(formFields[0], document.getElementById('btn_newpass'));
  passwordVisibilityHandler(formFields[1], document.getElementById('btn_newpassconf'));
};
//change password
const sendResetPassword = (event) => {
 event.preventDefault();
 const labels = document.querySelectorAll('.errorLabel');
 const formFields = document.querySelectorAll('.reset_pass');
 const clearFields = document.querySelectorAll('.formInputs');
 const new_pass = formFields[0].value.toString();
 const new_pass_conf = formFields[1].value.toString();
 let valid_new_pass = passwordValidation(new_pass, labels[0]);
 let valid_new_pass_conf = passwordValidation(new_pass_conf, labels[1], new_pass);
 if(valid_new_pass===true && valid_new_pass_conf===true){
   const data = {
     "apphost": domain,
     "user": self.account_username.toString(),
     "activationcode": self.accountcode.toString(),
     "newpass": new_pass,
     "newpass_conf": new_pass_conf
   };
   showChangingLoader();
   clearPassResetForm(labels, clearFields);
   sendData("resetPassword", data).then((response)=>{
     if(response.message==="invalid_request"){
       invalidRequestHandler(data);
     }else{
       const toast_options = {
         "message": "",
         "type": "fadeout",
         "timer": 9000,
         "buttonsmode": "got_it",
         "container_classes":["show_toast"]
       };
      if(response.message==="success"){
          toast_options.message = messageGenerator({initiator:"passreset", message_type:'success'});
          setTimeout(() =>{
            hideChangingLoader();
            hideElement(self.signuplink);
          },1000);
        }else if(response.message==="success_no_email"){
          toast_options.message = messageGenerator({initiator:"passreset", message_type:'success_no_email'});
          setTimeout(() =>{
            hideChangingLoader();
            hideElement(self.signuplink);
          },1000);
        }else if(response.message==="unverified_account"){
          toast_options.message = messageGenerator({initiator:"passreset", message_type:'unverified_account'});
          toast_options.timer=16000;
          setTimeout(() =>{hideChangingLoader();},1000);
        }else if(response.message==="noaccount"){
          toast_options.message = messageGenerator({initiator:"passreset", message_type:'noaccount', message_part:`your account!</b><br/>`});
          toast_options.timer=6000;
          setTimeout(() =>{
            hideChangingLoader();
            hideElement(self.signinlink);
          },1000);
        }else if (response.message==="code_error") {
          toast_options.message = messageGenerator({initiator:"passreset", message_type:'code_error'});
          toast_options.timer=7000;
          setTimeout(() =>{hideChangingLoader();},1000);
        }else{
          toast_options.message = messageGenerator({initiator:"passreset", message_type:"else_error", error_part:"reset your password"});
          toast_options.timer=11000;
          setTimeout(() =>{hideChangingLoader();},1000);
        }
        setTimeout(() =>{showToaster(toast_options);},1000);
     }
    });
  }
};
//show message when reseting password
const showChangingLoader = () => {
  showLoader();
  const sendImage = document.createElement('div');
  sendImage.setAttribute('id', 'changePassImage');
  const sendText = document.createElement('p');
  sendText.setAttribute('id', 'changePassText');
  sendText.innerHTML = `Reseting your password....<br><span>Please wait.</span><span>This might take a while!<span>`
  self.loader.insertBefore(sendImage, self.loader.childNodes[0]);
  self.loader.insertBefore(sendText, self.loader.childNodes[1]);

};
//hide message after reseting password
const hideChangingLoader = () => {
  document.getElementById('changePassImage').remove();
  document.getElementById('changePassText').remove();
  hideLoader();
};
