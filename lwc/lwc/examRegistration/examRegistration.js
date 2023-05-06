import { LightningElement, wire, api,track } from 'lwc';
import { createRecord, getRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getExamTypes from '@salesforce/apex/ExamController.getExamTypes';



import Id from '@salesforce/user/Id';
import Email_FIELD from '@salesforce/schema/User.Username';
import EXAM_REGISTRATION_OBJECT from '@salesforce/schema/AB_Exam_Registration__c';
import EXAM_TYPE_FIELD from '@salesforce/schema/AB_Exam_Registration__c.AB_Exam_Type__c';
import SCHEDULED_DATE_FIELD from '@salesforce/schema/AB_Exam_Registration__c.AB_Exam_Schedule_Date__c';
import STATUS_FIELD from '@salesforce/schema/AB_Exam_Registration__c.AB_Exam_Status__c';
import STUDENT_EMAIL from '@salesforce/schema/AB_Exam_Registration__c.AB_Student_Email__c';

export default class ExamRegistration extends LightningElement {
    examType;
    examDate;
    examTypes = [];
    @api email;
    @track curr_user_email;
    @track startDate;
    @track endDate;
    @track start_data;
    @track end_data;

 @wire(getRecord,{recordId:Id,fields:[Email_FIELD]})wireuser({error,data}){
    if(data){
        this.curr_user_email=data.fields.Username.value;
        console.log(data);
    }else if(error){
        this.error=error;
    }
}



    @wire(getExamTypes)
    wiredExamTypes({ error, data }) {
        if (data) {
            this.examTypes = data.map(type => {
                return {
                    label: type.Name,
                    value: type.Id
                };
            });
            this.start_data=data.map(type=>{
                return{
                    label:type.Id,
                    value:type.AB_Available_Start_Date__c
                };
            });
            console.log(this.start_data.value);
            this.end_data=data.map(type=>{
                return{
                    label:type.Id,
                    value:type.AB_Available_End_Date__c
                };
            });
        } else if (error) {
            this.showToast('Error', error.body.message, 'error');
        }
    }

    handleExamTypeChange(event) {
        this.examType = event.target.value;
        for(let i=0;i<this.start_data.length;i++)
            {
                if(this.examType == this.start_data[i]['label']){
                    this.startDate = this.start_data[i]['value'];
                    console.log(this.start_data[i]['value']);
                }
            }
            for(let i=0;i<this.end_data.length;i++)
            {
                if(this.examType == this.end_data[i]['label']){
                     this.endDate = this.end_data[i]['value'];
            
            }
           }
     }

    handleExamDateChange(event) {
        this.examDate = event.target.value;
    }

    handleScheduleExam() {
        if (!this.examType || !this.examDate) {
            this.showToast('Error', 'Please select an exam type and date', 'error');
            return;
        }
       
                const fields = {};
                fields[STUDENT_EMAIL.fieldApiName] = this.curr_user_email;
                fields[EXAM_TYPE_FIELD.fieldApiName] = this.examType;
                fields[SCHEDULED_DATE_FIELD.fieldApiName] = this.examDate;
                fields[STATUS_FIELD.fieldApiName] = 'Scheduled';

        const recordInput = { apiName: EXAM_REGISTRATION_OBJECT.objectApiName, fields };
        createRecord(recordInput)
            .then(() => {
                this.showToast('Success', 'Exam scheduled successfully', 'success');
            })
            .catch(error => {
                console.log(error);
                this.showToast('Error', error.body.message, 'error');
            });
         }
            
    showToast(title, message, variant) {
        const event = new ShowToastEvent({
            title,
            message,
            variant
        });
        this.dispatchEvent(event);
    }
}