import { Link } from "react-router-dom";

function Home() {
  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h1>Football Simulation</h1>
      <nav>
        <Link to="/soccer-sim/match">
          <button style={{ margin: "10px", padding: "10px 20px" }}>One-Off Match</button>
        </Link>
        <Link to="/soccer-sim/tournament-simulation">
          <button style={{ margin: "10px", padding: "10px 20px" }}>Tournament Simulation</button>
        </Link>
        <Link to="/soccer-sim/continuous-simulation">
          <button style={{ margin: "10px", padding: "10px 20px" }}>Continuous Simulation</button>
        </Link>
      </nav>
    </div>
  );
}

export default Home;