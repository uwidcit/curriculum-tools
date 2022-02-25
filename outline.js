const { utils, readFile } = require('xlsx');

function parseExcelOutline(sheet){
    
    const { B2, B3, B4, B5, B6, B7, B9, B10, B11, B12, B13, B14, B15, B16, B17 } = sheet;
    
    // this maps excel cells to a course data structure
    return {
        'Campus and Faculty': B2,
        'Department': B3,
        'Course Code & title':B4,
        'Semester and Level': B5,
        'Pre-requisites':'',
        'Co-requisites':'',
        'Anti-requisites':'',
        'Course Type':'',
        'Credits':'',
        'Projected Enrolment':'',
        'Project Start Date':'',
        'Mode of Delivery':'',
        'Course Description':'',
        'Rationale':'',
        'Course Aims':'',
        'Course Learning Outcomes':'',
        'Course Content':'',
        'Teaching Methods':'',
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
                "Assessment":'',
                "Learning Outcomes": [],
                "Weighting %": '',
                "Assessment Description": '',
                "Duration": ""
            },
            {
                "Assessment":'',
                "Learning Outcomes": [],
                "Weighting %": '',
                "Assessment Description": '',
                "Duration": ""
            },
            {
                "Assessment":'',
                "Learning Outcomes": [],
                "Weighting %": '',
                "Assessment Description": '',
                "Duration": ""
            },
            {
                "Assessment":'',
                "Learning Outcomes": [],
                "Weighting %": '',
                "Assessment Description": '',
                "Duration": ""
            }
        ],
        'Learning Resources':'',
        'Staffing Requirements':'',
        'Additional Cost':'',
        'Collaboration':'',
        'Course Coordinator':'',
        'Course Calendar':[
            {
                'Week':'',
                'Topics':'',
                'Required Readings':'',
                'Learning Activities':'',
                'Assessment':'',
                'Date':''
            },
            {
                'Week':'',
                'Topics':'',
                'Required Readings':'',
                'Learning Activities':'',
                'Assessment':'',
                'Date':''
            },
            {
                'Week':'',
                'Topics':'',
                'Required Readings':'',
                'Learning Activities':'',
                'Assessment':'',
                'Date':''
            },
            {
                'Week':'',
                'Topics':'',
                'Required Readings':'',
                'Learning Activities':'',
                'Assessment':'',
                'Date':''
            },
            {
                'Week':'',
                'Topics':'',
                'Required Readings':'',
                'Learning Activities':'',
                'Assessment':'',
                'Date':''
            }
        ],
    };
}


function readOutline(path){
    const workbook = readFile(path);
    const currentSheet = 'Revised Course Outline Template';
    console.log(workbook.Sheets[currentSheet]);

}

readOutline('./outlines/COMP 1601.xlsx');