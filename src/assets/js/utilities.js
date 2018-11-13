"use strict";
//display element
const displayElement = (element) => {
  element.classList.remove("hidden");
};
//hide element
const hideElement = (element) => {
  element.classList.add("hidden");
};
//prepare main page to display view
const prepareMain = (mode="hide", main = self.main) => {
  if (mode==="hide" && main.childNodes.length>0) {
    for (let i = 0; i < main.childNodes.length; i++) {
      let node = main.childNodes[i];
      if (node.nodeName === "#text" || node.nodeType === 3) {
        main.removeChild(node);
      }
    }
    for (let i = 0; i < main.childNodes.length; i++) {
      let node = main.childNodes[i];
      if (node.nodeName != "#text" || node.nodeType != 3) {
        hideElement(node);
      }
    }
  }else if (mode==="clear"  && main.childNodes.length>0) {
    main.innerHTML = '';
  }
};
//set tabindex of multiple elements:
const setTabIndex = (elements, value, start=0) => {
  for (let i = start; i < elements.length; i++) {
    elements[i].setAttribute('tabindex',value);
  }
};
//get page from url
const getPageFromUrl = () => {
  const url = window.location.href;
  let page = "null";
  if (url===domain || url===domain.substr(0,domain.length-1)) {
    page = "index";
  }else{
    page = url.split(domain).pop();
    page = page.split(".html")[0];
  }
  return page;
};
//get parameter from url
const getParameterByName = (name) => {
  const url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`),
    results = regex.exec(url);
  if (!results || !results[2]){
    return "null";
  }else{
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
  }
};
//decode HTML entities
const decodeEntities = (encodedString) => {
  let textArea = document.createElement('textarea');
  textArea.innerHTML = encodedString;
  return textArea.value;
};
//get date parts - day, month, year
const getDateParts = (date) => {
  let d = new Date(date),
      day = (d.getDate()<10?'0':'') + d.getDate(),
      month = (d.getMonth()+1<10?'0':'') + (d.getMonth()+1),
      year = d.getFullYear();
  const dateparts = [day, month, year];
  return dateparts;
};
//get month name
const getMonthName = (datestring) =>{
  let date = new Date(datestring).toString();
  const monthName = date.split(" ")[1];
  return monthName;
};
//get day name
const getDayName = (datestring) =>{
  let date = new Date(datestring).toString();
  const dayName = date.split(" ")[0];
  return dayName;
};
//get picker dates
const getPickerDates = (initday, pastday, futureday) => {
  let pickerDates = [];
  pickerDates["today"] = new Date(initday);
  pickerDates["past"] = new Date(pastday);
  pickerDates["future"] = new Date(futureday);
  return pickerDates;
};
//get a specific date based on another date
const getSpecificDate = (initday, day_diff) => {
  const datetime = new Date(initday).getTime();
  const onedaytime = (1 * 24 * 60 * 60 * 1000);
  const desired_time = day_diff * onedaytime;
  let desired_date = new Date(datetime + desired_time);
  const date_parts = getDateParts(desired_date);
  desired_date = date_parts[2]+"-"+date_parts[1]+"-"+date_parts[0];
  return desired_date;
};
//get now time
const getNowTime = () => {
  let date = new Date(),
      hours = (date.getHours()<10?'0':'') + date.getHours(),
      minutes = (date.getMinutes()<10?'0':'') + (date.getMinutes());
  return hours+":"+ minutes;
};
//get all days
const getAllDays = (startDay, endDay) => {
  let alldays = [];
  let startDayTime = new Date(startDay).getTime();
  const endDayTime = new Date(endDay).getTime();
  const onedaytime = (1 * 24 * 60 * 60 * 1000);
  let next_daytime = startDayTime;
  while (next_daytime <= endDayTime) {
    let desired_date = new Date(next_daytime);
    let date_parts = getDateParts(desired_date);
    desired_date = date_parts[2]+"-"+date_parts[1]+"-"+date_parts[0];
    alldays[alldays.length] = desired_date;
    next_daytime = next_daytime + onedaytime;
  }
  return alldays;
};
//function to get the desired decimal format
const getDecimalFormat = (value) => {
  return Number(Math.round(value+'e'+2)+'e-'+2);
};
//function to get the desired decimal format for display
const getDisplayFormat = (value) => {
  return getDecimalFormat(value).toFixed(2);
};
//function to capitalize the first letter of a string
const capitalizeFirstLetter=(string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
};
//load javascript file
const loadScript = (path, callback)=>{
  const script = document.createElement("script")
  script.type = "application/javascript";
  script.src = path;
  if (script.readyState){  //IE
    script.onreadystatechange = () => {
      if (script.readyState == "loaded" || script.readyState == "complete"){
        script.onreadystatechange = null;
        callback();
      }
    };
  } else {//Others
    script.onload = () => {
      callback();
    };
  }
  document.body.appendChild(script);
};
//load css file
const loadStyle = (path, callback)=>{
  const css = document.createElement("link")
  css.type = "text/css";
  css.rel = "stylesheet";
  css.href = path;
  if (css.readyState){  //IE
    css.onreadystatechange = () => {
      if (css.readyState == "loaded" || css.readyState == "complete"){
        css.onreadystatechange = null;
        callback();
      }
    };
  } else {//Others
    css.onload = () => {
      callback();
    };
  }
  document.head.appendChild(css);
};
//generate notification message
const messageGenerator = (params) => {
  let message;
  if (params.message_type==='unverified_account') {
    message = `<b>Your account is not active!</b><br/>`;
    message = message+`<span>Follow the instructions in the <i>"Account Activation"</i> email we sent you, and don't forget to check your spam emails too!</span>`;
    message = message+`<span><b>Notice: </b>You have to activate your account to be able to use this app!</span>`;
    message = message+`<span class='contact_indicator'>If you face any issues in activating your account, please contact us immediately!</span>`;
  }
  else if (params.message_type==='noaccount') {
    message = `<b>We couldn't find ${params.message_part}`;
    message = message+`<span>If you are a member ensure that you gave us the right username and the right email!</span>`;
    message = message+`<span>If you are not a member yet Sign Up now!</span>`;
  }else if(params.message_type==='else_error'){
    message = `<b>This is embarassing!</b><br/>`;
    message = message+`<span>An unexpected error occurred and we couldn't ${params.error_part}</span>`;
    message = message+`<span>Sorry for the inconvenience!</span><span>Please try again!</span>`;
    message = message+`<span class='contact_indicator'>If you keep facing this issue, please contact us as soon as possible!</span>`;
  } else if (params.initiator==='contact' || params.initiator==='passforgot') {
   if (params.initiator==='contact' && params.message_type==='success') {
      message = `<b>We got your message!</b><br/>`;
      message = message+`<span>We will get back to you as soon as possible!</span>`;
      message = message+`<span class='usermail_indicator'>Under the condition that your email is valid!</span>`;
    }
    else if (params.initiator==='passforgot' && params.message_type==='success') {
       message = `<b>You have a new e-mail!</b><br/>`;
       message = message+`<span>We sent you an email at: <span class='emailcont'>`;
       message = message+params.user_email;
       message = message+`</span></span>`;
       message = message+`<span>Follow the instructions in your email to reset your password.</span>`;
    }
  } else if (params.initiator==='passreset') {
   if (params.message_type==='success') {
     message = `<b>Your password was successfully changed!</b><br/>`;
     message = message+`<span>You can now sign in with your new password!</span>`;
     message = message+`<span>We also sent you a confirmation email.</span>`;
    }
    else if (params.message_type==='success_no_email') {
      message = `<b>Your password was successfully changed!</b><br/>`;
      message = message+`<span>You can now sign in with your new password!</span>`;
      message = message+`<span>However, an unexpected error occurred and we couldn't send you a confirmation email.</span>`;
     }
     else if (params.message_type==='success') {
       message = `<b>Your password was successfully changed!</b><br/>`;
       message = message+`<span>You can now sign in with your new password!</span>`;
       message = message+`<span>We also sent you a confirmation email.</span>`;
      }
  } else if (params.initiator==='signup') {
   if (params.message_type==='success') {
     message = `<b>You were successfully Signed Up!</b><br/>`;
     message = message+`<span>In order to activate your account and start using the app, follow the instructions in the email we sent you!</span>`;
     message = message+`<span class='contact_indicator'>Don't forget to check your spam folder too!</span>`;
    } else if (params.message_type==='success_no_email') {
      message = `<b>Your password was successfully changed!</b><br/>`;
      message = message+`<span>You can now sign in with your new password!</span>`;
      message = message+`<span>However, an unexpected error occurred and we couldn't send you a confirmation email.</span>`;
     } else if (params.message_type==='saved_no_ver_email') {
       message = `<b>Account created, but...</b><br/>`;
       message = message+`<span>An unexpected error occurred and we couldn't send you an <i>"Account Activation"</i> email!</span>`;
       message = message+`<span>Please contact us to activate your account!</span>`;
      }
  }else if ((params.initiator==='email' || params.initiator==='emails') && params.message_type==='saved_no_ver_email') {
    message = `<b>Your `+params.message_part+` changed successfully, but...!</b><br/>`;
    message = message+`<span>An unexpected error occurred and we couldn't send you an <i>"Account Activation"</i> email!</span>`;
    message = message+`<span>Please contact us to activate your account!</span>`;
  }else if (params.message_type==='signout_error') {
    message = `<b>Your `+params.message_part+` changed successfully, however...!</b><br/>`;
    message = message+`<span>An unexpected error occurred and we couldn't sign you out!</span>`;
    message = message+`<span>You can continue using the app!</span>`;
  }else if (params.initiator==='addexpense' && params.message_type==='success') {
    message = `<b>Hoorayyyyy!</b><br/>`;
    message = message+`<span>Your expense was successfully added!</span>`;
    message = message+`<span>View your expenses or keep adding more!</span>`;
  } else if (params.message_type==='overlapping_budget') {
    message = `<b>Ooooooooooooops!</b><br/>`;
    message = message+`<span>Your starting date already exists in a previous week!</span>`;
    message = message+`<span>Your weekly budget MUST start from another day!</span>`;
  }else if (params.message_type==='goals_more') {
    message = `<b>Ooooooooooooops!</b><br/>`;
    message = message+`<span>You are not allowed to set your budget to this amount!</span>`;
    message = message+`<span>The total amount of your goals is more than your budget! Update your goals first and then reset your budget.</span>`;
  }else if (params.message_type==='budget_less') {
    message = `<b>Ooooooooooooops!</b><br/>`;
    message = message+`<span>You are not allowed to do this!</span>`;
    message = message+`<span>Make sure that the total amount of your budget goals is less than or equal to your weekly budget!</span>`;
  } else if (params.message_type==='goal_setted') {
    message = `<b>Ooooooooooooops!</b><br/>`;
    message = message+`<span>You have already setted this budget goal!</span>`;
    message = message+`<span>You cannot set a budget goal twice!</span>`;
  }
  return message;
};
//load icons for categories
const loadCategoryIcons = (category_icons) => {
  for (let i = 0; i < category_icons.length; i++) {
    if (category_icons[i].classList.contains("icon_bar")) {
      category_icons[i].classList.add("fas","fa-coffee");
    }else if (category_icons[i].classList.contains("icon_bills")) {
      category_icons[i].classList.add("fas","fa-file-invoice");
    } else if (category_icons[i].classList.contains("icon_clothing")) {
      category_icons[i].classList.add("fas","fa-tshirt");
    }else if (category_icons[i].classList.contains("icon_communication")) {
      category_icons[i].classList.add("fas","fa-phone-volume");
    }else if (category_icons[i].classList.contains("icon_donations")) {
      category_icons[i].classList.add("fas","fa-hand-holding-heart");
    }else if (category_icons[i].classList.contains("icon_education")) {
      category_icons[i].classList.add("fas","fa-graduation-cap");
    }else if (category_icons[i].classList.contains("icon_entertainment")) {
      category_icons[i].classList.add("fas","fa-star");
    }else if (category_icons[i].classList.contains("icon_gifts")) {
      category_icons[i].classList.add("fas","fa-gift");
    }else if (category_icons[i].classList.contains("icon_health")) {
      category_icons[i].classList.add("fas","fa-medkit");
    }else if (category_icons[i].classList.contains("icon_housing")) {
      category_icons[i].classList.add("fas","fa-home");
    }else if (category_icons[i].classList.contains("icon_investments")) {
      category_icons[i].classList.add("fas","fa-hand-holding-usd");
    }else if (category_icons[i].classList.contains("icon_restaurant")) {
      category_icons[i].classList.add("fas","fa-utensils");
    }else if (category_icons[i].classList.contains("icon_sports")) {
      category_icons[i].classList.add("fas","fa-heartbeat");
    }else if (category_icons[i].classList.contains("icon_supermarket")) {
      category_icons[i].classList.add("fas","fa-shopping-cart");
    }else if (category_icons[i].classList.contains("icon_technology")) {
      category_icons[i].classList.add("fas","fa-laptop");
    }else if (category_icons[i].classList.contains("icon_transportation")) {
      category_icons[i].classList.add("fas","fa-bus-alt");
    }else if (category_icons[i].classList.contains("icon_traveling")) {
      category_icons[i].classList.add("fas","fa-luggage-cart");
    }else if (category_icons[i].classList.contains("icon_vehicle")) {
      category_icons[i].classList.add("fas","fa-drum-steelpan");
    }else if (category_icons[i].classList.contains("icon_miscellaneous")) {
      category_icons[i].classList.add("fas","fa-box-open");
    }else if(!category_icons[i].classList.contains("icon_cosmetics")){
      category_icons[i].classList.add("icon_ettiquete", "fas","fa-tags");
    }
  }
};
/*
* FUNCTIONS FOR FORMS
*/
//view password
const viewPassword = (event) => {
  event.preventDefault();
  const button = event.target;
  button.focus();
  button.blur();
  const target_id = button.id.split("_").pop();
  const field = document.getElementById(target_id);
  passwordVisibilityHandler(field, button);
}
//manage visibility of password field
const passwordVisibilityHandler = (field, button) => {
  if (field.type === "password") {
    field.type = "text";
    button.classList.remove("fa-eye");
    button.classList.add("fa-eye-slash");
  }else{
    field.type = "password";
    button.classList.remove("fa-eye-slash");
    button.classList.add("fa-eye");
  }
};
//reset fields and labels
const clearAppForm = (labels, formFields) => {
  for (let i = 0; i < labels.length; i++) {
    hideElement(labels[i]);
    labels[i].innerHTML = "";
  }
  for (let i = 0; i < formFields.length; i++) {
    formFields[i].value="";
    formFields[i].blur();
  }
};
//close all other forms
const closeAllOtherForms = (keepid, forms, pageFormsHandler) => {
  for (let i = 0; i<forms.length; i++) {
    if(forms[i].id!=keepid){
      let id = forms[i].id.split("_").pop();
      pageFormsHandler(id);
    }
  }
};
//display buttons properly in each card
const cardButtonHandler = (cardname, id, mode, button_numb=4) => {
  const editBtn = document.getElementById(`edit_${cardname}_${id}`);
  const cancelBtn = document.getElementById(`cancel_${cardname}_${id}`);
  const saveBtn = document.getElementById(`save_${cardname}_${id}`);
  if(button_numb===4){
    const deleteBtn = document.getElementById(`delete_${cardname}_${id}`);
    if(mode==='open'){
      hideElement(editBtn);
      hideElement(deleteBtn);
      displayElement(cancelBtn);
      displayElement(saveBtn);
    }else{
      hideElement(cancelBtn);
      hideElement(saveBtn);
      displayElement(editBtn);
      displayElement(deleteBtn);
    }
  }else if (button_numb===3) {
    if(mode==='open'){
      hideElement(editBtn);
      displayElement(cancelBtn);
      displayElement(saveBtn);
    }else{
      hideElement(cancelBtn);
      hideElement(saveBtn);
      displayElement(editBtn);
    }
  }
};
//show message when sending email
const showSendingLoader = () => {
  showLoader()
  const loader_image = document.getElementById('loader_image');
  hideElement(loader_image);
  const sendImage = document.createElement('div');
  sendImage.setAttribute('id', 'sendEmailImage');
  const sendText = document.createElement('p');
  sendText.setAttribute('id', 'sendEmailText');
  sendText.innerHTML = `Sending your email....<br><span>Please wait.</span><span>This might take a while!<span>`
  self.loader.insertBefore(sendImage, self.loader.childNodes[0]);
  self.loader.insertBefore(sendText, self.loader.childNodes[1]);
};
//hide message when sending email
const hideSendingLoader = () => {
  document.getElementById('sendEmailImage').remove();
  document.getElementById('sendEmailText').remove();
  hideLoader();
};
/*
* DATE & TIME PICKERS
*/
//initiallize date picker
const initDatePickerCalendar = (selfCalendar, dayPicker, pickerDates, dayPickerInput) => {
  selfCalendar = new mdDateTimePicker.default({
    type: 'date',
    init : moment(pickerDates["today"]),
    past : moment(pickerDates["past"]),
    future : moment(pickerDates["future"]),
    orientation: 'PORTRAIT'
  });
  dayPickerInput.setAttribute('readonly', true);
  const left = document.getElementById('mddtp-date__left');
  const right = document.getElementById('mddtp-date__right');
  left.innerHTML='<';
  right.innerHTML='>';
  //open on click
  dayPicker.addEventListener('click', (event) => {
      selfCalendar.show();
      displayElement(self.opacity_layer);
    });
  //open on keydown
  dayPicker.addEventListener('keydown', (event) => {
      if(event.keyCode===13){
        selfCalendar.show();
        displayElement(self.opacity_layer);
        //TODO: fix tab navigation when datepicker is open
        //and when enter second time
        //document.getElementById('mddtp-picker__date').setAttribute('tabindex', 0);
        //document.getElementById('mddtp-picker__date').focus();
      }
    });
  //set selected date into input
  selfCalendar.trigger = dayPicker;
  document.getElementById(dayPicker.id).addEventListener('onOk', () => {
    const selectedDate = selfCalendar.time.toString();
    const dateparts = getDateParts(selectedDate);
    dayPickerInput.innerHTML = dateparts[0]+"/"+dateparts[1]+"/"+dateparts[2];
    dayPickerInput.classList.add('has_selected_datetime');
    hideElement(self.opacity_layer);
  });
  //close on click outside of the calendar
  document.addEventListener('click', (event) => {
    if(event.target.id==='opacity_layer'){
      selfCalendar.hide();
      hideElement(self.opacity_layer);
    }
    if(event.target.id==='mddtp-date__cancel'){
      hideElement(self.opacity_layer);
    }
  });
};
//initialize time picker
const initTimePicker = (timePicker, timePickerInput, startTime) => {
  timePickerInput.innerHTML = startTime;
  timePicker.addEventListener('click',(event) => {
    Timepicker.showPicker({
      time: startTime,
      onSubmit: (time) => {
        timePickerInput.innerHTML = (time.hours<10?'0':'') + time.hours +":"+ (time.minutes<10?'0':'') + time.minutes;
        timePickerInput.classList.add("has_selected_datetime");
      },
      onClose: () => document.body.removeChild(document.getElementById(clockId)),
        headerBackground: "#009933",
        headerColor: "#cddbe4",
        headerSelected: "#ffffff",
        wrapperBackground: "#f4fffd",
        footerBackground: "#f4fffd",
        submitColor: "#009933",
        cancelColor: "#009933",
        clockBackground: "#cccccc",
        clockItemColor: "#0d0d0d",
        clockItemInnerColor: "#0d0d0d",
        handColor: "#009933"
      })
    });
    document.addEventListener('click',(event) => {
      if(event.target.id==="grudus-clock"){
        document.getElementById("grudus-clock").remove();
        Timepicker="";
      }
    });
};
/*
* FORM VALIDATIONS
*/
//validate password field
const passwordValidation = (field, error, field_checker='') => {
  const pattern = new RegExp(`^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?!.*[\`\"\']).{4,}$`);
  if(field ===''){
    error.innerHTML='This field is required!';
    displayElement(error);
    return false;
  } else if(!pattern.test(field)){
    error.innerHTML=`Minimum 4 characters, at least 1 uppercase alphabet, 1 lowercase alphabet and 1 number! No spaces or any quotation marks!`;
    displayElement(error);
    return false;
  } else if(field_checker!='' && field!=field_checker){
    error.innerHTML=`Passwords don't match!`;
    displayElement(error);
    return false;
  } else {
    error.innerHTML= "";
    hideElement(error);
    return true;
  }
};
//validate password field when signing in
const passwordValidationSignIn = (field, error) => {
  if(field ===''){
    error.innerHTML='This field is required!';
    displayElement(error);
    return false;
  }else if(field.replace(/\s+/, "") === ''){
    error.innerHTML='Only spaces are NOT allowed!';
    displayElement(error);
    return false;
  }  else if(field.length<4){
    error.innerHTML=`At least 4 characters are required!`;
    displayElement(error);
    return false;
  }
  else {
    error.innerHTML= "";
    hideElement(error);
    return true;
  }
};
//required text validation
const credentialValidation = (field, error) => {
  const pattern = new RegExp("^(?=.*[a-zA-Z\u0080-\u024F]{2,})(?=.*[0-9]{0,})(?=.*[._&-']{0,}).{0,}$");
  if(field ===''){
    error.innerHTML='This field is required!';
    displayElement(error);
    return false;
  } else if(field.replace(/\s+/, "") === ''){
    error.innerHTML='Only spaces are NOT allowed!';
    displayElement(error);
    return false;
  } else if(!pattern.test(field)){
    error.innerHTML='Only latin characters <i>(at least two)</i>, and NOT ONLY numbers and/or special characters!';
    displayElement(error);
    return false;
  }else if (field.length<4) {
    error.innerHTML='At least four characters are required!';
    displayElement(error);
    return false;
  }else {
    error.innerHTML= "";
    hideElement(error);
    return true;
  }
};
//required text validation
const requiredTextInputValidation = (field, error, field_checker='', msg='') => {
  const pattern = new RegExp("^(?=.*[a-zA-Z\u0080-\u024F]{2,})(?=.*[0-9]{0,})(?=.*[._&-']{0,}).{0,}$");
  if(field ===''){
    error.innerHTML='This field is required!';
    displayElement(error);
    return false;
  } else if(field.replace(/\s+/, "") === ''){
    error.innerHTML='Only spaces are NOT allowed!';
    displayElement(error);
    return false;
  } else if(!pattern.test(field)){
    error.innerHTML='Only latin characters <i>(at least two)</i>, and NOT ONLY numbers and/or special characters!';
    displayElement(error);
    return false;
  }  else if (field.length<2) {
    error.innerHTML='Only latin characters <i>(at least two)</i>, and NOT ONLY numbers and/or special characters!';
    displayElement(error);
    return false;
  } else if(field_checker!='' && field===field_checker){
    error.innerHTML=msg;
    displayElement(error);
    return false;
  }else {
    error.innerHTML= "";
    hideElement(error);
    return true;
  }
};
//validate email field
const emailValidation = (field, error, field_checker='') => {
  const pattern = new RegExp("^[0-9a-zA-Z\.]+@[0-9a-zA-Z]+[\.]{1}[0-9a-zA-Z]+[\.]?[0-9a-zA-Z]+$");
  if(field ===''){
    error.innerHTML='This field is required!';
    displayElement(error);
    return false;
  } else if(!pattern.test(field)){
    error.innerHTML='Enter a valid email address!';
    displayElement(error);
    return false;
  }else if(field_checker!='' && field!=field_checker){
    error.innerHTML=`Emails don't match!`;
    displayElement(error);
    return false;
  } else {
    error.innerHTML= "";
    hideElement(error);
    return true;
  }
};
//optional text validation
const optionalTextInputValidation = (field, error) => {
  const pattern = new RegExp("^(?=.*[a-zA-Z\u0080-\u024F]{1,})(?=.*[0-9]{0,})(?=.*[._&-']{0,}).{0,}$");
  if(field ===''){
    error.innerHTML='';
    hideElement(error);
    return true;
  } else if(field.replace(/\s+/, "") === ''){
    error.innerHTML='Only spaces are NOT allowed!';
    displayElement(error);
    return false;
  } else if(!pattern.test(field)){
    error.innerHTML='Only latin characters <i>(at least two)</i>, and NOT ONLY numbers and/or special characters!';
    displayElement(error);
    return false;
  } else if (field.length<2) {
    error.innerHTML='Only latin characters <i>(at least two)</i>, and NOT ONLY numbers and/or special characters!';
    displayElement(error);
    return false;
  } else {
    error.innerHTML= "";
    hideElement(error);
    return true;
  }
};
//validate username field
const usernameValidation = (field, error, required=true) => {
  const pattern = new RegExp("^(?=.*[a-zA-Z\u0080-\u024F]{4,})(?=.*[0-9]{0,})(?=.*[._&-']{0,}).{0,}$");
  if(field ==='' && required===true){
    error.innerHTML='This field is required!';
    displayElement(error);
    return false;
  } else if(field.length<4){
   error.innerHTML='At least four characters are required!';
   displayElement(error);
   return false;
 }else if(!pattern.test(field) || field!=field.toLowerCase()){
    error.innerHTML=`Only <b>lowercase</b> latin characters <i>(at least four)</i>, and NOT ONLY numbers and/or special characters!`;
    displayElement(error);
    return false;
  }else {
    error.innerHTML= "";
    hideElement(error);
    return true;
  }
};
//date validation
const dateValidation = (field, error, field_checker) => {
  if(field === field_checker){
    error.innerHTML='This field is required!';
    displayElement(error);
    return false;
  }else{
    error.innerHTML='';
    hideElement(error);
    return true;
  }
};
//instant amount validation
const amountValidation = (fieldvalue, field, error) => {
  const pattern = new RegExp(`^([0-9]{1,})$|^([0-9]*[\.]{1}[0-9]{0,2})$`);
  if(fieldvalue ===''){
    error.innerHTML='This field is required!';
    displayElement(error);
    return false;
  } else if(fieldvalue.replace(/\s+/, "") === ''){
    field.value="";
    error.innerHTML = "Only spaces are NOT allowed!";
    displayElement(error);
    return false;
  }else if (pattern.test(fieldvalue)) {
    if (fieldvalue.length>16) {
      field.value="";
      error.innerHTML = "At most 16 digits are allowed (or 15 and a dot)!";
      displayElement(error);
      return false;
    }else if (parseFloat(fieldvalue)===0) {
      error.innerHTML = "Amount of 0.00&euro; is not allowed!";
      displayElement(error);
      return false;
    }else{
      error.innerHTML= "";
      hideElement(error);
      return true;
    }
  } else{
    field.value="";
    error.innerHTML = "Enter a valid integer or decimal in form 0.00!";
    displayElement(error);
    return false;
  }
};
//amount validation
const simpleAmountValidation = (fieldvalue, error) => {
  const pattern = new RegExp(`^([0-9]{1,})$|^([0-9]*[\.]{1}[0-9]{0,2})$`);
  if(fieldvalue ===''){
    error.innerHTML='This field is required!';
    displayElement(error);
    return false;
  }  else if(fieldvalue.replace(/\s+/, "") === ''){
    error.innerHTML = "Only spaces are NOT allowed!";
    displayElement(error);
    return false;
  }else if (pattern.test(fieldvalue)) {
    if (fieldvalue.length>16) {
      error.innerHTML = "At most 16 digits are allowed (or 15 and a dot)!";
      displayElement(error);
      return false;
    }else if (parseFloat(fieldvalue)===0) {
      error.innerHTML = "Amount of 0.00&euro; is not allowed!";
      displayElement(error);
      return false;
    }else{
      error.innerHTML= "";
      hideElement(error);
      return true;
    }
  } else{
    error.innerHTML = "Enter a valid integer or decimal in form 0.00!";
    displayElement(error);
    return false;
  }
};
//validate location field
const locationValidation = (field, error) => {
  const pattern = new RegExp("^[a-zA-Z\u0080-\u024F]+(?:([\ \-\']|(\.\ ))[a-zA-Z\u0080-\u024F]+)*$");
  if(field!=''){
    if(field.replace(/\s+/, "") === ''){
      error.innerHTML='Only spaces are NOT allowed!';
      displayElement(error);
      return false;
    }else if(!pattern.test(field)){
      error.innerHTML='Enter a valid location!';
      displayElement(error);
      return false;
    } else {
      error.innerHTML='';
      hideElement(error);
      return true;
    }
  }else{
    return true;
  }
};
//optional text validation
const optionalAdvancedTextInputValidation = (field, error) => {
  const pattern = new RegExp("^(?=.*[a-zA-Z\u0080-\u024F]{1,})(?=.*[0-9]{0,})(?=.*[._&-']{0,}).{0,}$");
  if(field ==='' || field.replace(/\s+/, "") === ''){
    error.innerHTML= "";
    hideElement(error);
    return true;
  } else if(!pattern.test(field)){
    error.innerHTML='Only latin characters <i>(at least two)</i>, and NOT ONLY numbers and/or special characters!';
    displayElement(error);
    return false;
  } else if (field.length<2) {
    error.innerHTML='Only latin characters <i>(at least two)</i>, and NOT ONLY numbers and/or special characters!';
    displayElement(error);
    return false;
  } else {
    error.innerHTML= "";
    hideElement(error);
    return true;
  }
};
//validate location field
const optionalLocationValidation = (field, error) => {
  const pattern = new RegExp("^[a-zA-Z\u0080-\u024F]+(?:([\ \-\']|(\.\ ))[a-zA-Z\u0080-\u024F]+)*$");
  if(field ===''){
    error.innerHTML='';
    hideElement(error);
    return true;
  } else if(field.replace(/\s+/, "") === ''){
    error.innerHTML='';
    hideElement(error);
    return true;
  }else if(!pattern.test(field)){
    error.innerHTML='Enter a valid location!';
    displayElement(error);
    return false;
  } else {
    error.innerHTML='';
    hideElement(error);
    return true;
  }
};
