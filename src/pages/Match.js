import { useState } from "react";
import { simulateMatch } from "../components/simulation/MatchEngine";
import  CountryDropdown  from "../components/CountryDropdown";
import MatchEvents from "../components/MatchEvents";
import { FaHome } from "react-icons/fa";
import { Link } from "react-router-dom";
import './Match.css';
import MatchOverview from "../components/MatchOverview";


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
      <div className="dropdown-row">
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
          <MatchOverview result={result} />
          {result.matchEvents && <MatchEvents matchEvents={result.matchEvents} version="normal"/>}
        </div>
      )}

      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <Link to="/soccer-sim/">
          <button style={{ margin: "10px", padding: "10px 20px", fontSize: "20px" }}>
            <FaHome />
          </button>
        </Link>
      </div>

    </div>
  );
}

export default Match;