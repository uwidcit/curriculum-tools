const { render, renderCourseLOC, renderContactHours,renderTeachingMethods, renderLearningResource, renderCourseCalendar } = require('./render');
const fs = require('fs')
var HTMLParser = require('node-html-parser');

const {writeJSON} = require('./util');

//const parsedData = require("./output.json");
const outlines = require("./outlines.json");
const { parse } = require('path');


function isBlankObject(obj){
    if(obj.constructor == Object){
        for(var key in obj){
            if(obj[key] != "")
                return false;
        }
    }

    return true;
}

function removeBlanksAll(fn, collectionName, arr) {
    var i = 0;
    while (i < arr.length) {
      if (isBlankObject(arr[i])) {
        arr.splice(i, 1);
        console.error(fn,collectionName,'blank object removed');
      } else {
        ++i;
      }
    }
    return arr;
}


function removeItemAll(fn, arr, value) {
    var i = 0;
    while (i < arr.length) {
      if (arr[i] === value) {
        arr.splice(i, 1);
        console.log(fn,'...','blank course learning outcome removed');
      } else {
        ++i;
      }
    }
    return arr;
}

function detectAndTryToFixNoCourseContent(fn, parsedData){
    
    
    var loc = parsedData["Course Learning Outcomes"];
    removeItemAll(fn, loc,"");
    var i = loc.length-1;
    
    if(parsedData["Course Content"] == ""){
        //likey the last entry in loc should be the course content
        parsedData["Course Content"] = loc[i];
        //remove potential course content entry form course learning outcomes 
        loc.splice(i, 1);
        console.log(fn,'...','blank course content detected attempted to fix');
    }

    return parsedData;
}


async function main(){

    
    


    
    //Word saves files using windows-1252 character set
    //which is based on latin1 
    //https://stackoverflow.com/questions/62557890/reading-a-windows-1252-file-in-node-js
    
    fs.readFile("./render_template/Template.htm", 'latin1', (error, data) => {
        if(error) {
            throw error;
        }

        var root = HTMLParser.parse(data.toString());

        //console.log(root.querySelector("img").toString());

        //console.log(root.toString());
        //var out = root.toString();
        
        
        var headHTML = root.querySelector("head").toString();
        
        //deep copy
        var sectionTemplate = root.querySelector("div");//first div should have the template...
        
        var htmlTagHTML = `<html xmlns:v="urn:schemas-microsoft-com:vml"
        xmlns:o="urn:schemas-microsoft-com:office:office"
        xmlns:w="urn:schemas-microsoft-com:office:word"
        xmlns:m="http://schemas.microsoft.com/office/2004/12/omml"
        xmlns="http://www.w3.org/TR/REC-html40">`.replace(/^\s+|\s+$/gm, '').split('\n').join('');

        try {
            fs.writeFileSync('./render_output/Template.htm', htmlTagHTML, 'latin1');
            //file written successfully
        } catch (err) {
            console.error(err)
        }

        try {
            fs.appendFileSync('./render_output/Template.htm', headHTML, 'latin1');
            //file written successfully
        } catch (err) {
            console.error(err)
        }

        var bodyHTML = `<body lang=EN-US style='tab-interval:.5in;word-wrap:break-word'>`;
        try {
            fs.appendFileSync('./render_output/Template.htm', bodyHTML, 'latin1');
            //file written successfully
        } catch (err) {
            console.error(err)
        }
        
        //Setup for rendering 
        var templateMap = {
            '@@@codeAndTitle': "Course Code & title",
            '@@@semesterAndLevel': "Semester and Level",
            '@@@prereq': "Pre-requisites",
            '@@@coreq' : "Co-requisites",
            '@@@courseType' : "Course Type",
            '@@@credits': "Credits",
            '@@@courseDescription' : "Course Description",
            '@@@rationale' : "Rationale",
            '@@@courseAims' : "Course Aims",
            '@@@courseContent' : "Course Content",
            '@@@courseAssessment': "Course Assessments Description",
            '@@@staff' : "Staffing Requirements",
            '@@@mode': "Mode of Delivery"
        }

        //const _json_dir = './valid_json_outlines';
        const _json_dir = './json_outlines';
        
        const json_files = fs.readdirSync(_json_dir);
        //const json_files = fs.readdirSync('./json_outlines');
        
        for(var file of json_files){
            var fn = _json_dir+"/"+file+"";
            console.log(file,fn);
            var parsedData = require(fn);

            parsedData = detectAndTryToFixNoCourseContent(file, parsedData);

            //Remove blank objects
            var checkPropertyForBlanks =["Teaching Methods","Matrix", "Course Calendar"];
            for(var prop of checkPropertyForBlanks)
                removeBlanksAll(file,prop,parsedData[prop]);

            parsedData['Course Content'] = parsedData['Course Content'].replace(/\r\n/g,'<br/>');
            var out = sectionTemplate.toString();    
            //var out = data.toString().replace(/@@@tableHTML/,res);
            
            for(var key in templateMap){
                out = out.replace(key,parsedData[templateMap[key]]);
            }
            //out = out.replace(/@@@codeAndTitle/g,parsedData['Semester and Level']);
            
            var locMatrix = render(parsedData);
            out = out.replace(/@@@tableHTML/,locMatrix);

            var cc = renderCourseLOC(parsedData['Course Learning Outcomes']);
            out = out.replace(/@@@courseLOC/g,cc);

            var ch = renderContactHours(parsedData['Contact and Credit hours']);
            out = out.replace(/@@@contactHours/g,ch);

            var tm = renderTeachingMethods(parsedData['Teaching Methods']);
            out = out.replace(/@@@teachingMethods/g,tm);

            //Why change up the json on meh :'(
            if(parsedData['Learning Resources'].constructor == "Object"){
                var lr = renderLearningResource(parsedData['Learning Resources']['Required']);
                out = out.replace(/@@@learningResources/g,lr);
            }
            else{
            //Assume is an array of books
                var lr = renderLearningResource(parsedData['Learning Resources']);
                out = out.replace(/@@@learningResources/g,lr);
            }

            var cal = renderCourseCalendar(parsedData['Course Calendar']);
            out = out.replace(/@@@courseCal/g,cal);

            try {
                fs.appendFileSync('./render_output/Template.htm', out, 'latin1');
                //file written successfully
            } catch (err) {
                console.error(err)
            }
        }


        try {
            fs.appendFileSync('./render_output/Template.htm', "</body></html>", 'latin1');
            //file written successfully
        } catch (err) {
            console.error(err)
        }

    });

     
}

main().catch(console.error);
