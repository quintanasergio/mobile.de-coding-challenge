public with sharing class ContactController {

    @AuraEnabled(cacheable=true)
    public static List<Contact> getContacts(String accountId) {
        List<Contact> contactList = [SELECT Id, Name, Email, Level__c, FirstName, LastName FROM Contact WHERE AccountId =: accountId];
        return contactList;
    }

    @AuraEnabled(cacheable=true)
    public static List<Contact> updateContact(Contact contact) {
        List<Contact> contactList = [SELECT Id, Name, Email, Level__c, FirstName, LastName FROM Contact WHERE AccountId =: accountId];
        return contactList;
    }

}