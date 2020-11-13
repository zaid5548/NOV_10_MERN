let request = require("request");
let fs = require("fs");
let cheerio = require("cheerio");

function getMatch(link) {
  request(link, cb);
}

function cb(error, responce, data) {
    console.log("inside callback");
  // parseData(data);
}

function parseData(html) {
  // console.log(html);
  console.log("inside parse data");
  let ch = cheerio.load(html);
  let bothInnings = ch(
    ".card.content-block.match-scorecard-table .Collapsible"
  );
  console.log(bothInnings.length);
  for (let i = 0; i < bothInnings.length; i++) {
    let teamName = ch(bothInnings[i]).find("h5").text();
    teamName = teamName.split("Innings");

    teamName = teamName[0].trim();
    console.log(teamName);

    let allRows = ch(bothInnings[i]).find(".table.batsman tbody tr");

    for (let j = 0; j < allRows.length - 1; j++) {
      let allTds = ch(allRows[j]).find("td");
      if (allTds.length > 1) {
        let batsmanName = ch(allTds[0]).find("a").text().trim();
        let runs = ch(allTds[2]).text().trim();
        let balls = ch(allTds[3]).text().trim();
        let fours = ch(allTds[5]).text().trim();
        let six = ch(allTds[6]).text().trim();

        // console.log(`Batsman = ${batsmanName} Runs = ${runs} Balls = ${balls} Fours = ${fours} Six = ${six}`);
        processDetails(teamName,batsmanName, runs, balls, fours, six);
      }
    }
  }
}

function checkTeamFolder(teamName) {
  return fs.existsSync(teamName);
}

function checkBatsmanFile(teamName, batsmanName) {
  let batsmanPath = `${teamName}${batsmanName}`;
  return fs.existsSync(batsmanPath);
}

function createTeamFolder(teamName) {
  return fs.mkdirSync(teamName);
}

function updateBatsmanFile(teamName,batsmanName, runs, balls, fours, six) {
  let batsmanPath = `${teamName}${batsmanName}.json`;
  let batsmanFile = fs.readdirSync(batsmanPath);
  batsmanFile = JSON.parse(batsmanFile);
  let inning = {
    Runs: runs,
    Balls: balls,
    Fours: fours,
    Sixes: six
  }
  batsmanFile.push(inning);
  fs.writeFileSync(batsmanFile, JSON.stringify(batsmanFile));
}

function createBatsmanFile(teamName,batsmanName, runs, balls, fours, six) {
  let batsmanPath = `${teamName}${batsmanName}.json`;
  let batsmanFile = [];
  let inning = {
    Runs: runs,
    Balls: balls,
    Fours: fours,
    Sixes: six
  }
  batsmanFile.push(inning);
  fs.writeFileSync(batsmanPath,JSON.stringify(batsmanFile));
}

function processDetails(teamName,batsmanName, runs, balls, fours, six){
  let isTeamExist = checkTeamFolder(teamName);

  if (isTeamExist) {
    let isBatsmanExist = checkBatsmanFile(teamName, batsmanName);
    if (isBatsmanExist) {
      updateBatsmanFile(teamName,batsmanName, runs, balls, fours, six);
    } else {
      createBatsmanFile(teamName,batsmanName, runs, balls, fours, six);
    }
  } else {
    createTeamFolder(teamName);
    createBatsmanFile(teamName,batsmanName, runs, balls, fours, six);
  }
}


//export getMatch
module.exports = getMatch;
