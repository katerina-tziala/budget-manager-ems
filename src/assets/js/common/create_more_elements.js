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
