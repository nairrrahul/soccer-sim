import countryStats from "../../configs/CountryStats.json";
import { simulateMatch, parseKnockoutMatchWinner } from "./MatchEngine";


export function simulateKnockouts(teams, entrySeeding) {
  if(Math.log2(teams.length) - Math.floor(Math.log2(teams.length)) !== 0) {
    return;
  }
  let matches = !entrySeeding 
    ? knockoutMatchups(teams).map(([team1, team2]) => [team1[0], team2[0]])
    : listPairing(teams);
  let knockoutResults = knockoutRounds(matches);
  console.log(knockoutResults);
  return knockoutResults;
}

function listPairing(teams) {
  if(teams.length % 2 !== 0) {
    return;
  }
  let returnedList = [];
  for(let i = 0; i < teams.length; i+=2) {
    returnedList.push([teams[i], teams[i+1]]);
  }
  return returnedList;
}

function knockoutMatchups(teams) {
  let teamRankings = teams.map((team) => [team, countryStats[team].rank_pts]);
  let matchups = [];
  teamRankings.sort(([teamA, rpA], [teamB, rpB]) => 
    rpA - rpB ||
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
  const ROUNDS = ["Final", "Semi-Final", "Quarter-Final", "Round of 16", "Round of 32"];
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