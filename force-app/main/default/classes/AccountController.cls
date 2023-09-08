public with sharing class AccountController {

    @AuraEnabled(cacheable=true)
    public static List<Account> getAccounts() {
        List<Account> accountList = [SELECT Id, Name FROM Account];
        return accountList;
    }

}