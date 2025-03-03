import { FaHome } from "react-icons/fa";
import { Link } from "react-router-dom";

function ContinuousSimulation() {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <h1>Continuous Simulation</h1>
        <p>TBD</p>

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
  
  export default ContinuousSimulation;