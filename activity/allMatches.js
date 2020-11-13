let request=require("request");
let fs=require("fs");
let cheerio=require("cheerio");
const getMatch = require("./match");

function getAllMatches(link){
    request(link,cb);
}

function cb(error,responce,data){
    // console.log(data);
    parseData(data);
}

function parseData(html){
    let ch=cheerio.load(html);
    let allTages=ch('a[data-hover="Scorecard"]');
// console.log(allTags);
for(let i=0;i<allTages.length;i++){
    let link=ch(allTages[i]).attr("href");
    let completeLink=`https://www.espncricinfo.com${link}`;
    // console.log(completeLink);
    getMatch(completeLink);
}

}

module.exports=getAllMatches;