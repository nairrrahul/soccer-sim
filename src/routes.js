import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Match from "./pages/Match";
import ContinuousSimulation from "./pages/ContinuousSimulation";
import TournamentSimulation from "./pages/TournamentSimulation";

function AppRoutes() {
  return (
      <Routes>
        <Route path="/soccer-sim" element={<Home />} />
        <Route path="/soccer-sim/match" element={<Match />} />
        <Route path="/soccer-sim/continuous-simulation" element={<ContinuousSimulation />} />
        <Route path="/soccer-sim/tournament-simulation" element={<TournamentSimulation />} />
      </Routes>
  );
}

export default AppRoutes;