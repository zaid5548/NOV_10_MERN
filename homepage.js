let request=require('request');
let cheerio=require('cheerio');
let fs=require('fs');
const getAllTeams = require('./allTeams');

let link="https://www.espncricinfo.com/series/_/id/8039/season/2019/icc-cricket-world-cup";

request(link,cb);

function cb(error,responce,data){

    // console.log("Inside callback");
    // console.log(data);

    // fs.writeFileSync("homepage.html",data);
    parseData(data);
}

function parseData(html){

    let ch=cheerio.load(html);
    let link=ch(".widget-items.cta-link a").attr("href");
    // console.log(link);
    let completeLink=`https://www.espncricinfo.com/${link}`;
    // console.log(completeLink);
    getAllTeams(completeLink);

}

