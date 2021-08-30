let url = "https://www.espncricinfo.com/series/ipl-2020-21-1210595"
let fs = require("fs");
let request = require("request");
let cheerio = require("cheerio");
let scoreCardObj=require("./scoreCard")


request(url, cb);
function cb(error, response, html){
    if(error){
        console.log(error);
    }else if(response.statusCode == 404){
        console.log("File Not Found");
    }else  {
        //console.log(html);
        dataExtracter(html);
    }
}
function dataExtracter(html){
    let searchTool = cheerio.load(html);
    let ancholElements = searchTool('a[data-hover ="View All Results"]');
    let link = ancholElements.attr("href");
    //console.log(link);
    let fullLink = `https://www.espncricinfo.com${link}`;
    console.log(fullLink);
    request(fullLink, newcb);
}
function newcb(error, response, html){
    if(error){
        console.log(error);
    }else if(response.statusCode == 404){
        console.log("File Not Found");
    }else  {
        //console.log(html);
        getAllScorecardLink(html);
    }
}
function getAllScorecardLink(html){
    let searchTool = cheerio.load(html);
    let allScoreCards = searchTool('a[data-hover ="Scorecard"]');
    //console.log(allScoreCards.length);
    for(let i = 0; i < allScoreCards.length; i++){
        let links = searchTool(allScoreCards[i]).attr("href");
        //console.log(links);
        let fullUrl = `https://www.espncricinfo.com${links}` ;
        //console.log(fullUrl);
        scoreCardObj.processSinglematch(fullUrl)
    }
    console.log("``````````````````````````````");
}