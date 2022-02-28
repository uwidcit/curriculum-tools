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

    
    fs.readFile("./render_template/test4.htm", (error, data) => {
        if(error) {
            throw error;
        }
        //console.log(data.toString());
        var out = data.toString().replace(/@@@tableHTML/,res);
        //var out = data.toString().replace(/@@@tableHTML/,"HELLO");
        //var out = data.toString();

        try {
            fs.writeFileSync('./render_output/test4.htm', out, 'utf-8');
            //file written successfully
        } catch (err) {
            console.error(err)
        }

    });


    /*
    const res = await render();
    //writeJSON('data/parsed-topics.json', res);
    //console.log(res);
    try {
        fs.writeFileSync('./render_output/table.txt', res)
        //file written successfully
    } catch (err) {
        console.error(err)
    }
    */
}

main().catch(console.error);
