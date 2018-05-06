var strCaller="";
function gRegister(strFunctionCall){
  strCaller=strFunctionCall;
  return true;
}
function gUnregister(){
  strCaller="";
  return true;
}

var objErrors=new Array();
//window.onerror=gAddError;
function gAddError(objError){
  var intLength=objErrors.length;
  var objNewError=new Object(objError);
  objNewError.priority=objError.priority;
  objNewError.code=objError.code;
  objErrors[intLength]=objNewError;
  return true;
}

function gGetLastError(){
  var intLength=objErrors.length;
  if(intLength>0) return objErrors[intLength-1];
  else return false;
}

function gWhine(strErrorIn){
  var msg='';
  msg+='Sorry, minor error occurred.\n\n';
  msg+=strErrorIn+'\n';
  alert(msg);
}

//BREAK OUT OF FRAMES
//if(self.parent.frames.length != 0) self.parent.location=self.location;

var objPage=new Object();

function CookieObject(objDocCk,strCkName,datCkExpires,strCkDomain,strCkPath,blnCkSecure){
  this._objDocCk=this._strCkName=this._datCkExpires=this._strCkDomain=this._strCkPath=null;
  this._blnCkSecure=false;
  if(objDocCk) this._objDocCk=objDocCk; //window.document from current page.
  if(strCkName) this._strCkName=strCkName;
  if(datCkExpires) this._datCkExpires=datCkExpires;
  if(strCkDomain) this._strCkDomain=strCkDomain;
  if(strCkPath) this._strCkPath=strCkPath;
  if(blnCkSecure) this._blnCkSecure=true;

  this.read=CookieObject_read;
  this.write=CookieObject_write;
  this.erase=CookieObject_erase;

}

function CookieObject_read(){
  var strDocCookie, strTarget, intNamePos, intValuePos, intEndValuePos, strCookieValue, intEndFlag, strErrorMsg;
  strErrorMsg="";
  if(this._strCkName!=null){
  strDocCookie=this._objDocCk.cookie;
  if(strDocCookie!=null){
    strTarget=escape(this._strCkName)+"=";
    intNamePos=strDocCookie.indexOf(strTarget);
    if(intNamePos>-1){
      intNamePos+=strTarget.length;
      intEndValuePos=strDocCookie.indexOf(";",intNamePos);
      if(intEndValuePos==-1) intEndValuePos=strDocCookie.length;
        strCookieValue=unescape(strDocCookie.substring(intNamePos,intEndValuePos));
        intNamePos=intEndValuePos=intValuePos=intEndFlag=0;
        while(intEndFlag>-1){
          intValuePos=strCookieValue.indexOf("^",intNamePos);
          intEndValuePos=strCookieValue.indexOf("|",intValuePos);
          intEndFlag=intEndValuePos;
          if(intEndValuePos==-1) intEndValuePos=strCookieValue.length;
          this[strCookieValue.substring(intNamePos,intValuePos)]=strCookieValue.substring(intValuePos+1,intEndValuePos);
          intNamePos=intEndFlag+1;
        }
      }else{
        strErrorMsg="value not found";
      }
    }else{
      strErrorMsg="no cookies";
    }
  }
  return strErrorMsg;
}

function CookieObject_write(){
  if(this._strCkName!=null){
    var strNewCookieString,strCookieValue,strTempCookieValue,strErrorMsg;
    strNewCookieString=escape(this._strCkName)+"=";
    strCookieValue=strErrorMsg="";
    for (property in this){
      if((property.charAt(0)!="_")&&(typeof(this[property])!="function")){
        strCookieValue+=property+"^"+this[property]+"|";
      }
    }
    strNewCookieString+=escape(strCookieValue.substring(0,strCookieValue.length-1));
    strNewCookieString+=";";
    strTempCookieValue=strCookieValue.substring(0,strCookieValue.length-1);
    if(this._datCkExpires) strNewCookieString+="expires="+this._datCkExpires.toGMTString();
    if(this._strCkDomain) strNewCookieString+="domain="+this._strCkDomain;
    if(this._strCkPath) strNewCookieString+="path="+this._strCkPath;
    if(this._blnCkSecure) strNewCookieString+="secure;";
    this._objDocCk.cookie=strNewCookieString;
    strDocCookie=this._objDocCk.cookie;
    strTarget=escape(this._strCkName)+"=";
    intNamePos=strDocCookie.indexOf(strTarget);
    if(intNamePos>-1){
      intNamePos+=strTarget.length;
      intEndValuePos=strDocCookie.indexOf(";",intNamePos);
      if(intEndValuePos==-1) intEndValuePos=strDocCookie.length;
      strCookieValue=unescape(strDocCookie.substring(intNamePos,intEndValuePos));
    }
    if(strTempCookieValue!=strCookieValue) strErrorMsg="write failure";
  }
  return strErrorMsg;
}

function CookieObject_erase(){
  var strNewCookieString,datCkExpires;
  strNewCookieString=escape(this._strCkName)+"=erased;";
  datCkExpires=new Date(0);
  strNewCookieString+="expires="+datCkExpires.toGMTString();
  this._objDocCk.cookie=strNewCookieString;
  for (property in this){
    if((property.charAt(0)!="_")&&(typeof(this[property])!="function")){
      this[property]=null;
    }
  }
}

var datExpiration=new Date();
datExpiration=new Date(Date.parse(datExpiration)+(1000*60*60*24*30));   //add one month
objPage.userdata=new CookieObject(document,"safehealthinfo",datExpiration);
var strErrorValue=objPage.userdata.read();

function gParseUserData(strUserData){
/**
 *gParseUserData(strUserData)
 *separates name=value pairs generated in inline script block by server script.
 *overwrites any cookie values.
 */
  gRegister("gParseUserData");
  if(strUserData!=""){
    hshUserData=strUserData.split(",");
    for (intCounter in hshUserData){
      var strPair=hshUserData[intCounter];
      var strKey=strPair.substring(0,strPair.indexOf("="));
      var strValue=strPair.substring(strPair.indexOf("=")+1);
      eval("objPage.userdata."+strKey+"=\""+strValue+"\"");
    }
    strErrorValue=objPage.userdata.write();
  }
  gUnregister();
  return true;
}

function gIsNumber(strNumber,strMin,strMax){
/**
 *gIsNumber(strNumber,strMin,strMax)
 *strMin and strMax may be null.
 *if strMin and/or strMax are not null, all are verified as numbers,
 *and strMin<=strNumber and/or strNumber<=strMax
 */
  gRegister("gIsNumber");
  var strTempNumber=strNumber;  //make a copy
  strTempNumber=""+strTempNumber; //make sure copy is string
  if(strTempNumber.length==0) return false;
  for(i=0;i<strTempNumber.length;i++){
    if(!((strTempNumber.charAt(i)=="0")||
      (strTempNumber.charAt(i)=="1")||
      (strTempNumber.charAt(i)=="2")||
      (strTempNumber.charAt(i)=="3")||
      (strTempNumber.charAt(i)=="4")||
      (strTempNumber.charAt(i)=="5")||
      (strTempNumber.charAt(i)=="6")||
      (strTempNumber.charAt(i)=="7")||
      (strTempNumber.charAt(i)=="8")||
      (strTempNumber.charAt(i)=="9")||
      (strTempNumber.charAt(i)=="-")||
      (strTempNumber.charAt(i)=="."))){
      return false;
    }
  }
  if(strTempNumber.indexOf(".")!=-1){
    var strDecident=strTempNumber.substr(strTempNumber.indexOf("."));
    var blnBadDecident=false;
    if(strDecident==".") blnBadDecident=true;
    for(i=1;i<strDecident.length;i++){
      if((strDecident.charAt(i)==".")||
        (strDecident.charAt(i)=="-")){
        blnBadDecident=true;
      }
    }
    if(blnBadDecident){
      return false;
    }
  }

  if ( strTempNumber.indexOf("-") != -1 ) {  //if it includes a - test:
    if ( strTempNumber.length == 1 ) return false;        //bad if - is the only character
    if ( strTempNumber.indexOf("-") != 0 ) return false;  //bad if - is not the first character
  }

  if(strMin){
    var strTempMin=strMin;
    strTempMin=""+strTempMin;
    if(strTempMin.length==0) return false;
    for(i=0;i<strTempMin.length;i++){
      if(!((strTempMin.charAt(i)=="0")||
        (strTempMin.charAt(i)=="1")||
        (strTempMin.charAt(i)=="2")||
        (strTempMin.charAt(i)=="3")||
        (strTempMin.charAt(i)=="4")||
        (strTempMin.charAt(i)=="5")||
        (strTempMin.charAt(i)=="6")||
        (strTempMin.charAt(i)=="7")||
        (strTempMin.charAt(i)=="8")||
        (strTempMin.charAt(i)=="9")||
        (strTempMin.charAt(i)=="-")||
        (strTempMin.charAt(i)=="."))){
        return false;
      }
    }
    if(strNumber<parseFloat(strMin)) return false;
  }
  if(strMax){
    var strTempMax=strMax;
    strTempMax=""+strTempMax;
    if(strTempMax.length==0) return false;
    for(i=0;i<strTempMax.length;i++){
      if(!((strTempMax.charAt(i)=="0")||
        (strTempMax.charAt(i)=="1")||
        (strTempMax.charAt(i)=="2")||
        (strTempMax.charAt(i)=="3")||
        (strTempMax.charAt(i)=="4")||
        (strTempMax.charAt(i)=="5")||
        (strTempMax.charAt(i)=="6")||
        (strTempMax.charAt(i)=="7")||
        (strTempMax.charAt(i)=="8")||
        (strTempMax.charAt(i)=="9")||
        (strTempMin.charAt(i)=="-")||
        (strTempMax.charAt(i)=="."))){
        return false;
      }
    }
    if(strNumber>parseFloat(strMax)) return false;
  }
  gUnregister();
  return true;
}

function gMakeNumber(strNumber,strAltValue){
/**
 *gMakeNumber(strNumber,strAltValue)
 *If strNumber is a number, returns strNumber
 *else returns strAltValue
 */
  if(gIsNumber(strNumber)) return parseInt(strNumber)
  else return strAltValue;
}

function gIsValidDateStr(strDate) {
/* Accepts date in the mm/dd/yyyy format only.
*/
  gRegister("gIsValidDateStr");

  var monthdays=0;
  var i = strDate.indexOf('/');
  var month = strDate.substring(0, i);
  var j = strDate.indexOf('/', i+1);
  var day = strDate.substring(i+1,j);
  var year = strDate.substring(j+1, strDate.length);

  if (isNaN(day) || day < 0 || isNaN(month) || month < 0 || isNaN(year) || year < 0 ) { return false; }

  if ((month == '1') || (month == '3') || (month == '5') || (month == '7') || 
      (month == '8') || (month == '10') || (month == '12') ){
        if (day >31) {
            return false; 
        } else {
            return true;
        } 
  } else if ((month == '4') || (month == '6') || (month == '9') || (month == '11')) {
     if (day > 30)  { 
      return false;  
     } else { return true; }
  } else if (month == 2) {
              if (day <=28) {
                 return true;
              } else if (year % 4 != 0)  {  return false; }
                 //{use 28 for days in February}
              else if ( (year % 400 == 0) && (day == 29) ) {  return true; }
                 //{use 29 for days in February}
              else if (day >29) {  return false; }
                 //{use 29 for days in February}
  }

}

function gIsDate(strDate,strMin,strMax){
/**
 *gIsDate(strDate,strMin,strMax)
 *strMin and strMax may be null.
 *if strMin and/or strMax are not null, all are converted to milliseconds since 1/1/1970,
 *and strMin<=strDate and/or strDate<=strMax
 */
  gRegister("gIsDate");
  if(!Date.parse(strDate))  { alert('returning false because parse failed' ); return false; }
  if(strMin){
    if(!Date.parse(strMin)) return false;
    if(Date.parse(strDate)<Date.parse(strMin)) return false;
  }
  if(strMax){
    if(!Date.parse(strMax)) return false;
    if(Date.parse(strDate)>Date.parse(strMax)) return false;
  }
  gUnregister();
  return true;
}

function gIsValidDate(strIncomingDateString){
/**
 *gIsValidDate(strIncomingDateString)
 *strIncomingDateString is a string literal to validate
 *
 *VALID FORMATS:
 *MM dd, yyyy** February 29, 2000
 *mm/dd/yyyy** 2/29/2000
 *dd MM yyyy** 29 February 2000
 *yyyy MM dd** 2000 February 29
 *yyyy/mm/dd** 2000/2/29
 *yyyy dd MM** 2000 29 February
 *MM yyyy dd** February 2000 29
 *dd yyyy MM** 29 2000 February
 *
 *dd/mm/yyyy NOT VALID**
 *yyyy/dd/mm NOT VALID**
 */
    //if JavaScript cannot convert it, toss it out
    if(gIsDate(strIncomingDateString)){
        var datConvertedDate=new Date(strIncomingDateString);    
    }else{
        return false;
    }

    //common strings to search for
    var strMonthAbbrevs=new Array('Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec');
    var blnContainsMonthAbbrev=false;
    for(x=0;x<strMonthAbbrevs.length;x++){
        if(strIncomingDateString.indexOf(strMonthAbbrevs[x])!=-1){
        //if string is found
            blnContainsMonthAbbrev=true;

            if(datConvertedDate.getMonth()!=x){
            //if converted month is not same as string month
                return false;
            }else{
                return true;
            }
        }
    }

    //this is not robust, but tries to grab numerical dates
    if(!blnContainsMonthAbbrev){
        var intMonthPos=strIncomingDateString.length;
        //where to start searching from in the loop
        var intCurrentPointerPos=strIncomingDateString.length;
        //the current pointer in the string
        var intLastMonthFoundPos=strIncomingDateString.length;
        //where the last month was found
        var intLastMonthFound=0;
        //what the last month was found was
        var blnBreakBefore=false;
        //is there a break point before
        var blnBreakAfter=false;
        //is there a break point after
        for(x=1;x<13;){
            blnBreakBefore=false;
            blnBreakAfter=false;
            if(strIncomingDateString.lastIndexOf(x,intMonthPos)!=-1){
            //if a number between 1 and 12 exists before intMonthPos
                intCurrentPointerPos=strIncomingDateString.lastIndexOf(x,intMonthPos);
                //set intCurrentPointerPos = loc of number
                if(intCurrentPointerPos<intLastMonthFoundPos){
                //if closer to front than last month
                    if(intCurrentPointerPos-1>=0){
                    //if there's something before it
                        //if the character before the pointer is not a digit
                        if(!((strIncomingDateString.charAt(intCurrentPointerPos-1)=='1')||
                            (strIncomingDateString.charAt(intCurrentPointerPos-1)=='2')||
                            (strIncomingDateString.charAt(intCurrentPointerPos-1)=='3')||
                            (strIncomingDateString.charAt(intCurrentPointerPos-1)=='4')||
                            (strIncomingDateString.charAt(intCurrentPointerPos-1)=='5')||
                            (strIncomingDateString.charAt(intCurrentPointerPos-1)=='6')||
                            (strIncomingDateString.charAt(intCurrentPointerPos-1)=='7')||
                            (strIncomingDateString.charAt(intCurrentPointerPos-1)=='8')||
                            (strIncomingDateString.charAt(intCurrentPointerPos-1)=='9'))){
                            blnBreakBefore=true;
                        }else{
                            blnBreakBefore=false;
                        }
                    }else{
                    //if there's nothing before it
                        blnBreakBefore=true;
                    }
                    if(intCurrentPointerPos+(x.toString().length)<strIncomingDateString.length){
                    //if there's something after it
                        if(!((strIncomingDateString.charAt(intCurrentPointerPos+(x.toString().length))=='1')||
                            (strIncomingDateString.charAt(intCurrentPointerPos+(x.toString().length))=='2')||
                            (strIncomingDateString.charAt(intCurrentPointerPos+(x.toString().length))=='3')||
                            (strIncomingDateString.charAt(intCurrentPointerPos+(x.toString().length))=='4')||
                            (strIncomingDateString.charAt(intCurrentPointerPos+(x.toString().length))=='5')||
                            (strIncomingDateString.charAt(intCurrentPointerPos+(x.toString().length))=='6')||
                            (strIncomingDateString.charAt(intCurrentPointerPos+(x.toString().length))=='7')||
                            (strIncomingDateString.charAt(intCurrentPointerPos+(x.toString().length))=='8')||
                            (strIncomingDateString.charAt(intCurrentPointerPos+(x.toString().length))=='9')||
                            (strIncomingDateString.charAt(intCurrentPointerPos+(x.toString().length))=='0'))){
                            blnBreakAfter=true;
                        }else{
                            blnBreakAfter=false;
                        }
                    }else{
                    //if there's nothing after it
                        blnBreakAfter=true;
                    }
                    if((blnBreakBefore)&&(blnBreakAfter)){
                    //if there's breakpoints before and after
                        intLastMonthFound=x;
                        //set x as new best month
                        intLastMonthFoundPos=intCurrentPointerPos;
                        //set pointer as new best month pointer
                    }
                }
                if(intCurrentPointerPos-1>=0){
                //if there could be more
                    intMonthPos=intCurrentPointerPos-1;
                    //set new starting point
                }else{
                //advance to next number
                    intMonthPos=strIncomingDateString.length;
                    intCurrentPointerPos=strIncomingDateString.length;
                    x++;
                }
            }else{
            //advance to next number
                intMonthPos=strIncomingDateString.length;
                intCurrentPointerPos=strIncomingDateString.length;
                x++;
            }
        }
        if(datConvertedDate.getMonth()!=intLastMonthFound-1){
        //if converted month is not same as string month
            return false;
        }else{
            return true;
        }
    }
}

function gReturnY2KDate(Y2KDateObject){
/**
 *gReturnY2KDate(Y2KDateObject)
 *Y2KDateObject is a Date object.
 *Returns a four-digit integer for year.
 *EXAMPLE:
 * var someDate=new Date();
 * alert((someDate.getMonth()+1)+'/'+someDate.getDate()+'/'+gReturnY2KDate(someDate));
 * RETURNS "mm/dd/yyyy" in all browsers 3.0+
 */
  gRegister("gReturnY2KDate");
  currYearIndex=Y2KDateObject.getYear();
  var yearln=(currYearIndex+"").length;
  if(yearln<4)currYearIndex+=1900; //Fix Y2K
  gUnregister();
  return currYearIndex;
}

function gIsTime(strTime,strMin,strMax){
/**
 *gIsTime(strTime,strMin,strMax)
 *strMin and strMax may be null.
 *if strMin and/or strMax are not null, all are converted to dates by appending to 1/1/1970,
 *and strMin<=strDate and/or strDate<=strMax
 */
  gRegister("gIsTime");
  strTime="1/1/1970 "+strTime;
  if(!Date.parse(strTime)) return false;
  if(strMin){
    strMin="1/1/1970 "+strMin;
    if(!Date.parse(strMin)) return false;
    if(Date.parse(strTime)<Date.parse(strMin)) return false;
  }
  if(strMax){
    strMax="1/1/1970 "+strMax;
    if(!Date.parse(strMax)) return false;
    if(Date.parse(strTime)>Date.parse(strMax)) return false;
  }
  gUnregister();
  return true;
}

function gConvertNumberToPercent(strToConvert){
/**
 *gConvertNumberToPercent(strToConvert)
 *converts numbers and numeric strings to percent strings.
 *A value not either returns false.
 */
  gRegister("gConvertNumberToPercent");
  if(gIsNumber(strToConvert,null,null)){
    strToConvert=strToConvert*100;
    strToConvert=strToConvert+"%";
  }else{
    gUnregister();
    return false;
  }
  gUnregister();
  return strToConvert;
}

function gConvertPercentToNumber(strToConvert){
/**
 *gConvertPercentToNumber(strToConvert)
 *converts percent strings to numbers and numeric strings.
 *A value not either returns false.
 */
  gRegister("gConvertPercentToNumber");
  if(strToConvert.indexOf("%")==strToConvert.length-1){
  var strNewValue=strToConvert.substring(0,strToConvert.indexOf("%"));
  if(gIsNumber(strNewValue,null,null)){
      strToConvert=strNewValue/100;
  }
  }else{
  gUnregister();
  return false;
  }
  gUnregister();
  return strToConvert;
}

function gCurrency(strToConvert){
/**
 *gCurrency(strToConvert)
 *converts numbers and numeric strings to currency.
 *A value not either returns false.
 */
  gRegister("gCurrency");
  if(gIsNumber(strToConvert,null,null)){
      strToConvert=strToConvert*100;
  strToConvert=Math.round(strToConvert);
  strToConvert=strToConvert/100;
  if(gCommify(strToConvert)) strToConvert=gCommify(strToConvert);
      strToConvert="$"+strToConvert;
  if(strToConvert.indexOf(".")==-1) strToConvert+=".";
  var intDecidentLength=strToConvert.length-(strToConvert.lastIndexOf(".")+1);
  for(i=0;i<2-intDecidentLength;i++){
      strToConvert=strToConvert+"0";
  }
  }else{
  gUnregister();
  return false;
  }
  gUnregister();
  return strToConvert;
}

function gDeCurrency(strToConvert){
/**
 *gDeCurrency(strToConvert)
 *convert currency strings to numbers.
 *A value not either returns false.
 */
  gRegister("gDeCurrency");
  if(strToConvert.indexOf("$")!=-1){
      strToConvert=strToConvert.substring(strToConvert.indexOf("$")+1);
  if(gDeCommify(strToConvert)) strToConvert=gDeCommify(strToConvert);
  }else{
  gUnregister();
  return false;
  }
  gUnregister();
  return strToConvert;
}

function gCommify(strToConvert){
/**
 *gCommify(strToConvert)
 *commifies numbers and numeric strings.
 *A non-numeric string without commas returns false.
 */
  gRegister("gCommify");
  var strNewValue=strToConvert;
  if(gIsNumber(strNewValue,null,null)){
      strNewValue=strNewValue.toString();
  if(strNewValue.indexOf(".")!=-1){
      var strDecident=strNewValue.substring(strNewValue.indexOf("."));
      strNewValue=strNewValue.substring(0,strNewValue.indexOf("."));
  }
  var intLength=strNewValue.length;
//        var intComma=((strNewValue.length-1)-((strNewValue.length-1) % 3))/3;  //finds number of commas.
      for(i=3;i<intLength;i=i+3){
  strNewValue=strNewValue.substring(0,intLength-i)+","+strNewValue.substring(intLength-i);
      }
  if(strDecident) strNewValue=strNewValue+strDecident;
  strToConvert=strNewValue;
  }else{
  gUnregister();
      return false;
  }
  gUnregister();
  return strToConvert;
}

function gDeCommify(strToConvert){
/**
 *gDeCommify(strToConvert)
 *decommifies strings.
 *A number or string without commas returns false.
 */
  gRegister("gDeCommify");
  var strNewValue=strToConvert;
  strNewValue=strNewValue.toString();
  if(strNewValue.indexOf(",")!=-1){
  while(strNewValue.indexOf(",")!=-1){
      strNewValue=strNewValue.substring(0,strNewValue.indexOf(","))+strNewValue.substring(strNewValue.indexOf(",")+1);
  }
      strToConvert=strNewValue;
  }else{
  gUnregister();
  return false;
  }
  gUnregister();
  return strToConvert;
}

function gToInches(strFeet,strInches,strMin,strMax){
/**
 *gToInches(strFeet,strInches,strMin,strMax)
 *strMin and strMax may be null.  If not, they should be inches values.
 *if strMin and/or strMax are not null, all are converted to inches,
 *and strMin<=strDate and/or strDate<=strMax
 */
  gRegister("gToInches");
  if(!gIsNumber(strFeet)) return false;
  if(!gIsNumber(strInches)) return false;
  strInches+=(strFeet*12);
  if(strMin){
  if(!gIsNumber(strMin)) return false;
      if(strInches<strMin) return false;
  }
  if(strMax){
  if(!gIsNumber(strMax)) return false;
  if(strInches>strMax) return false;
  }
  gUnregister();
  return strInches;
}

function gToFeetAndInches(strInches,strMin,strMax){
/**
 *gToFeetAndInches(strInches,strMin,strMax)
 *strMin and strMax may be null.
 *if strMin and/or strMax are not null, return a string of x'y",
 *where x=feet and y=inches,
 *and strMin<=strDate and/or strDate<=strMax
 */
  gRegister("gToFeetAndInches");
  if(!gIsNumber(strInches)) return false;
  if(strMin){
  if(!gIsNumber(strMin)) return false;
      if(strInches<strMin) return false;
  }
  if(strMax){
  if(!gIsNumber(strMax)) return false;
  if(strInches>strMax) return false;
  }
  var strReturnValue='';
  strReturnValue=(strInches-(parseInt(strInches)%12))/12+'\''+(parseInt(strInches)%12)+'"';
  gUnregister();
  return strReturnValue;
}

function gBuildDOMArrays(){
/**
 *gBuildDOMArrays()
 *Builds cross-browser object model
 */
  if(document.anchors) objPage.anchors=document.anchors;
  else objPage.anchors=new Array();

  if(document.links) objPage.links=document.links;
      else objPage.links=new Array();

  if(document.forms) objPage.forms=document.forms;
  else objPage.forms=new Array();

  if(document.images) objPage.images=document.images;
  else objPage.images=new Array();

  objPage.layers=new Array();
  if(document.all){  //compensate for IE 4.x
    for(i=0;i<document.all.length;i++){
      var intLength=objPage.layers.length;
      if(document.all[i].tagName=="DIV"){
        if((document.all[i].NAME)||(document.all[i].className)||(document.all[i].id)){
          objPage.layers[intLength]=new Object();
          if(document.all[i].NAME){
            objPage.layers[intLength].layername=document.all[i].NAME;
          }
          if(document.all[i].className){
            objPage.layers[intLength].layerclass=document.all[i].className;
          }
          if(document.all[i].id){
            objPage.layers[intLength].layerid=document.all[i].id;
          }
          objPage.layers[intLength].layersrc=null;
        }
      }
    }
  }else if(document.layers){
    for(i=0;i<document.layers.length;i++){
        objPage.layers[i]=new Object();
        objPage.layers[i].layername=document.layers[i].name;
        objPage.layers[i].layerclass=null;
        objPage.layers[i].layerid=document.layers[i].id;
        objPage.layers[i].layersrc=document.layers[i].src;
    }
  }
  return true;
}

// strQuery is a string that contains the window.location.search portion of the URL
// i.e. ?Age=25&Submit=begin
// strToGet is the variable to find in the strQuery and return the corresponding value.

function strGetQueryValue(strQuery, strToGet) {

  var i = 0;
  var l = strQuery.length;
  var value = '';
  var name = '';
  for (i=1; i<l; i++) {
      j = strQuery.indexOf('=', i);
      k = strQuery.indexOf('&', i);
      name = strQuery.substring(i,j); 
      if (name == strToGet) {
         if (k>0) {
             value = strQuery.substring(j+1, k);
         } else {
             value = strQuery.substring(j+1, l);
         }
         return value;
      } else if (k < 1 ) { 
                return '';
             } 
  }
  return '';
}
