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
          self.userInfo.gender=gender;
          document.querySelector('input[value="'+self.userInfo.gender+'"]').checked=true;
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
          self.userInfo.birthdate = data.field_value;
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
const updateEmail = (personalInfo = self.userInfo) => {
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
            self.userInfo.email = data.email;
            toast_options.message = messageGenerator({initiator:"email", message_type:"saved_no_ver_email", message_part:"email"});
            toast_options.buttonsmode="got_it_signout";
            toast_options.type="keep_open";
            toast_options.timer=0;
         } else if(response.message==="signout_error"){
           toast_options.message = messageGenerator({initiator:"email", message_type:"signout_error", message_part:"email"});
           fields[0].placeholder = data.email;
           self.dataFields[2].innerHTML = data.email;
           self.userInfo.email = data.email;
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
