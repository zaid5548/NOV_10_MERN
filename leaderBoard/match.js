let request = require("request");
let fs = require("fs");
let cheerio = require("cheerio");

let leaderBoard = [];
let count = 0;

function getMatch(link) {
  console.log("Sending Data!!"+count);
  count++;
  request(link, cb);
}

function cb(error, responce, data) {
  console.log("Recived data!!"+count);
  count--;
  parseData(data);
  if (count == 0) {
    console.log(leaderBoard);
  }
}

function parseData(html) {
  // console.log(html);
  // console.log("inside parse data");
  let ch = cheerio.load(html);
  let bothInnings = ch(
    ".card.content-block.match-scorecard-table .Collapsible"
  );
  // console.log(bothInnings.length);
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
        processLeaderboard(teamName, batsmanName, runs, balls, fours, six);
      }
    }
  }
}

function processLeaderboard(teamName, batsmanName, runs, balls, fours, six) {
  runs = Number(runs);
  balls = Number(balls);
  fours = Number(fours);
  six = Number(six);

  //if batsMan entry exist in LeaderBoard
  for (let i = 0; i < leaderBoard.length; i++) {
    if (
      leaderBoard[i].Team == teamName &&
      leaderBoard[i].BatsmanName == batsmanName
    ) {
      leaderBoard.Runs += runs;
      leaderBoard.Balls += balls;
      leaderBoard.Fours += fours;
      leaderBoard.Six += six;
      return;
    }
  }

  //else
  let entry = {
    Team: teamName,
    BatsmanName: batsmanName,
    Runs: runs,
    Balls: balls,
    Fours: fours,
    Six: six,
  };
  leaderBoard.push(entry);
}

module.exports = getMatch;
