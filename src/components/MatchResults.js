import Flag from 'react-world-flags';
import countryStats from "../configs/CountryStats.json";
import './MatchResults.css';

const LeagueMatchResults = ({ matchResults }) => {
    if (!matchResults) return <p>No scheduled matches</p>;
  
    const matchdays = Object.entries(matchResults);
  
    const chunkSize = 5;
    const matchdayRows = [];
    for (let i = 0; i < matchdays.length; i += chunkSize) {
      matchdayRows.push(matchdays.slice(i, i + chunkSize));
    }


  
    return (
      <div className="match-results-container">
        {matchdayRows.map((matchdayGroup, rowIndex) => (
          <div key={rowIndex} className="matchday-row">
            {matchdayGroup.map(([matchday, matches]) => (
              <div key={matchday} className="matchday" style={{border: '1px solid grey'}}>
                <h3 className='matchday-header'>Matchday {parseInt(matchday)+1}</h3>
                {matches.map(([team1, team2], index) => (
                  <div className='matchday-row'>
                    <Flag code={countryStats[team1].code} height="16" />
                    <p key={index} className='matchup'>{team1}</p>
                    <p>-</p>
                    <p key={index} className='matchup'>{team2}</p>
                    <Flag code={countryStats[team2].code} height="16" />
                  </div>
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  };
  
  export default LeagueMatchResults;