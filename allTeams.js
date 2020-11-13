let request = require("request");
let cheerio = require("cheerio");
let fs = require("fs");
const getRecord = require("./record");

function getAllTeams(link) {
  request(link, cb);
}

function cb(error, responce, data) {
  // console.log(data);
  parseData(data);
}

function parseData(html) {
  let ch = cheerio.load(html);
  let allTags = ch('a[data-hover="Scorecard"]');
  // console.log(allTags);
  for (let i = 0; i < allTags.length; i++) {
    // console.log("hello");
    let link = ch(allTags[i]).attr("href");
    let completeLink = `https://www.espncricinfo.com${link}`;
    // console.log(completeLink);
    getRecord(completeLink);
  }
}

module.exports = getAllTeams;
