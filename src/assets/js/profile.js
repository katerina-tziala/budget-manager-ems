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
const initProfileView = (data) =>{
  self.personalInfo = data;
  createProfileHTMLContent();
  initPage();
};
//create view
const createProfileHTMLContent = (data = self.personalInfo,  main = self.main) => {
  let registration_date = data.registration_date.split(" ")[0];
  const reg_date_parts = registration_date.split("-");
  const month = getMonthName(registration_date);
  const day = getDayName(registration_date);
  registration_date = day+", "+reg_date_parts[2]+" "+month+" "+reg_date_parts[0];
  const container = document.createElement('div');
  container.setAttribute('id', 'personalCard');
  container.classList.add('personalCard', 'hidden');
  const card_header_section = createCardHeader(data.gender, registration_date);
  const infocontainer = document.createElement('div');
  infocontainer.setAttribute('id', 'infocontainer');
  const username_section = createCardSection("username", data.username);
  const email_section = createCardSection("email", data.email);
  const birthdate_section = createCardSection("birthdate", data.birthdate);
  const gender_section = createCardSection("gender", data.gender);
  infocontainer.append(username_section, email_section, birthdate_section, gender_section);
  const editpass_txt = `<i id='btn_icon_password' class='fas fa-lock'></i><span id='pass_txt_password' class='pass_txt'>change password</span>`;
  const editpass_btn = createButton('edit_profile_password', editpass_txt, 'change password', toggleForm);
  editpass_btn.classList.add("app_btn", "editBtn", "centeredFlexbox");
  const password_form = createPasswordForm();
  container.append(card_header_section, infocontainer, editpass_btn, password_form);
  main.append(container);
};
//create basic info in the card
const createCardHeader = (gender, memberdate, main = self.main) => {
  const container = document.createElement('div');
  container.setAttribute('id', 'personalCard_header');
  container.className = "centeredFlexbox";
  const personalCardIcon = document.createElement('div');
  personalCardIcon.setAttribute('id', 'personalCardIcon');
  personalCardIcon.classList.add("personalCardIcon", `cardIcon_${gender}`);
  const personalCard_header_info = document.createElement('div');
  personalCard_header_info.setAttribute('id', 'personalCard_header_info');
  const info_title = document.createElement('p');
  info_title.classList.add('info_title', 'info_title_member');
  info_title.innerHTML = "member since:";
  const info_data = document.createElement('p');
  info_data.classList.add('info_data', 'info_data_member');
  info_data.innerHTML = memberdate;
  personalCard_header_info.append(info_title, info_data);
  container.append(personalCardIcon, personalCard_header_info);
  return container;
};
//create username section in the card
const createCardSection = (section_name, data) => {
  const container = document.createElement('div');
  container.className = "personalInfo";
  const info_header = document.createElement('p');
  info_header.className = "info_header";
  const info_title = document.createElement('span');
  info_title.className = "info_title";
  info_title.innerHTML = section_name;
  const info_data = document.createElement('span');
  info_data.className = "info_data";
  info_data.innerHTML = data;
  info_header.append(info_title, info_data);
  const edit_button = createEditButton('profile', section_name, toggleForm);
  edit_button.classList.add("editBtn", "editProfileBtn");
  edit_button.setAttribute("aria-label", "edit "+section_name);
  const form = document.createElement('form');
  form.setAttribute('id', `form_${section_name}`);
  form.classList.add('profileForm', 'hidden');
  if (section_name==="username") {
    createUsernameForm(form, data);
  }else if (section_name==="email") {
    createEmailForm(form, data);
  }else if (section_name==="birthdate") {
    info_data.innerHTML =  data.split("-").reverse().join("/");
    createBirthdayForm(form, data);
  }else if (section_name==="gender") {
    createGenderForm(form);
  }
  const cancel_button = createCancelButton('profile', section_name, toggleForm);
  cancel_button.classList.add("editBtn", "cancelProfileBtn", "hidden");
  cancel_button.setAttribute("aria-label", `close ${section_name} form`);
  const save_button = createSaveButton('profile', section_name, updateHandler);
  save_button.classList.add("editBtn", "saveProfileBtn", "hidden");
  save_button.setAttribute("aria-label", "save "+section_name);
  container.append(info_header, edit_button, form, cancel_button, save_button);
  return container;
};
//create username form
const createUsernameForm = (form, username) => {
  const inpt = createInput('text', username, 'enter new username', 'new_username');
  inpt.classList.add('profileInput', 'username_input');
  const lbl = createLabel('new_username');
  lbl.classList.add('username_label');
  const form_note = document.createElement('p');
  form_note.classList.add('centeredFlexbox', 'form_note');
  form_note.innerHTML = `<i class='fas fa-exclamation-triangle'></i><span>After updating your username you will be automatically signed out!</span>`;
  form.append(inpt, lbl, form_note);
};
//create email form
const createEmailForm = (form, useremail) => {
  const inpt = createInput('text', useremail, 'enter new email', 'new_email');
  inpt.classList.add('profileInput', 'email_input');
  const lbl = createLabel('new_email');
  lbl.classList.add('email_label');
  const form_note = document.createElement('p');
  form_note.classList.add('centeredFlexbox', 'form_note');
  form_note.innerHTML = `<i class='fas fa-exclamation-triangle'></i><span>After updating your email you will be automatically signed out!</span>`;
  form.append(inpt, lbl, form_note);
};
//create birthday form
const createBirthdayForm = (form, birthday) => {
  form.classList.add('birthdayForm');
  const picker = document.createElement('div');
  picker.classList.add("pickerContainer");
  picker.setAttribute('id', 'birthdayPick');
  picker.setAttribute('tabindex', 0);
  picker.setAttribute('aria-label', 'date picker');
  const pickerinp = document.createElement('span');
  pickerinp.classList.add("profileInput");
  pickerinp.setAttribute('id', 'datepickerInput');
  pickerinp.setAttribute('aria', 'enter your birthday');
  pickerinp.setAttribute('name', 'birthday');
  pickerinp.innerHTML = birthday.split("-").reverse().join("/");
  const pickercalendar = document.createElement('i');
  pickercalendar.classList.add("calendar", "fas", "fa-calendar-alt");
  picker.append(pickerinp, pickercalendar);
  const lbl = createLabel('birthdayPick');
  lbl.classList.add('birth_label');
  form.append(picker, lbl);
};
//create gender form
const createGenderForm = (form) => {
  const gender_section = document.createElement('div');
  gender_section.setAttribute('id', 'gender_section');
  const gender_tag = document.createElement('span');
  gender_tag.setAttribute('id', 'gender_tag');
  gender_tag.innerHTML = "Gender: ";
  const maleinpt = createRadioInput('genderlabel', 'male', 'gender', 'male', 'genderlabel', true);
  const femaleinpt = createRadioInput('genderlabel', 'female', 'gender', 'female', 'genderlabel', false);
  const gender_lbl = document.createElement('span');
  gender_lbl.classList.add("errorLabel", "hidden", "gender_label");
  gender_section.append(maleinpt, femaleinpt, gender_lbl);
  form.append(gender_section);
};
//create change password form
const createPasswordForm = () => {
  const form = document.createElement('form');
  form.setAttribute('id', 'form_password');
  form.classList.add('profileForm', 'hidden');
  const cancel_button = createCancelButton('profile', 'password', toggleForm);
  cancel_button.classList.add("editBtn", "cancelProfileBtn");
  cancel_button.setAttribute("aria-label", "close password form");
  const form_tag = document.createElement('p');
  form_tag.className = "form_password_tag";
  form_tag.innerHTML = 'change password';
  const currentpassinpt = createPasswordInput('passcur', 'Current Password', 'enter current password', 'passcur', 'password_input', 'view_passcur');
  const curr_label = createLabel('passcur');
  curr_label.classList.add("password_label");
  const passnew = createPasswordInput('passnew', 'New Password', 'enter new password', 'passnew', 'password_input', 'view_passnew');
  const passnew_label = createLabel('passnew');
  passnew_label.classList.add("password_label");
  const passconf = createPasswordInput('passconf', 'Confirm New Password', 'enter new password again', 'passconf', 'password_input', 'view_passconf');
  const passconf_label = createLabel('passconf');
  passconf_label.classList.add("password_label");
  const buttonWrapper = document.createElement('div');
  buttonWrapper.className = "btnWrapper";
  const resetBtn = createButton('resetBtn', 'clear form', 'reset form', resetClearForm);
  resetBtn.classList.add('formBtn', 'change_pass_btn');
  const sendBtn = createButton('save_profile_password', 'change password', 'save password', changePassword);
  sendBtn.classList.add('formBtn', 'change_pass_btn');
  buttonWrapper.append(resetBtn, sendBtn);
  const form_note = document.createElement('p');
  form_note.classList.add('centeredFlexbox', 'form_note');
  form_note.innerHTML = `<i class='fas fa-exclamation-triangle'></i><span>After updating your password you will be automatically signed out!</span>`;
  form.append(cancel_button, form_tag, currentpassinpt, curr_label, passnew, passnew_label,passconf,passconf_label, buttonWrapper);
  return form;
};
//manage how elements display, add categories html
const initPage = (data = self.personalInfo) => {
  document.querySelector('input[value="'+data.gender+'"]').checked=true;
  initBirthDatePicker(data.birthdate.split("-").reverse().join("/"));
  if (data.has_current_budget==="no") {
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
      if (inputname==='passcur') {
        label = document.querySelector('[for='+`${inputname}`+']');
        passwordValidation(inputvalue, label);
      }
      else if(inputname==='passnew'){
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
  hideLoader();
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
    clearUsernameForm();
  }else if(target==="email"){
    keep_form = self.emailForm;
    form_id = self.emailForm.id;
    datafield_numb=2;
    clearEmailForm();
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
//clear username form
const clearUsernameForm = () => {
  const labels = document.querySelectorAll('.username_label');
  const fields = document.querySelectorAll('.username_input');
  clearAppForm(labels, fields);
}
//clear email form
const clearEmailForm = () => {
  const labels = document.querySelectorAll('.email_label');
  const fields = document.querySelectorAll('.email_input');
  clearAppForm(labels, fields);
}
//clear gender form
const clearGenderForm = (selectedGender = self.personalInfo.gender) => {
  const labels = document.querySelectorAll('.gender_label');
  hideElement(labels[0]);
  document.querySelector('input[value="'+selectedGender+'"]').checked=true;
}
//clear birthdate form
const clearBirthdateForm = (birthdate = self.personalInfo.birthdate) =>{
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
  form.reset();
  cardButtonHandler('profile', id, 'close', 3);
  let datafield_numb=0;
  if(id==="username"){
    datafield_numb=1;
  }else if(id==="email"){
    datafield_numb=2;
  }else if(id==="birthdate"){
    datafield_numb=3;
  }else if(id==="gender"){
    datafield_numb=4;
  }else if(id==="password"){
    datafield_numb=5;
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
//handle update
const updateHandler = (event) =>{
  event.preventDefault();
  const target = event.target.id.split("_").pop();
  if (target==="gender") {
    updateGender();
  }else if (target==="email") {
    updateEmail();
  }else if (target==="birthdate") {
    updateBirthdate();
  }else if (target==="username") {
    updateUsername();
  }
};
//update gender
const updateGender = () =>{
  const gender = document.querySelector('input[name="gender"]:checked').value;
  const labels = document.querySelectorAll('.gender_label');
  const data = {
    "field_value": gender.toString().toLowerCase(),
    "update_field": "gender",
    "request_type": "update_gender"
  };
  if(self.dataFields[4].innerHTML===gender){
    closeOneForm('gender', 4);
  }else{
    const target = event.target.id.split("_").pop();
    const previousHTML = self.dataFields[4];
    closeOneForm('gender', 4);
    renderUpdateMessage(target, 4);
    sendData('updateGenderBirthday', data).then((response)=>{
      if(response.message==="invalid_request"){
        invalidRequestHandler(data);
      }else{
        if(response.message==="current"){
          labels[0].innerHTML="This is your current gender!";
          displayElement(labels[0]);
        }else{
          if(response.message==="success"){
            self.dataFields[4].innerHTML=gender;
            document.getElementById('personalCardIcon').className=`cardIcon_${gender}`;
          }else{
            const toast_options = {
              "message": messageGenerator({initiator:"gender", message_type:"else_error", error_part:"change your gender"}),
              "type": "fadeout",
              "timer": 10000,
              "buttonsmode": "got_it",
              "container_classes":["show_toast"]
            };
            showToaster(toast_options);
          }
          removeUpdateMessage(target, previousHTML, 3);
          self.personalInfo.gender=gender;
          document.querySelector('input[value="'+self.personalInfo.gender+'"]').checked=true;
          displayElement(self.dataFields[4]);
          closeOneForm('gender', 4);
        }
      }
    });
  }
};
//update birthdate
const updateBirthdate = () => {
  const label = document.querySelector('[for="birthdayPick"]');
  const dayPickerInput = document.getElementById('datepickerInput');
  const birthdate = dayPickerInput.innerHTML;
  const current_birthdate = self.dataFields[3].innerHTML;
  if(current_birthdate===birthdate){
    closeOneForm('birthdate', 3);
  }else{
    const target = event.target.id.split("_").pop();
    const previousHTML = self.dataFields[3];
    hideElement(self.genderForm);
    renderUpdateMessage(target, 3);
    closeOneForm('birthdate', 3);
    const sending_birthday = birthdate.split("/").reverse().join("-");
    const data = {
      "field_value": sending_birthday.toString(),
      "update_field": "birthdate",
      "request_type": "update_birthdate"
    };
    sendData('updateGenderBirthday', data).then((response)=>{
      if(response.message==="invalid_request"){
        invalidRequestHandler(data);
      }else{
        if(response.message==="success"){
          self.personalInfo.birthdate = data.field_value;
        }else{
          const toast_options = {
            "message": messageGenerator({initiator:"birthdate", message_type:"else_error", error_part:"change your birthdate"}),
            "type": "fadeout",
            "timer": 10000,
            "buttonsmode": "got_it",
            "container_classes":["show_toast"]
          };
          showToaster(toast_options);
        }
        self.dataFields[3].innerHTML=birthdate;
        removeUpdateMessage(target, previousHTML, 2);
        displayElement(self.dataFields[3]);
        closeOneForm('birthdate', 3);
      }
    });
  }
};
//update username
const updateUsername = () => {
  const fields = document.querySelectorAll('.username_input');
  const labels = document.querySelectorAll('.username_label');
  let username = fields[0].value;
  const current_username = decodeEntities(self.dataFields[1].innerHTML);
  if(username.toString() === ''){
    username = current_username;
  }
  const valid_username = usernameValidation(username, labels[0], false);
  if(username===current_username){
    displayElement(fields[0]);
    closeOneForm('username', 1);
  }else if(valid_username===true){
    const target = event.target.id.split("_").pop();
    const previousHTML = self.dataFields[1];
    hideElement(fields[0]);
    hideElement(labels[0]);
    renderUpdateMessage(target, 1);
    const data = {
      "username": decodeEntities(username).toString(),
      "request_type": "update_username"
    };
    sendData('updateUsername', data).then((response)=>{
      if(response.message==="invalid_request"){
        invalidRequestHandler(data);
      }else{
        removeUpdateMessage(target, previousHTML, 0);
        if(response.message==="this_username"){
          displayElement(fields[0]);
          closeOneForm('username', 1);
        } else if(response.message==="username_exists"){
          displayElement(fields[0]);
          labels[0].innerHTML="This username is taken! Try another one.";
          displayElement(labels[0]);
          hideElement(self.dataFields[1])
          displayElement(self.usernameForm);
        }else if(response.message==="success"){
          redirectUser(pages.index.url);
        }else{
          const toast_options = {
            "message": "",
            "type": "fadeout",
            "timer": 9000,
            "buttonsmode": "got_it",
            "container_classes":["show_toast"]
          };
          if(response.message==="signout_error"){
            toast_options.message = messageGenerator({initiator:"username", message_type:"signout_error", message_part:"username"});
            self.dataFields[1].innerHTML=username;
            fields[0].placeholder=username;
            fields[0].value="";
          }else{
            toast_options.message = messageGenerator({initiator:"username", message_type:"else_error", error_part:"change your username"});
          }
          displayElement(fields[0]);
          displayElement(self.dataFields[1]);
          closeOneForm('username', 1);
          showToaster(toast_options);
        }
      }
    });
  }};
//change password
const changePassword = (event, form = self.passwordForm) => {
  event.preventDefault();
  const labels = document.querySelectorAll('.password_label');
  const fields = document.querySelectorAll('.password_input');
  const user_pass = fields[0].value;
  const new_pass = fields[1].value;
  const conf_new_pass = fields[2].value;
  const valid_pass = passwordValidation(new_pass, labels[0]);
  const valid_new_pass = passwordValidation(new_pass, labels[1]);
  const valid_conf_pass = passwordValidation(conf_new_pass, labels[2], new_pass);
  if(valid_pass===true && valid_new_pass===true && valid_conf_pass===true){
    const target = event.target.id.split("_").pop();
    let formElements = form.childNodes;
    const previousHTML = form.innerHTML;
    const passDivs = document.querySelectorAll('.password_container');
    for (let i = 0; i < passDivs.length; i++) {
      let node = passDivs[i];
      hideElement(node);
    }
    for (let i = 0; i < formElements.length; i++) {
      let node = formElements[i];
      if (node.nodeName === "#text") {
        node.remove();
      }
    }
    formElements = form.childNodes;
    const btn_Wrapper = document.querySelectorAll('.btnWrapper')[0];
    hideElement(btn_Wrapper);
    const referenceNode = document.querySelectorAll('.form_note')[0];
    const cancelButton = document.getElementById('cancel_profile_password');
    hideElement(cancelButton);
    const updateMessage = renderUpdateMessage(target, 6);
    form.insertBefore(updateMessage, formElements[2]);
    const data = {
      "password": user_pass.toString(),
      "new_password": new_pass.toString(),
      "request_type":"update_password"
    };
    sendData('updatePassword', data).then((response)=>{
      document.getElementById(`update_msg_${target}`).remove();
      displayElement(cancelButton);
      for (let i = 0; i < formElements.length; i++) {
        if(!formElements[i].classList.contains("errorLabel")){
          displayElement(formElements[i]);
        }
      }
      if(response.message==="invalid_request"){
        invalidRequestHandler(data);
      }else{
        if(response.message==="wrong_password"){
          labels[0].innerHTML="Wrong password!";
          displayElement(labels[0]);
        } else if(response.message==="current_password"){
          labels[1].innerHTML="This is your current password!";
          displayElement(labels[1]);
        }else if(response.message==="success"){
          redirectUser(pages.index.url);
        }else{
          const toast_options = {
            "message": "",
            "type": "fadeout",
            "timer": 9000,
            "buttonsmode": "got_it",
            "container_classes":["show_toast"]
          };
          if(response.message==="signout_error"){
            toast_options.message = messageGenerator({initiator:"password", message_type:"signout_error", message_part:"password"});
          }
          else{
            toast_options.message = messageGenerator({initiator:"password", message_type:"else_error", error_part:"change your password"});
          }
          closeOneForm('password', 4);
          clearPasswordForm();
          showToaster(toast_options);
        }
      }
    });
  }
};
//update email
const updateEmail = (personalInfo = self.personalInfo) => {
  const labels = document.querySelectorAll('.email_label');
  const fields = document.querySelectorAll('.email_input');
  let new_email = fields[0].value;
  const current_email = personalInfo.email;
  if(new_email.toString() === ''){
    new_email = current_email;
  }
  const valid_email = emailValidation(new_email, labels[0]);
  if(new_email===current_email){
    displayElement(fields[0]);
    closeOneForm('email', 1);
  }else if(valid_email===true){
    const target = event.target.id.split("_").pop();
    const previousHTML = self.dataFields[2];
    hideElement(fields[0]);
    hideElement(labels[0]);
    renderUpdateMessage("email", 2);
    closeOneForm("email", 1);
    const data = {
      "apphost": domain,
      "email": new_email.toString(),
      "request_type":"update_email"
     };
    sendData('updateEmail', data).then((response)=>{
      removeUpdateMessage(target, previousHTML, 1);
      if(response.message==="invalid_request"){
        invalidRequestHandler(data);
      }else{
        if(response.message==="current_email"){
          labels[0].innerHTML="This is your current email!";
          displayElement(labels[0]);
          displayElement(fields[0]);
          displayElement(self.emailForm);
          cardButtonHandler('profile', target, 'open', 3);
          hideElement(self.dataFields[2]);
        } else if(response.message==="email_exists"){
          labels[0].innerHTML="There is already an account for this email!";
          displayElement(labels[0]);
          displayElement(fields[0]);
          cardButtonHandler('profile', target, 'open', 3);
          displayElement(self.emailForm);
          hideElement(self.dataFields[2]);
        }else if(response.message==="success"){
          redirectUser(pages.index.url);
        }else{
          const toast_options = {
            "message": "",
            "type": "fadeout",
            "timer": 9000,
            "buttonsmode": "got_it",
            "container_classes":["show_toast"]
          };
          if(response.message==="saved_no_ver_email"){
            fields[0].placeholder = data.email;
            self.dataFields[2].innerHTML = data.email;
            self.personalInfo.email = data.email;
            toast_options.message = messageGenerator({initiator:"email", message_type:"saved_no_ver_email", message_part:"email"});
            toast_options.buttonsmode="got_it_signout";
            toast_options.type="keep_open";
            toast_options.timer=0;
         } else if(response.message==="signout_error"){
           toast_options.message = messageGenerator({initiator:"email", message_type:"signout_error", message_part:"email"});
           fields[0].placeholder = data.email;
           self.dataFields[2].innerHTML = data.email;
           self.personalInfo.email = data.email;
         }else{
          toast_options.message = messageGenerator({initiator:"email", message_type:"else_error", error_part:"change your email"});
         }
         displayElement(fields[0]);
         closeOneForm('email', 1);
         clearAppForm(labels, fields);
         showToaster(toast_options);
        }
      }
    });
  }
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
