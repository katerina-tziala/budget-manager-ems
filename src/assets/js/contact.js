"use strict";
window.addEventListener('keydown', (event)=>{
  if(event.keyIdentifier=='U+000A' || event.keyIdentifier=='Enter' || event.keyCode==13){
    if(event.target.nodeName=='INPUT' || event.target.nodeName=='TEXTAREA'){
      sendContactEmail(event);
    }
  }
});
//initialize contact view
const renderContact = () =>{
  prepareMain("clear");
  createContactHTMLContent(userInfo);
  if (userInfo.signed_in) {
    createNavMenu();
    styleNavMenu(7);
    if (!self.userInfo.has_current_budget) {
      showBudgetNotification();
    }
    const email_input = document.getElementById('user_email');
    email_input.placeholder = userInfo.email;
  }else{
    const linksWrapper = document.createElement('div');
    linksWrapper.className = "btnWrapper";
    linksWrapper.append(createSignInLink(), createSignUpLink());
    main.append(linksWrapper);
  }
  hideLoader();
};
/*
* ACTIONS & BEHAVIOR
*/
//send contact email
const sendContactEmail = (event) => {
  event.preventDefault();
  const labels = document.querySelectorAll('.contact_label');
  const formFields = document.querySelectorAll('.contanct_inputs');
  const fullname = formFields[0].value.trim();
  let email = formFields[1].value.trim();
  const subject = formFields[2].value.trim();
  const message = formFields[3].value.trim();
  const email_placeholder = formFields[1].placeholder.trim();
  if (email_placeholder!='* Email') {//for the logged user take the predefined email
    email = email_placeholder;
  }
  const valid_fullname = requiredTextInputValidation(fullname, labels[0]);
  const valid_email = emailValidation(email, labels[1]);
  const valid_subject = optionalTextInputValidation(subject, labels[2]);
  const valid_message = requiredTextInputValidation(message, labels[3]);
  if(valid_fullname===true && valid_email===true && valid_message===true && valid_subject===true){
    const data = {
      "fullname": fullname.toString(),
      "email": email.toString(),
      "subject": subject.toString(),
      "message": message.toString(),
      "request_type": "contactmail"
    };
    showSendingLoader();
    hideElement(document.getElementById('contact_form'));
    clearContactForm(labels, formFields);
    sendData('sendContactEmail', data).then((response)=>{
      if(response.message==="invalid_request"){
        invalidRequestHandler(data);
      }else{
        const toast_options = {
          "message": "",
          "type": "fadeout",
          "timer": 5000,
          "buttonsmode": "got_it",
          "container_classes":["show_toast"]
        };
       let timer=0;
       if (response.message==="success") {
         toast_options.message = messageGenerator({initiator:"contact", message_type:response.message});
       }else{
         toast_options.message = messageGenerator({initiator:"contact", message_type:"else_error", error_part:"send your message"});
         toast_options.timer=9000;
       }
       hideSendingLoader();
       displayElement(document.getElementById('contact_form'));
       showToaster(toast_options);
      }
   });
  }
};
//reset contact form
const resetClearForm = (event) => {
  event.preventDefault();
  const labels = document.querySelectorAll('.contact_label');
  const formFields = document.querySelectorAll('.contanct_inputs');
  clearContactForm(labels, formFields);
};
//clear contact form
const clearContactForm = (labels, formFields) => {
  event.preventDefault();
  clearAppForm(labels, formFields);
};
/*
* CREATE HTML FOR CONTACT INTERFACE
*/
//create categories view - (different views for authorized and unauthorized user)
const createContactHTMLContent = (userInfo, main = self.main) => {
  const h3_a = document.createElement('h3');
  h3_a.innerHTML = `<i class='fas fa-hand-point-right'></i>Got any suggestions or want to give us feedback?`;
  const p_a = document.createElement('p');
  p_a.innerHTML = "Email us to provide better quality services!";
  const h3_b = document.createElement('h3');
  h3_b.innerHTML = `<i class='fas fa-hand-point-right'></i>Got any questions or facing any problems?`;
  const p_b = document.createElement('p');
  p_b.innerHTML = "Email us to help you!";
  const p_c = document.createElement('p');
  p_c.innerHTML = `Contact us at <i class='app_mail'>budgetmanager.ems@gmail.com</i> or fill in the form below, and we'll get back to you within 24 hours!`;
  const contactForm = document.createElement('form');
  contactForm.setAttribute('id', 'contact_form');
  contactForm.classList.add('centeredFlexbox', 'form_style');
  const form_tag = document.createElement('p');
  form_tag.className = "form_tag";
  form_tag.innerHTML = `Send us an email<br><i>Fields with an asterisk (*) are required!</i>`;
  const inputsContainer = document.createElement('div');
  inputsContainer.className = 'contactInputContainer';
  const name_inpt = createInput('text', '* Full Name', 'enter your full name', 'fullname');
  name_inpt.classList.add('contanct_inputs');
  const name_lbl = createLabel('fullname');
  name_lbl.classList.add('contact_label');
  const email_inpt = createInput('text', '* Email', 'enter your email', 'user_email', 'user_email');
  email_inpt.classList.add('contanct_inputs');
  const email_lbl = createLabel('user_email');
  email_lbl.classList.add('contact_label');
  const subject_inpt = createInput('text', 'Subject', 'enter the subject of the email', 'subject');
  subject_inpt.classList.add('contanct_inputs');
  const subject_lbl = createLabel('subject');
  subject_lbl.classList.add('contact_label');
  inputsContainer.append(name_inpt, name_lbl, email_inpt, email_lbl, subject_inpt, subject_lbl);
  const textContainer = document.createElement('div');
  textContainer.className = 'contactInputContainer';
  const textInput = createTextareaInput('* Write your message here', 'write your message here', 'message', 'message');
  textInput.classList.add('contanct_inputs');
  const textLabel = createLabel('message');
  textLabel.classList.add('contact_label');
  textContainer.append(textInput, textLabel);
  const resetBtn = createButton('resetBtn', 'clear form', 'reset contact form', resetClearForm);
  resetBtn.classList.add('formBtn', 'contactBtn', 'resetBtn');
  const sendBtn = createButton('sendBtn', 'send email', 'send email', sendContactEmail);
  sendBtn.classList.add('formBtn', 'contactBtn', 'sendBtn');
  contactForm.append(form_tag, inputsContainer, textContainer, resetBtn, sendBtn);
  main.append(h3_a, p_a, h3_b, p_b, p_c, contactForm);
};
