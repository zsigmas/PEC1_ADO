// (C) Wolfgang Huber 2010-2011

// Script parameters - these are set up by R in the function 'writeReport' when copying the 
//   template for this script from arrayQualityMetrics/inst/scripts into the report.

var highlightInitial = [ true, false, false, false, false, false, false, false, false, true, false, false, false, false, false, false, true, false, false, false, false, false, false, false ];
var arrayMetadata    = [ [ "1", "control_1_male_1", "GSM183815.CEL", "control", "1", "male" ], [ "2", "control_1_male_2", "GSM183816.CEL", "control", "1", "male" ], [ "3", "control_1_female_1", "GSM183817.CEL", "control", "1", "female" ], [ "4", "control_1_female_2", "GSM183856.CEL", "control", "1", "female" ], [ "5", "sensitive_2_male_1", "GSM183857.CEL", "sensitive", "2", "male" ], [ "6", "sensitive_2_male_2", "GSM183858.CEL", "sensitive", "2", "male" ], [ "7", "sensitive_2_female_1", "GSM183875.CEL", "sensitive", "2", "female" ], [ "8", "sensitive_2_female_2", "GSM183886.CEL", "sensitive", "2", "female" ], [ "9", "resistant_3_male_1", "GSM183887.CEL", "resistant", "3", "male" ], [ "10", "resistant_3_male_2", "GSM183888.CEL", "resistant", "3", "male" ], [ "11", "resistant_3_female_1", "GSM183936.CEL", "resistant", "3", "female" ], [ "12", "resistant_3_female_2", "GSM183989.CEL", "resistant", "3", "female" ], [ "13", "control_4_male_1", "GSM183990.CEL", "control", "4", "male" ], [ "14", "control_4_male_2", "GSM183991.CEL", "control", "4", "male" ], [ "15", "control_4_female_1", "GSM183992.CEL", "control", "4", "female" ], [ "16", "control_4_female_2", "GSM183993.CEL", "control", "4", "female" ], [ "17", "sensitive_5_male_1", "GSM183994.CEL", "sensitive", "5", "male" ], [ "18", "sensitive_5_male_2", "GSM184118.CEL", "sensitive", "5", "male" ], [ "19", "sensitive_5_female_1", "GSM184119.CEL", "sensitive", "5", "female" ], [ "20", "sensitive_5_female_2", "GSM184120.CEL", "sensitive", "5", "female" ], [ "21", "resistant_6_male_1", "GSM184121.CEL", "resistant", "6", "male" ], [ "22", "resistant_6_male_2", "GSM184122.CEL", "resistant", "6", "male" ], [ "23", "resistant_6_female_1", "GSM184123.CEL", "resistant", "6", "female" ], [ "24", "resistant_6_female_2", "GSM184124.CEL", "resistant", "6", "female" ] ];
var svgObjectNames   = [ "pca", "dens" ];

var cssText = ["stroke-width:1; stroke-opacity:0.4",
               "stroke-width:3; stroke-opacity:1" ];

// Global variables - these are set up below by 'reportinit'
var tables;             // array of all the associated ('tooltips') tables on the page
var checkboxes;         // the checkboxes
var ssrules;


function reportinit() 
{
 
    var a, i, status;

    /*--------find checkboxes and set them to start values------*/
    checkboxes = document.getElementsByName("ReportObjectCheckBoxes");
    if(checkboxes.length != highlightInitial.length)
	throw new Error("checkboxes.length=" + checkboxes.length + "  !=  "
                        + " highlightInitial.length="+ highlightInitial.length);
    
    /*--------find associated tables and cache their locations------*/
    tables = new Array(svgObjectNames.length);
    for(i=0; i<tables.length; i++) 
    {
        tables[i] = safeGetElementById("Tab:"+svgObjectNames[i]);
    }

    /*------- style sheet rules ---------*/
    var ss = document.styleSheets[0];
    ssrules = ss.cssRules ? ss.cssRules : ss.rules; 

    /*------- checkboxes[a] is (expected to be) of class HTMLInputElement ---*/
    for(a=0; a<checkboxes.length; a++)
    {
	checkboxes[a].checked = highlightInitial[a];
        status = checkboxes[a].checked; 
        setReportObj(a+1, status, false);
    }

}


function safeGetElementById(id)
{
    res = document.getElementById(id);
    if(res == null)
        throw new Error("Id '"+ id + "' not found.");
    return(res)
}

/*------------------------------------------------------------
   Highlighting of Report Objects 
 ---------------------------------------------------------------*/
function setReportObj(reportObjId, status, doTable)
{
    var i, j, plotObjIds, selector;

    if(doTable) {
	for(i=0; i<svgObjectNames.length; i++) {
	    showTipTable(i, reportObjId);
	} 
    }

    /* This works in Chrome 10, ssrules will be null; we use getElementsByClassName and loop over them */
    if(ssrules == null) {
	elements = document.getElementsByClassName("aqm" + reportObjId); 
	for(i=0; i<elements.length; i++) {
	    elements[i].style.cssText = cssText[0+status];
	}
    } else {
    /* This works in Firefox 4 */
    for(i=0; i<ssrules.length; i++) {
        if (ssrules[i].selectorText == (".aqm" + reportObjId)) {
		ssrules[i].style.cssText = cssText[0+status];
		break;
	    }
	}
    }

}

/*------------------------------------------------------------
   Display of the Metadata Table
  ------------------------------------------------------------*/
function showTipTable(tableIndex, reportObjId)
{
    var rows = tables[tableIndex].rows;
    var a = reportObjId - 1;

    if(rows.length != arrayMetadata[a].length)
	throw new Error("rows.length=" + rows.length+"  !=  arrayMetadata[array].length=" + arrayMetadata[a].length);

    for(i=0; i<rows.length; i++) 
 	rows[i].cells[1].innerHTML = arrayMetadata[a][i];
}

function hideTipTable(tableIndex)
{
    var rows = tables[tableIndex].rows;

    for(i=0; i<rows.length; i++) 
 	rows[i].cells[1].innerHTML = "";
}


/*------------------------------------------------------------
  From module 'name' (e.g. 'density'), find numeric index in the 
  'svgObjectNames' array.
  ------------------------------------------------------------*/
function getIndexFromName(name) 
{
    var i;
    for(i=0; i<svgObjectNames.length; i++)
        if(svgObjectNames[i] == name)
	    return i;

    throw new Error("Did not find '" + name + "'.");
}


/*------------------------------------------------------------
  SVG plot object callbacks
  ------------------------------------------------------------*/
function plotObjRespond(what, reportObjId, name)
{

    var a, i, status;

    switch(what) {
    case "show":
	i = getIndexFromName(name);
	showTipTable(i, reportObjId);
	break;
    case "hide":
	i = getIndexFromName(name);
	hideTipTable(i);
	break;
    case "click":
        a = reportObjId - 1;
	status = !checkboxes[a].checked;
	checkboxes[a].checked = status;
	setReportObj(reportObjId, status, true);
	break;
    default:
	throw new Error("Invalid 'what': "+what)
    }
}

/*------------------------------------------------------------
  checkboxes 'onchange' event
------------------------------------------------------------*/
function checkboxEvent(reportObjId)
{
    var a = reportObjId - 1;
    var status = checkboxes[a].checked;
    setReportObj(reportObjId, status, true);
}


/*------------------------------------------------------------
  toggle visibility
------------------------------------------------------------*/
function toggle(id){
  var head = safeGetElementById(id + "-h");
  var body = safeGetElementById(id + "-b");
  var hdtxt = head.innerHTML;
  var dsp;
  switch(body.style.display){
    case 'none':
      dsp = 'block';
      hdtxt = '-' + hdtxt.substr(1);
      break;
    case 'block':
      dsp = 'none';
      hdtxt = '+' + hdtxt.substr(1);
      break;
  }  
  body.style.display = dsp;
  head.innerHTML = hdtxt;
}
