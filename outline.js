const { utils, readFile } = require('xlsx');
const { readdirSync, writeFileSync } = require('fs');
const path = require('path');

function $(cell, key){
    if(!cell)return ""
    return cell[key];
}

function parseExcelOutline(sheet){
    
    const { 
        B2, B3, B4, B5, B6, B7, B8, B9, B10, 
        B11, B12, B13, B14, B15, B16, B17, B18, B19, B20, 
        B21, B22, B23, B24, B25, B26, B27, B28, B29,
        B30, B31, B35, C35, B36, C36, B37, C37, B38, 
        C38, B39, C39, B40, C40, B41, C41, 
        B45, C45, D45, E45,
        B46, C46, D46, E46, B50,
        A55, B55, C55, D55, E55,
        A56, B56, C56, D56, E56,
        A57, B57, C57, D57, E57,  
        A58, B58, C58, D58, E58,
        A59, B59, C59, D59, E59,
        A60, B60, C60, D60, E60,
        A61, B61, C61, D61, E61,
        A62, B62, C62, D62, E62,
        A63, B63, C63, D63, E63,
        A68, A69, A70, B78,
        A84, B84, C84, D84, E84, F84,
        A85, B85, C85, D85, E85, F85,
        A86, B86, C86, D86, E86, F86,
        A87, B87, C87, D87, E87, F87,
        A88, B88, C88, D88, E88, F88,
        A89, B89, C89, D89, E89, F89,
        A90, B90, C90, D90, E90, F90,
        A91, B91, C91, D91, E91, F91,
        A92, B92, C92, D92, E92, F92,
        A93, B93, C93, D93, E93, F93,
        A94, B94, C94, D94, E94, F94,
        A95, B95, C95, D95, E95, F95,
        A96, B96, C96, D96, E96, F96
    } = sheet;
    
    
    // this maps excel cells to a course data structure
    return {
        'Campus and Faculty': $(B2, 'w'),
        'Department': $(B3,'w'),
        'Course Code & title': $(B4, 'w'),
        'Semester and Level': $(B5, 'w'),
        'Pre-requisites': $(B6, 'w'),
        'Co-requisites': $(B7, 'w'),
        'Anti-requisites': $(B8,'w'),
        'Course Type': $(B9, 'w'),
        'Credits': $(B10, 'w'),
        'Projected Enrolment': $(B11, 'w'),
        'Project Start Date': $(B12, 'w'),
        'Mode of Delivery': $(B13, 'w'),
        'Course Description': $(B14, 'w'),
        'Rationale': $(B15, 'w'),
        'Course Aims': $(B16, 'w'),
        'Course Learning Outcomes':[
            $(B17, 'w'),
            $(B18, 'w'),
            $(B19, 'w'),
            $(B20, 'w'),
            $(B21, 'w'),
            $(B22, 'w'),
            $(B23, 'w'),
            $(B24, 'w'),
            $(B25, 'w'),
            $(B26, 'w'),
            $(B27, 'w'),
            $(B28, 'w'),
            $(B29, 'w'),
            $(B30, 'w')
        ],
        'Course Content': $(B31, 'r'),
        'Teaching Methods':[
            {
                "Name": $(B35, 'w'),
                "Description": $(C35, 'w'),
            },
            {
                "Name": $(B36, 'w'),
                "Description": $(C36, 'w'),
            },
            {
                "Name": $(B37, 'w'),
                "Description": $(C37, 'w'),
            },
            {
                "Name": $(B38, 'w'),
                "Description": $(C38, 'w'),
            },
            {
                "Name": $(B39, 'w'),
                "Description": $(C39, 'w'),
            },
            {
                "Name": $(B40, 'w'),
                "Description": $(C40, 'w'),
            },
            {
                "Name": $(B41, 'w'),
                "Description": $(C41, 'w'),
            }
        ],
        'Contact and Credit hours':[
            {
                "Type":"",
                "Duration":"",
                "Contact Hours":"",
                "Credit Hours":""
            },
            {
                "Type":"",
                "Duration":"",
                "Contact Hours":"",
                "Credit Hours":""
            },
            {
                "Type":"",
                "Duration":"",
                "Contact Hours":"",
                "Credit Hours":""
            }
        ],
        'Course Assessments Description':'',
        'Matrix':[
            {
                "Assessment": $(A55, 'w'),
                "Learning Outcomes": $(B55, 'w'),
                "Assessment Description": $(C55, 'w'),
                "Weighting %" : $(D55, 'w'),
                "Duration": $(E55, 'w')
            },
            {
                "Assessment": $(A56, 'w'),
                "Learning Outcomes": $( B56, 'w'),
                "Assessment Description": $( C56, 'w'),
                "Weighting %": $( D56, 'w'),
                "Duration": $( E56, 'w')
            },
            {
                "Assessment": $(A57, 'w'),
                "Learning Outcomes": $( B7, 'w'),
                "Assessment Description": $( C57, 'w'),
                "Weighting %": $( D57, 'w'),
                "Duration": $( E57, 'w')
            },
            {
                "Assessment": $(A58, 'w'),
                "Learning Outcomes": $( B58, 'w'),
                "Assessment Description": $( C58, 'w'),
                "Weighting %": $( D58, 'w'),
                "Duration": $( E58, 'w')
            },
            {
                "Assessment": $(A59, 'w'),
                "Learning Outcomes": $( B59, 'w'),
                "Assessment Description": $( C59, 'w'),
                "Weighting %": $( D59, 'w'),
                "Duration": $(E59, 'w')
            },
            {
                "Assessment": $(A60, 'w'),
                "Learning Outcomes": $(B60, 'w'),
                "Assessment Description": $(C60, 'w'),
                "Weighting %": $(D60, 'w'),
                "Duration": $(E60, 'w')
            },
            {
                "Assessment": $(A61, 'w'),
                "Learning Outcomes": $(B61, 'w'),
                "Assessment Description": $(C61, 'w'),
                "Weighting %": $(D61, 'w'),
                "Duration": $(E61, 'w')
            },
            {
                "Assessment": $(A62, 'w'),
                "Learning Outcomes": $(B62, 'w'),
                "Assessment Description": $(C62, 'w'),
                "Weighting %": $(D62, 'w'),
                "Duration": $(E62, 'w')
            },
            {
                "Assessment": $(A63, 'w'),
                "Learning Outcomes": $(B63, 'w'),
                "Assessment Description": $(C63, 'w'),
                "Weighting %": $(D63, 'w'),
                "Duration": $(E63, 'w')
            }
        ],
        'Learning Resources':[ $(A68, 'w'), $(A69, 'w'), $(A70, 'w')],
        'Staffing Requirements': $(B78, 'w'),
        'Additional Cost':'',
        'Collaboration':'',
        'Course Coordinator':'',
        'Course Calendar':[
            {
                'Week': $(A84, 'w'),
                'Topics': $(B84, 'w'),
                'Required Readings': $(C84, 'w'),
                'Learning Activities': $(D84, 'w'),
                'Assessment': $(E84, 'w'),
                'Date': $(F84, 'w'),
            },
            {
                'Week': $(A85, 'w'),
                'Topics': $(B85, 'w'),
                'Required Readings': $(C85, 'w'),
                'Learning Activities': $(D85, 'w'),
                'Assessment': $(E85, 'w'),
                'Date': $(F85, 'w'),
            },
            {
                'Week': $(A86, 'w'),
                'Topics': $(B86, 'w'),
                'Required Readings': $(C86, 'w'),
                'Learning Activities': $(D86, 'w'),
                'Assessment': $(E86, 'w'),
                'Date': $(F86, 'w'),
            },
            {
                'Week': $(A87, 'w'),
                'Topics': $(B87, 'w'),
                'Required Readings': $(C87, 'w'),
                'Learning Activities': $(D87, 'w'),
                'Assessment': $(E87, 'w'),
                'Date': $(F87, 'w'),
            },
            {
                'Week': $(A88, 'w'),
                'Topics': $(B88, 'w'),
                'Required Readings': $(C88, 'w'),
                'Learning Activities': $(D88, 'w'),
                'Assessment': $(E88, 'w'),
                'Date': $(F88, 'w'),
            },
            {
                'Week': $(A89, 'w'),
                'Topics': $(B89, 'w'),
                'Required Readings': $(C89, 'w'),
                'Learning Activities' : $(D89, 'w'),
                'Assessment': $(E89, 'w'),
                'Date': $(F89, 'w'),
            },
            {
                'Week': $(A90, 'w'),
                'Topics': $( B90, 'w'),
                'Required Readings': $(C90, 'w'),
                'Learning Activities': $(D90, 'w'),
                'Assessment': $(E90, 'w'),
                'Date': $(F90, 'w'),
            },
            {
                'Week': $(A91, 'w'),
                'Topics': $( B91, 'w'),
                'Required Readings': $(C91, 'w'),
                'Learning Activities': $(D91, 'w'),
                'Assessment': $(E91, 'w'),
                'Date': $(F91, 'w'),
            },
            {
                'Week': $(A92, 'w'),
                'Topics': $( B92, 'w'),
                'Required Readings': $(C92, 'w'),
                'Learning Activities': $(D92, 'w'),
                'Assessment': $(E92, 'w'),
                'Date': $(F92, 'w'),
            },
            {
                'Week': $(A93, 'w'),
                'Topics': $( B93, 'w'),
                'Required Readings': $(C93, 'w'),
                'Learning Activities': $(D93, 'w'),
                'Assessment': $(E93, 'w'),
                'Date': $(F93, 'w'),
            },
            {
                'Week': $(A94, 'w'),
                'Topics': $( B94, 'w'),
                'Required Readings': $(C94, 'w'),
                'Learning Activities': $(D94, 'w'),
                'Assessment': $(E94, 'w'),
                'Date': $(F94, 'w'),
            },
            {
                'Week': $(A95, 'w'),
                'Topics': $( B95, 'w'),
                'Required Readings': $(C95, 'w'),
                'Learning Activities': $(D95, 'w'),
                'Assessment': $(E95, 'w'),
                'Date': $(F95, 'w'),
            },
            {
                'Week': $(A96, 'w'),
                'Topics': $( B96, 'w'),
                'Required Readings': $(C96, 'w'),
                'Learning Activities': $(D96, 'w'),
                'Assessment': $(E96, 'w'),
                'Date': $(F96, 'w'),
            }
        ],
    };
}

function readOutline(path){
    const workbook = readFile(path);
    const currentSheet = 'Revised Course Outline Template';
    return parseExcelOutline(workbook.Sheets[currentSheet]);
}

function dumpToFile(filename, data){
    return writeFileSync(filename, JSON.stringify(data, null, 2));
}

async function parseAll(dir){
    const directoryPath = path.join(__dirname, dir);
 
    const addrs = await readdirSync(directoryPath);
    let data = addrs.map(addr=>readOutline(path.join(directoryPath, addr)));
    dumpToFile('./outlines.json', data);
}



// readOutline('./outlines/COMP 1601.xlsx');

parseAll('./outlines');