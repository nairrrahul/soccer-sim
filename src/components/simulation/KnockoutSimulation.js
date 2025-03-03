import countryStats from "../../configs/CountryStats.json";

export function simulateKnockouts(teams) {
  if(Math.log2(teams.length) - Math.floor(Math.log2(teams.length))) {
    return;
  }
  let matches = knockoutMatchups(teams);
  console.log(matches);
  return matches;
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
    endPtr += 1;
  }

  return matchups;
}