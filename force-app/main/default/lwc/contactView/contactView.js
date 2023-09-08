import { LightningElement, wire } from 'lwc';
import getAccounts from '@salesforce/apex/AccountController.getAccounts';
import getContacts from '@salesforce/apex/ContactController.getContacts';
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import { updateRecord } from 'lightning/uiRecordApi';
import CONTACT_ID_FIELD from '@salesforce/schema/Contact.Id';
import CONTACT_FIRST_NAME_FIELD from '@salesforce/schema/Contact.FirstName';
import CONTACT_LAST_NAME_FIELD from '@salesforce/schema/Contact.LastName';
import CONTACT_EMAIL_FIELD from '@salesforce/schema/Contact.Email';
import { refreshApex } from '@salesforce/apex';

export default class AccountContactList extends LightningElement {
    selectedAccountId;
    selectedAccount;
    contactListTitle = '';
    accounts = [];
    contacts = [];
    selectedContact;
    numberOfContacts;
    _contactDataToUpdate;




    //Load accounts using wire service
    @wire(getAccounts)
    wiredAccounts({ data, error }) {
        if (data) {
            this.accounts = data.map(account => ({
                label: account.Name,
                value: account.Id
            }));
        } else if (error) {
            console.log('Error loading accounts');
        }
    }

    //Load contacts for the selected account
    handleAccountChange(event) {
        this.selectedAccountId = event.target.value;
        this.selectedAccount = this.accounts.find(account => account.value === event.target.value);
        if (this.selectedAccount) {
            this.contactListTitle = "Contacts for " + this.selectedAccount.label;
        }
        
        //this.loadContacts();
    }

    //Load contacts using wire service
    @wire(getContacts, { accountId: '$selectedAccountId' })
    wiredContacts(wireResult) {
        const { data, error } = wireResult;
        this._contactDataToUpdate = wireResult;
        if (data) {
            this.contacts = data;
            this.numberOfContacts = data.length + " contact" + (data.length > 1 ? "s" : "");
        } else if (error) {
            console.log('Error loading account contacts');
        }
    }

    // Opens contact edit form
    editContact(e) {
        const contactId = e.currentTarget.dataset.contactId;
        this.selectedContact = this.contacts.find(contact => contact.Id === contactId);
        //console.log(this.selectedContact);
    }

    // Clears selected account and selected contact and closes contacts table and contact edit form
    clear() {
        this.selectedContact = undefined;
        this.selectedAccountId = undefined;
        this.contactListTitle = '';
        this.contacts = [];
    }

    //closes contact edit form
    handleContactEditClose() {
        this.selectedContact = undefined;
    }

    //updates the wired contact and refreshes the list
    handleUpdateContact(e){
        const newContact = e.detail.contact;
        const fields = {};

            fields[CONTACT_ID_FIELD.fieldApiName] = newContact.Id;
            fields[CONTACT_FIRST_NAME_FIELD.fieldApiName] = newContact.FirstName;
            fields[CONTACT_LAST_NAME_FIELD.fieldApiName] = newContact.LastName;
            fields[CONTACT_EMAIL_FIELD.fieldApiName] = newContact.Email;
                
            const recordInput = {fields: fields};
            //console.log(recordInput);
            updateRecord(recordInput).then((record) => {
                refreshApex(this._contactDataToUpdate);
                const event = new ShowToastEvent({
                    title: 'Success',
                    variant: 'Success',
                    message:
                        'Contact saved successfully.',
                });
                this.dispatchEvent(event);
                this.selectedContact = undefined;
            }).catch(error => {
                // Handle errors
                const event = new ShowToastEvent({
                    title: 'Error',
                    variant: 'Error',
                    message: `Error updating Contact: ${error.body.message}`,
                });
                this.dispatchEvent(event);
            });
    }

}
