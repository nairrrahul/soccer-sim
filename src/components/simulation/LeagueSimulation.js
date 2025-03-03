import { simulateMatch } from "./MatchEngine";

export function simulateLeague(teams, homeAway) {
    const matchSchedule = leagueScheduler(teams, homeAway);
    return runLeague(teams, matchSchedule);
}

function parseMatchResults(homeStruct, awayStruct, homeGoals, awayGoals) {
    homeStruct.gf += homeGoals;
    homeStruct.ga += awayGoals;
    awayStruct.gf += awayGoals;
    awayStruct.ga += homeGoals;
    homeStruct.gd = homeStruct.gf - homeStruct.ga;
    awayStruct.gd = awayStruct.gf - awayStruct.ga;

    if(homeGoals > awayGoals) {
        homeStruct.win += 1;
        awayStruct.loss += 1;
    }else if(homeGoals === awayGoals) {
        homeStruct.draw += 1;
        awayStruct.draw += 1; 
    }else {
        awayStruct.win += 1;
        homeStruct.loss += 1;
    }

    homeStruct.points = 3*homeStruct.win + homeStruct.draw;
    awayStruct.points = 3*awayStruct.win + awayStruct.draw;

    return [homeStruct, awayStruct];

}

function runLeague(teams, matchSchedule) {
    let teamCounts = {};
    teams.forEach((team) => {
       teamCounts[team] = {
        points: 0,
        win: 0,
        draw: 0,
        loss: 0,
        gf: 0,
        ga: 0,
        gd: 0
       }
    });

    for(let round in matchSchedule) {
        for(let match in matchSchedule[round]) {
            let homeTeam = matchSchedule[round][match][0];
            let awayTeam = matchSchedule[round][match][1];
            let matchResults = simulateMatch(homeTeam, awayTeam, false, false);
            matchSchedule[round][match].push(...[matchResults.homeGoalCount, matchResults.awayGoalCount]);
            let newPoints = parseMatchResults(teamCounts[homeTeam], 
                teamCounts[awayTeam], 
                matchResults.homeGoalCount, 
                matchResults.awayGoalCount);
            teamCounts[homeTeam] = newPoints[0];
            teamCounts[awayTeam] = newPoints[1];
        }
    }

    return {
        matches: matchSchedule,
        results: teamCounts
    };
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