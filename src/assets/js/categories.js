"use strict";
let categoryForms, addCategorySection, categoriesContainer, addbutton;
window.addEventListener('keydown', (event)=>{
  if(event.keyIdentifier=='U+000A' || event.keyIdentifier=='Enter' || event.keyCode==13){
    event.preventDefault();
    let element = event.target;
    if(element.classList.contains("inpt_add")) {
      addNewCategory(event);
    }else if (element.classList.contains("categoryInputs")) {
      updateCategory(event);
    }
  }
});
//initialize categories view
const initCategoriesView = (budgetIndicator, categories) => {
  createCategoriesHTMLContent();
  initPage(budgetIndicator, categories);
};
//create categories view
const createCategoriesHTMLContent = (main = self.main) => {
  const addtext = `<i id='plus_icon_add' class='plus_icon_add fas fa-plus'></i><span id='plus_txt_add' class='plus_txt_add'>add<br>category</span>`;
  const add_ctgr_btn = createButton('btn_category_add', addtext, 'add new category', toggleForm);
  add_ctgr_btn.classList.add('add_btn_link');
  const add_exp = createAddLink('add_expense', 'add<br>expense', 'add expense', pages.add_expense.url);
  const addSection = document.createElement('div');
  addSection.setAttribute('id', 'add_section');
  addSection.classList.add('centeredFlexbox', 'add_section');
  const form = document.createElement('form');
  form.setAttribute('id', 'form_add');
  form.classList.add("form_style", "categoryForm", "hidden");
  const input = createInput('text', 'New Category', 'enter category name','category', 'add_category_input');
  input.classList.add("formInputs", 'inpt_add');
  const label = createLabel('category');
  label.classList.add("label_add");
  const cancel_btn = createButton('cancelcategory_canceladd', '', 'close add category form', toggleForm);
  cancel_btn.classList.add('round_btn', 'editBtn', 'fas', 'fa-times', 'cancelBtn');
  const add_btn = createButton('savecategory_add', 'save category', 'save new category', addNewCategory);
  add_btn.classList.add('formBtn');
  form.append(input, label, cancel_btn,add_btn);
  addSection.append(form);
  const categoriesContainer = document.createElement('ul');
  categoriesContainer.setAttribute('id', 'categories_container');
  categoriesContainer.setAttribute('aria-label', 'categories list');
  categoriesContainer.className = 'categories_container';
  main.append(add_ctgr_btn, add_exp, addSection, categoriesContainer);
};
//manage how elements display, add categories html
const initPage = (budgetIndicator, categories) => {
  self.categoryForms = [];
  self.addCategorySection = document.getElementById('add_section');
  self.categoriesContainer = document.getElementById('categories_container');
  self.addbutton = document.getElementById('btn_category_add');
  let newCard;
  categories.forEach(category => {
    if(category.added_by!=null){//if category is added by user
      newCard = createUserCategoryCard(category);
      self.categoriesContainer.insertBefore(newCard, self.categoriesContainer.childNodes[1]);
    }else{//basic categories in database common for all users
      let categoryicon = 'icon_';
      let category_base = category.name.split(" ")[0];
      categoryicon = categoryicon+category_base;
      newCard = createBasicCategoryCard(category.name, categoryicon, category.id);
      self.categoriesContainer.append(newCard);
    }
  });
  const category_icons = document.querySelectorAll('.category_icon');
  loadCategoryIcons(category_icons);
  self.categoryForms = document.querySelectorAll('.categoryForm');
  if (budgetIndicator===false) {
    showBudgetNotification();
  }
  hideLoader();
};
//open close forms
const toggleForm = (event, allforms = self.categoryForms) => {
  event.preventDefault();
  const target = event.target.id.split("_").pop();
  if(allforms.length>1){
    if(target==="add") {//target is add category, hide button add, show form, close all other forms
      hideElement(self.addbutton);
      openCategoryForm(self.categoryForms[0], 'add');
      closeAllOtherForms(self.categoryForms[0].id, allforms, closeOneForm);
    }else if (target==="canceladd") {//target is cancel add category, display button add, hide form
      closeAddForm();
    }else {
      const action = event.target.id.split("_")[0];
      if(action==="edit") {//target is edit category, display buttons canel and save, hide buttons edit and delete
        cardButtonHandler('category', target, 'open');
        const categoryform = document.getElementById(`categoryForm_${target}`);
        //close all forms except the targeted one
        closeAllOtherForms(`categoryForm_${target}`, allforms, closeOneForm);
        //open the appropriate form
        openCategoryForm(categoryform, target);
        //hide category text
        const text_container = document.getElementById(`displayed_category_${target}`);
        hideElement(text_container);
      }else{//close one form, display buttons edit and delete, hide buttons canel and save
        cardButtonHandler('category', target, 'close');
        closeOneForm(target);
        const text_container = document.getElementById(`displayed_category_${target}`);
        displayElement(text_container);
      }
    }
  }else{//only one form available the add form
    const addform = allforms[0];
    if(target==="add") {//target is add category, hide button add, show form
      hideElement(self.addbutton);
      openCategoryForm(self.categoryForms[0], 'add');
    }else if(target==="canceladd") {//target is cancel add category, display button add, hide form
      closeAddForm();
    }
  }

};
//close one form
const closeOneForm = (id) => {
  if(id!="add"){//the selected form is not the add form, so we manage the display of the form inside the card
    const form = document.getElementById(`categoryForm_${id}`);
    hideElement(form);
    cardButtonHandler('category', id, 'close');
    const text_container = document.getElementById(`displayed_category_${id}`);
    displayElement(text_container);
  }else{
    closeAddForm();
  }
};
//close form to add category
const closeAddForm = (form = self.categoryForms[0], button = self.addbutton) => {
  hideElement(form);
  displayElement(button);
};
//open one form
const openCategoryForm = (form, classpart) => {
  const labels = document.querySelectorAll(`.label_${classpart}`);
  const fields = document.querySelectorAll(`.inpt_${classpart}`);
  clearAppForm(labels, fields);
  displayElement(form);
};
/*
* ADD, DELETE, UPDATE CATEGORIES
*/
//add category
const addNewCategory = (event) => {
  event.preventDefault();
  const labels = document.querySelectorAll(`.label_add`);
  const fields = document.querySelectorAll(`.inpt_add`);
  const category = fields[0].value.trim();
  const valid_category = requiredTextInputValidation(category, labels[0]);
  if(valid_category===true){
    const data = {
      "name" : category.toString().toLowerCase(),
      "request_type": "add_category"
    };
    sendData('addNewCategory', data).then((response)=>{
      fields[0].value="Adding Category...";
      if(response.message==="invalid_request"){
        invalidRequestHandler(data);
       }else if(response.message==="exists"){
        labels[0].innerHTML="You have already added this category!";
        displayElement(labels[0]);
        fields[0].placeholder = category;
        fields[0].value = "";
      }else{
        if(response.message==="success"){
        const parentNode =  self.categoriesContainer;
        const referenceNode = self.categoriesContainer.childNodes[0];
        const newCard = createUserCategoryCard(response.data);
        parentNode.insertBefore(newCard, referenceNode);
        const category_icons = document.querySelectorAll('.icon_ettiquete');
        loadCategoryIcons(category_icons);
        self.categoryForms = [];
        self.categoryForms = document.querySelectorAll('.categoryForm');
        }else{
          const toast_options = {
            "message": messageGenerator({initiator:"categories", message_type:"else_error", error_part:"add this category"}),
            "type": "fadeout",
            "timer": 8000,
            "buttonsmode": "got_it",
            "container_classes":["show_toast"]
          };
          showToaster(toast_options);
          fields[0].placeholder = "New Category";
          fields[0].value = "";
        }
        closeAddForm();
      }
    });
  }
};
//delete category
const deleteCategory = (event) => {
  event.preventDefault();
  const categoryID = event.target.id.split("_").pop();
  closeAllOtherForms(categoryID, self.categoryForms, closeOneForm);
  const text_container = document.getElementById(`displayed_category_${categoryID}`);
  const category_current = text_container.innerHTML;
  text_container.innerHTML="Deleting category...";
  const data = {
    "id" : parseInt(categoryID),
    "request_type": "delete_category"
  };
  sendData('deleteUserCategory', data).then((response)=>{
    if(response.message==="invalid_request"){
      invalidRequestHandler(data);
     }else if(response.message==="success"){
      document.getElementById(`categoryCard_${categoryID}`).remove();
      self.categoryForms = [];
      self.categoryForms = document.querySelectorAll('.categoryForm');
    }else {
      text_container.innerHTML=category_current;
      const toast_options = {
        "message": messageGenerator({initiator:"categories", message_type:"else_error", error_part:"delete this category"}),
        "type": "fadeout",
        "timer": 8000,
        "buttonsmode": "got_it",
        "container_classes":["show_toast"]
      };
      showToaster(toast_options);
    }
  });
};
//update a category
const updateCategory = (event) => {
  event.preventDefault();
  const categoryID = event.target.id.split("_").pop();
  const form = document.getElementById(`categoryForm_${categoryID}`);
  const category_input = document.getElementById(`category_inpt_${categoryID}`);
  const category_label = form.getElementsByTagName("LABEL")[0];
  let category = category_input.value.trim().toLowerCase();
  const current_category = category_input.placeholder.toLowerCase();
  if (category.replace(/\s+/, "") === '') {
    category = current_category;
  }
  if (category === current_category) {
    closeOneForm(categoryID);
  }else{
    const valid_edit = requiredTextInputValidation(category, category_label);
    if(valid_edit===true){
      const data = {
        "id": parseInt(categoryID),
        "name": category.toString().toLowerCase(),
        "request_type": "update_category"
      };
      category_input.placeholder = "Editing category...";
      category_input.value='';
      sendData('editUserCategory', data).then((response)=>{
        if(response.message==="invalid_request"){
          invalidRequestHandler(data);
         }else if(response.message==="success"){
          const text_container = document.getElementById(`displayed_category_${categoryID}`);
          text_container.innerHTML = category;
          category_input.placeholder = category;
          closeOneForm(categoryID);
        }else if(response.message==="exists"){
          category_label.innerHTML="You have already added this category!"
          displayElement(category_label);
          category_input.placeholder = current_category;
        }else{
          category_input.placeholder = current_category;
          closeOneForm(categoryID);
          const toast_options = {
            "message": messageGenerator({initiator:"categories", message_type:"else_error", error_part:"update this category"}),
            "type": "fadeout",
            "timer": 8000,
            "buttonsmode": "got_it",
            "container_classes":["show_toast"]
          };
          showToaster(toast_options);
        }
      });
    }
  }
};
/*
* CREATE ELEMENTS
*/
//create card for basic category
const createBasicCategoryCard = (category, icon, id) => {
  const card = document.createElement('li');
  card.setAttribute('role', 'list item');
  card.classList.add("card", "category_card");
  const category_icon = document.createElement('div');
  category_icon.classList.add("category_icon", icon);
  const category_text = document.createElement('p');
  category_text.classList.add("category_text");
  category_text.setAttribute('id', `displayed_category_${id}`);
  category_text.innerHTML = decodeEntities(category);
  card.append(category_icon, category_text);
  return card;
};
//create card for user category
const createUserCategoryCard = (category) => {
  const categoryicon = 'icon_ettiquete';
  const card = createBasicCategoryCard(category.name, categoryicon, category.id);
  const delete_btn = createDeleteButton('category', category.id, deleteCategory);
  const edit_btn = createEditButton('category', category.id, toggleForm) ;
  const cancel_btn = createCancelButton('category', category.id, toggleForm);
  const save_btn = createSaveButton('category', category.id, updateCategory);
  const form = createCategoryFormHTML(category.id, decodeEntities(category.name));
  card.setAttribute('id',`categoryCard_${category.id}`);
  card.append(delete_btn, edit_btn, form, cancel_btn, save_btn);
  return card;
};
//create form for category card
const createCategoryFormHTML = (id, category_name) => {
  const form = document.createElement('form');
  form.setAttribute('id', `categoryForm_${id}`);
  form.classList.add("card_form", "categoryForm", "hidden");
  const input = createInput('text', category_name, 'enter category name', `category_${id}`, `category_inpt_${id}`);
  input.classList.add("categoryInputs", `inpt_${id}`);
  const label = createLabel(`category_${id}`);
  label.classList.add("categorylbl", `label_${id}`);
  form.append(input, label);
  return form;
};
