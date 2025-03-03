import { useState } from "react";
import { simulateLeague } from "../components/simulation/LeagueSimulation";
import  CountryDropdown  from "../components/CountryDropdown";
import  LeagueMatchResults  from "../components/MatchResults";
import { Link } from "react-router-dom";
import { FaHome } from "react-icons/fa";

import './TournamentSimulation.css';

function TournamentSimulation() {
  const [mode, setMode] = useState(null);
  const [numTeams, setNumTeams] = useState(null);
  const [homeAway, setHomeAway] = useState(false);
  const [selectedTeams, setSelectedTeams] = useState([]);
  const [matchResults, setMatchResults] = useState(null);

  const handleAddTeam = (team) => {
    if (team && !selectedTeams.includes(team) && selectedTeams.length < numTeams) {
      setSelectedTeams([...selectedTeams, team]);
    }
  };

  const handleRemoveTeam = (team) => {
    setSelectedTeams(selectedTeams.filter((t) => t !== team));
  };


  const handleSimulate = () => {
    if(mode === "League") {
      const matchRes = simulateLeague(selectedTeams, homeAway);
      setMatchResults(matchRes);
    } else {
      setMatchResults(null);
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h1>Tournament Simulation</h1>

      <div className="centered-buttons" style={{padding:"5px 5px 20px 5px", borderBottom: "1px solid grey"}}>
        <button onClick={() => setMode("Knockout")} className="user-big-button">Knockout</button>
        <button onClick={() => setMode("League")} className="user-big-button">League</button>
      </div>

      {mode === "Knockout" && (
        <div>
          <h2>Select Number of Teams</h2>
          <div className="centered-buttons">
            {[4, 8, 16].map((num) => (
              <button key={num} className="user-button" onClick={() => setNumTeams(num)}>
                {num}
              </button>
            ))}
          </div>
          {numTeams && <p>Selected: {numTeams} teams</p>}
        </div>
      )}

      {mode === "League" && (
        <div>
          <h2>Select Number of Teams</h2>
          <select onChange={(e) => setNumTeams(Number(e.target.value))}>
            <option value="">-- Select --</option>
            {[...Array(7)].map((_, i) => {
              const num = i + 4;
              return (
                <option key={num} value={num}>
                  {num}
                </option>
              );
            })}
          </select>
          {numTeams && <p>Selected: {numTeams} teams</p>}

          <div>
            <input
              type="checkbox"
              id="homeAway"
              checked={homeAway}
              onChange={(e) => setHomeAway(e.target.checked)}
            />
            <label htmlFor="homeAway">Home & Away</label>
          </div>
        </div>
      )}

      {numTeams && (
        <div className="team-selection">
          <h2>Enter Teams ({selectedTeams.length}/{numTeams})</h2>
          {selectedTeams.length < numTeams ? (
            <CountryDropdown onSelect={handleAddTeam} />
          ) : selectedTeams.length === numTeams ? (
            <p className="all-teams-entered">All teams entered</p>
          ) : (
            <p className="too-many-teams">Too many teams. Remove {selectedTeams.length - numTeams} team(s)</p>
          )}

          <div className="selected-teams">
            {selectedTeams.map((team) => (
              <div key={team} className="team-box">
                {team}
                <button className="remove-team" onClick={() => handleRemoveTeam(team)}>✖</button>
              </div>
            ))}
          </div>

          {numTeams === selectedTeams.length && (
            <div style={{marginTop:"2em"}}>
              <button className="user-big-button" onClick={handleSimulate} style={{marginBottom: "2em"}}>
                Simulate {mode}
              </button>
            </div>
          )}

        </div>
      )}

      {matchResults && (
        mode == "League" ? (
          <LeagueMatchResults matchResults={matchResults} />
        ) : (
          <p>Knockout not yet supported</p>
        )
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

export default TournamentSimulation