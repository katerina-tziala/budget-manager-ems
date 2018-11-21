/*
* CREATE HTML FOR PROFILE INTERFACE
*/
//create view
const createProfileHTMLContent = (data = self.userInfo,  main = self.main) => {
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
