let request=require('request');
let cheerio=require('cheerio');
let fs=require('fs');
function getRecord(link){
    request(link,cb);
}

function cb(error,responce,data){
    // console.log('inside callback');
    // console.log(data);
    parseData(data);
}

function parseData(html){
    let ch=cheerio.load(html);
    let bothInnings = ch('.card.content-block.match-scorecard-table .Collapsible');
    // [ <div> </div> , <div></div>    ]
    
    for(let i=0;i<bothInnings.length;i++){

        let teamName=ch(bothInnings[i]).find("h5").text();
        teamName=teamName.split("Innings");

        teamName=teamName[0].trim();
        console.log(teamName);

        let allRows=ch(bothInnings[i]).find(".table.batsman tbody tr");
        for(let j=0;j<allRows.length;j++){
            let allTds=ch(allRows[j]).find("td");
            if(allTds.length>1){
                let batsmanName=ch(allTds[0]).find("a").text().trim();
                let runs=ch(allTds[2]).text().trim();
                let balls=ch(allTds[3]).text().trim();
                let fours=ch(allTds[5]).text().trim();
                let sixes=ch(allTds[6]).text().trim();
                let strikeRate=ch(allTds[7]).text().trim();
                // console.log(`BatsmanName = ${batsmanName}, Runs = ${runs}, Balls = ${balls}, Fours = ${fours}, Sixes = ${sixes}, StrikeRate = ${strikeRate}`);
                processDetails(teamName,batsmanName,runs,balls,fours,sixes,strikeRate);
            }
        }
        
    }
}

function checkTeamFolder(teamName){
    return fs.existsSync('WorldCupRecord/'+teamName);
}

function checkBatsmanFile(teamName,batsmanName){
    let batsmanPath=`WorldCupRecord/${teamName}/${batsmanName}.json`;
    return fs.existsSync(batsmanPath);
}

function createTeamFolder(teamName){

    fs.mkdirSync('WorldCupRecord/'+teamName);

}

function createBatsmanFile(teamName,batsmanName,runs,balls,fours,sixes,strikeRate){
    let batsmanPath=`WorldCupRecord/${teamName}/${batsmanName}.json`;
    let batsmanFile=[];
    let  innings={
        Runs:runs,
        Balls:balls,
        Fours:fours,
        Sixes:sixes,
        StrikeRate:strikeRate
    }
    batsmanFile.push(innings);
    fs.writeFileSync(batsmanPath,JSON.stringify(batsmanFile));
}

function updateBatsmanFile(teamName,batsmanName,runs,balls,fours,sixes,strikeRate){
    let batsmanPath=`WorldCupRecord/${teamName}/${batsmanName}.json`;
    let batsmanFile=fs.readFileSync(batsmanPath);
    batsmanFile=JSON.parse(batsmanFile);
    let innings={
        Runs:runs,
        Balls:balls,
        Fours:fours,
        Sixes:sixes,
        StrikeRate:strikeRate
    }
    batsmanFile.push(innings);
    fs.writeFileSync(batsmanPath,JSON.stringify(batsmanFile));
}

function processDetails(teamName,batsmanName,runs,balls,fours,sixes,strikeRate){
    let isTeamExist=checkTeamFolder(teamName);
    if(isTeamExist){

        let isBatsmanExist=checkBatsmanFile(teamName,batsmanName);
        if(isBatsmanExist){
            updateBatsmanFile(teamName,batsmanName,runs,balls,fours,sixes,strikeRate);
        }else{
            createBatsmanFile(teamName,batsmanName,runs,balls,fours,sixes,strikeRate);
        }

    }else{
        createTeamFolder(teamName);
        createBatsmanFile(teamName,batsmanName,runs,balls,fours,sixes,strikeRate);
    }

}


module.exports=getRecord;