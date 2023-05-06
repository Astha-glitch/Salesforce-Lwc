import { LightningElement,api,track,wire } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';
import { NavigationMixin } from 'lightning/navigation';
import getExamDetails from '@salesforce/apex/ExamScheduler.getScheduledExams';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import Id from '@salesforce/user/Id';
import Email_FIELD from '@salesforce/schema/User.Username';

export default class ExamScheduledToday extends NavigationMixin(LightningElement) {

    examId;
    regId;
    @track curr_user_email;
    @api examList;
    
    @track columns = [
        { label: 'Name', fieldName: 'Name' },
        { label: 'Id', fieldName: 'Id'},
        { label:'Exam Type', fieldName: 'AB_Exam_Type__c'},
        {label: 'Exam Status', fieldName: 'AB_Exam_Status__c'},
        {label:'Student Email', fieldName: 'AB_Student_Email__c'},
        {
            label: 'Start',
            type: 'button',
            initialWidth: 135,
            typeAttributes: {
                label: 'Start',
                name: 'start',
                title: 'Start',
                disabled: false,
                value: 'start',
                action: 'handleRowAction'
            }
        }
        
    ];
   @track examList;



@track showResults = false;

@wire(getRecord,{recordId:Id,fields:[Email_FIELD]})wireuser({error,data}){
    if(data){
        this.curr_user_email=data.fields.Username.value;
        getExamDetails({username: this.curr_user_email})
        .then(result=>{
            this.showResults = true;
            this.examList = result;
            console.log(this.examList);
        })
        .catch(error=>{
            this.showResults = false;
            this.showToast('Error', error.body.message, 'error');
        })
        console.log(this.curr_user_email);
    }else if(error){
        this.error=error;
    }
}

handleRowAction(event){
    this.regId = event.detail.row.Id;
    localStorage.setItem('regIdd', this.regId);
     this.examId = event.detail.row.AB_Exam_Type__r.Id;
    localStorage.setItem('examineId',this.examId);
    //console.log(event.detail.row.AB_Exam_Type__r.Id);
    this[NavigationMixin.Navigate]({
        type: 'standard__webPage',
        attributes: {
            url: '/questionPaper'
        }
        
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




