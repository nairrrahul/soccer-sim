export function simulateMatch(team1, team2, knockout, tournament) {
    let gameStats = coreEngine(team1, team2, 1, 91, tournament);

    if(knockout && gameStats.awayGoalCount === gameStats.homeGoalCount) {
        let newStats = coreEngine(team1, team2, 90, 121, tournament);
        gameStats.awayGoalCount += newStats.awayGoalCount;
        gameStats.homeGoalCount += newStats.homeGoalCount;
        gameStats.homeGoalList = gameStats.homeGoalList.concat(newStats.homeGoalList);
        gameStats.awayGoalList = gameStats.awayGoalList.concat(newStats.awayGoalList);

        if(gameStats.awayGoalCount === gameStats.homeGoalCount) {
            return penaltyShootout(gameStats);
        }

    }
    return gameStats;
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
        homeGoalCount: gameStats.homeGoalCount,
        homeGoalList: gameStats.homeGoalList,
        awayGoalCount: gameStats.awayGoalCount,
        awayGoalList: gameStats.awayGoalList,
        penalties:{
            awayPens: awayPenalties,
            awayPensMade: awayPensScored,
            homePens: homePenalties,
            homePensMade: homePensScored,
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

function coreEngine(team1, team2, minStart, minEnd, tournamentStatus) {
    let ballPos = 0.0;
    let homeGoals = 0;
    let awayGoals = 0;
    let momentum = 0;
    let homeGoalTimes = [];
    let awayGoalTimes = [];
    let halfTime = minStart + Math.floor((minEnd - minStart) / 2);
    let homeAdvantage = tournamentStatus ? 0 : team1.home_adv;

    for(let i = minStart; i < minEnd; i++) {
        let homeVal = 0;
        let awayVal = 0;

        if(i === halfTime) {
            momentum = Math.floor(momentum / Math.abs(momentum));
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

        if(ballPos > 200) {
            homeGoals += 1;
            momentum = 0;
            ballPos = 0;
            homeGoalTimes.push(i);
        }

        if(ballPos < -200) {
            awayGoals += 1;
            momentum = 0;
            ballPos = 0;
            awayGoalTimes.push(i);
        }

    }

    return {
        homeGoalCount: homeGoals,
        awayGoalCount: awayGoals,
        homeGoalList: homeGoalTimes,
        awayGoalList: awayGoalTimes,
        penalties: null
    };
}