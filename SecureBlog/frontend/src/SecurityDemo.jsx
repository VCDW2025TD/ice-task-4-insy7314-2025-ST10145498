// frontend/src/SecurityDemo.jsx
import React, { useState } from "react";

export default function SecurityDemo() {
  const [events, setEvents] = useState([]);

  const log = (msg) => setEvents((prev) => [...prev, msg]);

  const tryExternalFetch = async () => {
    try {
      const res = await fetch("https://api.github.com/rate_limit");
      log(`External fetch status: ${res.status}`);
    } catch (e) {
      log(`External fetch error: ${String(e)}`);
    }
  };

  const tryEval = () => {
    try {
      const fn = new Function("return 42");
      alert(fn());
    } catch (e) {
      log(`Eval error: ${String(e)}`);
    }
  };

  return (
    <div style={{ padding: 16 }}>
      <h2>CSP Demo</h2>
      <img
        src="https://images.unsplash.com/photo-1549880338-65ddcdfd017b"
        alt="External (should be blocked under strict CSP)"
        width={300}
        onError={() => log("External image blocked (onError)")}
      />
      <div style={{ marginTop: 12 }}>
        <button onClick={tryExternalFetch}>Try external fetch</button>
        <button onClick={tryEval} style={{ marginLeft: 8 }}>
          Try eval()
        </button>
      </div>
      <h3 style={{ marginTop: 16 }}>Observed events:</h3>
      <ul>{events.map((e, i) => <li key={i}>{e}</li>)}</ul>
      <p>Open DevTools → Console & Network. Check backend logs for POSTs to /csp-report.</p>
    </div>
  );
}
