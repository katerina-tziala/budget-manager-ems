"use strict";
const domain="APP_DOMAIN";
const app_scope="APP_SCOPE";
const data_url = domain+"models/dataManager.php?action=";
const cssfolder = domain+"assets/css/";
const jsfolder = domain+"assets/js/";
let page_title, menuBtn, menu, closeMenuBtn, opacity_layer, header, main, loader, toaster, notification_msg, footerlinks, toasterButtonsContainer;
let userInfo = [];
let NewWorker = "";
//run javascript when files are loaded
document.addEventListener('DOMContentLoaded', (event) => {
  const host = window.location.hostname;
  const url = window.location.href;
  if (host!='localhost') {
    const http = url.split(":")[0];
    const restlink = url.split(":")[1];
    if (http==="http") {
      const applink = http+"s:"+restlink;
      window.location.replace(applink);
      window.location=applink;
      window.location.href=applink;
    }
  }
  if (url===domain || url===domain.substr(0,domain.length-1)) {
      redirectUser(pages.index.url);
  }else{
    registerServiceWorker();
    basicAppElementSelector();
    showLoader();
    initApp();
  }
});
//function to redirect user
const redirectUser = (url) => {
  setTimeout(() =>{
    window.location.replace(url);
    window.location=url;
    window.location.href=url;
  },500);
};
//refresh app - force reload from server
const refreshApp = (event) => {
  window.location.reload(true);
};
//basic element seletor
const basicAppElementSelector = () => {
  self.menuBtn=null;
  self.menu=null;
  self.closeMenuBtn=null;
  self.page_title = document.getElementById('app_title');
  self.opacity_layer = document.getElementById('opacity_layer');
  self.header = document.getElementById('header');
  self.main = document.getElementById('main');
  self.loader = document.getElementById('loader_container');
  self.toaster = document.getElementById('toaster');
  self.notification_msg = document.getElementById('toast_msg');
  let footer = document.getElementById('footer');
  self.footerlinks = footer.getElementsByTagName("A");
  self.toasterButtonsContainer = document.getElementById('notification_btns');
};
//initialize app
const initApp = () => {
  const url_page = getPageFromUrl();
  const redirectToHome = ["signup", "account_activation", "forgot_password", "reset_password"];
  const redirectToIndex = ["profile", "categories", "add_expense", "my_expenses", "expense_details", "budget_and_goals"];
  self.page_title.innerHTML = pages[url_page].view_title;
  fetchData('getPersonalInfo', (error, results) => {
    if (error) { // Got an error!
      hideLoader();
      showErrorView();
      console.error(error);
    } else {
      self.userInfo = results;
      self.userInfo.signed_in = self.userInfo.signed_in===0?false:true;
      self.userInfo.feedback = self.userInfo.feedback===1?'affective gifs':'regular';
      if (self.userInfo.signed_in) {
        let homeRedirect = false;
        homeRedirect = redirectToHome.includes(url_page);
        if (homeRedirect===true) {
          redirectUser(pages.index.url);
        }else{
          pages[url_page].initFunction();
        }
      }else{
        let indexRedirect = false;
        indexRedirect = redirectToIndex.includes(url_page);
        if (indexRedirect===true) {
          redirectUser(pages.index.url);
        }else{
          pages[url_page].initFunction();
        }
      }
    }
  });
};
//register service worker
const registerServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    // Register the service worker
    navigator.serviceWorker.register('ServiceWorker.js', {scope: self.app_scope}).then(reg => {
      if (!navigator.serviceWorker.controller) {
        return;
      }
      if (reg.waiting) {
        updateReady(reg.waiting);
        return;
      }
      if (reg.installing) {
        trackInstalling(reg.installing);
        return;
      }
      reg.addEventListener('updatefound', () =>{
        trackInstalling(reg.installing);
      });
    }).catch((error) => {
        console.log('Oh No! Service Worker registration failed! Error: ' + error);
      });
  } else {
    console.log('Nooooooooo! Service Workers are not supported!');
  }
};
//Track service worker installation
const trackInstalling = (worker) => {
  worker.addEventListener('statechange', () => {
    if(worker.state == 'installed'){
      updateReady(worker);
    }
  });
};
//When upadate is ready, then display toaster
const updateReady = (worker) => {
  const toast_options = {
    "message": "A new version of this app is available!",
    "type": "keep_open",
    "timer": 0,
    "buttonsmode": "worker_update_btns",
    "container_classes":["show_toast", "worker_toast"],
    "worker":worker
  };
  setTimeout(() =>{showToaster(toast_options);},1500);
};
//dismiss update of service worker
const dismissSWorker = (event) => {
  hideToaster();
};
//handle invalid request
const invalidRequestHandler = (data) => {
  window.location.reload(true);
  redirectUser(pages.index.url);
};
//close menu on click outside the menu
document.addEventListener('click', (event) => {
  if(event.target.id==='opacity_layer'){
    if (self.menu!=null && self.closeMenuBtn!=null && self.menuBtn!=null) {
      closeMenuHandler();
    }
  }
});
/**
** Save user's changes when online.
**/
window.addEventListener('online',(event)=>{
  hideToaster();
  const toast_options = {
    "message": `<b>You are back online!</b><br>Connection was successfully re-established!`,
    "type": "fadeout",
    "timer": 5000,
    "buttonsmode": "got_it",
    "container_classes":["show_toast"]
  };
  showToaster(toast_options);
});
/**
** Notify user's when offline.
**/
window.addEventListener('offline',(event)=>{
  event.preventDefault();
  hideToaster();
  self.toaster.classList.remove("on_off_requests");
  const toast_options = {
    "message": `Unable to connect! Retrying...<br>`,
    "type": "fadeout",
    "timer": 20000,
    "buttonsmode": "got_it",
    "container_classes":["show_toast"]
  };
  showToaster(toast_options);
});
//show loader
const showLoader = (main = self.main, loader = self.loader) => {
  prepareMain();
  const spinner = document.getElementById('spinner');
  spinner.classList.add("spin");
  const loader_image = document.getElementById('loader_image');
  loader_image.className = "loader_image";
  loader_image.classList.add("hidden");
  displayElement(loader);
};
//hide loader
const hideLoader = (main = self.main) => {
  for (let i = 0; i < main.childNodes.length; i++) {
    let node = main.childNodes[i];
    displayElement(node);
  }
  const spinner = document.getElementById('spinner');
  spinner.classList.remove("spin");
  hideElement(self.loader);
};
//show eror view
const showErrorView = (error_view=createErrorView(), main = self.main) => {
  prepareMain();
  main.insertBefore(error_view, main.childNodes[0]);
};
/*
*  SIGN OUT
*/
//sign out handler
const signOutHandler=()=>{
  self.signOutBtn = document.getElementById('btn_logout');
  self.signOutBtn.addEventListener("keyup", (event) => {
    event.preventDefault();
    if (event.keyCode === 13) {
      signOut();
    }
  });
  self.signOutBtn.addEventListener("click", (event) => {
    event.preventDefault();
    signOut();
  });
};
//sign user out
const signOut=()=>{
  const data = {
    "action": "sign out"
  };
  sendData("signUserOut", data).then((response)=>{
    if(response.message==="signout"){
      redirectUser(pages.index.url);
    }else{
      const toast_options = {
        "message": "",
        "type": "keep_open",
        "timer": 0,
        "buttonsmode": "got_it",
        "container_classes":["show_toast"]
      };
      let message = '';
      message = `<b>This is embarassing!</b><br/>An unexpected error occurred and we couldn't sign you out! Please try again!`;
      message = message+`<br/>If you keep facing this issue, please contact us immediately!`;
      toast_options.message = message;
      showToaster(toast_options);
    }
  });
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
