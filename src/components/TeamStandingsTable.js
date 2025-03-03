import countryStats from "../configs/CountryStats.json";
import Flag from 'react-world-flags';
import "./TeamStandingsTable.css";

const TeamStandingsTable = ({ teamCounts }) => {
  if (!teamCounts || Object.keys(teamCounts).length === 0) {
    return <p>No standings available.</p>;
  }

  const sortedTeams = Object.entries(teamCounts).sort(
    ([teamA, statsA], [teamB, statsB]) =>
      statsB.points - statsA.points ||
      statsB.gd - statsA.gd ||
      statsB.gf - statsA.gf ||
      statsB.win - statsA.win ||
      teamA.localeCompare(teamB)
  );

  return (
    <table className="standings-table">
      <thead>
        <tr>
          <th>Country</th>
          <th>PTS</th>
          <th>W</th>
          <th>D</th>
          <th>L</th>
          <th>GF</th>
          <th>GA</th>
          <th>GD</th>
        </tr>
      </thead>
      <tbody>
        {sortedTeams.map(([team, stats], index) => (
          <tr key={team}  style={{backgroundColor: index === 0 ? 'rgba(202, 232, 218, 0.642)': 'white'}}>
            <td className="team-name">
              <Flag code={countryStats[team].code} height="20" /> {team}
            </td>
            <td>{stats.points}</td>
            <td>{stats.win}</td>
            <td>{stats.draw}</td>
            <td>{stats.loss}</td>
            <td>{stats.gf}</td>
            <td>{stats.ga}</td>
            <td>{stats.gd}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TeamStandingsTable;