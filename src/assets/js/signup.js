"use strict";
window.addEventListener('keydown', (event)=>{
  if(event.keyIdentifier=='U+000A' || event.keyIdentifier=='Enter' || event.keyCode==13){
    if(event.target.nodeName=='INPUT' && (event.target.type=='text' || event.target.type=='password')){
      signUp(event);
    }
  }
});
let signUpData;
//initialize sign up view
const initSignUpView = () =>{
  hideLoader();
  createSignUpHTMLContent();
  self.signUpData="";
  initBirthDatePicker();
  const suForm = document.getElementById('signup_form');
  let pass_check;
  suForm.addEventListener('keyup', (event) => {
    const element = event.target;
    const formelement = element.tagName;
    if(formelement==='INPUT'){
      const inputname = element.name;
      const inputvalue = element.value;
      const lbl = document.querySelector('[for='+`${inputname}`+']');
      if(inputname==='username'){
        usernameValidation(inputvalue, lbl);
      }else if (inputname==='user_email') {
        emailValidation(inputvalue, lbl);
      }else if (inputname==='passwrd') {
        if(passwordValidation(inputvalue, lbl)===true){
          pass_check=inputvalue;
        }
      }else if (inputname==='conf_passwrd') {
        passwordValidation(inputvalue, lbl, pass_check);
      }
    }else if (formelement==='LABEL') {
      const radio = event.target.querySelectorAll('input[name="gender"]');
      if(event.keyCode===13){
        radio[0].checked=true;
      }
    }else {
      return;
    }
  });
};
//create view
const createSignUpHTMLContent = (main = self.main) => {
  const h2 = document.createElement('h2');
  h2.innerHTML = "Not a member yet? Sign Up now!";
  const form = document.createElement('form');
  form.setAttribute('id', 'signup_form');
  form.classList.add('centeredFlexbox', 'form_style');
  const form_tag = document.createElement('p');
  form_tag.className = "form_tag";
  form_tag.innerHTML = `Create an account<br><i>All fields are required!</i>`;
  const username_container = createBasicContainer('Username', 'enter username','username');
  const email_container = createBasicContainer('Email', 'enter your email','user_email');
  const pass_container = createPasswordContainer('supass', 'Password', 'enter your password', 'conf_new_pass', 'sign_upinpt', 'btn_view_supass');
  const pass_conf_container = createPasswordContainer('surpass', 'Confirm Password', 'enter your password again', 'conf_passwrd', 'sign_upinpt', 'btn_view_surpass');
  const birthday_container = createBirthContainer();
  const gender_container = createGenderContainer();
  const resetBtn = createButton('resetBtn', 'clear form', 'reset sign up form', resetClearForm);
  resetBtn.classList.add('formBtn', 'signupBtn');
  const sendBtn = createButton('signupBtn', 'sign up', 'sign up', signUp);
  sendBtn.classList.add('formBtn', 'signupBtn');
  form.append(form_tag, username_container, email_container, pass_container, pass_conf_container, birthday_container, gender_container, resetBtn,sendBtn);
  main.append(h2, form, createSignInLink(), createContactLink());
};
//create section for inputs in form
const createBasicContainer = (placeholder, aria, name) => {
  const container = document.createElement('div');
  container.className = "signupInputContainer";
  const input = createInput('text', placeholder, aria, name);
  input.classList.add("sign_upinpt");
  const label = createLabel(name);
  label.classList.add("su_label");
  container.append(input, label);
  return container;
};
//create section for password in form
const createPasswordContainer = (id, placeholder, aria, name, inputclass, btnid) => {
  const container = document.createElement('div');
  container.className = "signupInputContainer";
  const input = createPasswordInput(id, placeholder, aria, name, inputclass, btnid);
  const label = createLabel(name);
  label.classList.add("su_label");
  container.append(input, label);
  return container;
};
//create section for birthday in form
const createBirthContainer = () => {
  const container = document.createElement('div');
  container.classList.add("signupInputContainer", "birthContainer");
  const picker = document.createElement('div');
  picker.classList.add("pickerContainer");
  picker.setAttribute('id', 'birthdayPick');
  picker.setAttribute('tabindex', 0);
  picker.setAttribute('aria-label', 'date picker');
  const pickerinp = document.createElement('span');
  pickerinp.classList.add("birth_input", "sign_upinpt");
  pickerinp.setAttribute('id', 'datepickerInput');
  pickerinp.setAttribute('aria', 'enter your birthday');
  pickerinp.setAttribute('name', 'birthday');
  pickerinp.innerHTML = "Birthday";
  const pickercalendar = document.createElement('i');
  pickercalendar.classList.add("calendar", "fas", "fa-calendar-alt");
  picker.append(pickerinp, pickercalendar);
  const label = createLabel('birthdayPick');
  label.classList.add("su_label");
  container.append(picker, label);
  return container;
};
//create section for gender in form
const createGenderContainer = () => {
  const container = document.createElement('div');
  container.className = "genderContainer";
  const gender_section = document.createElement('div');
  gender_section.setAttribute('id', 'gender_section');
  const gender_tag = document.createElement('span');
  gender_tag.setAttribute('id', 'gender_tag');
  gender_tag.innerHTML = "Gender: ";
  const maleinpt = createRadioInput('genderlabel', 'male', 'gender', 'male', 'genderlabel', true);
  const femaleinpt = createRadioInput('genderlabel', 'female', 'gender', 'female', 'genderlabel', false);
  gender_section.append(gender_tag, maleinpt, femaleinpt);
  container.append(gender_section);
  return container;
};
//sign up
const signUp = (event) => {
  event.preventDefault();
  const labels = document.querySelectorAll('.su_label');
  const formFields = document.querySelectorAll('.sign_upinpt');
  const username = formFields[0].value.trim();
  const email = formFields[1].value.trim();
  const pass = formFields[2].value.trim();
  const pass_conf = formFields[3].value.trim();
  const birth = formFields[4].innerHTML;
  const gender = document.querySelector('input[name="gender"]:checked').value;
  const valid_username = usernameValidation(username, labels[0]);
  const valid_email = emailValidation(email, labels[1]);
  const valid_pass = passwordValidation(pass, labels[2]);
  const valid_pass_conf = passwordValidation(pass_conf, labels[3], pass);
  const valid_birthday = dateValidation(birth, labels[4], "* Birthday");
  if(valid_username===true && valid_email===true && valid_pass===true && valid_pass_conf===true && valid_birthday===true){
    const sending_birthday = birth.split("/").reverse().join("-");
    self.signUpData = {
      "apphost": domain,
      "username": username.toString(),
      "email": email.toString(),
      "password": pass.toString(),
      "birth": sending_birthday.toString(),
      "gender": gender.toString().toLowerCase(),
      "request_type":"sign_up"
    };
    displayConsentView();
  }
};
//create consent view
const createConsentView = ()=>{
  const container = document.createElement('div');
  container.classList.add("terms_layer");
  //container.classList.add("terms_layer", "hidden");
  container.setAttribute('id', 'terms_layer');
  const terms_card = document.createElement('div');
  terms_card.setAttribute('id', 'terms_card');
  const termsheader = document.createElement('h2');
  termsheader.innerHTML = "Terms of Use";
  const consent_btn = createButton('concent_btn', 'consent to terms', 'consent to terms', concentToTermsAndSignUp);
  consent_btn.className = 'app_btn';
  const close_btn = createButton('closeterms_btn', '', 'close terms', closeConsentView);
  close_btn.classList.add("round_btn", "fas", "fa-times");
  terms_card.append(termsheader, createTermsList(), consent_btn, close_btn);
  container.append(terms_card);
  return container;
};
//display consent view
const displayConsentView = () =>{
  document.body.append(createConsentView(), document.body.childNodes[2]);
  displayElement(self.opacity_layer);
};
//remove concentView
const removeConsentView = () =>{
  const termsview = document.querySelectorAll('.terms_layer');
  if (termsview.length>0) {
    termsview[0].remove();
    hideElement(self.opacity_layer);
  }
};
//close consent view on click
const closeConsentView = (event) => {
  event.preventDefault();
  removeConsentView();
};
//concent to terms and sign up
const concentToTermsAndSignUp = (event, data = self.signUpData) => {
  event.preventDefault();
  const labels = document.querySelectorAll('.su_label');
  const formFields = document.querySelectorAll('.sign_upinpt');
  removeConsentView();
  showSignUpLoader();
  sendData('signUp', data).then((response)=>{
    hideSignUpLoader();
    if(response.message==="invalid_request"){
      invalidRequestHandler(data);
    }else{
      if(response.message==="username_email_exists") {
        labels[0].innerHTML="This username is taken! Try another one.";
        displayElement(labels[0]);
        labels[1].innerHTML="There is already an account for this email!";
        displayElement(labels[1]);
      }else if(response.message==="username_exists"){
        labels[0].innerHTML="This username is taken! Try another one.";
        displayElement(labels[0]);
      }else if(response.message==="email_exists"){
        labels[1].innerHTML="There is already an account for this email!";
        displayElement(labels[1]);
      }else{
        clearSignupForm(labels, formFields);
        const toast_options = {
          "message": "",
          "type": "fadeout",
          "timer": 0,
          "buttonsmode": "got_it",
          "container_classes":["show_toast"]
        };
        if (response.message==="success") {
          toast_options.message = messageGenerator({initiator:"signup", message_type:"success"});
          toast_options.timer=15000;
        }else if (response.message==="saved_no_ver_email") {
          toast_options.type='keep_open';
          toast_options.message = messageGenerator({initiator:"signup", message_type:"saved_no_ver_email"});
        }else{
          toast_options.message = messageGenerator({initiator:"signup", message_type:"else_error", error_part:"create an account for you"});
          toast_options.timer=12000;
        }
        showToaster(toast_options);
      }
    }
  });
};
//show message when signing up
const showSignUpLoader = () => {
  const sendImage = document.createElement('div');
  sendImage.setAttribute('id', 'signUpLoaderImage');
  const sendText = document.createElement('p');
  sendText.setAttribute('id', 'signUpLoaderText');
  sendText.innerHTML = `Creating your account....<br><span>Please wait.</span><span>This might take a while!<span>`
  self.loader.insertBefore(sendImage, self.loader.childNodes[0]);
  self.loader.insertBefore(sendText, self.loader.childNodes[1]);
  showLoader();
};
//hide message after signing up
const hideSignUpLoader = () => {
  document.getElementById('signUpLoaderImage').remove();
  document.getElementById('signUpLoaderText').remove();
  hideLoader();
};
//clear sign up form
const resetClearForm = (event) => {
  event.preventDefault();
  const labels = document.querySelectorAll('.su_label');
  const formFields = document.querySelectorAll('.sign_upinpt');
  clearSignupForm(labels, formFields);
};
//clear sign up form
const clearSignupForm = (labels, formFields) => {
  self.signUpData="";
  formFields[4].innerHTML="Birthday";
  formFields[4].classList.remove('has_selected_datetime');
  clearAppForm(labels, formFields);
  document.querySelector('input[value="male"]').checked = true;
  document.querySelector('input[value="female"]').checked = false;
  formFields[2].type = "text";
  formFields[3].type = "text";
  passwordVisibilityHandler(formFields[2], document.getElementById('btn_view_supass'));
  passwordVisibilityHandler(formFields[3], document.getElementById('btn_view_surpass'));
};
//initialize birthday picker:
const initBirthDatePicker = () => {
  let pickerDates = [];
  pickerDates["today"] = new Date("1990-01-01");
  pickerDates["past"] = new Date("1918-01-01");
  pickerDates["future"] = new Date("2008-01-01");
  const dayPicker = document.getElementById('birthdayPick');
  const dayPickerInput = document.getElementById('datepickerInput');
  initDatePickerCalendar(self.signBirthdayCalendar, dayPicker, pickerDates, dayPickerInput);
};
