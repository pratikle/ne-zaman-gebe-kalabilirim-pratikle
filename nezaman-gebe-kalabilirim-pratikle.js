// Initialize


var MINUTE=60*1000;
var HOUR=MINUTE*60;
var DAY=HOUR*24;
var DUEDAY=28*DAY;



// Define static finals
var datTodaysDate=new Date();
var datZeroDate=new Date(0);
//Declare dates
 datDateObject1=new Date(Date.parse(datZeroDate));
 datDateObject2=new Date(Date.parse(datZeroDate));
 datDateObject3=new Date(Date.parse(datZeroDate));

function ClearAnswers(){
  document.OvulationForm.Cycle.value='';
  document.OvulationForm.Nextperiod.value='';
  document.OvulationForm.Fertile2.value='';
  document.OvulationForm.Fertile1.value='';
}

function AdjustDates(objCaller){
  ClearAnswers();
  //Getting the name of the object that called the function
  var objCallerStr=objCaller.name;
  if((objCallerStr=='month1')||(objCallerStr=='day1')){
  //datDateObject1 source on the form has changed
    setDateObj1();
  }
  if((objCallerStr=='month2')||(objCallerStr=='day2')){
  //datDateObject2 source on the form has changed
    setDateObj2();
  }
  if((objCallerStr=='month3')||(objCallerStr=='day3')){
  //datDateObject3 source on the form has changed
    setDateObj3();
  }
}
function setDateObj1(){
  // Check if either the month1 or day1 values are null.
  if(  ((gIsNumber((document.OvulationForm.month1.options[document.OvulationForm.month1.selectedIndex]).value))>0)  
    && ((gIsNumber((document.OvulationForm.day1.options[document.OvulationForm.day1.selectedIndex]).value))>0)){ 
      var strDate1 = (document.OvulationForm.month1.selectedIndex) + '/' + document.OvulationForm.day1.selectedIndex + '/' + getCorrectYear(document.OvulationForm.month1.selectedIndex) ;

        if (gIsValidDateStr(strDate1)) {
		datDateObject1.setUTCFullYear(getCorrectYear(document.OvulationForm.month1.selectedIndex));
		datDateObject1.setUTCMonth(document.OvulationForm.month1.selectedIndex-1);
		datDateObject1.setUTCDate(document.OvulationForm.day1.selectedIndex);
		//alert('Date1 is '+ datDateObject1.toUTCString());
  		return true;
	} else { alert('Geçersiz bir tarih girdiniz!'); return false;  }

  } else  datDateObject1.setTime(0);
}

function setDateObj2(){
  // Check if either the month2 or day2 values are null.
  if(  ((gIsNumber((document.OvulationForm.month2.options[document.OvulationForm.month2.selectedIndex]).value))>0)
    && ((gIsNumber((document.OvulationForm.day2.options[document.OvulationForm.day2.selectedIndex]).value))>0)){
      var strDate2 = (document.OvulationForm.month2.selectedIndex) + '/' + document.OvulationForm.day2.selectedIndex + '/' + getCorrectYear(document.OvulationForm.month2.selectedIndex) ;
	if (gIsValidDateStr(strDate2)) {
		datDateObject2.setUTCDate(document.OvulationForm.day2.selectedIndex);
		datDateObject2.setUTCMonth(document.OvulationForm.month2.selectedIndex-1);
		datDateObject2.setUTCFullYear(getCorrectYear(document.OvulationForm.month2.selectedIndex));
		//alert('Date2 is '+ datDateObject2.toUTCString());
  
         } else { alert('Geçersiz bir tarih girdiniz!'); }

   }  else  datDateObject2.setTime(0);
}

function setDateObj3(){
   // Check if either the month3 or day3 values are null.
  if(  ((gIsNumber((document.OvulationForm.month3.options[document.OvulationForm.month3.selectedIndex]).value))>0)
    && ((gIsNumber((document.OvulationForm.day3.options[document.OvulationForm.day3.selectedIndex]).value))>0)){  
	
      var strDate3 = (document.OvulationForm.month3.selectedIndex) + '/' + document.OvulationForm.day3.selectedIndex + '/' + getCorrectYear(document.OvulationForm.month3.selectedIndex) ;
        if (gIsValidDateStr(strDate3)) {
		datDateObject3.setUTCDate(document.OvulationForm.day3.selectedIndex);
		datDateObject3.setUTCMonth(document.OvulationForm.month3.selectedIndex-1);
		datDateObject3.setUTCFullYear(getCorrectYear(document.OvulationForm.month3.selectedIndex));
		//alert('Date3 is '+ datDateObject3.toUTCString());
        } else { alert('Geçersiz bir tarih girdiniz!'); }

  }  else  datDateObject3.setTime(0);
}

   
   
function getCorrectYear( dateToCheck ) {
  //if the monthToCheck is greater than datTodaysDate month
  //it must mean LAST year

  if ( dateToCheck > (datTodaysDate.getMonth() + 1) ) {
    return datTodaysDate.getFullYear() - 1;
  } else { 
    return datTodaysDate.getFullYear();
  }

}

function Reset(){
  datDateObject1=new Date(Date.parse(datZeroDate));
  datDateObject2=new Date(Date.parse(datZeroDate));
  datDateObject3=new Date(Date.parse(datZeroDate));
  ClearAnswers();
}

function CalculateAnswer(){
  var intNumberOfDatesSelected=intDividend=intDivisor=intQuotient=0;

  if(Date.parse(datDateObject1)!=0) intNumberOfDatesSelected++;
  if(Date.parse(datDateObject2)!=0) intNumberOfDatesSelected++;
  if(Date.parse(datDateObject3)!=0) intNumberOfDatesSelected++;

  if (intNumberOfDatesSelected<1){
    alert('Lütfen hem ay hem de günü girdiğinizden emin olunuz!');
    return;
  }

  //if they've only entered one date, guess the others
  if (intNumberOfDatesSelected==1){
    if(Date.parse(datDateObject1)!=0){
        datDateObject2=new Date(datDateObject1.valueOf() - (28*24*60*60*1000));
        //alert('Date2 is date1-28 days' + datDateObject2.toUTCString());
        document.OvulationForm.month2.selectedIndex = datDateObject2.getUTCMonth()+1;
        document.OvulationForm.day2.selectedIndex = datDateObject2.getUTCDate();
        datDateObject3=new Date(datDateObject2.valueOf() - (28*24*60*60*1000) );
		//alert('Date3 is date2-28 days' + datDateObject3.toUTCString());
        document.OvulationForm.month3.selectedIndex = datDateObject3.getUTCMonth()+1;
        document.OvulationForm.day3.selectedIndex = datDateObject3.getUTCDate();       
    }else if(Date.parse(datDateObject2)!=0){
        datDateObject1=new Date(datDateObject2.valueOf()+ DUEDAY);
        document.OvulationForm.month1.selectedIndex = datDateObject1.getUTCMonth()+1;
        document.OvulationForm.day1.selectedIndex = datDateObject1.getUTCDate();
        datDateObject3=new Date(datDateObject2.valueOf()-DUEDAY);
        document.OvulationForm.month3.selectedIndex = datDateObject3.getUTCMonth()+1;
        document.OvulationForm.day3.selectedIndex = datDateObject3.getUTCDate();      
    }else if(Date.parse(datDateObject3)!=0){
        datDateObject1=new Date(datDateObject3.valueOf()+DUEDAY+DUEDAY);
        document.OvulationForm.month1.selectedIndex = datDateObject1.getUTCMonth()+1;
        document.OvulationForm.day1.selectedIndex = datDateObject1.getUTCDate();
        datDateObject2=new Date(datDateObject3.valueOf()+DUEDAY);
        document.OvulationForm.month2.selectedIndex = datDateObject2.getUTCMonth()+1;
        document.OvulationForm.day2.selectedIndex = datDateObject2.getUTCDate();
    }
  }

  //adjust second year off first
  if ( ( Date.parse( datDateObject1 ) != 0 ) 
       && ( Date.parse( datDateObject2 ) != 0 ) ) { //if one and two have been changed.
    if ( Date.parse( datDateObject1 ) < Date.parse( datDateObject2 ) ) {
      while ( Date.parse( datDateObject1 ) < Date.parse( datDateObject2 ) ) {
        datDateObject2.setYear( datDateObject2.getYear() - 1 );
      }
    }
    var intDateObject1N2Deviation=(Date.parse(datDateObject1)-Date.parse(datDateObject2));
    intDivisor++;
  }else{
    var intDateObject1N2Deviation=0;
  }

  //adjust third year off second
  if((Date.parse(datDateObject2)!=0)&&(Date.parse(datDateObject3)!=0)){
    //if two and three have been changed.
    if(Date.parse(datDateObject2)<Date.parse(datDateObject3)){
      while(Date.parse(datDateObject2)<Date.parse(datDateObject3)){
        datDateObject3.setYear(datDateObject3.getYear()-1);
      }
    }
    var intDateObject2N3Deviation=(Date.parse(datDateObject2)-Date.parse(datDateObject3));
    intDivisor++;
  }else{
    var intDateObject2N3Deviation=0;
  }

  //adjust third year off first
  if((Date.parse(datDateObject1)!=0)&&(Date.parse(datDateObject3)!=0)){
    //if one and three have been changed.
    if(Date.parse(datDateObject1)<Date.parse(datDateObject3)){
      while(Date.parse(datDateObject1)<Date.parse(datDateObject3)){
        datDateObject3.setYear(datDateObject3.getYear()-1);
      }
    }
    var intDateObject1N3Deviation=(Date.parse(datDateObject1)-Date.parse(datDateObject3));
    intDivisor+=2;
  }else{
    var intDateObject1N3Deviation=0;
  }

  //validate all three dates
  // Date1 can be anything in the past.
  //make sure that they haven't selected a date too far in the past
  //var intCheckDate = (Date.parse(datTodaysDate) / DAY) - (Date.parse(datDateObject1) / DAY);
  //if ((intQuotient < 0) || (intCheckDate > 33)) {
  //  alert('Siklusunuz 21 günden kısa veya 35 günden uzun ise bu hesaplayıcıyı kullanmamalısınız: '+ intCheckDate + '.' );
  //  return;
  //}


  //calculate the average cycle
  intDividend=(intDateObject1N2Deviation/DAY)+(intDateObject2N3Deviation/DAY)+(intDateObject1N3Deviation/DAY);
  if ( intDivisor != 0 ) {
    intQuotient = intDividend / intDivisor;
  }
  
  if((intQuotient<21)||(intQuotient>35)){
    alert('Siklusunuz 21 günden kısa veya 35 günden uzun ise bu hesaplayıcıyı kullanmamalısınız.');
    return;
  }
  document.OvulationForm.Cycle.value=Math.round(intQuotient);

  var datNextPeriod=new Date(0);
  if(Date.parse(datDateObject1)!=0){
    datNextPeriod=new Date(Date.parse(datDateObject1)+(intQuotient*DAY));
  }else if(Date.parse(datDateObject2)!=0){
    datNextPeriod=new Date(Date.parse(datDateObject2)+((intQuotient*DAY)*2));
  }else if(Date.parse(datDateObject3)!=0){
    datNextPeriod=new Date(Date.parse(datDateObject1)+((intQuotient*DAY)*3));
  }else{
    return;
  }

  if(Date.parse(datNextPeriod)!=0){
    document.OvulationForm.Nextperiod.value=datNextPeriod.getDate()+'/'+(datNextPeriod.getMonth()+1)+'/'+gReturnY2KDate(datNextPeriod);

    var datEndFertitlity=new Date(Date.parse(datNextPeriod)-(DAY*14));
    document.OvulationForm.Fertile2.value=datEndFertitlity.getDate()+'/'+(datEndFertitlity.getMonth()+1)+'/'+gReturnY2KDate(datEndFertitlity);

    //var m=(4.875-3)/(31-22);
    //var b=(3-(m*22));
    //x=intQuotient;
    //var y=(m*x)+b;
    var datStartFertitlity=new Date(Date.parse(datEndFertitlity)-(DAY*5));
    document.OvulationForm.Fertile1.value=datStartFertitlity.getDate()+'/'+(datStartFertitlity.getMonth()+1)+'/'+gReturnY2KDate(datStartFertitlity);
  }
}

function adBannerCalc(strQuery) {
   document.OvulationForm.month1.selectedIndex = strGetQueryValue(strQuery, 'Month');
   document.OvulationForm.day1.selectedIndex = strGetQueryValue(strQuery, 'Day');
   if (setDateObj1() ) {
        CalculateAnswer();
   }
}
