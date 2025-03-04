import countryStats from "../configs/CountryStats.json";
import Flag from 'react-world-flags';
import { FaFutbol } from "react-icons/fa";
import './MatchOverview.css';

const MatchOverview = ({result, version}) => {

  return (
    <div className="match-container">
      <div className="match-row">
        <div className="team team-right">
          <h2 className="team-name" 
            style={{
              justifyContent: 'right',
              fontSize: version === "mini" ? ".9em" : "1.5em"
            }}>
            <Flag code={countryStats[result.homeTeam].code} height="30"/>
            {result.homeTeam}
          </h2>
        </div>
        <div className="score">
          <h1 style={{fontSize: version === "mini" ? "1.15em" : "2em"}}>{result.homeGoalCount} - {result.awayGoalCount}</h1>
        </div>
        <div className="team team-left">
          <h2 className="team-name" 
            style={{
              justifyContent: 'left',
              fontSize: version === "mini" ? "1em" : "1.5em"
              }}>
            {result.awayTeam}
            <Flag code={countryStats[result.awayTeam].code} height="30"/>
          </h2>
        </div>
      </div>

      <div className="match-row">
        <div className="goal-list goal-list-right">
          {result.homeGoalList.map((min, i) => (
            <span key={i}>
              {min}' <FaFutbol /><br />
            </span>
          ))}
        </div>
        <div className="score-placeholder"></div>
        <div className="goal-list goal-list-left">
          {result.awayGoalList.map((min, i) => (
            <span key={i}>
              <FaFutbol /> {min}'<br />
            </span>
          ))}
        </div>
      </div>


      {result.penalties && (
      <>
        <div className="match-row">
          <div className="penalty-list penalty-list-right">
            {result.penalties.homePens.map((pen, i) => (
              <span key={i} className={pen === "O" ? "penalty-success" : "penalty-fail"}
                style={{fontSize: version === "mini" ? ".5em" : "1em"}}>
                {pen === "O" ? "✅" : "❌"}
              </span>
            ))}
          </div>
          <div className="score-placeholder">
            <div className="penalty-score">
              <h3 style={{fontSize: version === "mini" ? ".7em" : "1.17em"}}>
                {result.penalties.homePensMade} - {result.penalties.awayPensMade}
              </h3>
            </div>
          </div>
          <div className="penalty-list penalty-list-left">
            {result.penalties.awayPens.map((pen, i) => (
              <span key={i} className={pen === "O" ? "penalty-success" : "penalty-fail"}
                style={{fontSize: version === "mini" ? ".5em" : "1em"}}>
                {pen === "O" ? "✅" : "❌"}
              </span>
            ))}
          </div>
        </div>
      </>
      )}
    </div>
  );
};

export default MatchOverview;