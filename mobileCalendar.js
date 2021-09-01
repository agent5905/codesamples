/*
	-Mobile Calendar Class Version 1.0 Created By: Daniel Garcia
		
		MobileCalendar (id, color)
			id:String - the id of the div element
			color:String - A predefined color theme.

		Example:
			//CSS
				#calendar {
					position:		absolute;
					top:			300px;
					left:			200px;
					height:			700px;
					width:			600px;
					border-radius:	5px;
				}
				
			//HTML
				<link href="https://fonts.googleapis.com/css?family=Lato" rel="stylesheet">
				<div id="calendar"></div>
			
			//JAVASCRIPT
				var json =  [{}];
				var calendar;
				calendar	=	new MobileCalendar('calendar', 'default');

				calendar.createCalendar();
				calendar.loadJSON(json);

		Event Listeners:
			1.linkScopePreserver		- Handles scoping for event. Excutes document.location
			2.selectDateScopePreserver	- Handles scoping for event. Calls dateSelected().
			3.dateSelected				- Called when a date is tapped.
			4.previousWeek				- Called when Prev Week Button is tapped.
			5.nextWeek					- Called when Next Week Button is tapped.

		Properties:
			1.currentFullDate			- returns the date object for the currently selected date. Default: {curernt date and time}.
			2.selectedDate 				- returns the currently selected date. Default: 0. Value: 1-31
			3.dateIndex					- returns the current date index. Default: -1. Value: 0-6. 
			4.dateRange					- returns an array of values(days) for a week. Based on dateIndex.
			5.monthRange				- returns an array of values(month) for a week. Based on dateIndex.
			6.rowDetailsJSON 			- returns the json data for a perticular day. Based on dateIndex.
			7.rowDetailsElem			- returns and array of doms that have been added to the calendar content area.
			8.calendarJSON				- returns the loaded json data.
			9.scale						- returns the scale of the mobileCalendar. Default: 1.0. !Must be set prior to calling createCalendar.
			10.datesScale				- returns the scale of the numerical days. !Must be set prior to calling createCalendar.
			11.rowScale					- returns the scale of the row details. !Must be set prior to calling createCalendar.
	
		Constants:
			1.monthString				- Array containing a list of strings representing the months textual long name. Index Value: 0-11 
			2.dayString 				- Array containing a list of strings representing the names of days first intial. Index Value: 0-6
			3.dayLongString				- Array containing a list of strings representing the full names of days of a week. Index Value: 0-6 
		
		Public Functions
			1. createCalendar()			- Creates the dom elements for the class.
			2. loadJSON(json: JSON)		- Loads the json array data and uses this data to populate the various status and details.
*/



function MobileCalendar (id, color){
	var element								=	'';
	if(typeof id == 'string')  
		element								=	document.getElementById(id);
	else
		element								=	id;
	
	var self = this;
	
	this.holder								= element;
	
	if (this.holder == null) {
		return
	}
	
	this.parentNode							= element.parentNode;
	
	this.borderRadius						= '5px';
	this.borderThickness					= 2;

	switch(color) {
		case "blue":
			this.blue();
		break;
		case "default":
		default:
			this.original();		
		break;
	}
	
	this.holder.style.border 				= this.borderThickness + 'px solid ' + this.borderOutsideColor;
	this.holder.style.backgroundColor 		= this.backgroundColor;
	this.holder.style.overflow 				= 'hidden';

	
	///////////////////////PROPERTIES/////////////////////////
	this.currentFullDate					=	new Date();
	this.selectedDate 						=	0;
	this.dateIndex							=	-1;
	this.dateRange							=	new Array();
	this.monthRange							=	new Array();
	this.rowDetailsJSON						= 	new Array();
	this.rowDetailsElem						= 	new Array();
	this.calendarJSON						=	[];
	this.scale								=	1.0;
	this.datesScale;
	this.rowScale;
	
	///////////////////////CONSTANTS/////////////////////////
	this.monthString = new Array();
	this.monthString[0] 					= "January";
	this.monthString[1] 					= "February";
	this.monthString[2] 					= "March";
	this.monthString[3] 					= "April";
	this.monthString[4] 					= "May";
	this.monthString[5] 					= "June";
	this.monthString[6] 					= "July";
	this.monthString[7] 					= "August";
	this.monthString[8] 					= "September";
	this.monthString[9] 					= "October";
	this.monthString[10] 					= "November";
	this.monthString[11] 					= "December";
	
	
	this.dayString = [
		'S',
		'M',
		'T',
		'W',
		'T',
		'F',
		'S'
	]
	
	this.dayLongString = [
		'Sunday',
		'Monday',
		'Tuesday',
		'Wednesday',
		'Thursday',
		'Friday',
		'Saturday'
	]
	
}

//////////////////////////////////////////////////////////////////////
//////						CREATE ELEMENTS						//////
//////////////////////////////////////////////////////////////////////


///////////////////////CREATE CALENDAR/////////////////////////
MobileCalendar.prototype.createCalendar	=	function() { 
	if (this.holder == null) {
		return
	}

	if (this.datesScale == null) {
		this.datesScale = this.scale;
	}
	
	if (this.rowScale == null) {
		this.rowScale = this.scale;
	}
	
	this.height							= 	this.holder.offsetHeight;

	var calendarHeader					=	document.createElement('div');
	calendarHeader.id					=	'calendarHeader';
	calendarHeader.style.height			=	(90*this.scale)+'px';
	calendarHeader.style.width			=	'100%';
	calendarHeader.style.position		=	'absolute';
	calendarHeader.style.left			=	'0px';
	calendarHeader.style.top			=	'0px';
	calendarHeader.style.overflow		= 	'hidden';
	calendarHeader.style.backgroundColor= 	this.headerBackgroundColor;
	calendarHeader.style.borderBottom	=	'medium solid '+this.borderColor;
	
	this.holder.appendChild(calendarHeader);	
	this.calendarHeader					=	calendarHeader;
	
	var calendarWeek					=	document.createElement('div');
	calendarWeek.id						=	'calendarWeek';
	calendarWeek.style.display			=	'flex';
	calendarWeek.style.height			=	(20*this.scale)+'px';
	calendarWeek.style.width			=	'100%';
	calendarWeek.style.position			=	'absolute';
	calendarWeek.style.left				=	'0px';
	calendarWeek.style.top				=	this.calendarHeader.offsetHeight+'px';
	calendarWeek.style.overflow			= 	'hidden';
	calendarWeek.style.borderBottom		=	'medium solid ' + this.borderHighlightColor;
	calendarWeek.style.backgroundColor 	= 	this.weekBackgroundColor;
	
	this.holder.appendChild(calendarWeek);	
	this.calendarWeek					=	calendarWeek;
	
	var calendarDates					=	document.createElement('div');
	calendarDates.id					=	'calendarDates';
	calendarDates.style.height			=	(124*this.scale)+'px';
	calendarDates.style.width			=	'100%';
	calendarDates.style.position		=	'absolute';
	calendarDates.style.left			=	'0px';
	calendarDates.style.top				=	(this.calendarHeader.offsetHeight + this.calendarWeek.offsetHeight)+'px';
	calendarDates.style.overflow		= 	'hidden';
	calendarDates.style.borderBottom	=	'medium solid '+this.borderColor;
	calendarDates.style.backgroundColor = 	this.datesBackgroundColor;
	
	this.holder.appendChild(calendarDates);	
	this.calendarDates					=	calendarDates;
	
	this.dateBlockContainer = new Array();
	for(var i = 0; i < this.dayString.length; i++) {
		var calendarDate					=	document.createElement('div');
		calendarDate.id						=	'calendarDate_'+i;
		calendarDate.style.display			=	'inline-block';
		calendarDate.style.height			=	'100%';
		calendarDate.style.width			=	'14.285%';
		calendarDate.style.overflow			= 	'hidden';
		
		calendarDate.addEventListener('touchend', this.selectDateScopePreserver(i,calendarDate ).bind(this), false);
		
		this.calendarDates.appendChild(calendarDate);	
		this.dateBlockContainer[i] = calendarDate;
	}
	
	this.dateHeaderContainer = new Array();
	this.dateHolderContainer = new Array();
	this.dateDetailContainer = new Array();
	this.dateDetailHolderContainer = new Array();
	
	
	for(var i = 0; i < this.dayString.length; i++) {
		var calendarDateHeader				=	document.createElement('div');
		calendarDateHeader.id				=	'calendarDateHeader_'+i;
		calendarDateHeader.style.display	=	'table';
		calendarDateHeader.style.height		=	(25*this.scale)+'px';
		calendarDateHeader.style.width		=	'100%';
		calendarDateHeader.style.overflow	= 	'hidden';
		calendarDateHeader.style.fontFamily	=	this.fontFamily;
		calendarDateHeader.style.fontSize 	= 	(17*this.datesScale)+'px';
		calendarDateHeader.style.color		= 	this.dayFontColor;

		this.dateBlockContainer[i].appendChild(calendarDateHeader);	
		this.dateHeaderContainer[i] = calendarDateHeader;
		
		var calendarDateCell				=	document.createElement('div');
		calendarDateCell.id					=	'calendarDateCell_'+i;
		calendarDateCell.style.display		=	'table-cell';
		calendarDateCell.style.textAlign	= 	'center';
		//calendarDateCell.style.verticalAlign = 'middle';

		calendarDateHeader.appendChild(calendarDateCell);	
		
		var calendarDateHolder				=	document.createElement('div');
		calendarDateHolder.id				=	'calendarDateHolder_'+i;
		calendarDateHolder.style.display	= 	'inline-block';
		calendarDateHolder.style.width		=	(25*this.datesScale)+'px';
		calendarDateHolder.style.height		=	(25*this.datesScale)+'px';
		calendarDateHolder.style.lineHeight =	(24*this.datesScale)+'px';
		

		calendarDateCell.appendChild(calendarDateHolder);	
		this.dateHolderContainer[i] = calendarDateHolder;
		
		
		var calendarDateDetail				=	document.createElement('div');
		calendarDateDetail.id				=	'calendarDateDetail_'+i;
		calendarDateDetail.style.display	=	'table';
		calendarDateDetail.style.height		=	(104*this.scale)+'px';
		calendarDateDetail.style.width		=	'100%';
		calendarDateDetail.style.overflow	= 	'hidden';
		
		this.dateBlockContainer[i].appendChild(calendarDateDetail);	
		this.dateDetailContainer[i] = calendarDateDetail;
		
		var calendarDateDetailCell					=	document.createElement('div');
		calendarDateDetailCell.id					=	'calendarDateDetailCell_'+i;
		calendarDateDetailCell.style.display		=	'table-cell';
		calendarDateDetailCell.style.textAlign		= 	'center';
		calendarDateDetailCell.style.verticalAlign 	= 	'middle';

		calendarDateDetail.appendChild(calendarDateDetailCell);	
		
		var calendarDateDetailHolder				=	document.createElement('div');
		calendarDateDetailHolder.id					=	'calendarDateDetailHolder_'+i;
		calendarDateDetailHolder.style.display		= 	'inline-block';
		calendarDateDetailHolder.style.width		=	(68*this.scale)+'px';
		calendarDateDetailHolder.style.height		=	(68*this.scale)+'px';
		
		calendarDateDetailCell.appendChild(calendarDateDetailHolder);	
		this.dateDetailHolderContainer[i] = calendarDateDetailHolder;
		
	}
	
	var calendarCurrentDate					=	document.createElement('div');
	calendarCurrentDate.id					=	'currentDate';
	calendarCurrentDate.style.height		=	(40*this.scale)+'px';
	calendarCurrentDate.style.width			=	'100%';
	calendarCurrentDate.style.position		=	'absolute';
	calendarCurrentDate.style.left			=	'0px';
	calendarCurrentDate.style.top			=	(this.calendarHeader.offsetHeight + this.calendarWeek.offsetHeight + this.calendarDates.offsetHeight)+'px';
	calendarCurrentDate.style.overflow		= 	'hidden';
	calendarCurrentDate.style.borderBottom	=	'medium solid '+this.borderColor;
	calendarCurrentDate.style.backgroundColor = 	this.currentDateBackgroundColor;
	calendarCurrentDate.style.fontFamily	=	this.fontFamily;
	calendarCurrentDate.style.fontSize 		= 	(32*this.scale)+'px';
	calendarCurrentDate.style.color			= 	this.currentDateFontColor;
	calendarCurrentDate.style.textAlign		=	'center';
	
	
	
	this.holder.appendChild(calendarCurrentDate);	
	this.calendarCurrentDate				=	calendarCurrentDate;
	
	var calendarContent					=	document.createElement('div');
	calendarContent.id					=	'calendarContent';
	calendarContent.style.height		=	(this.height - (this.calendarHeader.offsetHeight + this.calendarWeek.offsetHeight + this.calendarDates.offsetHeight + this.calendarCurrentDate.offsetHeight)) + 'px';
	calendarContent.style.width			=	'100%';
	calendarContent.style.position		=	'absolute';
	calendarContent.style.left			=	'0px';
	calendarContent.style.top			=	(this.calendarHeader.offsetHeight + this.calendarWeek.offsetHeight + this.calendarDates.offsetHeight + this.calendarCurrentDate.offsetHeight)+'px';
	calendarContent.style.overflowY		= 	'scroll';
	calendarContent.style.overflowX		= 	'hidden';
	
	this.holder.appendChild(calendarContent);	
	this.calendarContent				=	calendarContent;
	
	this.setHeader(0);
	
	var d = new Date();
	this.currentFullDate = d;
	this.setDates(this.currentFullDate.getDate(), this.currentFullDate.getDay());
	
	
	
}


///////////////////////SET HEADER/////////////////////////
MobileCalendar.prototype.setHeader	=	function(index) {
	var d = new Date();
	var ewom = d.getWeekOfMonth(true);
	
	
	var previousWeek				=	document.createElement('div');
	previousWeek.id					=	'calendarPreviousWeek';
	previousWeek.style.display		=	'inline-block';
	previousWeek.style.height		=	'100%';
	previousWeek.style.width		=	'30%';
	previousWeek.style.overflow		= 	'hidden';
	previousWeek.style.lineHeight	= 	(120*this.scale)+'px';
	previousWeek.style.fontFamily	=	this.fontFamily;
	previousWeek.style.fontSize 	= 	(30*this.scale)+'px';
	previousWeek.style.color		= 	this.headerFontColor;
	previousWeek.innerHTML 			= 	'< Prev Week';
	
	previousWeek.addEventListener('touchend', this.previousWeek.bind(this), false);
	this.calendarHeader.appendChild(previousWeek);	
	this.previousWeek					=	previousWeek;
	
	
	var month				=	document.createElement('div');
	month.id				=	'calendarMonth';
	month.style.display		=	'inline-block';
	month.style.height		=	'100%';
	month.style.width		=	'40%';
	month.style.overflow	= 	'hidden';
	month.style.lineHeight	= 	(90*this.scale)+'px';
	month.style.fontFamily	=	this.fontFamily;
	month.style.fontSize 	= 	(48*this.scale)+'px';
	//month.style.fontWeight = '500';
	month.style.color		= 	this.headerFontColor;
	month.style.textAlign	=	'center';
	
	month.innerHTML 			= 	this.monthString[d.getMonth()];
	
	this.calendarHeader.appendChild(month);	
	this.month				=	month;
	
	
	var nextWeek				=	document.createElement('div');
	nextWeek.id					=	'calendarPreviousWeek';
	nextWeek.style.display		=	'inline-block';
	nextWeek.style.height		=	'100%';
	nextWeek.style.width		=	'30%';
	nextWeek.style.overflow		= 	'hidden';
	nextWeek.style.lineHeight	= 	(120*this.scale)+'px';
	nextWeek.style.fontFamily	=	this.fontFamily;
	nextWeek.style.fontSize 	= 	(30*this.scale)+'px';
	nextWeek.style.color		= 	this.headerFontColor;
	nextWeek.style.textAlign	=	'right';
	nextWeek.innerHTML 			= 	'Next Week >';
	
	nextWeek.addEventListener('touchend', this.nextWeek.bind(this), false);
	this.calendarHeader.appendChild(nextWeek);	
	this.nextWeek					=	nextWeek;
	
	var html								=	'';
	for(var i = 0; i < this.dayString.length; i++) {
		html						+=	'<div  id="calendarDay_' + this.dayString[i] + '" style="display:inline-block; width:14.285%; height:100%; color:' + this.dayFontColor + ';font-family: ' + this.fontFamily + '; font-size:'+(15*this.scale)+'px; font-weight:500; text-align:center; ">' + this.dayString[i] + '</div>';
		
	}
	
	this.calendarWeek.innerHTML = html;
	
}

///////////////////////SET DATES/////////////////////////
MobileCalendar.prototype.setDates	=	function(currentDate, currentDayIndex) {
	this.selectedDate				=	currentDate;
	this.dateIndex					=	currentDayIndex
	
	this.dateRange = new Array();
	this.monthRange = new Array();
	
	for(var i = 0; i < 7 ; i++) {
		
		var d = new Date(this.currentFullDate.getFullYear(), this.currentFullDate.getMonth(), currentDate - (currentDayIndex - i) );

		this.dateRange[i] = d.getDate();
		this.monthRange[i] = d.getMonth();
		//This sets the month header based on the selected day.
		if (i == currentDayIndex ) {
			this.month.innerHTML 			= 	this.monthString[d.getMonth()];
		}
		
		
		
	}

	for(var i = 0; i < this.dateRange.length; i++) {
		this.dateHolderContainer[i].innerHTML = this.dateRange[i];
		
		if (i == this.dateIndex) {
			this.dateHolderContainer[i].style.backgroundColor = this.selectedBackgroundColor;
			this.dateHolderContainer[i].style.color = this.selectedFontColor;
			this.dateHolderContainer[i].style.borderRadius = '50%';
		}else{
			this.dateHolderContainer[i].style.backgroundColor = this.datesBackgroundColor;
			this.dateHolderContainer[i].style.color = this.dayFontColor;
			this.dateHolderContainer[i].style.borderRadius = '0%';
		}
	}
	
	
	var ordinalDate = this.getOrdinal(this.dateRange[this.dateIndex]);
	
	
	
	this.calendarCurrentDate.innerHTML = this.dayLongString[this.dateIndex] + ' the ' + ordinalDate;
	
	
}

///////////////////////LOAD JSON/////////////////////////
MobileCalendar.prototype.loadJSON	=	function(json) {
	if (this.holder == null) {
		return
	}
	this.rowDetailsJSON					= 	new Array();
	this.calendarJSON					=	json;
	
	
	for(var i = 0; i < this.dateRange.length; i++) {
		this.rowDetailsJSON[i] = new Array();
		
		for (var key in json) {
			if (json.hasOwnProperty(key)) {
				var d = new Date(json[key].start);

				if (this.dateRange[i] == d.getDate() && this.monthRange[i] == d.getMonth()){
					this.rowDetailsJSON[i].push(json[key]);
				}
			}
			
		}
	}
	
	this.displayRowDetails(this.dateIndex);
	this.displayCalendarStatus();
}

///////////////////////DISPLAY ROW DETAILS/////////////////////////
MobileCalendar.prototype.displayRowDetails	=	function(selectedDateIndex) {
	this.removeRowDetails()
	
	for(var i = this.rowDetailsJSON[selectedDateIndex].length - 1; i >= 0 ; i--) {
		this.addRowDetail(i);
	}
	
	
}

///////////////////////REMOVE ROW DETAILS/////////////////////////
MobileCalendar.prototype.removeRowDetails	=	function() {
	for(var i = 0; i < this.rowDetailsElem.length; i++) {
		 this.rowDetailsElem[i].remove();
	}
	
	this.rowDetailsElem = new Array();
}


///////////////////////DISPLAY CALENDAR STATUS/////////////////////////
MobileCalendar.prototype.displayCalendarStatus	=	function() {
	this.removeCalendarStatus();
	
	for(var i = 0; i < this.dateRange.length; i++) {
		for(var ii = this.rowDetailsJSON[i].length - 1; ii >= 0 ; ii--) {
			var statusElem					=	document.createElement('div');
			statusElem.id					=	'statusElem_'+i+'_'+ii;
			statusElem.style.display		= 	'inline-block';
			statusElem.style.width			=	(15*this.scale)+'px';
			statusElem.style.height			=	(15*this.scale)+'px';
			statusElem.style.borderRadius 	= 	'50%';
			statusElem.style.backgroundColor			= 	this.rowDetailsJSON[i][ii].color;
			statusElem.style.marginRight	=	'2px';
			//statusElem.style.border 			= 	'1px solid #000000';
			
			this.dateDetailHolderContainer[i].appendChild(statusElem);
		}
	}
	
}

///////////////////////REMOVE CALENDAR STATUS/////////////////////////
MobileCalendar.prototype.removeCalendarStatus	=	function() {
	for(var i = 0; i < this.dateDetailHolderContainer.length ; i++) {
		while (this.dateDetailHolderContainer[i].firstChild) {
			this.dateDetailHolderContainer[i].removeChild(this.dateDetailHolderContainer[i].firstChild);
		}
	}
}

///////////////////////ADD ROW DETAIL/////////////////////////
MobileCalendar.prototype.addRowDetail	=	function(index) {
	
	var rowIndex = index ; 
	
	
	var calendarRowStatus					=	document.createElement('div');
	calendarRowStatus.id					=	'calendarRowStatus_'+rowIndex;
	calendarRowStatus.style.position		= 	'relative';
	calendarRowStatus.style.height			=	(15*this.rowScale)+'px';
	calendarRowStatus.style.width			=	(15*this.rowScale)+'px';
	calendarRowStatus.style.top				=	'0px';
	calendarRowStatus.style.left			=	'0px';
	calendarRowStatus.style.display			= 	'inline-block';
	calendarRowStatus.style.backgroundColor	=	this.rowDetailsJSON[this.dateIndex][rowIndex].color;
	calendarRowStatus.style.borderRadius 	= 	'50%';
	calendarRowStatus.style.border 			= 	'1px solid #000000';
	

	var calendarRowDetail					=	document.createElement('div');
	calendarRowDetail.id					=	'calendarRowDetail_'+rowIndex;
	calendarRowDetail.style.height			=	(150*this.rowScale)+'px';
	calendarRowDetail.style.width			=	'100%';
	calendarRowDetail.style.overflow		= 	'hidden';
	calendarRowDetail.style.display			= 	'inline-block';
	calendarRowDetail.style.borderBottom	=	'medium solid '+this.borderColor;
	calendarRowDetail.style.fontFamily		=	this.fontFamily;
	calendarRowDetail.style.fontSize 		= 	(20*this.rowScale)+'px';
	calendarRowDetail.style.color			= 	this.rowDetailFontColor;
	calendarRowDetail.style.paddingLeft 	= 	'8px';
	
	this.calendarContent.appendChild(calendarRowDetail);	
	this.rowDetailsElem[rowIndex] = calendarRowDetail;
	
	
	var d = new Date(this.rowDetailsJSON[this.dateIndex][rowIndex].start);
	var timeString = d.toLocaleString('en-US').split(" ")[1] + ' ' + d.toLocaleString('en-US').split(" ")[2];
	
	this.rowDetailsElem[rowIndex].appendChild(calendarRowStatus);
	
	this.rowDetailsElem[rowIndex].innerHTML = this.rowDetailsElem[rowIndex].innerHTML + '<br>Time: ' + timeString
								+ '<br>Officer: ' + this.rowDetailsJSON[this.dateIndex][rowIndex].OfficerName
								+ '<br>DR/CR #: ' + this.rowDetailsJSON[this.dateIndex][rowIndex].DrCrNo
								+ '<br>Court Case #: ' + this.rowDetailsJSON[this.dateIndex][rowIndex].CourtCaseNo
								+ '<br>Defendant: ' + this.rowDetailsJSON[this.dateIndex][rowIndex].Defendant
	
	

	var calendarRowMoreInfo						=	document.createElement('div');
	calendarRowMoreInfo.id						=	'calendarRowMoreInfo_'+rowIndex;
	calendarRowMoreInfo.style.position			= 	'relative';
	calendarRowMoreInfo.style.height			=	(35*this.rowScale)+'px';
	calendarRowMoreInfo.style.width				=	(100*this.rowScale)+'px';
	calendarRowMoreInfo.style.top				=	(-45*this.rowScale)+'px';
	calendarRowMoreInfo.style.left				=	(this.holder.clientWidth - (100*this.rowScale)-20)+'px';
	//calendarRowMoreInfo.style.display			= 	'inline-block';
	calendarRowMoreInfo.style.backgroundColor	=	this.moreInfoBackgroundColor;
	calendarRowMoreInfo.style.borderRadius 		= 	(8*this.rowScale)+'px';
	calendarRowMoreInfo.style.lineHeight		= 	(33*this.rowScale)+'px';
	calendarRowMoreInfo.style.fontFamily		=	this.fontFamily;
	calendarRowMoreInfo.style.fontSize 			= 	(19*this.rowScale)+'px';
	calendarRowMoreInfo.style.color				= 	this.moreInfoFontColor;
	calendarRowMoreInfo.style.textAlign			=	'center';
	
	calendarRowMoreInfo.innerHTML = 'More Info'
	
	calendarRowMoreInfo.addEventListener('touchend', this.linkScopePreserver(this.rowDetailsJSON[this.dateIndex][rowIndex].url).bind(this), false);
	
	
	this.rowDetailsElem[rowIndex].appendChild(calendarRowMoreInfo);
	
}





///////////////////////DECONSTRUCT ELEMENTS/////////////////////////////
MobileCalendar.prototype.deconstructCalendar		=	function(){
	

	
}

//////////////////////////////////////////////////////////////////////
//////						EVENTS								//////
//////////////////////////////////////////////////////////////////////

///////////////////////LINK SCOPE PRESERVER/////////////////////////
MobileCalendar.prototype.linkScopePreserver		=	function(url) {
  return function () {
    document.location = url;
  };
}

///////////////////////SELECT DATE SCOPE PRESERVER/////////////////////////
MobileCalendar.prototype.selectDateScopePreserver		=	function(dateIndex, target) {
  return function () {
    this.dateSelected(dateIndex, target);
  };
}

///////////////////////DATE SELECTED/////////////////////////
MobileCalendar.prototype.dateSelected		=	function(dateIndex, target) { 
	console.log('dateSelected');
		
	this.dateHolderContainer[dateIndex].style.backgroundColor = this.selectedBackgroundColor;
	this.dateHolderContainer[dateIndex].style.color = this.selectedFontColor;
	this.dateHolderContainer[dateIndex].style.borderRadius = '50%';
		
	this.dateHolderContainer[this.dateIndex].style.backgroundColor = this.datesBackgroundColor;
	this.dateHolderContainer[this.dateIndex].style.color = this.dayFontColor;
	this.dateHolderContainer[this.dateIndex].style.borderRadius = '0%';
		
	var newDate = new Date(this.currentFullDate);
	newDate = new Date(newDate.setDate(this.currentFullDate.getDate() + (dateIndex - this.dateIndex)));
	this.currentFullDate = newDate;
	this.dateIndex = dateIndex;
	
	this.month.innerHTML 			= 	this.monthString[this.currentFullDate.getMonth()];
	
	var ordinalDate = this.getOrdinal(this.dateRange[this.dateIndex]);
	this.calendarCurrentDate.innerHTML = this.dayLongString[this.dateIndex] + ' the ' + ordinalDate;
	
	this.displayRowDetails(this.dateIndex);
	
	var event 									= new Event('calendarDateSelected');
	this.holder.dispatchEvent(event);

}


///////////////////////PREVIOUS WEEK/////////////////////////
MobileCalendar.prototype.previousWeek		=	function(event) { 
	console.log('previousWeek');
	var target									= event.target;
	var newDate = this.currentFullDate.getDate() - 7;
	
	//Creates a new date by subtracting 7 days from the current date.
	var makeDate = new Date(this.currentFullDate);
	makeDate = new Date(makeDate.setDate(newDate));

	this.currentFullDate = makeDate;
	this.setDates(this.currentFullDate.getDate(), this.currentFullDate.getDay());
	this.loadJSON(this.calendarJSON);
	
	var event 									= new Event('calendarPreviousWeek');
	this.holder.dispatchEvent(event);

}


///////////////////////NEXT WEEK/////////////////////////
MobileCalendar.prototype.nextWeek		=	function(event) { 
	console.log('nextWeek');
	var target									= event.target;
	var newDate = this.currentFullDate.getDate() + 7;
	
	//Creates a new date by adding 7 days to the current date.
	var makeDate = new Date(this.currentFullDate);
	makeDate = new Date(makeDate.setDate(newDate));

	this.currentFullDate = makeDate;
	this.setDates(this.currentFullDate.getDate(), this.currentFullDate.getDay());
	this.loadJSON(this.calendarJSON);
	
	var event 									= new Event('calendarNextWeek');
	this.holder.dispatchEvent(event);

}

///////////////////////ADD EVENT LISTENER/////////////////////////
MobileCalendar.prototype.addEventListener	=	function(eventString, functionCallback, bubble) {
	
	this.holder.addEventListener(eventString, functionCallback, bubble);
}


//////////////////////////////////////////////////////////////////////
//////							THEME							//////
//////////////////////////////////////////////////////////////////////

///////////////////////ORIGINAL/////////////////////////
MobileCalendar.prototype.original			=	function(){
	
	//content area
		//Normal State
		this.fontColor						=	'#FFFFFF';
		this.backgroundColor				=	'#FFFFFF';
		this.headerBackgroundColor			=	'#E9E8E9';
		this.weekBackgroundColor			=	'#E9E8E9';
		this.datesBackgroundColor			=	'#FFFFFF';
		this.currentDateBackgroundColor		=	'#E9E8E9';
		this.moreInfoBackgroundColor		=	'#EF3D39';
		
	//Border
		this.borderOutsideColor				=	'#000000';
		this.borderColor					=	'#989898';
		this.borderHighlightColor			=	'#676767';
	//Font
		this.fontFamily						= 	'Lato';
		this.headerFontColor				=	'#EF3D39';
		this.dayFontColor					=	'#000000';
		this.currentDateFontColor			=	'#EF3D39';
		this.rowDetailFontColor				=	'#000000';
	//Selected State
		this.selectedBackgroundColor		=	'#EF3D39';
		this.selectedFontColor				=	'#FFFFFF';

		this.moreInfoFontColor				=	'#FFFFFF';

}

///////////////////////ORIGINAL/////////////////////////
MobileCalendar.prototype.blue			=	function(){
	
	//content area
		//Normal State
		this.fontColor						=	'#FFFFFF';
		this.backgroundColor				=	'#FFFFFF';
		this.headerBackgroundColor			=	'#C4DEF9';
		this.weekBackgroundColor			=	'#C4DEF9';
		this.datesBackgroundColor			=	'#FFFFFF';
		this.currentDateBackgroundColor		=	'#C4DEF9';
		this.moreInfoBackgroundColor		=	'#3991EF';
		
	//Border
		this.borderOutsideColor				=	'#000000';
		this.borderColor					=	'#6E9EE6';
		this.borderHighlightColor			=	'#5F89C7';
	//Font
		this.fontFamily						= 	'Lato';
		this.headerFontColor				=	'#3991EF';
		this.dayFontColor					=	'#000000';
		this.currentDateFontColor			=	'#3991EF';
		this.rowDetailFontColor				=	'#000000';
	//Selected State
		this.selectedBackgroundColor		=	'#3991EF';
		this.selectedFontColor				=	'#FFFFFF';

		this.moreInfoFontColor				=	'#FFFFFF';

}

//////////////////////////////////////////////////////////////////////
//////						GENERAL								//////
//////////////////////////////////////////////////////////////////////



MobileCalendar.prototype.rotate								= 	function(obj, pos){
		obj.currentRotation = pos;		
		obj.style.transform = "rotate(" + pos + "deg)";
		obj.style.MsTransform = "rotate(" + pos + "deg)";
		obj.style.MozTransform = "rotate(" + pos + "deg)";
		obj.style.WebkitTransform = "rotate(" + pos + "deg)";
		obj.style.OTransform = "rotate(" + pos + "deg)";
}

///////////////////////////////////////////////////////////////
MobileCalendar.prototype.getOrdinal = function(n) {
   var s=["th","st","nd","rd"],
       v=n%100;
   return n+(s[(v-20)%10]||s[v]||s[0]);
}

///////////////////////////////////////////////////////////////
 Date.prototype.getWeekOfMonth = function(exact) {
        var month = this.getMonth()
            , year = this.getFullYear()
            , firstWeekday = new Date(year, month, 1).getDay()
            , lastDateOfMonth = new Date(year, month + 1, 0).getDate()
            , offsetDate = this.getDate() + firstWeekday - 1
            , index = 1 // start index at 0 or 1, your choice
            , weeksInMonth = index + Math.ceil((lastDateOfMonth + firstWeekday - 7) / 7)
            , week = index + Math.floor(offsetDate / 7)
        ;
        if (exact || week < 2 + index) return week;
        return week === weeksInMonth ? index + 5 : week;
 }