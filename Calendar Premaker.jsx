// Calendar Premaker (BD version)
// Horizontal Orientation
// BD Style (Sunday first)
// version 0.3.2
// Modified by ChatGPT for Mahinur Rahman

var sMS = "January,February,March,April,May,June,July,August,September,October,November,December";
var sDS = "sun,mon,tue,wed,thu,fri,sat"; // BD week start Sunday
var sHS = "1/1,21/2,26/3,14/4,1/5,30/3,31/3,1/4,24/5,16/6,17/6,18/6,6/7,15/8,16/12,25/12"; // Sample BD holidays
var pMS = "Enter names for months (by comma)\nOr leave unchanged";
var pDS = "Enter names for days of week (by comma)\nOr leave unchanged";
var pHS = "Enter holidays, like this D/M[,D/M,D/M...]";
var AppCap = "Calendar Premaker (for Adobe Illustrator CS)\n\n";
var iStr = "To correct appearance use:\n\n"+
	   "Window -> Type -> Paragraph Styles\n"+
	   "Window -> Type -> Character Styles\n"+
	   "Window -> Swatches\n\n";
var pStr = AppCap+"Enter value of the year.\nFor example: 2025";
Year = 2025;
Year = prompt(pStr, Year); 

if(Year>2000 && Year<2100 && Year != null) {			
	MS = prompt(AppCap+pMS, sMS);
	if(MS){
		MC = MS.split(',',12);
		for(i=0;i<12;i++) if(MC[i]==null) MC.push(' ');
		for(i=0;i<12;i++) if(MC[i]=='') MC[i]=' ';
		
		DS = prompt(AppCap+pDS, sDS);
		if(DS) {
			DC = DS.split(',',7);
			for(i=0;i<7;i++) if(DC[i]==null) DC.push(' ');
			for(i=0;i<7;i++) if(DC[i]=='') DC[i]=' ';
			
			HS = prompt(AppCap+pHS, sHS);
			if(HS == '') HS = ' ';
			if(HS) {
				HC = HS.split(',');
				HD = Array();
				for(i=0;i<HC.length;i++) {
				  DM = HC[i].split('/');
				  HD.push(DM[0],DM[1]);
				}
				
				makeCalendar();
			}
		}
	}
}

function makeCalendar() {
	CellHeight = 20;
	CellWidth  = 30;
	
	var MN = Array(31,(Year%4==0)?29:28,31,30,31,30,31,31,30,31,30,31);
	var DocTop = CellHeight*52;
	var docRef = documents.add(DocumentColorSpace.CMYK,CellWidth*18,DocTop+CellHeight*3);
	
	waitRef = docRef.textFrames.add();
	waitRef.contents = "Processing...";
	waitRef.top = DocTop;
	waitRef.left = 10;
	waitRef.height = 100;
	waitRef.width = 300;
	redraw();
	
	docRef.swatches.removeAll();
	try{docRef.characterStyles.removeAll()} catch(e){}
	
	// Colors & styles setup (same as original)
	var nColor = new CMYKColor();
	var nSpotColor = new SpotColor();
	
	var DefaultSpot = docRef.spots.add();
	nColor.cyan = 90; nColor.magenta = 60; nColor.yellow = 0; nColor.black = 0;
	DefaultSpot.name = "Week day color";
	DefaultSpot.colorType = ColorModel.PROCESS;
	DefaultSpot.color = nColor;
	
	var HolidaySpot = docRef.spots.add();
	nColor.cyan = 0; nColor.magenta = 90; nColor.yellow = 60; nColor.black = 0;
	HolidaySpot.name = "Holiday color";
	HolidaySpot.colorType = ColorModel.PROCESS;
	HolidaySpot.color = nColor;
	
	var DaySpot = docRef.spots.add();
	nColor.cyan = 0; nColor.magenta = 0; nColor.yellow = 0; nColor.black = 70;
	DaySpot.name = "Color of caption of week day";
	DaySpot.colorType = ColorModel.PROCESS;
	DaySpot.color = nColor;
	
	var HolydayDaySpot = docRef.spots.add();
	nColor.cyan = 0; nColor.magenta = 60; nColor.yellow = 20; nColor.black = 50;
	HolydayDaySpot.name = "Color of caption of weekend";
	HolydayDaySpot.colorType = ColorModel.PROCESS;
	HolydayDaySpot.color = nColor;
	
	var CaptionSpot = docRef.spots.add();
	nColor.cyan = 0; nColor.magenta = 0; nColor.yellow = 0; nColor.black = 100;
	CaptionSpot.name = "Color of caption of month";
	CaptionSpot.colorType = ColorModel.PROCESS;
	CaptionSpot.color = nColor;
	
	var DefaultStyle = docRef.characterStyles.add("Week day");
	var HolidayStyle = docRef.characterStyles.add("Holyday");
	var DayCapStyle = docRef.characterStyles.add("Caption of week day");
	var HolydayCapStyle = docRef.characterStyles.add("Caption of weekend");
	var CaptionsStyle = docRef.characterStyles.add("Caption of month");
	
	var charAttr = DefaultStyle.characterAttributes;
	nSpotColor.spot = DefaultSpot;
	charAttr.fillColor = nSpotColor;
	charAttr = HolidayStyle.characterAttributes;
	nSpotColor.spot = HolidaySpot;
	charAttr.fillColor = nSpotColor;
	charAttr = DayCapStyle.characterAttributes;
	nSpotColor.spot = DaySpot;
	charAttr.fillColor = nSpotColor;
	charAttr = HolydayCapStyle.characterAttributes;
	nSpotColor.spot = HolydayDaySpot;
	charAttr.fillColor = nSpotColor;
	charAttr = CaptionsStyle.characterAttributes;
	nSpotColor.spot = CaptionSpot;
	charAttr.fillColor = nSpotColor;
	
	var paraDayStyle = docRef.paragraphStyles.add("Dates");
	var paraAttr = paraDayStyle.paragraphAttributes;
	paraAttr.justification = Justification.RIGHT;
	
	var paraWeekDayStyle = docRef.paragraphStyles.add("Days of week");
	paraAttr = paraWeekDayStyle.paragraphAttributes;
	paraAttr.justification = Justification.RIGHT;
	
	var paraMonthStyle = docRef.paragraphStyles.add("Months");
	paraAttr = paraMonthStyle.paragraphAttributes;
	paraAttr.justification = Justification.LEFT;
	
	LeftMargin = CellWidth;
	for(m=0; m<6; m++){
		var FirstDay = new Date(Year, m, 1).getDay(); // accurate BD day calc
		textRef = docRef.textFrames.add();
		textRef.contents = MC[m];
		textRef.top = DocTop - m*9*CellHeight+CellHeight*2;
		textRef.left = CellWidth + LeftMargin;     
		CaptionsStyle.applyTo(textRef.textRange)
		paraMonthStyle.applyTo(textRef.paragraphs[0], true);
	
		for(i=0; i<7; i++){
			textRef = docRef.textFrames.add();
			textRef.contents = DC[i];
			textRef.top = DocTop - m*9*CellHeight+CellHeight;
			textRef.left = i*CellWidth + LeftMargin;
			(i<6) ? DayCapStyle.applyTo(textRef.textRange) : HolydayCapStyle.applyTo(textRef.textRange);
			paraWeekDayStyle.applyTo(textRef.paragraphs[0], true);
		} 
		for(d=0; d<MN[m]; d++){
			textRef = docRef.textFrames.add();
			textRef.contents = d+1;
			textRef.top = DocTop - ((Math.floor((FirstDay+d)/7)*CellHeight) + m*9*CellHeight);
			textRef.left = (FirstDay+d)%7*CellWidth + LeftMargin;
			paraDayStyle.applyTo(textRef.paragraphs[0], true);
			if ((FirstDay+d)%7 == 5 || (FirstDay+d)%7 == 6) // Fri/Sat weekends
				HolidayStyle.applyTo(textRef.textRange);
			else
				DefaultStyle.applyTo(textRef.textRange);
			if (isHoliday(d+1,m+1)) HolidayStyle.applyTo(textRef.textRange);
		}
	}
	
	LeftMargin = CellWidth*9;
	for(m=6; m<12; m++){
		var FirstDay = new Date(Year, m, 1).getDay(); // accurate BD day calc
		textRef = docRef.textFrames.add();
		textRef.contents = MC[m];
		textRef.top = DocTop - (m-6)*9*CellHeight+CellHeight*2;
		textRef.left = CellWidth + LeftMargin;     
		CaptionsStyle.applyTo(textRef.textRange)
		paraMonthStyle.applyTo(textRef.paragraphs[0], true);
		
		for(i=0; i<7; i++){
			textRef = docRef.textFrames.add();
			textRef.contents = DC[i];
			textRef.top = DocTop - (m-6)*9*CellHeight+CellHeight;
			textRef.left = i*CellWidth + LeftMargin;     
			(i<6) ? DayCapStyle.applyTo(textRef.textRange) : HolydayCapStyle.applyTo(textRef.textRange);
			paraWeekDayStyle.applyTo(textRef.paragraphs[0], true);
		} 
		for(d=0; d<MN[m]; d++){
			textRef = docRef.textFrames.add();
			textRef.contents = d+1;
			textRef.top = DocTop - ((Math.floor((FirstDay+d)/7)*CellHeight) + (m-6)*9*CellHeight);
			textRef.left = (FirstDay+d)%7*CellWidth + LeftMargin;
			paraDayStyle.applyTo(textRef.paragraphs[0], true);
			if ((FirstDay+d)%7 == 5 || (FirstDay+d)%7 == 6) // Fri/Sat weekends
				HolidayStyle.applyTo(textRef.textRange);
			else
				DefaultStyle.applyTo(textRef.textRange);
			if (isHoliday(d+1,m+1)) HolidayStyle.applyTo(textRef.textRange);
		}
	}
	
	waitRef.remove();
	redraw();
	alert(iStr);
}

function isHoliday(day,month)
{
	for(i=0; i<HD.length; i+=2){
		if(day==HD[i] && month==HD[i+1]) return true;
	}
	return false;
}
