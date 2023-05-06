public with sharing class ExamController {
    public ExamController() {

    }

    @AuraEnabled()
    public static List<AB_Exam_Type__c> getExamTypes(){
        List<AB_Exam_Type__c> examType = [Select Id,Name,AB_Available_Start_Date__c, AB_Available_End_Date__c from AB_Exam_Type__c];
        return examType;
    }

    @AuraEnabled()
    public static List<AB_Questions__c> getQuestions(Id ids){
       //AB_Exam_Type__c examtype = [Select Id,Name from AB_Exam_Type__c where Id=:ids limit 1];
        return [Select AB_QuestionDes__c,AB_Option1__c,AB_Option2__c,AB_Option3__c,AB_Option4__c ,AB_Correct_Answer__c
        from AB_Questions__c WHERE Exam_Type__c=: ids];
    }
    
    @AuraEnabled()
    public static List<AB_Exam_Registration__c> getStatus(Id registerId){
        List<AB_Exam_Registration__c> lst =  [Select AB_Exam_Status__c from AB_Exam_Registration__c where Id=: registerId AND AB_Exam_Status__c = 'Scheduled'];
        return lst;
    }


    @AuraEnabled
    public static List<AB_Examination_Result__c> fetchResponse(Id Exam_RegId){
        return [Select Id,QuestionDes__c, AB_Answer_Marked__c,AB_Correct_Answer__c from AB_Examination_Result__c where AB_Exam_Registration__c = :Exam_RegId];
                }
    
    @AuraEnabled
    public static void addResponse(List<AB_Examination_Result__c> responses){
        insert responses;
    }

    }


