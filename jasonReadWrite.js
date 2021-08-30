let fs = require("fs");
let input = ["Hello", "How", "Are", "You"];
// write
// let jasonWriteAble = JSON.stringify(input);
// fs.writeFileSync("abc.jason", jasonWriteAble);
// read
let readingContent = fs.readFileSync("abc.jason");
console.log("" + readingContent); //here "" is used to remove buffer from output and print ans in string format.
//let jasonContent  = JSON.parse(readingContent);
//console.log(jasonContent);
