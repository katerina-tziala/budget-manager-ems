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
