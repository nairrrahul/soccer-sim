import countryStats from "../../configs/CountryStats.json";
import { simulateMatch, parseKnockoutMatchWinner } from "./MatchEngine";

const CUSTOMORDERPAIRS = {
  "Semi-Final": [1,2],
  "Quarter-Final": [1,4,2,3],
  "Round of 16": [1,8,4,5,2,7,3,6],
  "Round of 32": [1,16,8,9,4,13,5,12,2,15,7,10,3,14,6,11]
}
const ROUNDS = ["Final", "Semi-Final", "Quarter-Final", "Round of 16", "Round of 32"];

export function simulateKnockouts(teams, entrySeeding) {
  if(Math.log2(teams.length) - Math.floor(Math.log2(teams.length)) !== 0) {
    return;
  }
  let matches = !entrySeeding 
    ? knockoutMatchups(teams).map(([team1, team2]) => [team1[0], team2[0]])
    : listPairing(teams);
  let knockoutResults = knockoutRounds(matches);
  return knockoutResults;
}

function listPairing(teams) {
  if(teams.length % 2 !== 0) {
    return;
  }
  let key = ROUNDS[Math.floor(Math.log2(teams.length)) - 1];
  let returnedList = new Array(CUSTOMORDERPAIRS[key].length);
  returnedList.fill([]);

  for(let i = 0; i < CUSTOMORDERPAIRS[key].length; i++) {
    returnedList[CUSTOMORDERPAIRS[key][i]-1] = [teams[2*i], teams[2*i + 1]];
  }

  return returnedList;
  
}

function knockoutMatchups(teams) {
  let teamRankings = teams.map((team) => [team, countryStats[team].rank_pts]);
  let matchups = [];
  
  teamRankings.sort(([teamA, rpA], [teamB, rpB]) => 
    rpB - rpA ||
    teamA.localeCompare(teamB)
  );

  let startPtr = 0;
  let endPtr = teamRankings.length - 1;
  while (startPtr <= endPtr) {
    matchups.push([teamRankings[startPtr], teamRankings[endPtr]]);
    startPtr += 1;
    endPtr -= 1;
  }
  return matchups;
}

function knockoutRounds(matchups) {
  let roundDict = {};
  let winner = "";
  while(matchups.length >= 1) {
    let dummyPairs = [];
    let key = ROUNDS[Math.floor(Math.log2(matchups.length))];
    roundDict[key] = [];
    if(matchups.length === 1) {
      let finalMatchRes = simulateMatch(matchups[0][0], matchups[0][1], true, true);
      roundDict[key].push(finalMatchRes);
      winner = parseKnockoutMatchWinner(finalMatchRes);
      matchups = [];
    } else {
      let startPtr = 0;
      let endPtr = matchups.length - 1;
      while(startPtr < endPtr) {
        let matchInfoA = simulateMatch(matchups[startPtr][0], matchups[startPtr][1], true, true);
        let matchInfoB = simulateMatch(matchups[endPtr][0], matchups[endPtr][1], true, true);
        let winnerA = parseKnockoutMatchWinner(matchInfoA);
        let winnerB = parseKnockoutMatchWinner(matchInfoB);

        dummyPairs.push([winnerA, winnerB]);
        roundDict[key].push(matchInfoA);
        roundDict[key].push(matchInfoB);

        startPtr += 1;
        endPtr -= 1;
      }
      matchups = dummyPairs;
    }
  }
  return {
    roundInfo: roundDict,
    winner: winner
  };
}