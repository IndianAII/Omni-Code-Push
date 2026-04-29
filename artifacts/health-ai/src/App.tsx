import { useState, useEffect, useRef } from "react";

type HealthResponse = {
  status: string;
  features: string[];
};

export default function App() {
  const [val, setVal] = useState(10);
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [alarmTime, setAlarmTime] = useState<string>("");
  const [alarmActive, setAlarmActive] = useState(false);
  const [alarmRinging, setAlarmRinging] = useState(false);
  const [now, setNow] = useState(new Date());
  const [supportSent, setSupportSent] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);

  useEffect(() => {
    const base = import.meta.env.BASE_URL.replace(/\/$/, "");
    fetch(`${base}/api/health`)
      .then((r) => r.json())
      .then((d: HealthResponse) => setHealth(d))
      .catch(() => setHealth(null));
  }, []);

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!alarmActive || !alarmTime) return;
    const [h, m] = alarmTime.split(":").map(Number);
    if (now.getHours() === h && now.getMinutes() === m && now.getSeconds() < 2) {
      ringAlarm();
      setAlarmActive(false);
    }
  }, [now, alarmActive, alarmTime]);

  function ringAlarm() {
    setAlarmRinging(true);
    try {
      const Ctx =
        (window as unknown as { AudioContext?: typeof AudioContext; webkitAudioContext?: typeof AudioContext }).AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctx) return;
      const ctx = new Ctx();
      audioCtxRef.current = ctx;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = 880;
      gain.gain.value = 0.2;
      osc.connect(gain).connect(ctx.destination);
      osc.start();
      oscRef.current = osc;
    } catch {
      // ignore
    }
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("Health AI Alarm", { body: "Time's up!" });
    }
  }

  function stopAlarm() {
    setAlarmRinging(false);
    if (oscRef.current) {
      try { oscRef.current.stop(); } catch { /* noop */ }
      oscRef.current = null;
    }
    if (audioCtxRef.current) {
      try { audioCtxRef.current.close(); } catch { /* noop */ }
      audioCtxRef.current = null;
    }
  }

  async function setAlarm() {
    if (!alarmTime) return;
    if ("Notification" in window && Notification.permission === "default") {
      try { await Notification.requestPermission(); } catch { /* noop */ }
    }
    try {
      const base = import.meta.env.BASE_URL.replace(/\/$/, "");
      await fetch(`${base}/api/set-alarm`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ time: alarmTime }),
      });
    } catch { /* noop */ }
    setAlarmActive(true);
  }

  function support() {
    setSupportSent(true);
    setTimeout(() => setSupportSent(false), 2500);
  }

  return (
    <div
      style={{
        padding: "24px",
        background: "#000",
        color: "#fff",
        minHeight: "100vh",
        textAlign: "center",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <h1 style={{ fontSize: "28px", margin: "0 0 4px" }}>Health AI Assistant</h1>
      <p style={{ color: "#9ca3af", margin: 0, fontSize: "13px" }}>
        {health ? health.status : "Connecting..."}
      </p>
      {health && (
        <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 12, flexWrap: "wrap" }}>
          {health.features.map((f) => (
            <span
              key={f}
              style={{
                fontSize: 11,
                padding: "4px 10px",
                background: "#0f172a",
                border: "1px solid #1e293b",
                borderRadius: 999,
                color: "#93c5fd",
              }}
            >
              {f}
            </span>
          ))}
        </div>
      )}

      <div
        style={{
          background: "#0a0a0a",
          padding: "20px",
          borderRadius: "15px",
          border: "1px solid #1e293b",
          marginTop: "28px",
          maxWidth: 460,
          marginInline: "auto",
        }}
      >
        <h3 style={{ color: "#3b82f6", margin: "0 0 8px" }}>Wellness Alarm</h3>
        <p style={{ fontSize: 12, color: "#9ca3af", margin: "0 0 12px" }}>
          {now.toLocaleTimeString()}
        </p>
        <input
          type="time"
          value={alarmTime}
          onChange={(e) => setAlarmTime(e.target.value)}
          style={{
            padding: "10px 12px",
            borderRadius: 8,
            border: "1px solid #1e293b",
            background: "#000",
            color: "#fff",
            fontSize: 16,
            width: "100%",
            boxSizing: "border-box",
          }}
        />
        {alarmRinging ? (
          <button
            onClick={stopAlarm}
            style={{
              width: "100%",
              padding: 12,
              marginTop: 12,
              background: "#dc2626",
              color: "white",
              border: "none",
              borderRadius: 8,
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Stop Alarm
          </button>
        ) : (
          <button
            onClick={setAlarm}
            disabled={!alarmTime}
            style={{
              width: "100%",
              padding: 12,
              marginTop: 12,
              background: alarmTime ? "#3b82f6" : "#1e293b",
              color: "white",
              border: "none",
              borderRadius: 8,
              fontWeight: "bold",
              cursor: alarmTime ? "pointer" : "not-allowed",
            }}
          >
            {alarmActive ? `Alarm set for ${alarmTime}` : "Set Alarm"}
          </button>
        )}
      </div>

      <div
        style={{
          background: "#0a0a0a",
          padding: "20px",
          borderRadius: "15px",
          border: "1px solid #3b82f6",
          marginTop: "20px",
          maxWidth: 460,
          marginInline: "auto",
        }}
      >
        <h3 style={{ color: "#3b82f6", margin: "0 0 4px" }}>Support Developer</h3>
        <p style={{ fontSize: "12px", color: "#9ca3af", margin: "0 0 12px" }}>
          Help us make this 50x better.
        </p>
        <input
          type="range"
          min="10"
          max="100"
          value={val}
          onChange={(e) => setVal(parseInt(e.target.value))}
          style={{ width: "100%" }}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            margin: "15px 0",
            fontSize: "20px",
          }}
        >
          <span>$10</span>
          <span style={{ color: "#4ade80", fontWeight: "bold" }}>${val}</span>
          <span>$100</span>
        </div>
        <button
          onClick={support}
          style={{
            width: "100%",
            padding: "12px",
            background: supportSent ? "#16a34a" : "#3b82f6",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          {supportSent ? "Thank you!" : "Support Now"}
        </button>
      </div>

      <p style={{ fontSize: "10px", color: "#555", marginTop: "20px" }}>
        *Enable Notifications for Alarm to work.
      </p>
    </div>
  );
}
