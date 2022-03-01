const { render, renderCourseLOC, renderContactHours,renderTeachingMethods, renderLearningResource, renderCourseCalendar } = require('./render');
const fs = require('fs')
var HTMLParser = require('node-html-parser');

const {writeJSON} = require('./util');

const parsedData = require("./output.json");

async function main(){
    
    /*

        VS-Code or JS doing something weird with this text

        <span style='mso-spacerun:yes'>  </span><o:p></o:p></span>

        when saveing as a template literal string....
        It rpelaces with garbage values...
    */
    const res = await render(parsedData);

    /*
    try {
        fs.writeFileSync('./render_output/course.htm', before_table_HTML, 'utf-8');
        //file written successfully
    } catch (err) {
        console.error(err);
    }

    try {
        fs.appendFileSync('./render_output/course.htm', res, 'utf-8');
        //file written successfully
    } catch (err) {
        console.error(err);
    }
    
    try {
        fs.appendFileSync('./render_output/course.htm', after_table_HTML, 'utf-8');
        //file written successfully
    } catch (err) {
        console.error(err);
    }
    */

    //Word saves files using windows-1252 character set
    //which is based on latin1 
    //https://stackoverflow.com/questions/62557890/reading-a-windows-1252-file-in-node-js
    
    fs.readFile("./render_template/Template.htm", 'latin1', (error, data) => {
        if(error) {
            throw error;
        }

        var root = HTMLParser.parse(data.toString());
        //console.log(root.toString());
        //var out = root.toString();
        
        //write html

        //Write head
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
            '@@@staff' : "Staffing Requirements"
        }

        parsedData['Course Content'] = parsedData['Course Content'].replace(/\r\n/g,'<br/>');
        
        for(_i = 1; _i <=2; _i++){
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

            var lr = renderLearningResource(parsedData['Learning Resources']);
            out = out.replace(/@@@learningResources/g,lr);

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

        /*
        try {
            fs.writeFileSync('./render_output/Template.htm', out, 'latin1');
            //file written successfully
        } catch (err) {
            console.error(err)
        }
        */

    });
}

main().catch(console.error);
