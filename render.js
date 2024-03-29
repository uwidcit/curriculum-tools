//const parsedData = require("./output.json");

function makeList(n){
    _ = []
    for(var i = 1; i <= n; i++)
        _[i] = i;
    return _;
}

function makeBlankList(n){
    _ = []
    for(var i = 1; i <= n; i++)
        _[i] = '';
    return _;
}

function mapLCToStr(x, lc){
    if(lc.includes(x))
        return 'X';
    return '';
}

//Make the cells, 1,2,3,4,... for the learning outcomes header
const makeLCHeadHTMLFn = X => `<td width=29 valign=top style='width:21.7pt;border-top:none;border-left:none;
  border-bottom:solid black 1.0pt;border-right:solid black 1.0pt;mso-border-top-alt:
  solid black 1.0pt;mso-border-left-alt:solid black 1.0pt;padding:5.0pt 5.0pt 5.0pt 5.0pt;
  height:19.35pt'>
  <p class=MsoNormal align=center style='text-align:center;line-height:normal;
  mso-pagination:none;border:none;mso-padding-alt:31.0pt 31.0pt 31.0pt 31.0pt;
  mso-border-shadow:yes'><span lang=EN-GB style='font-size:10.0pt;font-family:
  "Times New Roman",serif;mso-fareast-font-family:"Times New Roman";color:black'> ${X}
  <o:p></o:p></span></p>
  </td>`.replace(/^\s+|\s+$/gm, '').split('\n').join('');

//Generates td tags for an array e.g., row = ["Assingment1","X","", ...,"5%","Algorithmic Problems","2 weeks"]
function makeAssessmentRowHTML(row){
    var _ = "<tr style='mso-yfti-irow:2;height:31.85pt'>";
    for (var d in row){
        _ += makeLCHeadHTMLFn(row[d]);
    }
    _ += "</tr>";
    return _;
}

//Generates the td tage for the learning outcomes table header
//      |Learnig outcomes|
//e.g., |1|2|3|....|numLC|
function makeLCColHeading(numLC){

    var _ = "<tr style='mso-yfti-irow:1;height:19.35pt'>";
     for (var i =0 ; i < numLC; i++){
         _ += makeLCHeadHTMLFn(i+1);
     }
     _ += "</tr>";
     return _;
 
 }

//The first row of the table. Note some cells have row span of 2
function makeFirstRow(X){

	var frow = ` <tr style='mso-yfti-irow:0;mso-yfti-firstrow:yes;height:19.6pt'>
  <td width=100 rowspan=2 valign=top style='width:74.95pt;border:solid black 1.0pt;
  padding:5.0pt 5.0pt 5.0pt 5.0pt;height:19.6pt'>
  <p class=MsoNormal align=center style='text-align:center;line-height:normal;
  mso-pagination:none'><b style='mso-bidi-font-weight:normal'><spanlang=EN-GB style='font-size:10.0pt;font-family:"Times New Roman",serif;mso-fareast-font-family:"Times New Roman";color:black'><span
  lang=EN-GB style='font-family:"Times New Roman",serif'>Assessment <o:p></o:p></span></b></p>
  </td>
  <td width=218 colspan=${X} valign=top style='width:163.8pt;border:solid black 1.0pt;
  border-left:none;mso-border-left-alt:solid black 1.0pt;padding:5.0pt 5.0pt 5.0pt 5.0pt;
  height:19.6pt'>
  <p class=MsoNormal align=center style='text-align:center;line-height:normal;
  mso-pagination:none'><b style='mso-bidi-font-weight:normal'><spanlang=EN-GB style='font-size:10.0pt;font-family:"Times New Roman",serif;mso-fareast-font-family:"Times New Roman";color:black'><span
  lang=EN-GB style='font-family:"Times New Roman",serif'>Learning Outcomes <o:p></o:p></span></b></p>
  </td>
  <td width=71 rowspan=2 valign=top style='width:53.5pt;border:solid black 1.0pt;
  border-left:none;mso-border-left-alt:solid black 1.0pt;padding:5.0pt 5.0pt 5.0pt 5.0pt;
  height:19.6pt'>
  <p class=MsoNormal align=center style='margin-top:0in;margin-right:2.5pt;
  margin-bottom:0in;margin-left:6.15pt;margin-bottom:.0001pt;text-align:center;
  line-height:90%;mso-pagination:none'><span class=GramE><b style='mso-bidi-font-weight:
  normal'><spanlang=EN-GB style='font-size:10.0pt;line-height:91%;font-family:"Times New Roman",serif;mso-fareast-font-family:"Times New Roman";color:black'><span
  lang=EN-GB style='font-family:"Times New Roman",serif'>Weighting<spanstyle='mso-spacerun:yes'>&nbsp;
  %</span></b></span><b style='mso-bidi-font-weight:normal'><span lang=EN-GB
  style='font-family:"Times New Roman",serif;mso-fareast-font-family:"Times New Roman";
  color:black'><o:p></o:p></span></b></p>
  </td>
  <td width=115 rowspan=2 valign=top style='width:86.3pt;border:solid black 1.0pt;
  border-left:none;mso-border-left-alt:solid black 1.0pt;padding:5.0pt 5.0pt 5.0pt 5.0pt;
  height:19.6pt'>
  <p class=MsoNormal align=center style='text-align:center;line-height:normal;
  mso-pagination:none'><b style='mso-bidi-font-weight:normal'><spanlang=EN-GB style='font-size:10.0pt;font-family:"Times New Roman",serif;mso-fareast-font-family:"Times New Roman";color:black'><span
  lang=EN-GB style='font-family:"Times New Roman",serif'>Assessment<spanstyle='mso-spacerun:yes'>&nbsp;
  <o:p></o:p></span></b></p>
  <p class=MsoNormal align=center style='text-align:center;line-height:normal;
  mso-pagination:none'><b style='mso-bidi-font-weight:normal'><spanlang=EN-GB style='font-size:10.0pt;font-family:"Times New Roman",serif;mso-fareast-font-family:"Times New Roman";color:black'><span
  lang=EN-GB style='font-family:"Times New Roman",serif'>Description<o:p></o:p></span></b></p>
  </td>
  <td width=66 rowspan=2 valign=top style='width:49.65pt;border:solid black 1.0pt;
  border-left:none;mso-border-left-alt:solid black 1.0pt;padding:5.0pt 5.0pt 5.0pt 5.0pt;
  height:19.6pt'>
  <p class=MsoNormal align=center style='text-align:center;line-height:normal;
  mso-pagination:none'><b style='mso-bidi-font-weight:normal'><spanlang=EN-GB style='font-size:10.0pt;font-family:"Times New Roman",serif;mso-fareast-font-family:"Times New Roman";color:black'><span
  lang=EN-GB style='font-family:"Times New Roman",serif'>Duration<o:p></o:p></span></b></p>
  </td>
 </tr>`;
 
 return frow.replace(/^\s+|\s+$/gm, '').split('\n').join('');
}

//The last row of the table, col spans set the same as the first row
function makeTotalsRow(numLC){
    var totalsRow = ` <tr style='mso-yfti-irow:7;mso-yfti-lastrow:yes;height:19.6pt'>
    <td width=100 valign=top style='width:74.95pt;border:solid black 1.0pt;
    border-top:none;mso-border-top-alt:solid black 1.0pt;padding:5.0pt 5.0pt 5.0pt 5.0pt;
    height:19.6pt'>
    <p class=MsoNormal style='margin-left:5.2pt;line-height:normal;mso-pagination:
    none'><span lang=EN-GB style='font-size:10.0pt;font-family:"Times New Roman",serif;
    mso-fareast-font-family:"Times New Roman";color:black'>Total % <o:p></o:p></span></p>
    </td>
    <td width=218 colspan=${numLC} valign=top style='width:163.8pt;border-top:none;
    border-left:none;border-bottom:solid black 1.0pt;border-right:solid black 1.0pt;
    mso-border-top-alt:solid black 1.0pt;mso-border-left-alt:solid black 1.0pt;
    padding:5.0pt 5.0pt 5.0pt 5.0pt;height:19.6pt'></td>
    <td width=71 valign=top style='width:53.5pt;border-top:none;border-left:none;
    border-bottom:solid black 1.0pt;border-right:solid black 1.0pt;mso-border-top-alt:
    solid black 1.0pt;mso-border-left-alt:solid black 1.0pt;padding:5.0pt 5.0pt 5.0pt 5.0pt;
    height:19.6pt'>
    <p class=MsoNormal style='margin-left:5.2pt;line-height:normal;mso-pagination:
    none'><span lang=EN-GB style='font-size:10.0pt;font-family:"Times New Roman",serif;
    mso-fareast-font-family:"Times New Roman";color:black'>100% <o:p></o:p></span></p>
    </td>
    <td width=115 valign=top style='width:86.3pt;border-top:none;border-left:
    none;border-bottom:solid black 1.0pt;border-right:solid black 1.0pt;
    mso-border-top-alt:solid black 1.0pt;mso-border-left-alt:solid black 1.0pt;
    padding:5.0pt 5.0pt 5.0pt 5.0pt;height:19.6pt'>
    <p class=MsoNormal align=center style='text-align:center;line-height:normal;
    mso-pagination:none'><b style='mso-bidi-font-weight:normal'><spanlang=EN-GB style='font-size:10.0pt;font-family:"Times New Roman",serif;mso-fareast-font-family:"Times New Roman";color:black'><spanstyle='mso-spacerun:yes'><span
    lang=EN-GB>&nbsp; <o:p></o:p></span></b></p>
    <b style='mso-bidi-font-weight:normal'><spanlang=EN-GB style='font-size:10.0pt;font-family:"Times New Roman",serif;mso-fareast-font-family:"Times New Roman";color:black'></b></td>
    <td width=66 valign=top style='width:49.65pt;border-top:none;border-left:
    none;border-bottom:solid black 1.0pt;border-right:solid black 1.0pt;
    mso-border-top-alt:solid black 1.0pt;mso-border-left-alt:solid black 1.0pt;
    padding:5.0pt 5.0pt 5.0pt 5.0pt;height:19.6pt'><b style='mso-bidi-font-weight:
    normal'><spanlang=EN-GB style='font-size:10.0pt;font-family:"Times New Roman",serif;mso-fareast-font-family:"Times New Roman";color:black'></b></td>
   </tr>`;
    
    return totalsRow.replace(/^\s+|\s+$/gm, '').split('\n').join('');
} 


//Generates and array of data from json matrix of assesments and learning outcomes
//like  row = ["Assingment1","X","", ...,"5%","Algorithmic Problems","2 weeks"]
//to be used to build html
function makeRowData(numLC,name,lcMaps,weight, desc,duration){
	if(lcMaps == ""){
		lcMaps = []
		
		for(var i =0; i < numLC; i++){
			lcMaps[i] = '';
		}	
	}
	else{

        var matches = lcMaps.match(/\d+/g);
        if(matches !=null){
            matches = matches.map(x => parseInt(x,10));
            lcMaps = makeList(numLC).map(x => mapLCToStr(x,matches));
        } 
        else
            lcMaps = makeBlankList(numLC);
	}
	
    return [name].concat(lcMaps).concat([weight,desc,duration]);
}


//Builds the HTML for the learning outcomes - assessment matrix
//numLC is the number of learning outcomes
function makeTableFromMatrix(numLC, matrix){

	var table = `<table class=MsoNormalTable border=1 cellspacing=0 cellpadding=0 width=571
 style='width:428.2pt;margin-left:58.25pt;border-collapse:collapse;border:none;
 mso-border-alt:solid black 1.0pt;mso-yfti-tbllook:1536;mso-padding-alt:0in 5.4pt 0in 5.4pt;
 mso-border-insideh:1.0pt solid black;mso-border-insidev:1.0pt solid black'>`;
 
	table+= makeFirstRow(numLC);
	table+= makeLCColHeading(numLC);
	
	for(var i in matrix){
		var row = matrix[i];
		//console.log(row['Assessment'], row['Learning Outcomes'], row['Weighting %'], row['Assessment Description'], row['Duration'] );
		table+= makeAssessmentRowHTML(makeRowData(numLC, row['Assessment'], row['Learning Outcomes'], row['Weighting %'], row['Assessment Description'], row['Duration'] ));
	}
	
	//table+= makeAssessmentRowHTML(makeRowData("Assingment #1","5,3","5%","Algorithmic Problems","2 weeks"));
	//table+= makeAssessmentRowHTML(makeRowData("Assingment #2","1,2,4","5%","Algorithmic Problems Again","2 weeks"))
	
	table+= makeTotalsRow(numLC);
	
	table+= "</table>";
	return table;
}

const ccRow = (i,text) => `<p class="MsoNormal" style="margin-top:10.15pt;margin-right:0in;margin-bottom:
0in;margin-left:67.35pt;margin-bottom:.0001pt;line-height:normal;mso-pagination:
none"><span lang="EN-GB" style="font-family:&quot;Times New Roman&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;color:black">${i}. ${text}<span style="mso-spacerun:yes">&nbsp; </span><o:p></o:p></span></p>`.replace(/^\s+|\s+$/gm, '').split('\n').join('');

function renderCourseLOC(courseContent){
    var cc = "";
    
    //The first line is always
    //Upon the successful completion of this course, the student will be able to:
    for(var i = 1; i < courseContent.length; i++){
        var text = courseContent[i];
        cc += ccRow(i,text);
    }
    
    return cc;
    
}

const contactHoursRow = info => `<tr style="mso-yfti-irow:1;height:19.6pt">
    <td width="122" valign="top" style="width:91.8pt;border:solid black 1.0pt;
    border-top:none;mso-border-top-alt:solid black 1.0pt;padding:5.0pt 5.0pt 5.0pt 5.0pt;
    height:19.6pt">
    <p class="MsoNormal" style="margin-left:5.1pt;line-height:normal;mso-pagination:
    none"><span lang="EN-GB" style="font-size:10.0pt;font-family:&quot;Times New Roman&quot;,serif;
    mso-fareast-font-family:&quot;Times New Roman&quot;;color:black">${info["Type"]} <o:p></o:p></span></p>
    </td>
    <td width="160" valign="top" style="width:119.65pt;border-top:none;border-left:
    none;border-bottom:solid black 1.0pt;border-right:solid black 1.0pt;
    mso-border-top-alt:solid black 1.0pt;mso-border-left-alt:solid black 1.0pt;
    padding:5.0pt 5.0pt 5.0pt 5.0pt;height:19.6pt">
    <p class="MsoNormal" style="margin-left:6.3pt;line-height:normal;mso-pagination:
    none"><span lang="EN-GB" style="font-size:10.0pt;font-family:&quot;Times New Roman&quot;,serif;
    mso-fareast-font-family:&quot;Times New Roman&quot;;color:black">${info["Duration"]} <o:p></o:p></span></p>
    </td>
    <td width="160" valign="top" style="width:119.7pt;border-top:none;border-left:
    none;border-bottom:solid black 1.0pt;border-right:solid black 1.0pt;
    mso-border-top-alt:solid black 1.0pt;mso-border-left-alt:solid black 1.0pt;
    padding:5.0pt 5.0pt 5.0pt 5.0pt;height:19.6pt">
    <p class="MsoNormal" style="margin-left:4.65pt;line-height:normal;mso-pagination:
    none"><span lang="EN-GB" style="font-size:10.0pt;font-family:&quot;Times New Roman&quot;,serif;
    mso-fareast-font-family:&quot;Times New Roman&quot;;color:black">${info["Contact Hours"]}<o:p></o:p></span></p>
    </td>
    <td width="128" valign="top" style="width:96.25pt;border-top:none;border-left:
    none;border-bottom:solid black 1.0pt;border-right:solid black 1.0pt;
    mso-border-top-alt:solid black 1.0pt;mso-border-left-alt:solid black 1.0pt;
    padding:5.0pt 5.0pt 5.0pt 5.0pt;height:19.6pt">
    <p class="MsoNormal" style="margin-left:4.95pt;line-height:normal;mso-pagination:
    none"><span lang="EN-GB" style="font-size:10.0pt;font-family:&quot;Times New Roman&quot;,serif;
    mso-fareast-font-family:&quot;Times New Roman&quot;;color:black">${info["Credit Hours"]}<o:p></o:p></span></p>
    </td>
   </tr>`.replace(/^\s+|\s+$/gm, '').split('\n').join('');

function renderContactHours(ch){
    var chHTML = `<table class="MsoNormalTable" border="1" cellspacing="0" cellpadding="0" width="570" style="margin-left:68.15pt;border-collapse:collapse;mso-table-layout-alt:fixed;
    border:none;mso-border-alt:solid black 1.0pt;mso-yfti-tbllook:1536;mso-padding-alt:
    5.0pt 5.0pt 5.0pt 5.0pt;mso-border-insideh:1.0pt solid black;mso-border-insidev:
    1.0pt solid black">
    <tbody>`;

    const contactHoursHeader = `<tr style="mso-yfti-irow:0;mso-yfti-firstrow:yes;height:43.05pt">
<td width="122" valign="top" style="width:91.8pt;border:solid black 1.0pt;
padding:5.0pt 5.0pt 5.0pt 5.0pt;height:43.05pt">
<p class="MsoNormal" align="center" style="text-align:center;line-height:normal;
mso-pagination:none"><b style="mso-bidi-font-weight:normal"><span lang="EN-GB" style="font-size:10.0pt;font-family:&quot;Times New Roman&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;color:black">Type <o:p></o:p></span></b></p>
</td>
<td width="160" valign="top" style="width:119.65pt;border:solid black 1.0pt;
border-left:none;mso-border-left-alt:solid black 1.0pt;padding:5.0pt 5.0pt 5.0pt 5.0pt;
height:43.05pt">
<p class="MsoNormal" style="margin-left:5.25pt;line-height:normal;mso-pagination:
none"><b style="mso-bidi-font-weight:normal"><span lang="EN-GB" style="font-size:10.0pt;font-family:&quot;Times New Roman&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;color:black">Duration<span style="mso-spacerun:yes">&nbsp;
</span><o:p></o:p></span></b></p>
<p class="MsoNormal" style="margin-top:3.3pt;margin-right:0in;margin-bottom:
0in;margin-left:5.5pt;margin-bottom:.0001pt;line-height:normal;mso-pagination:
none"><b style="mso-bidi-font-weight:normal"><span lang="EN-GB" style="font-size:10.0pt;font-family:&quot;Times New Roman&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;color:black">(Number of weeks)<o:p></o:p></span></b></p>
</td>
<td width="160" valign="top" style="width:119.7pt;border:solid black 1.0pt;
border-left:none;mso-border-left-alt:solid black 1.0pt;padding:5.0pt 5.0pt 5.0pt 5.0pt;
height:43.05pt">
<p class="MsoNormal" style="margin-left:4.85pt;line-height:normal;mso-pagination:
none"><b style="mso-bidi-font-weight:normal"><span lang="EN-GB" style="font-size:10.0pt;font-family:&quot;Times New Roman&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;color:black">Contact Hours<span style="mso-spacerun:yes">&nbsp;
</span><o:p></o:p></span></b></p>
<p class="MsoNormal" style="margin-top:3.3pt;margin-right:0in;margin-bottom:
0in;margin-left:4.85pt;margin-bottom:.0001pt;line-height:normal;mso-pagination:
none"><b style="mso-bidi-font-weight:normal"><span lang="EN-GB" style="font-size:10.0pt;font-family:&quot;Times New Roman&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;color:black">(Weekly)<o:p></o:p></span></b></p>
</td>
<td width="128" valign="top" style="width:96.25pt;border:solid black 1.0pt;
border-left:none;mso-border-left-alt:solid black 1.0pt;padding:5.0pt 5.0pt 5.0pt 5.0pt;
height:43.05pt">
<p class="MsoNormal" style="margin-left:5.1pt;line-height:normal;mso-pagination:
none"><b style="mso-bidi-font-weight:normal"><span lang="EN-GB" style="font-size:10.0pt;font-family:&quot;Times New Roman&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;color:black">Credit Hours<span style="mso-spacerun:yes">&nbsp;
</span><o:p></o:p></span></b></p>
<p class="MsoNormal" style="margin-top:3.3pt;margin-right:0in;margin-bottom:
0in;margin-left:5.1pt;margin-bottom:.0001pt;line-height:normal;mso-pagination:
none"><b style="mso-bidi-font-weight:normal"><span lang="EN-GB" style="font-size:10.0pt;font-family:&quot;Times New Roman&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;color:black">(Weekly)<o:p></o:p></span></b></p>
</td>
</tr>`;

    chHTML += contactHoursHeader;

    for(var i in ch){
        chHTML+= contactHoursRow(ch[i]);
    }

    chHTML+= "</tbody></table>"

    //console.log(chHTML);
    return chHTML;
}


const teachingMethodsRow = info => `<tr style="mso-yfti-irow:1;height:3.0pt">
<td width="207" valign="top" style="width:155.3pt;border:solid windowtext 1.0pt;
border-top:none;mso-border-top-alt:solid windowtext .5pt;mso-border-alt:solid windowtext .5pt;
padding:0in 5.4pt 0in 5.4pt;height:3.0pt">
<p class="MsoNormal" style="margin-top:11.15pt;margin-right:.5pt;margin-bottom:
0in;margin-left:0in;margin-bottom:.0001pt;line-height:90%;mso-pagination:
none"><span lang="EN-GB" style="font-family:&quot;Times New Roman&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;color:black">${info["Name"]}</span><o:p></o:p></p>
</td>
<td width="360" valign="top" style="width:3.75in;border-top:none;border-left:
none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;
mso-border-top-alt:solid windowtext .5pt;mso-border-left-alt:solid windowtext .5pt;
mso-border-alt:solid windowtext .5pt;padding:0in 5.4pt 0in 5.4pt;height:3.0pt">
<p class="MsoNormal" style="margin-top:11.15pt;margin-right:.5pt;margin-bottom:
0in;margin-left:0in;margin-bottom:.0001pt;line-height:90%;mso-pagination:
none"><span lang="EN-GB" style="font-family:&quot;Times New Roman&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;color:black">${info["Description"]}</span><o:p></o:p></p>
</td>
</tr>`.replace(/^\s+|\s+$/gm, '').split('\n').join('');

function renderTeachingMethods(tm){
    const tmHeader = `<table class="MsoTableGrid" border="1" cellspacing="0" cellpadding="0" style="margin-left:51.45pt;border-collapse:collapse;border:none;mso-border-alt:
    solid windowtext .5pt;mso-yfti-tbllook:1184;mso-padding-alt:0in 5.4pt 0in 5.4pt">
    <tbody>
    <tr style="mso-yfti-irow:0;mso-yfti-firstrow:yes">
    <td width="207" valign="top" style="width:155.3pt;border:solid windowtext 1.0pt;
    mso-border-alt:solid windowtext .5pt;padding:0in 5.4pt 0in 5.4pt">
    <p class="MsoNormal" style="margin-top:11.15pt;margin-right:.5pt;margin-bottom:
    0in;margin-left:0in;margin-bottom:.0001pt;line-height:90%;mso-pagination:
    none"><b><span lang="EN-GB" style="font-family:&quot;Times New Roman&quot;,serif;
    mso-fareast-font-family:&quot;Times New Roman&quot;;color:black">Teaching Method<o:p></o:p></span></b></p>
    </td>
    <td width="360" valign="top" style="width:3.75in;border:solid windowtext 1.0pt;
    border-left:none;mso-border-left-alt:solid windowtext .5pt;mso-border-alt:
    solid windowtext .5pt;padding:0in 5.4pt 0in 5.4pt">
    <p class="MsoNormal" style="margin-top:11.15pt;margin-right:.5pt;margin-bottom:
    0in;margin-left:0in;margin-bottom:.0001pt;line-height:90%;mso-pagination:
    none"><b><span lang="EN-GB" style="font-family:&quot;Times New Roman&quot;,serif;
    mso-fareast-font-family:&quot;Times New Roman&quot;;color:black">Description<o:p></o:p></span></b></p>
    </td>
    </tr>`;

    var tmHTML = ""
    tmHTML += tmHeader;
    for(var i in tm){
        tmHTML+= teachingMethodsRow(tm[i]);
    }

    tmHTML+= "</tbody></table>";

    return tmHTML;
}

const learningResourceRow = book => `<p class="MsoNormal" style="margin-top:5.15pt;margin-right:43.35pt;margin-bottom:
0in;margin-left:52.7pt;margin-bottom:.0001pt;line-height:90%;mso-pagination:
none"><span lang="EN-GB" style="font-family:&quot;Times New Roman&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;color:black">${book}<o:p></o:p></span></p>`.replace(/^\s+|\s+$/gm, '').split('\n').join('');


function renderLearningResource(lr){
    var lrHTML = "";
    for(var i in lr){
        if(lr[i] != ""){
            lrHTML += learningResourceRow(lr[i]);
        }
    }
    return lrHTML;
}

const replaceBlankWithX = x => {
    if (x == "") return "X";
    return x;
};

const calRow = info => `<tr style="mso-yfti-irow:2;height:30.6pt">
<td width="48" valign="top" style="width:.5in;border:solid black 1.0pt;
border-top:none;mso-border-top-alt:solid black 1.0pt;padding:5.0pt 5.0pt 5.0pt 5.0pt;
height:30.6pt">
<p class="MsoNormal" align="center" style="text-align:center;line-height:normal;
mso-pagination:none"><span lang="EN-GB" style="font-family:&quot;Times New Roman&quot;,serif;
mso-fareast-font-family:&quot;Times New Roman&quot;;color:black">${info["Week"]}. <o:p></o:p></span></p>
</td>
<td width="174" valign="top" style="width:130.5pt;border-top:none;border-left:
none;border-bottom:solid black 1.0pt;border-right:solid black 1.0pt;
mso-border-top-alt:solid black 1.0pt;mso-border-left-alt:solid black 1.0pt;
padding:5.0pt 5.0pt 5.0pt 5.0pt;height:30.6pt">
<p class="MsoNormal" style="margin-left:5.65pt;line-height:normal;mso-pagination:
none"><span lang="EN-GB" style="font-size:10.0pt;font-family:&quot;Times New Roman&quot;,serif;
mso-fareast-font-family:&quot;Times New Roman&quot;;color:black">${info["Topics"]}<o:p></o:p></span></p>
</td>
<td width="160" valign="top" style="width:119.75pt;border-top:none;border-left:
none;border-bottom:solid black 1.0pt;border-right:solid black 1.0pt;
mso-border-top-alt:solid black 1.0pt;mso-border-left-alt:solid black 1.0pt;
padding:5.0pt 5.0pt 5.0pt 5.0pt;height:30.6pt">
<p class="MsoNormal" style="margin-left:5.0pt;line-height:normal;mso-pagination:
none"><span lang="EN-GB" style="font-family:&quot;Times New Roman&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;color:black">${info["Required Readings"]}<o:p></o:p></span></p>
</td>
<td width="122" valign="top" style="width:91.85pt;border-top:none;border-left:
none;border-bottom:solid black 1.0pt;border-right:solid black 1.0pt;
mso-border-top-alt:solid black 1.0pt;mso-border-left-alt:solid black 1.0pt;
padding:5.0pt 5.0pt 5.0pt 5.0pt;height:30.6pt">
<p class="MsoNormal" style="margin-left:5.2pt;line-height:normal;mso-pagination:
none"><span lang="EN-GB" style="font-family:&quot;Times New Roman&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;color:black">${info["Learning Activities"]}<o:p></o:p></span></p>
</td>
<td width="84" valign="top" style="width:63.2pt;border-top:none;border-left:none;
border-bottom:solid black 1.0pt;border-right:solid black 1.0pt;mso-border-top-alt:
solid black 1.0pt;mso-border-left-alt:solid black 1.0pt;padding:5.0pt 5.0pt 5.0pt 5.0pt;
height:30.6pt">
<p class="MsoNormal" style="mso-pagination:none"><span lang="EN-GB" style="font-family:&quot;Times New Roman&quot;,serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
color:black">${info["Assessment"] }<o:p></o:p></span></p>
</td>
<td width="72" valign="top" style="width:53.7pt;border-top:none;border-left:none;
border-bottom:solid black 1.0pt;border-right:solid black 1.0pt;mso-border-top-alt:
solid black 1.0pt;mso-border-left-alt:solid black 1.0pt;padding:5.0pt 5.0pt 5.0pt 5.0pt;
height:30.6pt">
<p class="MsoNormal" style="mso-pagination:none"><span lang="EN-GB" style="font-family:&quot;Times New Roman&quot;,serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
color:black">${info["Date"]}<o:p></o:p></span></p>
</td>
</tr>`.replace(/^\s+|\s+$/gm, '').split('\n').join('');

function renderCourseCalendar(cal){
    var calHTML = `<table class="MsoNormalTable" border="1" cellspacing="0" cellpadding="0" width="660" style="margin-left:13.0pt;border-collapse:collapse;mso-table-layout-alt:fixed;
    border:none;mso-border-alt:solid black 1.0pt;mso-yfti-tbllook:1536;mso-padding-alt:
    5.0pt 5.0pt 5.0pt 5.0pt;mso-border-insideh:1.0pt solid black;mso-border-insidev:
    1.0pt solid black">
    <tbody><tr style="mso-yfti-irow:0;mso-yfti-firstrow:yes;height:37.3pt">
     <td width="48" rowspan="2" valign="top" style="width:.5in;border:solid black 1.0pt;
     padding:5.0pt 5.0pt 5.0pt 5.0pt;height:37.3pt">
     <p class="MsoNormal" align="center" style="text-align:center;line-height:normal;
     mso-pagination:none"><b style="mso-bidi-font-weight:normal"><span lang="EN-GB" style="font-size:10.0pt;font-family:&quot;Times New Roman&quot;,serif;mso-fareast-font-family:
     &quot;Times New Roman&quot;;color:black">Week <o:p></o:p></span></b></p>
     </td>
     <td width="174" rowspan="2" valign="top" style="width:130.5pt;border:solid black 1.0pt;
     border-left:none;mso-border-left-alt:solid black 1.0pt;padding:5.0pt 5.0pt 5.0pt 5.0pt;
     height:37.3pt">
     <p class="MsoNormal" align="center" style="text-align:center;line-height:normal;
     mso-pagination:none"><b style="mso-bidi-font-weight:normal"><span lang="EN-GB" style="font-size:10.0pt;font-family:&quot;Times New Roman&quot;,serif;mso-fareast-font-family:
     &quot;Times New Roman&quot;;color:black">Topics<o:p></o:p></span></b></p>
     </td>
     <td width="160" rowspan="2" valign="top" style="width:119.75pt;border:solid black 1.0pt;
     border-left:none;mso-border-left-alt:solid black 1.0pt;padding:5.0pt 5.0pt 5.0pt 5.0pt;
     height:37.3pt">
     <p class="MsoNormal" align="center" style="text-align:center;line-height:normal;
     mso-pagination:none"><b style="mso-bidi-font-weight:normal"><span lang="EN-GB" style="font-size:10.0pt;font-family:&quot;Times New Roman&quot;,serif;mso-fareast-font-family:
     &quot;Times New Roman&quot;;color:black">Required<o:p></o:p></span></b></p>
     <p class="MsoNormal" align="center" style="margin-right:9.95pt;text-align:center;
     line-height:normal;mso-pagination:none"><b style="mso-bidi-font-weight:normal"><span lang="EN-GB" style="font-size:10.0pt;font-family:&quot;Times New Roman&quot;,serif;
     mso-fareast-font-family:&quot;Times New Roman&quot;;color:black">Readings<o:p></o:p></span></b></p>
     <p class="MsoNormal" align="center" style="margin-right:9.95pt;text-align:center;
     line-height:normal;mso-pagination:none"><b style="mso-bidi-font-weight:normal"><span lang="EN-GB" style="font-size:10.0pt;font-family:&quot;Times New Roman&quot;,serif;
     mso-fareast-font-family:&quot;Times New Roman&quot;;color:black">Learning<o:p></o:p></span></b></p>
     <p class="MsoNormal" align="center" style="text-align:center;line-height:normal;
     mso-pagination:none"><b style="mso-bidi-font-weight:normal"><span lang="EN-GB" style="font-size:10.0pt;font-family:&quot;Times New Roman&quot;,serif;mso-fareast-font-family:
     &quot;Times New Roman&quot;;color:black">Resources<o:p></o:p></span></b></p>
     </td>
     <td width="122" rowspan="2" valign="top" style="width:91.85pt;border:solid black 1.0pt;
     border-left:none;mso-border-left-alt:solid black 1.0pt;padding:5.0pt 5.0pt 5.0pt 5.0pt;
     height:37.3pt">
     <p class="MsoNormal" style="margin-top:0in;margin-right:4.25pt;margin-bottom:
     0in;margin-left:8.1pt;margin-bottom:.0001pt;text-indent:.1pt;line-height:
     90%;mso-pagination:none"><b style="mso-bidi-font-weight:normal"><span lang="EN-GB" style="font-size:10.0pt;line-height:90%;font-family:&quot;Times New Roman&quot;,serif;
     mso-fareast-font-family:&quot;Times New Roman&quot;;color:black">Learning<o:p></o:p></span></b></p>
     <p class="MsoNormal" style="margin-top:0in;margin-right:4.25pt;margin-bottom:
     0in;margin-left:8.1pt;margin-bottom:.0001pt;text-indent:.1pt;line-height:
     90%;mso-pagination:none"><b style="mso-bidi-font-weight:normal"><span lang="EN-GB" style="font-size:10.0pt;line-height:90%;font-family:&quot;Times New Roman&quot;,serif;
     mso-fareast-font-family:&quot;Times New Roman&quot;;color:black">Activities<o:p></o:p></span></b></p>
     </td>
     <td width="156" colspan="2" valign="top" style="width:116.9pt;border:solid black 1.0pt;
     border-left:none;mso-border-left-alt:solid black 1.0pt;padding:5.0pt 5.0pt 5.0pt 5.0pt;
     height:37.3pt">
     <p class="MsoNormal" align="center" style="text-align:center;mso-pagination:none"><b style="mso-bidi-font-weight:normal"><span lang="EN-GB" style="font-size:10.0pt;
     line-height:115%;font-family:&quot;Times New Roman&quot;,serif;mso-fareast-font-family:
     &quot;Times New Roman&quot;;color:black">Assessment<o:p></o:p></span></b></p>
     </td>
    </tr>
    <tr style="mso-yfti-irow:1;height:23.5pt">
     <td width="84" valign="top" style="width:63.2pt;border-top:none;border-left:none;
     border-bottom:solid black 1.0pt;border-right:solid black 1.0pt;mso-border-top-alt:
     solid black 1.0pt;mso-border-left-alt:solid black 1.0pt;padding:5.0pt 5.0pt 5.0pt 5.0pt;
     height:23.5pt">
     <p class="MsoNormal" align="center" style="text-align:center;line-height:normal;
     mso-pagination:none"><b style="mso-bidi-font-weight:normal"><span lang="EN-GB" style="font-size:10.0pt;font-family:&quot;Times New Roman&quot;,serif;mso-fareast-font-family:
     &quot;Times New Roman&quot;;color:black">Name <o:p></o:p></span></b></p>
     </td>
     <td width="72" valign="top" style="width:53.7pt;border-top:none;border-left:none;
     border-bottom:solid black 1.0pt;border-right:solid black 1.0pt;mso-border-top-alt:
     solid black 1.0pt;mso-border-left-alt:solid black 1.0pt;padding:5.0pt 5.0pt 5.0pt 5.0pt;
     height:23.5pt">
     <p class="MsoNormal" align="center" style="text-align:center;line-height:normal;
     mso-pagination:none"><b style="mso-bidi-font-weight:normal"><span lang="EN-GB" style="font-size:10.0pt;font-family:&quot;Times New Roman&quot;,serif;mso-fareast-font-family:
     &quot;Times New Roman&quot;;color:black">Date<o:p></o:p></span></b></p>
     </td>
    </tr>`;

    for(var i in cal){
        calHTML+= calRow(cal[i]);
    }

    calHTML+= "</tbody></table>";

    return calHTML;
}

function render(parsedData){
    //The first line of course learning outcome is always
    //Upon the successful completion of this course, the student will be able to:
    return makeTableFromMatrix(parsedData['Course Learning Outcomes'].length-1,
                               parsedData.Matrix);
}


module.exports = {render, renderCourseLOC, renderContactHours, renderTeachingMethods, renderLearningResource, renderCourseCalendar}