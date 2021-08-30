let request = require("request");
let cheerio = require("cheerio");
let fs = require("fs");
const { uniqueSort } = require("domutils");
const { SSL_OP_DONT_INSERT_EMPTY_FRAGMENTS } = require("constants");

let bowlersArr = [];
let bowlersCount = 0; 

console.log("Before");
request('https://www.espncricinfo.com/series/ipl-2020-21-1210595/royal-challengers-bangalore-vs-sunrisers-hyderabad-eliminator-1237178/full-scorecard', cb);
function cb(error, response, html){ //this entire is async function which is executed at last
    if(error){
        console.log(error); //Print the error if occured
    }else if(response.statusCode == 404){
        console.log("Page Not Found");
    }else{
       // console.log("html :", html); //print the html for the request made
       dataExtracter(html)
    }
}
console.log("After")

function dataExtracter(html){

    let searchTool = cheerio.load(html);
    let bowlers = searchTool(".table.bowler tbody tr");  //getting rows

    for(let i = 0; i < bowlers.length; i++){
        let cols = searchTool(bowlers[i]).find("td");  // getting columns of particular bowler
        if(cols.length > 1){
            bowlersCount++;
        let anchorElements = searchTool(cols[0]).find("a");
        let link = anchorElements.attr("href");
        //console.log(link); //This will give the link without the http: part
        let fullLink = `https://www.espncricinfo.com${link}`;
        //console.log(fullLink);
        request(fullLink, newcb);
        }
    }
 }
function newcb(error, response, html){
    if(error){
        console.log(error); //Print the error if occured
    }else if(response.statusCode == 404){
        console.log("Page Not Found");
    }else{
       // console.log("html :", html); //print the html for the request made
       getAge(html);
       if(bowlersArr.length == bowlersCount){
           //console.log(bowlersArr);
           sortAge(bowlersArr); //function to sort the data stored in bowlersArr into a table
       }
    }
}
function getAge(html){  //from this function we will get the age and name of the different players using cheerio
    let searchTool = cheerio.load(html);
    let detailsArr = searchTool(".player-card-description.gray-900");
        let name = searchTool(detailsArr[0]).text();
        let age = searchTool(detailsArr[2]).text();
        bowlersArr.push({"name" : name, "age" : age});
       
}
//console.log(bowlersArr);

function sortAge(bowlersArr){ //this function will only sort the age and convert them into numbers and will print all the return objects given below.
    //sort-> first convert age
    let newArr = bowlersArr.map(singleFn); //here newArr will initialize a function named singleFn to print the following objects
   // console.log(newArr); //prints the return objects after calling the singleFn.

    function singleFn(obj){  //singleFn is called and return objects is printed.
        let name = obj.name;
        let age = obj.age;
        let ageArr = obj.age.split(" ");
        let years = ageArr[0].slice(0, ageArr[0].length - 1);
        let days = ageArr[1].slice(0, ageArr[1].length - 1);
        let ageInDays = Number(years) * 365 + Number(days);
        return {
            name: name,
            ageInDays: ageInDays,
            age: age,
        }
    }
    let sortedArr = newArr.sort(cb);
   // console.table(sortedArr); //print the sorted table but with ageindays within it
    function cb(objA, objB){
        return objA.ageInDays - objB.ageInDays;
    }
    let finalArr = sortedArr.map(removeageIndays);
        function removeageIndays(obj){
            return{
                name: obj.name,
                age: obj.age,
            }
        }
       console.table(finalArr); //print the final sorted table
    }