import { useState } from "react";
import { simulateMatch } from "../components/MatchEngine";
import countryStats from "../configs/CountryStats.json";
import  CountryDropdown  from "../components/CountryDropdown";
import MatchEvents from "../components/MatchEvents";
import { FaFutbol } from "react-icons/fa";
import Flag from 'react-world-flags';
import './Match.css';


function Match() {
  const [homeTeam, setHomeTeam] = useState(null);
  const [awayTeam, setAwayTeam] = useState(null);
  const [result, setResult] = useState(null);
  const [yesKO, setKO] = useState(false);

  const handleSimulate = () => {
    if (homeTeam && awayTeam && homeTeam !== awayTeam) {
      const matchResult = simulateMatch(homeTeam, awayTeam, yesKO, false);
      setResult({
        homeTeam: homeTeam,
        awayTeam: awayTeam,
        ...matchResult,
      });
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>One-Off Match</h1>
      <div className="dropdownRow">
        <div style={{ marginBottom: "10px" }}>
          <p>Select Home Team</p>
          <CountryDropdown onSelect={setHomeTeam} />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <p>Select Away Team</p>
        <CountryDropdown onSelect={setAwayTeam} />
        </div>
      </div>   
      <div>
        <label>
          <input
            type="checkbox"
            checked={yesKO}
            onChange={(e) => setKO(e.target.checked)} 
          />
          Set as Knockout Match
        </label>
        <p>Knockout is {yesKO ? "Enabled" : "Disabled"}</p>
      </div>

      <button className="match-button" onClick={handleSimulate}>Simulate Match</button>

      {result && (
        <div style={{ marginTop: "20px" }}>
          <div className="match-container">
            <div className="match-row">
              <div className="team team-right">
                <h2 className="team-name" style={{justifyContent: 'right'}}>
                  <Flag code={countryStats[homeTeam].code} height="30"/>
                  {homeTeam}
                </h2>
              </div>
              <div className="score">
                <h1>{result.homeGoalCount} - {result.awayGoalCount}</h1>
              </div>
              <div className="team team-left">
                <h2 className="team-name" style={{justifyContent: 'left'}}>
                  {awayTeam}
                  <Flag code={countryStats[awayTeam].code} height="30"/>
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
                    <span key={i} className={pen === "O" ? "penalty-success" : "penalty-fail"}>
                      {pen === "O" ? "✅" : "❌"}
                    </span>
                  ))}
                </div>
                <div className="score-placeholder">
                  <div className="penalty-score">
                    <h3>{result.penalties.homePensMade} - {result.penalties.awayPensMade}</h3>
                  </div>
                </div>
                <div className="penalty-list penalty-list-left">
                  {result.penalties.awayPens.map((pen, i) => (
                    <span key={i} className={pen === "O" ? "penalty-success" : "penalty-fail"}>
                      {pen === "O" ? "✅" : "❌"}
                    </span>
                  ))}
                </div>
              </div>
            </>
            )}
          </div>

          {result.matchEvents && <MatchEvents matchEvents={result.matchEvents} />}
          
        </div>
      )}
    </div>
  );
}

export default Match;