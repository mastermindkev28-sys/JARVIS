/* ================= J.A.R.V.I.S. OS — CORE ================= */

const $ = (id) => document.getElementById(id);

/* ---------- boot sequence ---------- */
const BOOT_LINES = [
  "STARK INDUSTRIES UNIFIED OS v1.2.5",
  "> Initializing arc reactor interface .......... OK",
  "> Loading neural heuristics module ............ OK",
  "> Mounting sensor arrays [12/12] .............. OK",
  "> Calibrating repulsor telemetry .............. OK",
  "> Establishing satellite uplink ............... OK",
  "> Decrypting personal protocols ............... OK",
  "> Voice interface ............................. READY",
  "",
  "J.A.R.V.I.S. ONLINE. WELCOME BACK.",
];

function runBoot() {
  const log = $("boot-log");
  let i = 0;
  const next = () => {
    if (i < BOOT_LINES.length) {
      log.textContent += BOOT_LINES[i++] + "\n";
      setTimeout(next, 110 + Math.random() * 240);
    } else {
      setTimeout(() => {
        $("boot-overlay").classList.add("fade");
        $("hud").classList.remove("hidden");
        setTimeout(() => $("boot-overlay").remove(), 1300);
        greet();
      }, 600);
    }
  };
  next();
}

/* ---------- clock ---------- */
function tickClock() {
  const now = new Date();
  $("clock").textContent = now.toLocaleTimeString("en-GB");
  $("date").textContent = now
    .toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })
    .toUpperCase();
}
setInterval(tickClock, 1000);
tickClock();

/* ---------- reactor tick marks (outer ring) ---------- */
(function buildTicks() {
  const svg = document.querySelector(".ring-ticks");
  const NS = "http://www.w3.org/2000/svg";
  for (let i = 0; i < 72; i++) {
    const a = (i / 72) * Math.PI * 2;
    const long = i % 6 === 0;
    const r1 = long ? 186 : 191, r2 = 198;
    const line = document.createElementNS(NS, "line");
    line.setAttribute("x1", 200 + r1 * Math.cos(a));
    line.setAttribute("y1", 200 + r1 * Math.sin(a));
    line.setAttribute("x2", 200 + r2 * Math.cos(a));
    line.setAttribute("y2", 200 + r2 * Math.sin(a));
    line.setAttribute("stroke", long ? "#9beaff" : "#39c4e8");
    line.setAttribute("stroke-width", long ? 2.5 : 1.2);
    line.setAttribute("opacity", long ? 0.9 : 0.5);
    svg.appendChild(line);
  }
})();

/* ---------- simulated telemetry ---------- */
function drift(value, min, max, step) {
  value += (Math.random() - 0.5) * step;
  return Math.min(max, Math.max(min, value));
}

const telemetry = { cpu: 34, mem: 58, temp: 30, power: 2.41, up: 320, down: 1840 };

function updateTelemetry() {
  const t = telemetry;
  t.cpu  = drift(t.cpu, 8, 96, 14);
  t.mem  = drift(t.mem, 30, 90, 6);
  t.temp = drift(t.temp, 24, 41, 1.5);
  t.power = drift(t.power, 1.8, 3.0, 0.12);
  t.up   = drift(t.up, 40, 900, 160);
  t.down = drift(t.down, 200, 4000, 600);

  $("cpu-val").textContent = t.cpu.toFixed(0);
  $("cpu-bar").style.width = t.cpu + "%";
  $("mem-val").textContent = t.mem.toFixed(0);
  $("mem-bar").style.width = t.mem + "%";
  $("core-temp").textContent = t.temp.toFixed(0);
  $("power-val").textContent = t.power.toFixed(2);
  $("power-bar").style.width = (t.power / 3 * 100) + "%";
  $("net-up").textContent = t.up.toFixed(0);
  $("net-down").textContent = t.down.toFixed(0);
}
setInterval(updateTelemetry, 1200);
updateTelemetry();

/* ---------- waveform canvases ---------- */
function makeWave(canvasId, opts) {
  const ctx = $(canvasId).getContext("2d");
  const { w, h } = { w: ctx.canvas.width, h: ctx.canvas.height };
  let phase = Math.random() * 100;
  const { color = "#39c4e8", mode = "sine", speed = 0.12 } = opts || {};
  const bars = Array.from({ length: 32 }, () => Math.random());

  function frame() {
    phase += speed;
    ctx.clearRect(0, 0, w, h);
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = 1.5;
    ctx.shadowColor = color;
    ctx.shadowBlur = 6;

    if (mode === "bars") {
      const bw = w / bars.length;
      bars.forEach((b, i) => {
        bars[i] = Math.max(0.05, Math.min(1, b + (Math.random() - 0.5) * 0.3));
        const bh = bars[i] * (h - 4);
        ctx.fillRect(i * bw + 1, h - bh, bw - 2, bh);
      });
    } else {
      ctx.beginPath();
      for (let x = 0; x <= w; x += 2) {
        const noise = mode === "noisy" ? (Math.random() - 0.5) * h * 0.25 : 0;
        const y = h / 2 +
          Math.sin(x * 0.06 + phase) * h * 0.28 +
          Math.sin(x * 0.013 + phase * 0.6) * h * 0.14 + noise;
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
    requestAnimationFrame(frame);
  }
  frame();
}

makeWave("wave-cpu",   { mode: "noisy" });
makeWave("wave-mem",   { mode: "sine", speed: 0.07 });
makeWave("wave-net",   { mode: "bars" });
makeWave("wave-audio", { mode: "sine", speed: 0.22, color: "#9beaff" });
makeWave("wave-temp",  { mode: "sine", speed: 0.05 });
makeWave("wave-radar", { mode: "noisy", color: "#5dff9d", speed: 0.09 });

/* ---------- voice: speech synthesis ---------- */
function speak(text) {
  $("jarvis-line").textContent = text;
  if (!("speechSynthesis" in window)) return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  const voices = speechSynthesis.getVoices();
  // prefer a British male voice for authenticity
  u.voice =
    voices.find((v) => /en[-_]GB/i.test(v.lang) && /male|daniel|arthur/i.test(v.name)) ||
    voices.find((v) => /en[-_]GB/i.test(v.lang)) ||
    voices.find((v) => /^en/i.test(v.lang)) || null;
  u.rate = 1.02;
  u.pitch = 0.85;
  speechSynthesis.speak(u);
}

function greet() {
  const h = new Date().getHours();
  const part = h < 12 ? "morning" : h < 18 ? "afternoon" : "evening";
  speak(`Good ${part}, sir. All systems are online and functioning within normal parameters.`);
}

/* ---------- voice: command handling ---------- */
function respond(query) {
  const q = query.toLowerCase();
  const t = telemetry;
  const now = new Date();

  if (/\btime\b/.test(q))
    return `The time is ${now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}, sir.`;
  if (/\bdate\b|\bday\b/.test(q))
    return `Today is ${now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}.`;
  if (/status|report|diagnostic/.test(q))
    return `Diagnostics complete. CPU at ${t.cpu.toFixed(0)} percent, memory at ${t.mem.toFixed(0)} percent, core temperature ${t.temp.toFixed(0)} degrees. All systems nominal, sir.`;
  if (/power|reactor|energy/.test(q))
    return `The arc reactor is stable and producing ${t.power.toFixed(2)} gigawatts. More than enough to keep the lights on, sir.`;
  if (/weather|temperature outside/.test(q))
    return `Current conditions are fair, ${$("temp").textContent} degrees with ${$("humidity").textContent} percent humidity.`;
  if (/threat|hostile|danger/.test(q))
    return `Scanning... no hostiles detected within the perimeter. You may relax, sir.`;
  if (/who are you|your name/.test(q))
    return `I am JARVIS — Just A Rather Very Intelligent System. At your service, sir.`;
  if (/hello|hi |hey/.test(q))
    return `Hello, sir. How may I assist you today?`;
  if (/joke/.test(q))
    return `I would tell you a joke about the arc reactor, sir, but I fear it would not get a glowing reaction.`;
  if (/thank/.test(q))
    return `Always a pleasure, sir.`;
  if (/suit|armor|mark/.test(q))
    return `The Mark 42 is currently in the workshop, sir. Shall I begin pre-flight diagnostics?`;
  if (/music/.test(q))
    return `I am afraid my speakers are tied up running diagnostics, sir. Might I suggest AC/DC, as usual?`;

  return `I heard: "${query}". That protocol is not yet in my database, sir.`;
}

/* ---------- voice: speech recognition ---------- */
const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition = null;
let listening = false;

if (SR) {
  recognition = new SR();
  recognition.lang = "en-US";
  recognition.interimResults = false;

  recognition.onresult = (e) => {
    const text = e.results[0][0].transcript;
    $("user-line").textContent = text;
    speak(respond(text));
  };
  recognition.onend = () => setListening(false);
  recognition.onerror = () => setListening(false);
}

function setListening(on) {
  listening = on;
  $("reactor").classList.toggle("listening", on);
  $("mic-btn").classList.toggle("live", on);
  $("mic-btn").textContent = on ? "◉ LISTENING..." : "◉ ENGAGE VOICE INTERFACE";
  $("reactor-label").textContent = on ? "VOICE INTERFACE ACTIVE" : "ARC REACTOR — STABLE";
}

function toggleListening() {
  if (!recognition) {
    speak("I'm sorry sir, voice recognition is not supported in this browser. Chrome or Edge would serve you better.");
    return;
  }
  if (listening) {
    recognition.stop();
  } else {
    setListening(true);
    recognition.start();
  }
}

$("mic-btn").addEventListener("click", toggleListening);
$("reactor").addEventListener("click", toggleListening);

/* ---------- random ambient status changes ---------- */
const STATUSES = [
  "ALL SYSTEMS NOMINAL",
  "RUNNING BACKGROUND DIAGNOSTICS",
  "SATELLITE UPLINK SYNCHRONIZED",
  "MONITORING PERIMETER SENSORS",
  "OPTIMIZING POWER DISTRIBUTION",
];
setInterval(() => {
  $("sys-status").textContent = STATUSES[Math.floor(Math.random() * STATUSES.length)];
}, 8000);

/* ---------- go ---------- */
// Chrome loads voices asynchronously; warm them up before the greeting.
if ("speechSynthesis" in window) speechSynthesis.getVoices();
runBoot();
