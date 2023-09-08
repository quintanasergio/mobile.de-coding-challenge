import { LightningElement, api } from 'lwc';

export default class ContactEdit extends LightningElement {
    @api _contact;
    newContact;
    isSaveDisabled = true;

    @api
    set contact(value) {
        this._contact = value;
        this.updateContact();
    }

    get contact() {
        return this._contact;
    }

    //Clone the original contact object to track changes
    updateContact(){
        this.isSaveDisabled = true;
        this.newContact = JSON.parse(JSON.stringify(this.contact));
    }

    connectedCallback() {
        this.updateContact();
    }

    //Enable the "Save" button when any field is modified
    handleInputChange(event) {
        this.newContact[event.target.name] = event.target.value;
        this.isSaveDisabled = false;
    }

    handleSave() {
        // Check if any fields were modified
        if (JSON.stringify(this.newContact) !== JSON.stringify(this.contact)) {
            if(this.isEmailValid()){
                this.dispatchEvent(new CustomEvent('updatecontact', {
                    detail: {
                        contact: this.newContact
                    }
                }));
            }
            
        }
    }

    // Fire a custom event to notify the parent component to close this component
    closeComponent() {
        this.dispatchEvent(new CustomEvent('close'));
        this.isSaveDisabled = true;
    }

    // validates email format and sets error message
    isEmailValid() {
        var flag = true;
        const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        let email = this.template.querySelector('[data-id="txtEmailAddress"]');
        let emailVal = email.value;
        if (emailVal.match(emailRegex)) {
            email.setCustomValidity("");
        } else {
            flag = false;
            email.setCustomValidity("Please enter valid email");
        }
        email.reportValidity();
        return flag;
    }
    
}