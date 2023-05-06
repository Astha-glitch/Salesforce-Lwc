import { LightningElement,track,api,wire } from 'lwc';
import { CurrentPageReference, NavigationMixin } from 'lightning/navigation';
import getQuestionPaper from '@salesforce/apex/ExamController.getQuestions';
import getStatuses from '@salesforce/apex/ExamController.getStatus'
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { updateRecord } from 'lightning/uiRecordApi';
import STATUS_FIELD from '@salesforce/schema/AB_Exam_Registration__c.AB_Exam_Status__c';
import EXAMID from '@salesforce/schema/AB_Exam_Registration__c.Id';
import addResponses from '@salesforce/apex/ExamController.addResponse';
import UserId from '@salesforce/user/Id';
export default class QuestionPaper extends NavigationMixin(LightningElement) {

    @wire(CurrentPageReference) pageRef;
    @api questions;
    @track score; 
    @track solution=new Map(); 
    @track showQuestion=false;
    responseList = [];


    connectedCallback(){
        const regId = localStorage.getItem('regIdd');
        getStatuses({registerId: regId})
        .then(result=>{
            console.log(result);
            this.showQuestion=true;
            const exam_Id = localStorage.getItem('examineId');
            console.log(exam_Id);
            getQuestionPaper({ids: exam_Id})
            .then(result=>{
                console.log(result);
                this.questions = result;
               // console.log(this.questions);
            })
            .catch(error=>{
                this.showToast('Error', error.body.message, 'error');
            });
        })
        .catch(error =>{
            console.log(error);
        })
        
        
    }
    handleAnswerChange(event) { 
        const regId = localStorage.getItem('regIdd');
        const questionId = event.target.name; 
        const result = event.target.value; 
        const question = this.questions.find(q => q.Id === questionId); 
        const response = { 
                            'Name': regId + questionId,
                            'AB_Exam_Registration__c': regId, 
                            'QuestionDes__c': question.AB_QuestionDes__c, 
                            'AB_Answer_Marked__c': result, 
                            'AB_Correct_Answer__c':question.AB_Correct_Answer__c 
                        }; 
             console.log(response.Name);           
            this.solution.set(questionId,response); 

        }

        handleSubmit(event) { 
            if(this.solution.size!=this.questions.length){
                 this.showToast('Error', "Select All Fields" , 'error');
                }
            else{
            var score=0; 
            for (let [key, value] of this.solution) { 
                this.responseList.push(value);
                if(value['AB_Answer_Marked__c']==value['AB_Correct_Answer__c']) {
                score+=1; 
                }
            } 
            
        
        const fields = {};
        const regId = localStorage.getItem('regIdd');
        fields[EXAMID.fieldApiName] = regId;
        if(score/this.questions.length<0.6)
            fields[STATUS_FIELD.fieldApiName] = 'Failed';
        else
        fields[STATUS_FIELD.fieldApiName] = 'Completed';
        const recordInput = { fields };
        console.log(JSON.stringify(recordInput));

        updateRecord(recordInput)
        .then(()=>{
            this.showToast('Success',`You have scored : ${score}, Result updated!!`,'success');
        })
        .catch(error=>{
            this.showToast('Error',error.body.message,'error');
        });
        addResponses({responses: this.responseList})
        .then(()=>{
            console.log(this.responseList);
        })
        .catch((error)=>{
            this.showToast('Error',error.body.message,'error');
        });
        
        this.showQuestion=false; 
    }
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
