/*
*  NAVIGATION MENU
*/
//display menu:
const displayMenu = (event, menu = self.menu) => {
  event.preventDefault();
  menu.classList.add("displayMenu");
  self.closeMenuBtn.setAttribute('tabindex','0');
  self.closeMenuBtn.focus();
  setTabIndex(self.menulinks, 0, 1);
  menu.addEventListener('keydown', trapMenuKeys);
  displayElement(self.opacity_layer);
};
//close menu:
const closeMenu = (event) => {
  event.preventDefault();
  closeMenuHandler();
  setTabIndex(self.menulinks, -1, 1);
};
//close menu when clicking the button, outside menu card and when pressing the 'esc' button:
const closeMenuHandler = (menu = self.menu) => {
  menu.classList.remove("displayMenu");
  hideElement(self.opacity_layer);
  self.closeMenuBtn.setAttribute('tabindex','-1');
  self.menuBtn.focus();
};
//trap navigaton inside the menu card:
const trapMenuKeys = (event)=> {
  const focusableElements = self.menulinks;
  const firstTabStop = focusableElements[0];
  const lastTabStop = focusableElements[focusableElements.length - 1];
  // Check for TAB key press
  if (event.keyCode === 9) {
    // SHIFT + TAB
    if (event.shiftKey) {
      if (document.activeElement === firstTabStop) {
        event.preventDefault();
        lastTabStop.focus();
      }
    // TAB
    } else {
      if (document.activeElement === lastTabStop) {
        event.preventDefault();
        firstTabStop.focus();
      }
    }
  }
  // ESCAPE
  if (event.keyCode === 27) {
    closeMenuHandler();
    setTabIndex(focusableElements, -1, 1);
  }
  if (event.keyCode === 13) {
    return;
  }
};
//unfocus the close button when mouse is over lis:
const changeCloseButton = (event) => {
  self.closeMenuBtn.blur();
};
//style navigation menu
const styleNavMenu = (position, menulinks = self.menulinks) => {
  menulinks[position].classList.add("active");
};
//create navigation menu
const createNavigationMenu = (parentNode=self.header) => {
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
/*
*  NAVIGATION LINKS
*/
const createNavigationLinks = (links, main = self.main) =>{
  const linksWrapper = document.createElement('div');
  linksWrapper.className = "btnWrapper";
  if (links.includes("signin")) {
    linksWrapper.append(createSignInLink());
  }
  if (links.includes("signup")) {
    linksWrapper.append(createSignUpLink());
  }
  if (links.includes("contact")) {
    linksWrapper.append(createContactLink());
  }
  main.append(linksWrapper);
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
