/*  
	-Dropdown Menu Version 1.0 Created By: Alan Fieldler & Daniel Garcia - Created Date: 5.14.13-
								Additions By: Len Lester
		
		Dropdown(id, height, selected, color)
			id:String - the id of the div element
			height:Integer - the height of the dropdown area
			selected:Integer - the default selected item. Starts at 0
			color:String - A predefined color theme.
			
		Example:
			//CSS
				#dropdown {
					position:		absolute;
					top:			300px;
					left:			200px;
					height:			21px;
					width:			43px;
					font-size: 		15px;
					font-family: 	AofLCenturyGothic;
				}
			//HTML
				<div id="dropdown"></div>
			
			//JAVASCRIPT
				var dropdown;
				
			//ONLOAD
				//attaches to a dropdown element; makes the dropdown area 100px high; selects the 11th item and sets the theme to green
				dropdown	=	new Dropdown('dropdown', 100, 10, 'green')"	);
				var array	=	['01', '02','03', '04', '05', '06','07', '08','09', '10', '11', '12', '13', '14', '15', '16','17', '18','19', '20'];
				dropdown.contruct_content_area(array);
			//PHP
				//These js files need to be include in the page for the dropdown to scroll.]
				//These js files are included in the template and will not need to be included.
				includeJS('verticalscrollbar.js');
				includeJS('scrolltabletdiv.js');
			
		Event Listeners:
			1.DropdownInit				- when function is initialized
			2.contruct_content_area		- when construct area is finished building
			3.itemSelected				- when an item is selected
			4.itemMouseOver				- when an item is moused over
			5.itemMouseOut				- when an item is moused out
			6.dropdownClose				- when dropdown is closed
			7.dropdownOpen				- when dropdown is opened
		
		Properties:
			1.index						- returns the location value of the selected item. Returns -1 if none selected.
			2.value						- returns the value of the selected item. Returns "--" if none selected.
			3.length					- returns the number of items in the dropdown list.
			4.items						- returns an array of the items in the dropdown list.
		
		Public Functions
			1. contruct_content_area(values:Array, data)	- Creates the dropdown list. This should be the first function called.
			2. setIndex(index:Integer)						- Changes the current index to the provide one.
		
		Help:
			!Make sure to write an array of the contents of whats being dropped down. Otherwise your dropdown wont render the dropdown list.
			
			!You can not use this class in an element that has a style display: none as there are calculations done based on hieght.
			Use display: block; visibility:hidden; or do a in-line style for your element if you wish to use this class. 
		
		Updates:
			5.15.13
				-Added setIndex function so you can change the index of the dropdown.
				-Added error handling for setIndex.
			5.20.13
				-Added data parameter to the construct_content_area function to add additional information to the data attribute.
				-Added __deconstruct function to remove objects and listeners.
			5.21.13
				-Added setDataAttribute so additional data could be passed from the dropdown. The parameters for the function are 
				index and data. Data should be contucted how you normally would assign the data inline as a string.
			5.24.13
				-Recoded line 97 to just set this.index to the selected value.
			5.28.13
				-Added ability to send complex values array [{display:,value:}] when constructing dropdown area
				-Added setting to keep from closing when you select. this.selectClose = true. Set to false causes it to stay open.
			6.6.13
				-Added global closeOtherDrops bool for basic closing of other dropdowns when another is open.
			8.9.13
				-Added the the js files that need to be included in the main page so people would know how to set this file up.
			10.29.13
				-Added a click listener on the holder div so the dropdown opens up when you click anywhere on the dropdown.
				
		Bug Fix:
			5.21.13
				-Fixed issue with dropdown not displaying the list if there was only a couple items
			6.17.13
				-Fixed issue with mobile not centering selected item.
			6.19.13
				-Fixed issue with setIndex not clearing previously selected color.
			6.27.13
				-Fixed and issue if you intialized the drop by setting the index with a string.
				
		Addional Features Suggestion:
			-Grouping functionality
 */
var active_dropdowns;
var closeOtherDrops	= false;
var dropdownIds; 

if(active_dropdowns == null) active_dropdowns = new Array(); 
if(dropdownIds == null) dropdownIds = 0; 
 
function Dropdown (id, height, selected, color, group ){
	dropdownIds++;
	var element						=	'';
	if(typeof id == 'string')  
		element						=	document.getElementById(id);
	else
		element						=	id;

	var self = this;
	addListener(element, "click", function(event) {
		var target = getEventTarget(event);
		target.objref = self;
		self.openClose(event);
	});
	
	this.holder						= element;
	this.parentNode					= element.parentNode;
	
	this.group						=	group == '' ? '' : group;
	
	this.hideGradient				= false;
	this.borderRadius				= '0px';
	
	this.disableFlip				= false;
	this.doubleArrow 				= false;
	this.arrowColor					= "#000000";
	this.useTracker 				= false;
	this.maskBGColor				= "#FFFFFF";
	//color = "new";
	
	switch(color) {
		case "green":
			this.green();
		break;
		case "yellow":
			this.yellow();
		break;
		case "new":
			this.newLook();
			this.hideGradient				= true;
			this.borderRadius				= '2px';
			this.disableFlip				= true;
		break;		
		case "newGreen":
			this.newGreen();
		break;
		case "blue":
		default:
			this.blue();		
		break;
	}
	//this.holder.style.visibility = 'hidden';
	this.holder.style.cursor 		= 'default';
	this.holder.style.border 		= '2px solid ' + this.borderColor;
	this.holder.style.lineHeight 	= this.holder.clientHeight+'px'
	this.holder.style.paddingLeft 	= '4px';
	this.holder.style.backgroundColor = this.backgroundColor;
	this.holder.style.borderRadius 	= this.borderRadius;
	this.holder.style.color 		= this.insideFontColor;
	
	this.mobile						=	MOBILE.length > 0 ? true : false;
	this.id							= 	id;
	this.color						= 	color;
	this.mask						=	'';
	this.dropdown_content			=	'';
	
	
	this.selectClose				=	true;
	
	this.index						=	parseInt(selected);
	this.value						=	'';
	this.height						= 	height;
	this.open						= 	0;
	this.moving						= 	false;
	this.scrollbar					=	'';
	this.scrollbarHeight			=	0;
	this.length						= 	0;
	this.items						= 	new Array();
	
	this.dropdownid					=	dropdownIds;
	
	
	this.setDropDownText("--");
	this.contruct_mask_area(0);
	this.contruct_button();
	
	
	if(this.group != '' && isNaN(this.group)) {
		this.group	=	active_dropdowns.length;
		active_dropdowns.push(this);
		
	}	else	{
		if(active_dropdowns[this.group].length > 0)
			active_dropdowns[this.group].push(this);
		else {
			active_dropdowns[this.group]	=	new Array();
			active_dropdowns[this.group].push(this);
		}
	}
	
	this.dispatchEvent('DropdownInit');
}

//////////////////////////////////////////////////////////////////////
//////						CREATE ELEMENTS						//////
//////////////////////////////////////////////////////////////////////

///////////////////////CONSTRUCT MASK/////////////////////////////////

Dropdown.prototype.contruct_mask_area		=	function(height) {
	var mask								=	document.createElement('div');
		mask.id								=	'dropdownMask_' + this.dropdownid;
		mask.style.height					=	height+ 'px';
		mask.style.width					=	this.holder.offsetWidth - 4 + 'px';
		mask.style.position					=	'absolute';
		mask.style.left						=	this.holder.offsetLeft + 'px';
		mask.style.top						=	(this.holder.offsetTop + this.holder.offsetHeight) - 2 + 'px';
		mask.style.overflow					= 	'hidden';
		mask.style.border 					= 	'2px solid '+this.borderColor;
		mask.style.backgroundColor 			=	this.maskBGColor;
		mask.style.visibility 				= 	'hidden';
	this.parentNode.appendChild(mask);	
	this.mask								=	mask;
}

///////////////////////CONSTRUCT CONTENT AREA/////////////////////////
Dropdown.prototype.contruct_content_area	=	function(values, data) { 
	this.items = [];
	if(((this.holder.offsetHeight * values.length) <= this.height) || (this.mobile && !this.useTracker) || this.height < 100) {
		var itemWidth 						= (this.mask.clientWidth - 4);
	}else{		
		if(!this.useTracker)
			var itemWidth 						= ((this.mask.clientWidth - this.holder.clientHeight) - 6);
		else
			var itemWidth 						= (this.mask.clientWidth - 19);
	}
	
	this.length = values.length;
	
	var html								=	'<div id="dropdownContent_' + this.dropdownid + '" style="font-family:' + this.fontFamily + '">';
	if(typeof values == 'object' && values.length) {
		for(var j = 0; j < values.length; j++) {
			if(j == this.index)	{
				html						+=	'<div  id="dropdownContent_'+this.dropdownid+'_'+j+'" style="position:relative; width:'+itemWidth+'px; height:' + this.holder.offsetHeight + 'px; color:' + this.selectedColor + '; background-color:' + this.selectedBgColor + ';padding-left:4px;cursor: pointer; line-height:'+this.holder.offsetHeight+'px;"></div>';
				this.setDropDownText(values[j]);
				this.value = values[j];
			}	else	{
				html						+=	'<div  id="dropdownContent_'+this.dropdownid+'_'+j+'" style="position:relative; width:'+itemWidth+'px; height:' + this.holder.offsetHeight + 'px; color:' + this.fontColor + '; background-color:' + this.backgroundColor + ';padding-left:4px;cursor: pointer; line-height:'+this.holder.offsetHeight+'px;"></div>';
			}
		}
	}

	if(this.index > values.length){
		this.setDropDownText("--");
	}
	
		html += '</div>';
		
	this.mask.innerHTML = html;
	this.dropdown_content					=	document.getElementById('dropdownContent_' + this.dropdownid); 

		for(var i = 0; i < values.length;i++) {
			var dropSelection = document.getElementById(this.dropdown_content.id + '_'+i);
			
			if(typeof values[i] == 'string' || typeof values[i] == 'number'){
				var selectionDisplay = values[i];
				var selectionValue = values[i];
					dropSelection.innerHTML = selectionDisplay;
			}else{
				var selectionDisplay = values[i].display;
				var selectionValue = values[i].value;
					dropSelection.innerHTML = selectionDisplay;
			}

			if(i == this.index)				
				this.setDropDownText(selectionDisplay);		
				dropSelection.objref = this;
				
				if(data && data.match("[{|}]{1}")) {
					data	=	data.substring(1, data.length - 2);
				}
				
				if(!data)
					dropSelection.setAttribute('data', '{"index": "' + i +'", "value": "' + selectionValue + '", "display": "' + selectionDisplay + '"}');
				else
					dropSelection.setAttribute('data', '{"index": "' + i +'", "value": "' + selectionValue + '", "display": "' + selectionDisplay + '", ' + data + '}');
			addListener(dropSelection, 'click', this.itemSelected);
			addListener(dropSelection, 'mouseover', this.itemMouseOver);
			addListener(dropSelection, 'mouseout', this.itemMouseOut);
			this.items.push(dropSelection);
		}
	
	if(this.scrollbar) this.scrollbar.parentNode.removeChild(this.scrollbar);
	var scrollbar						=	document.createElement('div');
		scrollbar.id					=	'dropdownScrollbar_' + this.dropdownid;
		scrollbar.style.position		=	'absolute';
		scrollbar.style.left			=	(this.mask.offsetLeft + (this.mask.offsetWidth - this.holder.offsetHeight)) + 'px';
		scrollbar.style.top				=	parseInt(this.mask.style.top)+1.5+'px';
		scrollbar.style.width			=	this.holder.clientHeight + 2 + 'px';
		if(!this.useTracker){
			scrollbar.style.left			=	(this.mask.offsetLeft + (this.mask.offsetWidth - this.holder.offsetHeight)) + 'px';
			scrollbar.style.width			=	this.holder.clientHeight + 2 + 'px';
		}else{
			scrollbar.style.width = '8px';
			scrollbar.style.left			=	(this.mask.offsetLeft + (this.mask.offsetWidth - 13)) + 'px';
		}
		scrollbar.style.height			=	this.height + 'px'; 
		scrollbar.style.overflow		=	'hidden';
		
		this.scrollbarHeight			= 	this.height;
		this.mask.scrollTop = 0;
	//check to to see if vertical scroll exists		
	if((this.holder.offsetHeight * values.length) >= this.height) {
		this.parentNode.appendChild(scrollbar);
		this.scrollbar					=	scrollbar;		
		this.scroll_area 				= 	new ScrollTabletDiv(this.mask);

		if(!this.useTracker){
			var vertical_scrollbar 	= 	new VerticalScrollBar(this.scrollbar, this.holder.offsetHeight, this.height+1);
			this.scroll_area.setVerticalScroll(vertical_scrollbar, true);
		}else{
			var searchTracker = new ScrollTracker(this.scrollbar,this.trackerColor);
			this.scroll_area.setScrollTracker(searchTracker, true);
		}

		this.scrollbar.style.height		= 	'0px';
		if((this.mobile && !this.useTracker) || this.height < 100){
			this.scrollbar.style.visibility = 'hidden';
		}
	}
	
	this.dispatchEvent('contruct_content_area');		
}

///////////////////////SET DATA ATTRIBUTE/////////////////////////

Dropdown.prototype.setDataAttribute	=	function(index, data) {
		var itemAttributes = this.items[index].getAttribute('data').slice(0,-1);
		
		this.items[index].setAttribute('data', itemAttributes + ', ' + data + '}');
}



///////////////////////CONSTRUCT BUTTON/////////////////////////////

Dropdown.prototype.contruct_button			=	function() {
	
	var button							=	document.createElement('div');
		button.id							=	'dropdownButton_' + this.dropdownid;
		button.style.position				=	'absolute';
		button.style.left					=	(this.mask.offsetLeft + (this.mask.offsetWidth - this.holder.offsetHeight)) + 'px';
		button.style.top					=	(this.holder.offsetTop) + 'px';
		button.style.height					=	this.holder.clientHeight + 4 + 'px';
		button.style.width					=	this.holder.clientHeight + 4 + 'px';
		button.style.cursor					= 	'pointer';
	this.parentNode.appendChild(button);	
	this.button								=	button;
	
	var buttonBox							=	document.createElement('div');
		buttonBox.id						=	'dropdownButtonBox_' + this.dropdownid;
		buttonBox.style.height				=	this.holder.clientHeight + 'px';
		buttonBox.style.width				=	this.holder.clientHeight + 'px';
		buttonBox.style.position			=	'absolute';
		
		buttonBox.style.backgroundColor		=   this.buttonColor;
		buttonBox.style.border 				= 	'2px solid '+this.buttonBorderColor;
		buttonBox.style.borderRadius 		= 	this.borderRadius;
		if(!this.doubleArrow)
			buttonBox.innerHTML					= 	'<img src="'+ IMGHOST + '/html5/dropdown_arrow.png" style="height: '+((this.holder.clientHeight/2))+'px; position: absolute; top: '+((this.holder.clientHeight/4)+1)+'px; left: '+(this.holder.clientHeight/4)+'px;"></img>';
		else{
			buttonBox.innerHTML					+= 	'<div style="width: 0;height: 0;border-left: '+((this.holder.clientHeight/2)*.6)+'px solid transparent;border-right: '+((this.holder.clientHeight/2)*.6)+'px solid transparent;border-bottom: '+((this.holder.clientHeight/2)*.55)+'px solid '+this.arrowColor+';font-size: 0;line-height: 0; margin-left: '+(this.holder.clientHeight*.225)+'px; margin-top: '+(this.holder.clientHeight*.175)+'px;"></div>';
			buttonBox.innerHTML					+= 	'<div style="width: 0;height: 0;border-left: '+((this.holder.clientHeight/2)*.6)+'px solid transparent;border-right: '+((this.holder.clientHeight/2)*.6)+'px solid transparent;border-top: '+((this.holder.clientHeight/2)*.55)+'px solid '+this.arrowColor+';font-size: 0;line-height: 0; margin-left: '+(this.holder.clientHeight*.225)+'px; margin-top: '+(this.holder.clientHeight*.125)+'px;"></div>';
		}

	this.button.appendChild(buttonBox);	
	this.buttonBox 							= 	buttonBox;
	
	if(this.hideGradient != true){
		var gradient							=	document.createElement('div');
			gradient.id							=	'dropdownButtonGradient_' + this.dropdownid;
			gradient.style.height				=	(this.holder.offsetHeight)/2+ 'px';
			gradient.style.width				=	this.holder.clientHeight + 'px';
			gradient.style.position				=	'absolute';
			gradient.style.left					=	'2px';
			gradient.style.top					=	'2px';
			gradient.style.background			=   '-moz-linear-gradient(top, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0) 100%)'; /* FF3.6+ */
			gradient.style.background			= 	'-webkit-gradient(linear, left top, left bottom, color-stop(0%,rgba(255,255,255,0.6)), color-stop(100%,rgba(255,255,255,0)))'; /* Chrome,Safari4+ */
			gradient.style.background			= 	'-webkit-linear-gradient(top, rgba(255,255,255,0.6) 0%,rgba(255,255,255,0) 100%)'; /* Chrome10+,Safari5.1+ */
			gradient.style.background			= 	'-o-linear-gradient(top, rgba(255,255,255,0.6) 0%,rgba(255,255,255,0) 100%)'; /* Opera 11.10+ */
			gradient.style.background			= 	'-ms-linear-gradient(top, rgba(255,255,255,0.6) 0%,rgba(255,255,255,0) 100%)'; /* IE10+ */
			gradient.style.background			= 	'linear-gradient(to bottom, rgba(255,255,255,0.6) 0%,rgba(255,255,255,0) 100%)'; /* W3C */
			gradient.style.filter				=	'progid:DXImageTransform.Microsoft.gradient( startColorstr="#ccffffff", endColorstr="#00ffffff",GradientType=0 )'; /* IE6-9 */
			gradient.style.borderBottomRightRadius = '100px 35px';
			gradient.style.borderBottomLeftRadius  = '100px 35px';
	
			this.button.appendChild(gradient);
			this.gradient							=	gradient;
	}
	
	button.objref = this;
	
	addListener(button, 'click', this.openClose);
}

///////////////////////DECONSTRUCT ELEMENTS/////////////////////////////
Dropdown.prototype.__deconstruct			=	function(){
	
	if(this.gradient) {
		this.gradient.parentNode.removeChild(this.gradient);
	}
	if(this.buttonBox) {
		this.buttonBox.parentNode.removeChild(this.buttonBox);
	}
	if(this.button) {
		removeListener(this.button, 'click', this.openClose);
		this.button.parentNode.removeChild(this.button);
	}
	if(this.mask) {
		this.mask.parentNode.removeChild(this.mask);
	}
	
}

//////////////////////////////////////////////////////////////////////
//////						EVENTS								//////
//////////////////////////////////////////////////////////////////////


Dropdown.prototype.itemSelected		=	function(event) { 
	var target						= getEventTarget(event);
	var obj							= target.objref;
	var data 						= eval("(" + target.getAttribute('data') + ")");
	
	if(obj.selectClose == true){
		obj.closeDropdown(obj);
	}	
	
	if(obj.index >= 0){
		obj.deselectIndex(obj.index);
	}
	obj.index						= data.index;
	obj.value						= data.value;
	
	if(data.value == data.display)
		obj.setDropDownText(data.value);
	else
		obj.setDropDownText(data.display);
		
	obj.items[data.index].style.color = obj.selectedColor;
	obj.items[data.index].style.backgroundColor = obj.selectedBgColor;	
	
	
	obj.dispatchEvent("itemSelected");
}
Dropdown.prototype.deselectIndex				=		function(index) { 
		this.items[index].style.color			= 		this.fontColor;
		this.items[index].style.backgroundColor = 		this.backgroundColor;
}
//////////////////////////////////////////////////////////////////////

Dropdown.prototype.itemMouseOver	=	function(event) { 
	var target 						= getEventTarget(event);
	var obj							= target.objref;
	var data 						= eval("(" + target.getAttribute('data') + ")");

	if(obj.index != data.index){
		obj.items[data.index].style.color = obj.overColor;
		obj.items[data.index].style.backgroundColor = obj.overBgColor;
	}
	obj.dispatchEvent("itemMouseOver");
}

//////////////////////////////////////////////////////////////////////

Dropdown.prototype.itemMouseOut	=	function(event) { 
	var target  				= getEventTarget(event);
	var obj						= target.objref;
	var data 					= eval("(" + target.getAttribute('data') + ")");
	
	if(obj.index != data.index){
		obj.items[data.index].style.color = obj.fontColor;
		obj.items[data.index].style.backgroundColor = obj.backgroundColor;
	}
	obj.dispatchEvent("itemMouseOut");
}

//////////////////////////////////////////////////////////////////////

Dropdown.prototype.openClose		=	function(event) {
	var target 						= getEventTarget(event);
	var obj							= target.objref;
	trace(obj.open,obj.moving)
	if(obj.open == 1 && obj.moving == false){
			obj.closeDropdown(obj);
		}else if (obj.open == 0 && obj.moving == false){
			obj.openDropdown(obj);
		}

	if(closeOtherDrops){
		for(var i=0;i<active_dropdowns.length;i++){
			var dropObj = active_dropdowns[i];
			if(dropObj.open == 1 && dropObj.moving == false){
				dropObj.closeDropdown(dropObj,false);
			}
		}
	}
}

//////////////////////////////////////////////////////////////////////
Dropdown.prototype.openDropdown 	= function(obj){
		obj.moving 					= true;
		obj.mask.style.visibility 	= 'inherit';
		var expandMask 				= new Tween(obj.mask, 'height', obj.mask.offsetHeight, obj.height, 250);
		if(obj.index > 0)
			obj.scroll_area.setVPosition((obj.holder.offsetHeight*obj.index)-((obj.height-obj.holder.offsetHeight)/2));
		
		if(obj.scrollbar != '' ){
			var expandScrollBar 	= new Tween(obj.scrollbar, 'height', obj.mask.offsetHeight, obj.height+1, 250);
		}

		addListener(expandMask, 'finish', function(){
			obj.open = 1;			
			obj.moving 	= false;
			if(obj.disableFlip == false)
				obj.vFlip(obj.button, obj.open);
		});
		obj.dispatchEvent("dropdownOpen");
}
//////////////////////////////////////////////////////////////////////
Dropdown.prototype.closeDropdown 	= function(obj,calldispatch){
		obj.moving 					= true;
		var useDispatch = true;
		if(typeof calldispatch == 'boolean'){
			useDispatch = calldispatch;
		}

		var contractMask 			= new Tween(obj.mask, 'height', obj.mask.offsetHeight, 0, 250);
		
		if(obj.scrollbar != '')
			var contractScrollBar 	= new Tween(obj.scrollbar, 'height', obj.mask.offsetHeight, 0, 250);
		
		addListener(contractMask, 'finish', function(){
			obj.open = 0;			
			obj.moving = false;

			if(obj.disableFlip == false)
				obj.vFlip(obj.button, obj.open);
			obj.mask.style.visibility = 'hidden';
		});
		if(useDispatch){
			obj.dispatchEvent("dropdownClose");
		}
}


//////////////////////////////////////////////////////////////////////

Dropdown.prototype.vFlip			=	function(obj, flip) { 
	if(flip == 1){
		obj.style.MozTransform 		= 'scaleY(-1)';
		obj.style.OTransform 		= 'scaleY(-1)';
		obj.style.WebkitTransform 	= 'scaleY(-1)';
		obj.style.transform 		= 'scaleY(-1)';
		obj.style.filter 			= 'FlipV';
		obj.style.MsFilter 			= 'FlipV';
	}else{
		obj.style.MozTransform 		= 'scaleY(1)';
		obj.style.OTransform 		= 'scaleY(1)';
		obj.style.WebkitTransform 	= 'scaleY(1)';
		obj.style.transform 		= 'scaleY(1)';
		obj.style.filter 			= 'FlipV';
		obj.style.MsFilter 			= 'FlipV';
	}
}


Dropdown.prototype.setDropDownText	=	function(text) { 
	var html						= text;
	this.holder.innerHTML 			= html;
	
}

Dropdown.prototype.setIndex	=	function(index) { 

	if(typeof(index) == 'string'){
		index 									= parseInt(index);
	}

	if (this.open == 1){
		this.mask.style.height = '0px';
		this.mask.style.visibility 				= 'hidden';
		this.scrollbar.style.height 			= '0px';
		this.scrollbar.style.visibility 		= 'hidden';
		this.open = 0;
		this.vFlip(this.button, this.open);
	}

	if(this.length-1 < index || index < 0){
		var element									= this.dropdown_content.getElementsByTagName('div');
		
		if(this.index >= 0){
			element[this.index].style.color	= this.fontColor;
			element[this.index].style.backgroundColor = this.backgroundColor;
		}
	
		this.index								= -1;
		this.value								= '';
		this.setDropDownText("--");
		return;
	}
	var element									= this.dropdown_content.getElementsByTagName('div');
	var data 									= eval("(" + element[index].getAttribute('data') + ")");
	
	if(this.index >= 0){
		element[this.index].style.color	= this.fontColor;
		element[this.index].style.backgroundColor = this.backgroundColor;
	}

	this.index									= data.index;
	this.value									= data.value;

	if(data.value == data.display)
		this.setDropDownText(data.value);
	else
		this.setDropDownText(data.display);

	element[data.index].style.color 			= this.selectedColor;
	element[data.index].style.backgroundColor 	= this.selectedBgColor;
	this.dispatchEvent('indexSet');
}

//////////////////////////////////////////////////////////////////////
//////							THEME							//////
//////////////////////////////////////////////////////////////////////

/* first parameter must be an object passing colors for custom dropdown box
	ex. 
	var custom	=		{
							border_color		: '',	
							inside_color		: '',	
							font_color			: '',	
							button_color		: '',	
							over_color			: ''
							selected_color		: ''
						}
	
 */

/////////////////////////CUSTOM THEME////////////////////////////////
 
Dropdown.prototype.custom_colors		=	function(obj, style){
	//custom theme still needs to be coded. Left uncoded since it was not need at present. 5.14.13
	
	if(typeof obj == 'object') {
		for(var j in obj) 
			if(obj[j] != '')
				this[j + ''] = obj[j];
	}
	this.holder.setAttribute('style', style);
}

Dropdown.prototype.newGreen				=	function(){
	
	//content area
		//Normal State
		this.fontColor					=	'#FFFFFF';
		this.backgroundColor			=	'#26ba57';
		
		//Hover State
		this.overColor					=	'#26ba57';
		this.overBgColor				=	'#FFFFFF';
		
		//Selected State
		this.selectedColor				=	'#26ba57';
		this.selectedBgColor			=	'#FFFFFF';
	
		//Border
		this.borderColor				=	'#26ba57';
		//Arrow
		this.arrowColor					=	'#26ba57';
	//Font
	this.fontFamily						= 	'AofLCenturyGothic';
	this.insideFontColor				=	'#FFFFFF';

	//Button
	this.buttonColor					=	'#FFFFFF';
	this.buttonBorderColor				=	'#26ba57';
	//Mask background color
	this.maskBGColor			 	= 	'#26ba57';

	this.hideGradient				= true;
	this.borderRadius				= '2px';
	this.disableFlip				= true;
	this.doubleArrow				= true;
	this.useTracker 				= true;
	this.trackerColor				= 'white';
}


Dropdown.prototype.newLook				=	function(){
	
	//content area
		//Normal State
		this.fontColor					=	'#000000';
		this.backgroundColor			=	'#FFFFFF';
		
		//Hover State
		this.overColor					=	'#FFFFFF';
		this.overBgColor				=	'#00408A';
		
		//Selected State
		this.selectedColor				=	'#000000';
		this.selectedBgColor			=	'#D3E8FC';
	
		//Border
		this.borderColor				=	'#4293D5';

	//Font
	this.fontFamily						= 	'AofLCenturyGothic';
	this.insideFontColor				=	'#40A7EC';

	//Button
	this.buttonColor					=	'#4293D5';
	this.buttonBorderColor				=	'#4293D5';
	
	
}


/////////////////////////BLUE THEME//////////////////////////////////

Dropdown.prototype.blue					=	function(){
	
	//content area
		//Normal State
		this.fontColor					=	'#000000';
		this.backgroundColor			=	'#FFFFFF';
		
		//Hover State
		this.overColor					=	'#FFFFFF';
		this.overBgColor				=	'#00408A';
		
		//Selected State
		this.selectedColor				=	'#000000';
		this.selectedBgColor			=	'#D3E8FC';
	
		//Border
		this.borderColor				=	'#66A7EB';

	//Font
	this.fontFamily						= 	'AofLCenturyGothic';
	this.insideFontColor				=	'#3A559C';

	//Button
	this.buttonColor					=	'#0360C7';
	this.buttonBorderColor				=	'#1B438A';
	
	
}
Dropdown.prototype.green				=	function(){
//The green color scheme is a place holder and might need to be adjusted. 5.14.13 
		//Normal State
		this.fontColor					=	'#000000';
		this.backgroundColor			=	'#FFFFFF';
		
		//Hover State
		this.overColor					=	'#FFFFFF';
		this.overBgColor				=	'#086F00';
		
		//Selected State
		this.selectedColor				=	'#000000';
		this.selectedBgColor			=	'#ADDFA7';
	
		//Border
		this.borderColor				=	'#339F27';

	//Font
	this.fontFamily						= 	'AofLCenturyGothic';
	this.insideFontColor				=	'#3A559C';

	//Button
	this.buttonColor					=	'#1D8D13';
	this.buttonBorderColor				=	'#115D09';
}
Dropdown.prototype.yellow				=	function(){
	//yellow theme still needs to be coded. Left uncoded since it was not need at present. 5.14.13
}


//////////////////////////////////////////////////////////////////////
//////						GENERAL								//////
//////////////////////////////////////////////////////////////////////

Dropdown.prototype.get_style							= 	function(dom, type){
	if(!dom.hasAttribute('style')) return '';
	var style							= dom.getAttribute('style');
	var styles							= style.split(";");
	var picked							= '';
	for(var i = 0; i < styles.length; i++)
		{
			var domstyle				= styles[i].split(":");
			if(domstyle.length > 1)
				{
					domstyle[0]			= domstyle[0].replace(" ", "");
					domstyle[1]			= domstyle[1].replace(" ", "");
					if(domstyle[0] == type) picked	= domstyle[1];
				}
		}
	return picked;
}



Dropdown.prototype.serialize							= 	function(object, seperator){
		var string						= '';
		var stringVars					= new Array();
		if(object && typeof object	== 'object')
			{
				for(var j in object) 
					if(object[j] && typeof object[j] != 'function' || object[j] == 0 && typeof object[j] != 'function') 
						stringVars.push(j + '=' + object[j]);
						
				if(seperator)
					string					= stringVars.join(seperator);
				else
					string					= stringVars.join("&");
			}
		return string;
	}		
Dropdown.prototype.concatAudio						= 	function(array){
		if(typeof array == 'object' && array.length != 0)
			{
				if(array[0])
					{
						var currentAudio 							= array.shift();
							currentAudio.objref						= this;
						var array								= array;
							addListener(currentAudio,'complete',function()
								{	
									var obj		= this.objref;
										if(array[0]) obj.concatAudio(array); 
								}
							,false);
							currentAudio.play();
					}
			}
	}	
Dropdown.prototype.hasClass 							= 	function(element, classname){
	if(typeof element == 'string') 
		var dom						= document.getElementById(element);
	else 
		var dom						= element;
	var clsstr						= dom.className;
	var str							= '';
	if(clsstr != '')
		{
			var splcls						= clsstr.split(" ");
			
			for(var i = 0; i < splcls.length; i++)
				if(splcls[i] == classname) return true;
				
			return false;
		}
	else
		return false;

}
Dropdown.prototype.addClass 							= 	function(element, classname, before){
	if(typeof element == 'string') 
		var dom						= document.getElementById(element);
	else 
		var dom						= element;
	var clsstr						= dom.className;
	var str							= '';
	if(clsstr != '')
		{
			if(before)
				str					+= classname;	
			var splcls						= clsstr.split(" ");
			for(var i = 0; i < splcls.length; i++)
				str					+= splcls[i] + ' ';
				
			if(!before)
				str					+= classname;
		}
	else
		str							= classname;
		
	dom.className			= str;
	return str;
}
Dropdown.prototype.removeClass 						= 	function (element, classname){
	if(typeof element == 'string') 
		var dom						= document.getElementById(element);
	else 
		var dom						= element;
	var clsstr						= dom.className;
	var str							= '';
	if(clsstr != '')
		{
			var splcls						= clsstr.split(" ");
				
			for(var i = 0; i < splcls.length; i++)
				{
					if(splcls[i] == classname) 
						continue;
					else	
						str		   += ' ' + splcls[i] + ' ';
				}
		}
	dom.className			= str;
	return str;
}
Dropdown.prototype.check_properties					=	function(class_obj){
	for(var j in class_obj) {
		if(typeof class_obj[j] != 'object' && typeof class_obj[j] != 'function') {
			trace("class property name ", j , " <br>class property value ", class_obj[j], "<br>");
		}
	}
}
Dropdown.prototype.check_objects						=	function(class_obj){
	for(var j in class_obj) {
		if(typeof class_obj[j] != 'string' && typeof class_obj[j] != 'function') {
			trace("class object name ", j , " <br>class object value ", class_obj[j], "<br>");
		}
	}
}
Dropdown.prototype.check_methods						=	function(class_obj){
	for(var j in class_obj) {
		if(typeof class_obj[j] != 'object' && typeof class_obj[j] != 'string') {
			trace("class method key ", j , " <br>class method value ", class_obj[j], "<br>");
		}
	}
}
Dropdown.prototype.view_object						=	function(obj){
	if(obj && typeof obj == 'object') {
		for(var j in obj) 
			trace("key is ", j, " value is ", obj[j], "<br>");
	}
}
Dropdown.prototype.rotate								= 	function(obj, pos){
		obj.currentRotation = pos;		
		obj.style.transform = "rotate(" + pos + "deg)";
		obj.style.MsTransform = "rotate(" + pos + "deg)";
		obj.style.MozTransform = "rotate(" + pos + "deg)";
		obj.style.WebkitTransform = "rotate(" + pos + "deg)";
		obj.style.OTransform = "rotate(" + pos + "deg)";
}
Dropdown.prototype.get_style							= 	function(dom, type){
	if(!dom.hasAttribute('style')) return '';
	var style						= dom.getAttribute('style');
	var styles						= style.split(";");
	var picked						= '';
	for(var i = 0; i < styles.length; i++)
		{
			var domstyle			= styles[i].split(":");
			if(domstyle.length > 1)
				{
					domstyle[0]		= domstyle[0].replace(" ", "");
					domstyle[1]		= domstyle[1].replace(" ", "");
					if(domstyle[0] == type) picked	= domstyle[1];
				}
		}
	return picked;
}

enableEventHandling(Dropdown);