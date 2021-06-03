import * as Element from './element.js'

//pop up message
export function info(title, body, closeModal){
    if (closeModal) closeModal.hide();
    Element.modalInfoBoxTitleElement.innerHTML = title;
    Element.modalInfoBoxBodyElement.innerHTML = body;
    Element.modalInfoBox.show();
}

export function disableButton(button){
    button.disable = true;
    const originalLabel = button.innerHTML;
    button.innerHTML = 'Wait...'//<button></button>
    return originalLabel; // switches the label of button back to it's normal state
}

export function enableButton(button, label){
    if(label) button.innerHTML = label; //if there is a label, button's label will be updated
    button.disable = false;//button is enabled 
}

// setting time delay for home button
export function sleep(ms){
    return new Promise(resolve => setTimeout(resolve, ms));
}