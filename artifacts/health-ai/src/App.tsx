import { useState, useEffect } from "react";

const STORAGE_KEY = "omni-code-ai:v1";
const DEFAULT_CODE =
  "\n<div style='text-align:center; font-family:sans-serif; padding:50px;'>\n  <h1 style='color:#58a6ff;'>Omni-Code AI Pro</h1>\n  <p>Left side mein prompt likho aur 'BUILD' dabao!</p>\n</div>";

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
  const [prompt, setPrompt] = useState<string>("");
  const [currency, setCurrency] = useState<"INR" | "USD">(initial.currency);
  const [amount, setAmount] = useState<number>(initial.amount);
  const [showSupport, setShowSupport] = useState<boolean>(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);

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

  // Maya's brain
  function handleMayaAction() {
    if (!prompt) return;
    const userPrompt = prompt.toLowerCase();
    let generatedCode = "";

    if (userPrompt.includes("login") || userPrompt.includes("form")) {
      generatedCode = `<div style="max-width:300px; margin:50px auto; padding:20px; border:1px solid #ccc; border-radius:10px; font-family:sans-serif;">
  <h2>Login</h2>
  <input type="text" placeholder="Username" style="width:100%; margin-bottom:10px; padding:8px;">
  <input type="password" placeholder="Password" style="width:100%; margin-bottom:10px; padding:8px;">
  <button style="width:100%; padding:10px; background:#238636; color:white; border:none; border-radius:5px;">Sign In</button>
</div>`;
    } else if (
      userPrompt.includes("button") ||
      userPrompt.includes("magic")
    ) {
      generatedCode = `<div style="display:flex; justify-content:center; align-items:center; height:100vh;">
  <button style="padding:20px 40px; font-size:20px; background:linear-gradient(45deg, #ff7b72, #8957e5); color:white; border:none; border-radius:50px; cursor:pointer; box-shadow:0 10px 20px rgba(0,0,0,0.2);">Maya's Magic Button</button>
</div>`;
    } else if (
      userPrompt.includes("dark") ||
      userPrompt.includes("portfolio")
    ) {
      generatedCode = `<body style="background:#0d1117; color:white; font-family:sans-serif; padding:40px;">
  <nav style="display:flex; justify-content:space-between;">
    <h2>My Portfolio</h2>
    <div>Home | Projects | Contact</div>
  </nav>
  <hr style="border:0.5px solid #333; margin:20px 0;">
  <h1>Hi, I'm a Developer</h1>
  <p>Built with Omni-Code AI by Maya.</p>
</body>`;
    } else if (
      userPrompt.includes("pricing") ||
      userPrompt.includes("plan") ||
      userPrompt.includes("card")
    ) {
      generatedCode = `<div style="display:flex; gap:20px; justify-content:center; padding:50px; font-family:sans-serif; background:#f6f8fa;">
  <div style="background:white; padding:30px; border-radius:12px; width:220px; box-shadow:0 4px 20px rgba(0,0,0,0.08); text-align:center;">
    <h3 style="margin:0 0 8px;">Starter</h3>
    <div style="font-size:36px; font-weight:bold; color:#1f6feb;">\$0</div>
    <p style="color:#666; font-size:14px;">For hobby projects</p>
    <ul style="text-align:left; padding-left:20px; font-size:14px; color:#444;">
      <li>1 project</li>
      <li>Community support</li>
    </ul>
    <button style="width:100%; padding:10px; background:#1f6feb; color:white; border:none; border-radius:6px; margin-top:10px;">Choose</button>
  </div>
  <div style="background:white; padding:30px; border-radius:12px; width:220px; box-shadow:0 8px 30px rgba(31,111,235,0.25); text-align:center; border:2px solid #1f6feb;">
    <h3 style="margin:0 0 8px;">Pro</h3>
    <div style="font-size:36px; font-weight:bold; color:#1f6feb;">\$19</div>
    <p style="color:#666; font-size:14px;">For growing teams</p>
    <ul style="text-align:left; padding-left:20px; font-size:14px; color:#444;">
      <li>Unlimited projects</li>
      <li>Priority support</li>
    </ul>
    <button style="width:100%; padding:10px; background:#238636; color:white; border:none; border-radius:6px; margin-top:10px;">Choose</button>
  </div>
</div>`;
    } else if (
      userPrompt.includes("hero") ||
      userPrompt.includes("landing") ||
      userPrompt.includes("banner")
    ) {
      generatedCode = `<section style="min-height:80vh; display:flex; flex-direction:column; align-items:center; justify-content:center; background:linear-gradient(135deg,#1f6feb,#8957e5); color:white; font-family:sans-serif; text-align:center; padding:40px;">
  <h1 style="font-size:48px; margin:0 0 16px;">Build the future, faster.</h1>
  <p style="font-size:18px; max-width:520px; opacity:0.9;">A modern starting point for your next big idea. Ship in days, not months.</p>
  <div style="margin-top:30px; display:flex; gap:12px;">
    <button style="padding:14px 28px; background:white; color:#1f6feb; border:none; border-radius:30px; font-weight:bold; font-size:16px;">Get Started</button>
    <button style="padding:14px 28px; background:transparent; color:white; border:2px solid white; border-radius:30px; font-weight:bold; font-size:16px;">Learn more</button>
  </div>
</section>`;
    } else if (
      userPrompt.includes("contact") ||
      userPrompt.includes("message")
    ) {
      generatedCode = `<div style="max-width:420px; margin:50px auto; padding:30px; border-radius:12px; background:white; box-shadow:0 8px 24px rgba(0,0,0,0.08); font-family:sans-serif;">
  <h2 style="margin:0 0 6px;">Get in touch</h2>
  <p style="color:#666; font-size:14px; margin:0 0 20px;">We usually reply within a day.</p>
  <input type="text" placeholder="Your name" style="width:100%; padding:10px; margin-bottom:10px; border:1px solid #ddd; border-radius:6px; box-sizing:border-box;">
  <input type="email" placeholder="Your email" style="width:100%; padding:10px; margin-bottom:10px; border:1px solid #ddd; border-radius:6px; box-sizing:border-box;">
  <textarea placeholder="Your message" rows="4" style="width:100%; padding:10px; margin-bottom:10px; border:1px solid #ddd; border-radius:6px; box-sizing:border-box; resize:vertical;"></textarea>
  <button style="width:100%; padding:12px; background:#238636; color:white; border:none; border-radius:6px; font-weight:bold;">Send Message</button>
</div>`;
    } else if (
      userPrompt.includes("navbar") ||
      userPrompt.includes("header") ||
      userPrompt.includes("menu")
    ) {
      generatedCode = `<nav style="display:flex; align-items:center; justify-content:space-between; padding:14px 28px; background:white; border-bottom:1px solid #eee; font-family:sans-serif; box-shadow:0 2px 8px rgba(0,0,0,0.04);">
  <div style="display:flex; align-items:center; gap:10px;">
    <div style="width:32px; height:32px; border-radius:8px; background:linear-gradient(45deg,#1f6feb,#8957e5);"></div>
    <strong style="font-size:18px;">Brand</strong>
  </div>
  <div style="display:flex; gap:24px; font-size:14px; color:#444;">
    <a href="#" style="text-decoration:none; color:inherit;">Home</a>
    <a href="#" style="text-decoration:none; color:inherit;">Features</a>
    <a href="#" style="text-decoration:none; color:inherit;">Pricing</a>
    <a href="#" style="text-decoration:none; color:inherit;">About</a>
  </div>
  <button style="padding:8px 16px; background:#1f6feb; color:white; border:none; border-radius:6px; font-weight:bold;">Sign in</button>
</nav>`;
    } else {
      generatedCode = `<div style="padding:40px; font-family:sans-serif; text-align:center;">
  <h1>Maya has built: ${prompt}</h1>
  <p>Aap is code ko editor mein edit bhi kar sakte hain!</p>
</div>`;
    }

    setCode(generatedCode);
    setPrompt("");

    if (Math.random() > 0.5) {
      setTimeout(() => setShowSupport(true), 1500);
    }
  }

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        background: "#0d1117",
        color: "#c9d1d9",
        overflow: "hidden",
        fontFamily: "Segoe UI, sans-serif",
      }}
    >
      {/* Maya Pro Sidebar */}
      <div
        style={{
          width: "320px",
          background: "#161b22",
          borderRight: "1px solid #30363d",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "25px" }}>
          <div
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              background: "linear-gradient(45deg, #ff7b72, #8957e5)",
              margin: "0 auto 10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "30px",
              color: "white",
              fontWeight: "bold",
            }}
          >
            M
          </div>
          <h3 style={{ color: "#58a6ff", margin: 0 }}>Maya AI Brain</h3>
          <p style={{ fontSize: "11px", color: "#56d364", margin: "4px 0 0" }}>
            Online &amp; Ready to Build
          </p>
        </div>

        <div style={{ flex: 1 }}>
          <label style={{ fontSize: "12px", color: "#8b949e" }}>
            Ask Maya to create something:
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Try: 'login form', 'pricing card', 'hero section', 'contact form', 'navbar', 'dark portfolio', 'magic button'..."
            style={{
              width: "100%",
              height: "100px",
              background: "#010409",
              color: "#fff",
              border: "1px solid #30363d",
              borderRadius: "8px",
              padding: "10px",
              marginTop: "5px",
              outline: "none",
              resize: "none",
              fontSize: "14px",
              boxSizing: "border-box",
            }}
          />
          <button
            onClick={handleMayaAction}
            style={{
              width: "100%",
              padding: "12px",
              background: "#238636",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontWeight: "bold",
              marginTop: "10px",
              cursor: "pointer",
            }}
          >
            BUILD FOR FREE
          </button>

          <p
            style={{
              fontSize: "12px",
              marginTop: "15px",
              color: "#8b949e",
            }}
          >
            <b>Maya:</b> "Bhai, main aapke liye code likh rahi hoon. Bas prompt
            dalo!"
          </p>
        </div>
      </div>

      {/* Editor */}
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
          <span style={{ fontWeight: "bold" }}>Omni-Code Editor v1.5</span>
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
              onClick={() => setShowSupport(true)}
              style={{
                background: "#1f6feb",
                color: "white",
                border: "none",
                padding: "6px 15px",
                borderRadius: "4px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              Support Dev
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
              padding: "20px",
              fontFamily: "monospace",
              fontSize: "15px",
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

      {/* Support Popup (centered modal) */}
      {showSupport && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "320px",
            background: "#161b22",
            padding: "25px",
            borderRadius: "15px",
            border: "2px solid #58a6ff",
            zIndex: 1000,
            boxShadow: "0 0 50px #000",
          }}
        >
          <h3 style={{ textAlign: "center", marginTop: 0 }}>
            Support Developer
          </h3>
          <div style={{ display: "flex", gap: "5px", marginBottom: "15px" }}>
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
                padding: "8px",
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
                padding: "8px",
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
              fontSize: "24px",
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
              padding: "12px",
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
              marginTop: "8px",
              background: "transparent",
              border: "none",
              color: "#8b949e",
              fontSize: "12px",
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
