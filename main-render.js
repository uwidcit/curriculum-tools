const { render, renderCourseLOC, renderContactHours,renderTeachingMethods, renderLearningResource, renderCourseCalendar } = require('./render');
const fs = require('fs')

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
        
        var out = data.toString().replace(/@@@tableHTML/,res);
        
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

        for(var key in templateMap){
            out = out.replace(key,parsedData[templateMap[key]]);
        }
        //out = out.replace(/@@@codeAndTitle/g,parsedData['Semester and Level']);
        
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
            fs.writeFileSync('./render_output/Template.htm', out, 'latin1');
            //file written successfully
        } catch (err) {
            console.error(err)
        }

    });
}

main().catch(console.error);
