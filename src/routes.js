import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Match from "./pages/Match";
import ContinuousSimulation from "./pages/ContinuousSimulation";
import TournamentSimulation from "./pages/TournamentSimulation";

function AppRoutes() {
  return (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/match" element={<Match />} />
        <Route path="/continuous-simulation" element={<ContinuousSimulation />} />
        <Route path="/tournament-simulation" element={<TournamentSimulation />} />
      </Routes>
  );
}

export default AppRoutes;