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
//create switcher
const createSwitcher = (indicator, text, aria, button_id, id=0) => {
  const switch_container = document.createElement('div');
  switch_container.classList.add('centeredFlexbox', 'switch_container');
  if (id!=0) {
    switch_container.setAttribute('id', id);
  }
  const label = createLabel(button_id);
  label.className = 'switch_label';
  label.innerHTML = text;
  const buttontext = `<span id="switch_indicator_${indicator}" class='switch_indicator unswitced' tabindex="0"></span>`;
  const button = createButton(button_id, buttontext, aria, switchOption);
   button.classList.add("switch_button", "unswitced");
   button.setAttribute('role', 'switch');
   button.setAttribute('aria-checked', 'false');
   button.setAttribute('tabindex', -1);
   switch_container.append(label, button);
   return switch_container;
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
//create contact link button
const createSignInLink = () => {
  const txt = "<i class='fas fa-sign-in-alt signin_link_icon'></i><span class='btn_link_txt'>sign in</span>";
  const buttonLink = createLinkButton('btnlink_home', txt, 'go to homepage', pages.index.url);
  buttonLink.classList.add('centeredFlexbox', 'app_btn', 'btn_link');
 return buttonLink;
};
//create sign up link button
const createSignUpLink = () => {
  const txt = "<i class='fas fa-user-plus signup_link_icon'></i><span class='btn_link_txt'>sign up</span>";
  const buttonLink = createLinkButton('btnlink_signup', txt, 'sign up', pages.signup.url);
  buttonLink.classList.add('centeredFlexbox', 'app_btn', 'btn_link');
 return buttonLink;
};
//create contact link button
const createContactLink = () => {
  const txt = "<i class='fas fa-at at_link_icon'></i><span class='btn_link_txt'>contact</span>";
  const buttonLink = createLinkButton('btnlink_contact', txt, 'contact', pages.contact.url);
  buttonLink.classList.add('centeredFlexbox', 'app_btn', 'btn_link');
  return buttonLink;
};
//create add link
const createAddLink = (btnid, btntext, aria, url) => {
  const txt = `<i class='plus_icon_add fas fa-plus'></i><span class='plus_txt_add'>${btntext}</span>`;
  const buttonLink = createLinkButton(btnid, txt, aria, url);
  buttonLink.classList.add('add_btn_link');
  return buttonLink;
};
//create button edit
const createEditButton = (cardname, id, functionName) => {
  const button = createButton(`edit_${cardname}_${id}`, '', `edit ${cardname}`, functionName);
  button.classList.add("round_btn", "editRoundBtn", "fas", "fa-pencil-alt");
  return button;
};
//create button delete
const createDeleteButton = (cardname, id, functionName) => {
  const button = createButton(`delete_${cardname}_${id}`, '', `delete ${cardname}`, functionName);
  button.classList.add("round_btn", "deleteRoundBtn", "fas", "fa-trash-alt");
  return button;
};
//create button cancel
const createCancelButton = (cardname, id, functionName) => {
  const button = createButton(`cancel_${cardname}_${id}`, '', `close ${cardname} form`, functionName);
  button.classList.add("round_btn", "cancelRoundBtn", "fas", "fa-times", "hidden");
  return button;
};
//create button save
const createSaveButton = (cardname, id, functionName) => {
  const button = createButton(`save_${cardname}_${id}`, '', `update ${cardname}`, functionName);
  button.classList.add("round_btn", "saveRoundBtn", "fas", "fa-save", "hidden");
  return button;
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
//create amount input
const createAmountInput = (aria, name, inptclass, id=0, moreclass=0) => {
  const amountContainer = document.createElement('div');
  amountContainer.classList.add('amountContainer');
  const amountinput = createInput('text', '0.0', aria, name, id);
  amountinput.classList.add('amount_inpt', inptclass);
  if (moreclass!=0) {
    amountinput.classList.add(moreclass);
  }
  const amountEuro = document.createElement('i');
  amountEuro.classList.add('amountEuro', 'fas', 'fa-euro-sign');
  amountContainer.append(amountinput, amountEuro);
  return amountContainer;
};
//create select box
const createSelectBox = (selectid, options, containerclass, tagclass, tagtext, selectclass, selectname, placeholder, labelclass) => {
  const selectContainer = document.createElement('div');
  selectContainer.className = containerclass;
  const selectBox = document.createElement('select');
  selectBox.setAttribute('id',selectid);
  selectBox.classList.add("formInputs", selectclass);
  selectBox.name = selectname;
  let selectedoption = document.createElement('option');
  selectedoption.value = placeholder;
  selectedoption.innerHTML = placeholder;
  selectBox.append(selectedoption);
  for (var i = 0; i < options.length; i++) {
    if(options[i]!=placeholder){
      let option = document.createElement('option');
      option.value = options[i];
      option.innerHTML = options[i];
      selectBox.append(option);
    }
  }
  const selectlabel = createLabel(selectname);
  selectlabel.classList.add(labelclass);
  if(tagclass!="" && tagtext!=""){
    const tag = document.createElement('span');
    tag.className = tagclass;
    tag.innerHTML = tagtext;
    selectContainer.append(tag, selectBox, selectlabel);
  }else{
    selectContainer.append(selectBox, selectlabel);
  }
  return selectContainer;
};
//initialize select box
const initSelectBox = (selectBox, placeholder) => {
  selectBox.blobSelect.init({
    "orderType":"string",
    "order":"ASC",
    "placeholder":placeholder,
    "placeholderOption":placeholder,
    "search":true});
};
//create filter select box
const createFilterSelectBox = (selectid, options, containerclass, tagclass, tagtext, selectclass, selectname, placeholder) => {
  const selectContainer = document.createElement('div');
  selectContainer.className = containerclass;
  const selectBox = document.createElement('select');
  selectBox.setAttribute('id',selectid);
  selectBox.classList.add("formInputs", selectclass);
  selectBox.value = placeholder;
  selectBox.name = selectname;
  for (let i = 0; i < options.length; i++) {
    let option = document.createElement('option');
    option.value = options[i];
    option.innerHTML = options[i];
    if(options[i]===placeholder){
      option.setAttribute('selected', 'true');
    }
    selectBox.append(option);
  }
  if(tagclass!="" && tagtext!=""){
    const tag = document.createElement('span');
    tag.className = tagclass;
    tag.innerHTML = tagtext;
    selectContainer.append(tag, selectBox);
  }else{
    selectContainer.append(selectBox);
  }
  return selectContainer;
};
//create menu link
const renderMenuLink = (href, iconClassList, link_name) => {
  const menuitem = document.createElement('li');
  menuitem.className = "menu_li";
  const link = document.createElement('a');
  link.href = href;
  link.setAttribute('tabindex', -1);
  link.classList.add('centeredFlexbox', 'menu_links');
  const spanicon = document.createElement('span');
  spanicon.classList.add('menu_icons');
  for (let i = 0; i < iconClassList.length; i++) {
    spanicon.classList.add(iconClassList[i]);
  }
  const span = document.createElement('span');
  span.classList.add('menu_txt');
  span.innerHTML = link_name;
  link.append(spanicon, span);
  menuitem.append(link);
  menuitem.addEventListener("mouseover", changeCloseButton);
  return menuitem;
};
//create navigation menu
const createNavMenu = (parentNode=self.header) => {
  const nav = document.createElement('nav');
  nav.setAttribute('id', 'nav');
  const nav_card = document.createElement('div');
  nav_card.setAttribute('id', 'nav_card');
  const close_btn = createButton('btn_closenav', '', 'close menu', closeMenu);
  close_btn.classList.add('round_btn','menu_links','fas','fa-times');
  const img = document.createElement('img');
  img.src = domain+"assets/img/logo/logomonocolor.svg";
  img.setAttribute('alt', 'budget manager logo, wallet with money');
  img.setAttribute('id', 'nav_logo');
  const h2 = document.createElement('h2');
  h2.setAttribute('id', 'nav_card_h2');
  h2.innerHTML="Budget Manager";
  nav_card.append(close_btn, img, h2);
  const menu = document.createElement('ul');
  menu.setAttribute('id', 'menu');
  menu.className = 'menu';
  const homeLink = renderMenuLink(pages.index.url, ['fas', 'fa-home'], 'home');
  const addLink = renderMenuLink(pages.add_expense.url, ['fas', 'fa-plus-circle'], 'add expense');
  const myexpensesLink = renderMenuLink(pages.my_expenses.url, ['fas', 'fa-money-bill-wave'], 'my expenses');
  const budgetgoalsLink = renderMenuLink(pages.budget_and_goals.url, ['fas', 'fa-tachometer-alt'], 'budget & goals');
  const categoriesLink = renderMenuLink(pages.categories.url, ['fas', 'fa-shapes'], 'categories');
  const profileLink = renderMenuLink(pages.profile.url, ['fas', 'fa-user-circle'], 'profile');
  const contactLink = renderMenuLink(pages.contact.url, ['fas', 'fa-at'], 'contact');
  const logoutLink = renderMenuLink('', ['fas', 'fa-sign-out-alt', 'signout_icon'], 'sign out');
  logoutLink.setAttribute('id', 'btn_logout');
  menu.append(homeLink, addLink, myexpensesLink, budgetgoalsLink, categoriesLink, profileLink, contactLink, logoutLink);
  nav.append(nav_card, menu);
  document.body.insertBefore(nav, document.body.childNodes[0]);
  const bars_btn = createButton('btn_menu', '', 'open menu', displayMenu);
  bars_btn.classList.add("round_btn","header_btn" , "fas", "fa-bars")
  const referenceNode = document.getElementById('app_title');
  referenceNode.parentNode.insertBefore(bars_btn, referenceNode);
  self.menuBtn = document.getElementById('btn_menu');
  self.menu = document.getElementById('nav');
  self.closeMenuBtn = document.getElementById('btn_closenav');
  self.menulinks = document.querySelectorAll('.menu_links');
  signOutHandler();
};
//create error view
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
