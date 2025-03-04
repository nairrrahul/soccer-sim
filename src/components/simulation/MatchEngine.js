import countryStats from "../../configs/CountryStats.json";

const eventTypes = {
    START: "The period starts",
    HALF: "We have arrived at half-time",
    END: "The period ends",
    ATK: "Dangerous attack by",
    DEF: "Defensive clearance by",
    GOAL: "Goal! Scored by"
};

const eventValues = {
    GOAL: 200,
    ATK: 160
}

export function simulateMatch(team1, team2, knockout, tournament) {
    let gameStats = coreEngine(team1, team2, 1, 91, tournament);

    if(knockout && gameStats.awayGoalCount === gameStats.homeGoalCount) {
        let newStats = coreEngine(team1, team2, 90, 121, tournament);
        gameStats.awayGoalCount += newStats.awayGoalCount;
        gameStats.homeGoalCount += newStats.homeGoalCount;
        gameStats.homeGoalList = gameStats.homeGoalList.concat(newStats.homeGoalList);
        gameStats.awayGoalList = gameStats.awayGoalList.concat(newStats.awayGoalList);
        gameStats.matchEvents = {...newStats.matchEvents, ...gameStats.matchEvents};
        //there will be overlap at minute 90
        gameStats.matchEvents[90][1] = gameStats.matchEvents[90][1].concat(newStats.matchEvents[90][1]);

        if(gameStats.awayGoalCount === gameStats.homeGoalCount) {
            return penaltyShootout(gameStats);
        }

    }
    return gameStats;
}

export function parseKnockoutMatchWinner(gameStats) {
    if(gameStats.homeGoalCount > gameStats.awayGoalCount) {
        return gameStats.homeTeam;
    } else if (gameStats.awayGoalCount > gameStats.homeGoalCount) {
        return gameStats.awayTeam;
    } else {
        if (gameStats.penalties.homePensMade > gameStats.penalties.awayPensMade) {
            return gameStats.homeTeam;
        } else {
            return gameStats.awayTeam;
        }
    }
}


function penaltyShootout(gameStats) {
    let homePenalties = [];
    let homePensScored = 0;
    let awayPenalties = []
    let awayPensScored = 0;

    for(let i = 0; i < 5; i++) {
        let homeShot = penaltyResult(Math.floor(Math.random() * 14));
        let awayShot = penaltyResult(Math.floor(Math.random() * 14));
    
        homePenalties.push(homeShot.result);
        homePensScored += homeShot.count;

        if(homePensScored + (4-i) < awayPensScored || awayPensScored + (5-i) < homePensScored) {
            break;
        }

        awayPenalties.push(awayShot.result);
        awayPensScored += awayShot.count;

        if(awayPensScored + (4-i) < homePensScored || homePensScored + (5-i) < awayPensScored) {
            break;
        }
    }

    //sudden death if so
    if(homePensScored === awayPensScored) {
        let eqCounter = true;
        while (eqCounter) {
            let homeShot = penaltyResult(Math.floor(Math.random() * 14));
            let awayShot = penaltyResult(Math.floor(Math.random() * 14));
        
            homePenalties.push(homeShot.result);
            homePensScored += homeShot.count;
            awayPenalties.push(awayShot.result);
            awayPensScored += awayShot.count;

            eqCounter = homePensScored === awayPensScored;
        }
    }

    return {
        homeTeam: gameStats.homeTeam,
        awayTeam: gameStats.awayTeam,
        homeGoalCount: gameStats.homeGoalCount,
        homeGoalList: gameStats.homeGoalList,
        awayGoalCount: gameStats.awayGoalCount,
        awayGoalList: gameStats.awayGoalList,
        matchEvents: gameStats.matchEvents,
        penalties:{
            awayPens: awayPenalties,
            awayPensMade: awayPensScored,
            homePens: homePenalties,
            homePensMade: homePensScored
        }
    };
}

function penaltyResult(val) {
    if(val <= 10) {
        return {
            result: "O",
            count: 1
        };
    } else {
        return {
            result: "X",
            count: 0
        };
    }
}

function coreEngine(team1Name, team2Name, minStart, minEnd, tournamentStatus) {

    let team1 = countryStats[team1Name];
    let team2 = countryStats[team2Name];

    let ballPos = 0.0;
    let homeGoals = 0;
    let awayGoals = 0;
    let momentum = 0;
    let homeGoalTimes = [];
    let awayGoalTimes = [];
    let halfTime = minStart + Math.floor((minEnd - minStart) / 2);
    let homeAdvantage = tournamentStatus ? 0 : team1.home_adv;
    let matchEvents = {};

    for(let i = minStart; i < minEnd; i++) {
        let homeVal = 0;
        let awayVal = 0;
        let initBallPos = ballPos;
        let goalScored = false;

        if(i === minStart) {
            matchEvents[i] = [null, [eventTypes.START]];
            
        }

        if(i === halfTime) {
            matchEvents[i] = [null, [eventTypes.HALF]]; 
        }

        if(momentum >= 0){
            homeVal = team1.atk + homeAdvantage;
            awayVal = team2.def;
            homeVal += momentum;
        } else {
            homeVal = team1.def + homeAdvantage;
            awayVal = team2.atk;
            awayVal -= momentum;
        }

        let homeGen = Math.floor(Math.random() * homeVal);
        let awayGen = Math.floor(Math.random() * awayVal);

        if(homeGen > awayGen) {
            momentum += 1;
            if(momentum > 0) {
                ballPos += 0.5 * (homeGen - awayGen);
            } else {
                ballPos -= 1.0/(homeGen - awayGen + 0.1);
            }
        } else {
            momentum -= 1;
            if(momentum < 0) {
                ballPos -= 0.5 * (awayGen - homeGen);
            } else {
                ballPos += 1.0/(awayGen - homeGen + 0.1);
            }
        }

        if(ballPos > eventValues.GOAL) {
            homeGoals += 1;
            momentum = 0;
            ballPos = 0;
            homeGoalTimes.push(i);
            if(!(i in matchEvents)) {
                matchEvents[i] = [team1.code, [eventTypes.GOAL.concat(" ", team1Name)]];
            } else {
                matchEvents[i][1].push(eventTypes.GOAL.concat(" ", team1Name));
            }
            
            goalScored = true;
        }

        if(ballPos < -eventValues.GOAL) {
            awayGoals += 1;
            momentum = 0;
            ballPos = 0;
            awayGoalTimes.push(i);
            if(!(i in matchEvents)) {
                matchEvents[i] = [team2.code, [eventTypes.GOAL.concat(" ", team2Name)]];
            } else {
                matchEvents[i][1].push(eventTypes.GOAL.concat(" ", team2Name));
            }
            
            goalScored = true;
        }

        if(!goalScored) {
            if(ballPos >= eventValues.ATK && initBallPos < eventValues.ATK) {
                if(!(i in matchEvents)) {
                    matchEvents[i] = [team1.code, [eventTypes.ATK.concat(" ", team1Name)]];
                } else {
                    matchEvents[i][1].push(eventTypes.ATK.concat(" ", team1Name));
                }
                
            } else if(ballPos < eventValues.ATK && initBallPos >= eventValues.ATK) {
                if(!(i in matchEvents)) {
                    matchEvents[i] = [team2.code, [eventTypes.DEF.concat(" ", team2Name)]];
                } else {
                    matchEvents[i][1].push(eventTypes.DEF.concat(" ", team2Name));
                }
                
            }
    
            if(ballPos <= -eventValues.ATK && initBallPos > -eventValues.ATK) {
                if(!(i in matchEvents)) {
                    matchEvents[i] = [team2.code, [eventTypes.ATK.concat(" ", team2Name)]];
                } else {
                    matchEvents[i][1].push(eventTypes.ATK.concat(" ", team2Name));
                }
                
            } else if(ballPos > -eventValues.ATK && initBallPos <= -eventValues.ATK) {
                if(!(i in matchEvents)) {
                    matchEvents[i] = [team1.code, [eventTypes.DEF.concat(" ", team1Name)]];
                } else {
                    matchEvents[i][1].push(eventTypes.DEF.concat(" ", team1Name));
                }
                
            }
        }

        if(i === minEnd - 1) {
            if(!(i in matchEvents)) {
                matchEvents[i] = [null, [eventTypes.END]];
            } else {
                matchEvents[i][1].push(eventTypes.END);
            }
        }

    }

    return {
        homeTeam: team1Name,
        awayTeam: team2Name,
        homeGoalCount: homeGoals,
        awayGoalCount: awayGoals,
        homeGoalList: homeGoalTimes,
        awayGoalList: awayGoalTimes,
        penalties: null,
        matchEvents: matchEvents
    };
}