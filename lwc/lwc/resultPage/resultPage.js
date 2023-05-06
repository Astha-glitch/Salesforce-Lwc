import { LightningElement, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import fetchResponses from '@salesforce/apex/ExamController.fetchResponse';

const columns_t=[
        
        {label:'Question',fieldName:'QuestionDes__c'},
        {label:'Answer Given',fieldName:'AB_Answer_Marked__c'},
        {label:'Correct Answer',fieldName:'AB_Correct_Answer__c'}
    
    ];
    
    
export default class ResultPage extends LightningElement {
        @track solutions;
        @track columnsList = columns_t;
        @track score=0; 
        connectedCallback(){   
            console.log('hi');   
            console.log('result pge',localStorage.getItem('examName'));
            fetchResponses({Exam_RegId:localStorage.getItem('examName')})
            .then(result=>{
                console.log(result);
                for(let i=0;i<result.length;i++)
                {
                    if(result[i]['AB_Correct_Answer__c']==result[i]['AB_Answer_Marked__c'])
                        this.score+=1;
                    }
                    this.solutions = result;
                 })
                 .catch(error=>{
                    console.log(error.body.message);
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
