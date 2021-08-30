let fs = require("fs");
let path = require("path");
let request = require("request");
let cheerio = require("cheerio");
let xlsx = require("xlsx");


let mainPath = process.cwd();
console.log(mainPath);
let iplFolderPath = path.join(mainPath, "IPL");  
fs.mkdirSync(iplFolderPath);  //creating IPL folder to stores all team details


function processSinglematch(url) {
   
//let url  = "https://www.espncricinfo.com/series/ipl-2020-21-1210595/royal-challengers-bangalore-vs-sunrisers-hyderabad-eliminator-1237178/full-scorecard"
request(url, cb);

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
function dataExtracter(html){
    let searchTool = cheerio.load(html);
    let bothInningArr = searchTool(".Collapsible");
    //console.log(namesOfPlayers.length);
    for(let i = 0; i < bothInningArr.length; i++){
        let teamNameElem = searchTool(bothInningArr[i]).find("h5");
        let teamName = teamNameElem.text();
        //console.log(teamName);
        teamName = teamName.split("INNINGS")[0];
        teamName = teamName.trim();
        console.log(teamName);

        let batsMAnBodyAllRows = searchTool(bothInningArr[i]).find(".table.batsman tbody tr");
        console.log(batsMAnBodyAllRows.length);
        for(let j = 0; j < batsMAnBodyAllRows.length; j++){
            let numberOfTds = searchTool(batsMAnBodyAllRows[j]).find("td");
            if(numberOfTds.length == 8){
                //console.log("Ypu are valid");
                let playerName = searchTool(numberOfTds[0]).text();
                //console.log(playerName);
                let runs = searchTool(numberOfTds[2]).text();
                //console.log(runs);
                let balls = searchTool(numberOfTds[3]).text();
                //console.log(balls);
                let fours = searchTool(numberOfTds[5]).text();
                //console.log(fours);
                let sixes = searchTool(numberOfTds[6]).text();
                //console.log(sixes);
                  // myTeamName	name	venue	date opponentTeamName	result	runs	balls	fours	sixes	sr
                  //console.log(playerName, "played for", teamName, "scored", runs, "in", balls, "with ", fours, "fours and ", sixes, "sixes");
                  processPlayer(playerName, teamName, runs, balls, fours, sixes);
            }
        }
        console.log("``````````````````````````````");
    }

}
function processPlayer(playerName, teamName, runs, balls, fours, sixes){
    let obj = {
        playerName,
        teamName,
        runs,
        balls,
        fours,
        sixes
    }
    let teamNamePath = path.join(iplFolderPath, teamName); // creating all team paths seperately inside IPL folder
    if(fs.existsSync(teamNamePath) == false){
        fs.mkdirSync(teamNamePath);
    }
    // player file
    let playersFilePath = path.join(teamNamePath, playerName + ".json");
    let playerArr = [];
    if(fs.existsSync(playersFilePath) == false){
        playerArr.push(obj);
    }else{
        //append
        playerArr = getContent(playersFilePath);
        playerArr.push(obj);
    }
    writeContent(playersFilePath, playerArr);
}
function getContent(playersFilePath){
    let content = fs.readFileSync(playersFilePath);
    return JSON.parse(content);
}
function writeContent(playersFilePath, content){
    let jsonData = JSON.stringify(content);
    fs.writeFileSync(playersFilePath, jsonData);
}
}
 module.exports ={
    processSinglematch
}