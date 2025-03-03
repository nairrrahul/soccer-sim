export function simulateLeague(teams, homeAway) {
    const matchSchedule = leagueScheduler(teams, homeAway);
    return matchSchedule;
}

function leagueScheduler(teams, homeAway) {
    let modifiedTeams = structuredClone(teams);
    let matches = {};

    if(modifiedTeams.length % 2 === 1) {
        modifiedTeams.push("X");
    }

    let iterations = modifiedTeams.length - 1;
    
    if(homeAway) {
        iterations *= 2;
    }
    for(let i = 0; i < iterations; i++) {
        if(i < modifiedTeams.length - 1) { 
            let matchups = [];
            for(let j = 0; j < Math.floor(modifiedTeams.length/2); j++) {
                let team1 = modifiedTeams[j];
                let team2 = modifiedTeams[modifiedTeams.length - 1 - j];
                if(team1 !== "X" && team2 !== "X") {
                    matchups.push([team1, team2]);
                }
            }
            matches[i] = matchups;
            let cycleOut = modifiedTeams.pop();
            modifiedTeams.splice(1, 0, cycleOut);
        } else {
            matches[i] = matches[i - modifiedTeams.length + 1].map(([team1, team2]) => [team2, team1]);
        }
    }
    return matches;
}