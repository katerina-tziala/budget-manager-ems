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
