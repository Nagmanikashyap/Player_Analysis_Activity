let request = require("request");
let cheerio = require("cheerio");
console.log("Before");
request('https://en.wikipedia.org/wiki/Legacy', cb);
function cb(error, response, html){ //this entire is async function which is executed at last
    if(error){
        console.log(error); //Print the error if occured
    }else if(response.statusCode == 404){
        console.log("Page Not Found");
    }else{
       // console.log("html :", html); //print the html for the request made
       //console.log("Html :",)
       dataExtracter(html)
    }
}
console.log("After")

function dataExtracter(html){
    //search tool
    let searchTool = cheerio.load(html);
    // css selector --> element
    //console.log(searchTool);
    let element = searchTool(".firstHeading");
    //console.log(element);
    //extract text
    let moduleName = element.text();
    console.log(moduleName);
}