const { render } = require('./render');
const fs = require('fs')

const {writeJSON} = require('./util');

async function main(){
    
    /*

        VS-Code or JS doing something weird with this text

        <span style='mso-spacerun:yes'>  </span><o:p></o:p></span>

        when saveing as a template literal string....
        It rpelaces with garbage values...
    */
    const res = await render();

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
        
        try {
            fs.writeFileSync('./render_output/Template.htm', out, 'latin1');
            //file written successfully
        } catch (err) {
            console.error(err)
        }

    });
}

main().catch(console.error);
