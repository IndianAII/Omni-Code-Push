import { useState, useEffect } from "react";

const STORAGE_KEY = "omni-code-ai:v1";
const DEFAULT_CODE = "\n<h1 style='color:blue'>Welcome to Omni-Code</h1>";

type StoredState = {
  code: string;
  currency: "INR" | "USD";
  amount: number;
};

function loadStored(): StoredState {
  if (typeof window === "undefined") {
    return { code: DEFAULT_CODE, currency: "INR", amount: 800 };
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { code: DEFAULT_CODE, currency: "INR", amount: 800 };
    const parsed = JSON.parse(raw) as Partial<StoredState>;
    return {
      code: typeof parsed.code === "string" ? parsed.code : DEFAULT_CODE,
      currency: parsed.currency === "USD" ? "USD" : "INR",
      amount:
        typeof parsed.amount === "number" && parsed.amount > 0
          ? parsed.amount
          : parsed.currency === "USD"
            ? 10
            : 800,
    };
  } catch {
    return { code: DEFAULT_CODE, currency: "INR", amount: 800 };
  }
}

export default function App() {
  const initial = loadStored();
  const [code, setCode] = useState<string>(initial.code);
  const [currency, setCurrency] = useState<"INR" | "USD">(initial.currency);
  const [amount, setAmount] = useState<number>(initial.amount);
  const [showSupport, setShowSupport] = useState<boolean>(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setShowSupport(true), 20000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handle = setTimeout(() => {
      try {
        const payload: StoredState = { code, currency, amount };
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
        setSavedAt(Date.now());
      } catch {
        // storage may be full or disabled; ignore
      }
    }, 400);
    return () => clearTimeout(handle);
  }, [code, currency, amount]);

  function resetEditor() {
    setCode(DEFAULT_CODE);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
      setSavedAt(null);
    } catch {
      // ignore
    }
  }

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        background: "#0d1117",
        color: "#c9d1d9",
        fontFamily: "Segoe UI, sans-serif",
      }}
    >
      {/* Maya AI Sidebar */}
      <div
        style={{
          width: "280px",
          background: "#161b22",
          borderRight: "1px solid #30363d",
          padding: "15px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <div
            style={{
              width: "70px",
              height: "70px",
              borderRadius: "50%",
              background: "#ff7b72",
              margin: "0 auto 10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "30px",
            }}
          >
            M
          </div>
          <h3 style={{ color: "#58a6ff", margin: 0 }}>Maya AI</h3>
          <p style={{ fontSize: "11px" }}>Free Website Builder</p>
        </div>
        <div
          style={{
            flex: 1,
            background: "#010409",
            borderRadius: "8px",
            padding: "10px",
            fontSize: "13px",
            border: "1px solid #333",
          }}
        >
          <p>
            <b>Maya:</b> Hello! Main aapki website ekdum <b>FREE</b> mein bana
            rahi hoon. Kya main header ka color badal dun?
          </p>
          <button
            style={{
              width: "100%",
              padding: "10px",
              background: "#238636",
              border: "none",
              borderRadius: "5px",
              color: "white",
              fontWeight: "bold",
              marginTop: "10px",
              cursor: "pointer",
            }}
          >
            Confirm Free Build
          </button>
        </div>
      </div>

      {/* Editor Section */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <div
          style={{
            padding: "10px 20px",
            background: "#161b22",
            borderBottom: "1px solid #30363d",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span style={{ fontWeight: "bold" }}>Omni-Code AI Editor</span>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 11, color: "#8b949e" }}>
              {savedAt
                ? `Saved ${new Date(savedAt).toLocaleTimeString()}`
                : "Auto-save on"}
            </span>
            <button
              onClick={resetEditor}
              style={{
                background: "transparent",
                color: "#8b949e",
                border: "1px solid #30363d",
                padding: "5px 12px",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Reset
            </button>
            <button
              style={{
                background: "#1f6feb",
                color: "white",
                border: "none",
                padding: "5px 15px",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Deploy Live
            </button>
          </div>
        </div>
        <div style={{ display: "flex", flex: 1 }}>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            style={{
              flex: 1,
              background: "#0d1117",
              color: "#79c0ff",
              padding: "15px",
              fontFamily: "monospace",
              fontSize: "14px",
              border: "none",
              outline: "none",
              borderRight: "1px solid #30363d",
              resize: "none",
            }}
          />
          <iframe
            title="preview"
            srcDoc={code}
            style={{ flex: 1, background: "#fff", border: "none" }}
          />
        </div>
      </div>

      {/* Multi-Currency Support Popup */}
      {showSupport && (
        <div
          style={{
            position: "absolute",
            bottom: "20px",
            right: "20px",
            width: "300px",
            background: "#161b22",
            padding: "20px",
            borderRadius: "12px",
            border: "2px solid #58a6ff",
            boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
          }}
        >
          <h4 style={{ margin: "0 0 10px" }}>Support Developer</h4>
          <div style={{ display: "flex", gap: "5px", marginBottom: "10px" }}>
            <button
              onClick={() => {
                setCurrency("INR");
                setAmount(800);
              }}
              style={{
                flex: 1,
                background: currency === "INR" ? "#1f6feb" : "#333",
                color: "white",
                border: "none",
                padding: "5px",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              INR
            </button>
            <button
              onClick={() => {
                setCurrency("USD");
                setAmount(10);
              }}
              style={{
                flex: 1,
                background: currency === "USD" ? "#1f6feb" : "#333",
                color: "white",
                border: "none",
                padding: "5px",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              USD
            </button>
          </div>
          <input
            type="range"
            min={currency === "INR" ? 800 : 10}
            max={currency === "INR" ? 8000 : 100}
            value={amount}
            onChange={(e) => setAmount(parseInt(e.target.value))}
            style={{ width: "100%" }}
          />
          <div
            style={{
              textAlign: "center",
              fontSize: "22px",
              fontWeight: "bold",
              margin: "10px 0",
              color: "#56d364",
            }}
          >
            {currency === "INR" ? "Rs " : "$"}
            {amount}
          </div>
          <button
            style={{
              width: "100%",
              padding: "10px",
              background: "#238636",
              border: "none",
              borderRadius: "6px",
              color: "white",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Support Now
          </button>
          <button
            onClick={() => setShowSupport(false)}
            style={{
              width: "100%",
              marginTop: "5px",
              background: "transparent",
              border: "none",
              color: "#8b949e",
              fontSize: "11px",
              cursor: "pointer",
            }}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}
