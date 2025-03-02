import { useState } from "react";
import Flag from "react-world-flags";
import "./MatchEvents.css";

function MatchEvents({ matchEvents }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const sortedEvents = Object.entries(matchEvents)
    .sort((a, b) => a[0] - b[0])
    .flatMap(([minute, [flag, events]], index) => (
      events.map((event, idx) => (
        <div key={`${index}-${idx}`} className="match-event" style={{fontSize: 16}}>
          {minute}': {flag && <Flag code={flag} height="15" />} {event}
        </div>
      ))   
    ));

  return (
    <div className="collapsible-container">
      <div className="collapsible-header" onClick={() => setIsExpanded(!isExpanded)}>
        <h3>Match Events {isExpanded ? "▼" : "▶"}</h3>
      </div>
      {isExpanded && <div className="collapsible-content">{sortedEvents}</div>}
    </div>
  );
}

export default MatchEvents;