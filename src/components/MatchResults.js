import Flag from 'react-world-flags';
import countryStats from "../configs/CountryStats.json";
import { useState } from "react";
import './MatchResults.css';
import './MatchEvents.css';

const LeagueMatchResults = ({ matchResults }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    if (!matchResults) return <p>No scheduled matches</p>;
  
    const matchdays = Object.entries(matchResults);
  
    const chunkSize = 4;
    const matchdayRows = [];
    for (let i = 0; i < matchdays.length; i += chunkSize) {
      matchdayRows.push(matchdays.slice(i, i + chunkSize));
    }
  
    return (
      <div className="collapsible-container">
        <div className="collapsible-header" onClick={() => setIsExpanded(!isExpanded)}>
          <h3>Matches by Round {isExpanded ? "▼" : "▶"}</h3>
        </div>
        {isExpanded && (
          <div className="match-results-container">
            {matchdayRows.map((matchdayGroup, rowIndex) => (
              <div key={rowIndex} className="matchday-row">
                {matchdayGroup.map(([matchday, matches]) => (
                  <div key={matchday} className="matchday" style={{border: '1px solid grey'}}>
                    <h3 className='matchday-header'>Matchday {parseInt(matchday)+1}</h3>
                    {matches.map(([team1, team2, homeGoals, awayGoals]) => (
                      <div className="match-result">
                        <div className="team team-left">
                          <Flag code={countryStats[team1].code} height="18" />
                          <p className="matchup">{team1}</p>
                        </div>
                        
                        <p className="match-score">{homeGoals}-{awayGoals}</p>
                      
                        <div className="team team-right">
                          <p className="matchup">{team2}</p>
                          <Flag code={countryStats[team2].code} height="18" />
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };
  
  export default LeagueMatchResults;