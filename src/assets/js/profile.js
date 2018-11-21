"use strict";
let personalInfo, personalCardIcon, dataFields, profileInputs;
let birthDayCalendar, forms, usernameForm, emailForm, genderForm, birthdateForm, passwordForm, infoHeaders, cancelBtns, saveButtons, editBtns;
window.addEventListener('keydown', (event)=>{
  if(event.keyIdentifier=='U+000A' || event.keyIdentifier=='Enter' || event.keyCode==13){
    if(event.target.nodeName=='INPUT' && (event.target.type=='text' || event.target.type=='password')){
      event.preventDefault();
      let inputname = event.target.name;
      inputname = inputname.split("_").pop();
      if (inputname==="username") {
        event.preventDefault();
        updateUsername();
      }else if (inputname==="email") {
        event.preventDefault();
        updateEmail();
      }
      else if (inputname==="passcur" || inputname==="passnew" || inputname==="passconf") {
        changePassword(event);
      }
    }
  }
});
//initialize profile view
const renderProfile = () =>{
  prepareMain("clear");
  createProfileHTMLContent();
  initPage();
  hideLoader();
};
/*
* ACTIONS & BEHAVIOR
*/
//initialize variables and elements
const initPage = (data = self.userInfo) => {
  document.querySelector('input[value="'+data.gender+'"]').checked=true;
  initBirthDatePicker(data.birthdate.split("-").reverse().join("/"));
  if (!data.has_current_budget) {
    showBudgetNotification();
  }
  self.personalCardIcon = document.getElementById('personalCardIcon');
  self.dataFields = document.querySelectorAll('.info_data');
  self.profileInputs = document.querySelectorAll('.profileInput');
  self.forms = document.querySelectorAll('.profileForm');
  self.usernameForm = self.forms[0];
  self.emailForm = self.forms[1];
  self.birthdateForm = self.forms[2];
  self.genderForm = self.forms[3];
  self.passwordForm = self.forms[4];
  self.infoHeaders = document.querySelectorAll('.info_header');
  self.cancelBtns = document.querySelectorAll('.cancelProfileBtn');
  self.saveButtons = document.querySelectorAll('.saveProfileBtn');
  self.editBtns = document.querySelectorAll('.editProfileBtn');
  self.usernameForm.addEventListener('keyup', (event) => {
    const element = event.target;
    const formelement = element.tagName;
    if(formelement==='INPUT'){
      const inputname = element.name;
      const inputvalue = element.value;
      const lbl = document.querySelector('[for='+`${inputname}`+']');
      usernameValidation(inputvalue, lbl);
    }
  });
  self.emailForm.addEventListener('keyup', (event) => {
      const element = event.target;
      const formelement = element.tagName;
      if(formelement==='INPUT'){
        const inputname = element.name;
        const inputvalue = element.value;
        const lbl = document.querySelector('[for='+`${inputname}`+']');
        emailValidation(inputvalue, lbl);
      }
    });
  self.genderForm.addEventListener('keyup', (event) => {
    const element = event.target;
    const formelement = element.tagName;
    if (formelement==='LABEL') {
      const radio = event.target.querySelectorAll('input[name="gender"]');
      if(event.keyCode===13){
          radio[0].checked=true;
      }
    }
  });
  let pass_check;
  self.passwordForm.addEventListener('keyup', (event) => {
    const element = event.target;
    const formelement = element.tagName;
    let label;
    if(formelement==='INPUT'){
      const inputname = element.name;
      const inputvalue = element.value;
      if(inputname==='passnew'){
        label = document.querySelector('[for='+`${inputname}`+']');
        const valid_pass = passwordValidation(inputvalue, label);
        if(valid_pass===true){
            pass_check=inputvalue;
        }
      }else if (inputname==='passconf') {
        label = document.querySelector('[for='+`${inputname}`+']');
        passwordValidation(inputvalue, label, pass_check);
      }
    }
  });
};
//initialize birthday picker:
const initBirthDatePicker = (userBirthdate) => {
  let pickerDates = [];
  pickerDates["today"] = new Date(userBirthdate.split("/").reverse().join("-"));
  pickerDates["past"] = new Date("1918-01-01");
  pickerDates["future"] = new Date("2008-01-01");
  const dayPicker = document.getElementById('birthdayPick');
  const dayPickerInput = document.getElementById('datepickerInput');
  initDatePickerCalendar(self.birthDayCalendar, dayPicker, pickerDates, dayPickerInput);
};
//open close form to edit
const toggleForm = (event) => {
  event.preventDefault();
  const target = event.target.id.split("_").pop();
  let action = event.target.id.split("_")[0];
  if (action==="pass" || action==="btn") {
    action="edit";
  }
  let keep_form;
  let datafield;
  let form_id = "";
  let datafield_numb=0;
  if(target==="username"){
    keep_form = self.usernameForm;
    form_id = self.usernameForm.id;
    datafield_numb=1;
    clearUsernameEmailForm(target);
  }else if(target==="email"){
    keep_form = self.emailForm;
    form_id = self.emailForm.id;
    datafield_numb=2;
    clearUsernameEmailForm(target);
  }else if(target==="birthdate"){
    keep_form = self.birthdateForm;
    form_id = self.birthdateForm.id;
    datafield_numb=3;
    clearBirthdateForm();
  }else if(target==="gender"){
    keep_form = self.genderForm;
    form_id = self.genderForm.id;
    datafield_numb=4;
    clearGenderForm();
  }else if(target==="password"){
    keep_form = self.passwordForm;
    form_id = self.passwordForm.id;
    clearPasswordForm();
  }
  if (action==="edit") {
    displayElement(keep_form);
    closeAllOtherForms(form_id, self.forms, closeOneForm);
    cardButtonHandler('profile', target, 'open', 3);
    if(datafield_numb>0 && datafield_numb<5){
      hideElement(self.dataFields[datafield_numb]);
    }
  }else if (action==="cancel") {
    closeOneForm(target, datafield_numb);
  }
};
//clear username or email form
const clearUsernameEmailForm = (target) => {
  const labels = document.querySelectorAll(`.${target}_label`);
  const fields = document.querySelectorAll(`.${target}_input`);
  clearAppForm(labels, fields);
};
//clear gender form
const clearGenderForm = (selectedGender = self.userInfo.gender) => {
  const labels = document.querySelectorAll('.gender_label');
  hideElement(labels[0]);
  document.querySelector('input[value="'+selectedGender+'"]').checked=true;
};
//clear birthdate form
const clearBirthdateForm = (birthdate = self.userInfo.birthdate) =>{
  const userBirthdate = birthdate.split("-").reverse().join("/");
  const dayPickerInput = document.getElementById('datepickerInput');
  dayPickerInput.innerHTML=userBirthdate;
  dayPickerInput.classList.remove('has_selected_datetime');
  const label = document.querySelector('[for="birthdayPick"]');
  label.innerHTML="";
  hideElement(label);
};
//clear password form
const clearPasswordForm = () => {
  const labels = document.querySelectorAll('.password_label');
  const fields = document.querySelectorAll('.password_input');
  clearAppForm(labels, fields);
  fields[0].type = "text";
  fields[1].type = "text";
  fields[2].type = "text";
  passwordVisibilityHandler(fields[0], document.getElementById('view_passcur'));
  passwordVisibilityHandler(fields[1], document.getElementById('view_passnew'));
  passwordVisibilityHandler(fields[2], document.getElementById('view_passconf'));
};
//close form and display properly data and buttons
const closeOneForm = (id) => {
  const form_id = 'form_'+id;
  let form = document.getElementById(form_id);
  hideElement(form);
  cardButtonHandler('profile', id, 'close', 3);
  let datafield_numb=0;
  if(id==="username"){
    datafield_numb=1;
    clearUsernameEmailForm(id);
  }else if(id==="email"){
    datafield_numb=2;
    clearUsernameEmailForm(id);
  }else if(id==="birthdate"){
    datafield_numb=3;
    clearBirthdateForm();
  }else if(id==="gender"){
    datafield_numb=4;
    clearGenderForm();
  }else if(id==="password"){
    datafield_numb=5;
    clearPasswordForm();
  }
  if(datafield_numb>0 && datafield_numb<5){
    displayElement(self.dataFields[datafield_numb]);
  }
};
//reset change password form
const resetClearForm = (event) => {
  event.preventDefault();
  clearPasswordForm();
};
//display update message
const renderUpdateMessage = (fieldname, dataFieldPosition) => {
  const update_message = document.createElement('p');
  update_message.setAttribute('id', `update_msg_${fieldname}`);
  update_message.classList.add("update_profile_msg");
  update_message.innerHTML = `Updating your ${fieldname}...`;
  if(dataFieldPosition<5){
    self.dataFields[dataFieldPosition].remove();
    self.infoHeaders[dataFieldPosition-1].append(update_message);
  }else{
    return update_message;
  }
};
//remove update message
const removeUpdateMessage = (fieldname, previousHTML, position) => {
  document.getElementById(`update_msg_${fieldname}`).remove();
  self.infoHeaders[position].append(previousHTML);
};
