"use strict";
//create button
const createButton = (id, text, aria, functionName) => {
 const button = document.createElement('button');
 button.innerHTML = text;
 button.setAttribute('id', id);
 button.setAttribute('aria-label', aria);
 button.addEventListener('click', functionName);
 button.type="button";
 return button;
};
//create link button
const createLinkButton = (id, text, aria, href) => {
 const buttonLink = document.createElement('a');
 buttonLink.innerHTML = text;
 buttonLink.setAttribute('id', id);
 buttonLink.setAttribute('role', 'button');
 buttonLink.setAttribute('aria-label', aria);
 buttonLink.href = href;
 return buttonLink;
};
//create input element
const createInput = (type, placeholder, aria, name, id=0) => {
  const input = document.createElement('input');
  input.type = type;
  input.placeholder = placeholder;
  input.setAttribute("aria-label", aria);
  input.classList.add("formInputs");
  input.name=name;
  input.setAttribute("autocomplete", "off");
  if(id!=0){
    input.setAttribute("id", id);
  }
  return input;
};
//create label
const createLabel = (inputname) => {
  const label = document.createElement('label');
  label.classList.add("errorLabel","hidden");
  label.setAttribute("for", inputname);
  return label;
};
//create password input element
const createPasswordInput = (id, placeholder, aria, name, inputclass, btnid) => {
  const div = document.createElement('div');
  div.classList.add('password_container');
  const input = createInput('password', placeholder, aria, name, id);
  input.classList.add(inputclass);
  const button = createButton(btnid, '', 'view password', viewPassword);
  button.classList.add('btn_viewpass','fas','fa-eye');
  div.append(input, button);
  return div;
};
//create radio input
const createRadioInput = (labelclass, labeltext, name, radiovalue, radioclass, ischecked) => {
  const label_wrapper = document.createElement('label');
  label_wrapper.classList.add(labelclass);
  label_wrapper.setAttribute("tabindex", 0);
  const labeltag = document.createElement('span');
  labeltag.innerHTML = labeltext;
  const input = document.createElement('input');
  input.type = 'radio';
  input.value = radiovalue;
  input.classList.add(radioclass);
  input.setAttribute("tabindex", -1);
  input.name=name;
  input.checked=ischecked;
  const checkmark = document.createElement('span');
  checkmark.classList.add('checkmark');
  label_wrapper.append(labeltext, input, checkmark);
  return label_wrapper;
};
//create textarea input
const createTextareaInput = (placeholder, aria, name, id) => {
  const input = document.createElement('textarea');
  input.placeholder = placeholder;
  input.setAttribute("aria-label", aria);
  input.classList.add("formInputs");
  input.name=name;
  input.setAttribute("autocomplete", "off");
  input.setAttribute("id", id);
  return input;
};
//create terms
const createTermsList = () => {
  const terms = [
    `The <i><b>Budget Manager</b></i> application is designed and developed for personal use only, and as part of the completion of a master thesis.`,
    `By using this application you willingly participate in the aforementioned survey.`,
    `All data provided by you will be strictly used for the needs of this survey.`,
    `Data will not be shared with anyone and won't be used for any purpose that may harm you in any way.`,
    `The use of this application is completely free.`
  ];
  const terms_list = document.createElement('ul');
  terms_list.setAttribute('id', 'terms_list');
  terms_list.setAttribute('aria-label', 'terms list');
  terms_list.className = 'terms_list';
  for (let i = 0; i < terms.length; i++) {
    let term = document.createElement('li');
    term.setAttribute('role', 'listitem');
    term.innerHTML = terms[i];
    terms_list.append(term);
  }
  return terms_list;
};
//create error view
const createErrorView = () => {
  const errorContainer = document.createElement('div');
  errorContainer.classList.add('error_container');
  errorContainer.setAttribute('id', 'error_container');
  const logo = document.createElement('img');
  logo.classList.add('app_logo_error');
  logo.src = domain+'assets/img/logo/logo.svg';
  logo.setAttribute('alt','budget manager logo, wallet with money');
  const p = document.createElement('p');
  p.setAttribute('id', 'app_error');
  p.classList.add('app_error_text');
  let message = `<span>Ooooooooops!</span>`;
  message = message+`<span>It seems that an error occurred!</span>`;
  message = message+`<span>Check your internet connection and refresh the app!</span>`;
  message = message+`<span class='linkerror'>Don't forget to check the url of the page!</span>`;
  p.innerHTML = message;
  errorContainer.append(logo, p);
  return errorContainer;
};
