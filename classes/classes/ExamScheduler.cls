public with sharing class ExamScheduler{
    public ExamScheduler() {

    }
    @AuraEnabled()
    public static List<AB_Exam_Registration__c> getScheduledExams(String username){
        try{
        List<AB_Exam_Registration__c> examlst = [SELECT Id, Name, AB_Exam_Schedule_Date__c, AB_Student_Email__c,AB_Exam_Type__r.Name,AB_Exam_Status__c from AB_Exam_Registration__c WHERE AB_Exam_Schedule_Date__c =: Date.today() AND AB_Student_Email__c = :username AND AB_Exam_Status__c = 'Scheduled'];
        return examlst;
    }
    catch(Exception e){
        throw new AuraHandledException(e.getMessage());
    }
    }
    @AuraEnabled()
    public static List<AB_Exam_Registration__c> getCompletedExams(String username){
        try{
        List<AB_Exam_Registration__c> examlst = [SELECT Id, Name, AB_Exam_Schedule_Date__c, AB_Student_Email__c,AB_Exam_Type__r.Name,AB_Exam_Status__c from AB_Exam_Registration__c WHERE AB_Student_Email__c = :username AND (AB_Exam_Status__c = 'Completed' OR AB_Exam_Status__c='Failed')];
        return examlst;
    }
    catch(Exception e){
        throw new AuraHandledException(e.getMessage());
    }
    }
}