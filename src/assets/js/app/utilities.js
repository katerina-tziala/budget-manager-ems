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
//get days formats for filters
const getDaysFormat = (days) => {
  let formedDays = [];
  for (let i = 0; i < days.length; i++) {
    formedDays[formedDays.length] = days[i].split("-").reverse().join("/");
  }
  return formedDays;
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
