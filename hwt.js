let request = require("request");
let cheerio = require("cheerio");
let fs = require("fs");

console.log("Before");
request('https://www.espncricinfo.com/series/ipl-2020-21-1210595/royal-challengers-bangalore-vs-sunrisers-hyderabad-eliminator-1237178/full-scorecard', cb);
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
    let bowlers = searchTool(".table.bowler tbody tr");  //getting rows
    let htmlData = "";
    for(let i = 0; i < bowlers.length; i++){
        htmlData += searchTool(bowlers[i]).html();
    }
    fs.writeFileSync("table.html", htmlData);
    //console.log(bowlers);
    for(let i = 0; i < bowlers.length; i++){
        let col = searchTool(bowlers[i]).find("td");  // getting columns of particular bowler
        let name = searchTool(col[0]).text();
        let wickets = searchTool(col[4]).text();
        console.log(name + " " + wickets);
    }
 }