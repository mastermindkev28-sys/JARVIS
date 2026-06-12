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

/* ---------- live weather (Open-Meteo, no API key) ---------- */
const WMO_CODES = {
  0: "Clear", 1: "Mostly Clear", 2: "Partly Cloudy", 3: "Overcast",
  45: "Fog", 48: "Icy Fog", 51: "Light Drizzle", 53: "Drizzle", 55: "Heavy Drizzle",
  56: "Freezing Drizzle", 57: "Freezing Drizzle", 61: "Light Rain", 63: "Rain",
  65: "Heavy Rain", 66: "Freezing Rain", 67: "Freezing Rain", 71: "Light Snow",
  73: "Snow", 75: "Heavy Snow", 77: "Snow Grains", 80: "Light Showers",
  81: "Showers", 82: "Heavy Showers", 85: "Snow Showers", 86: "Snow Showers",
  95: "Thunderstorm", 96: "Thunderstorm + Hail", 99: "Thunderstorm + Hail",
};

const weather = { live: false, city: "", desc: "Fair", temp: 21, humidity: 44, wind: 8 };

function compass(deg) {
  const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  return dirs[Math.round(deg / 45) % 8];
}

function getLocation() {
  // Try browser geolocation first (5s budget), then fall back to IP lookup.
  const byGPS = new Promise((resolve, reject) => {
    if (!navigator.geolocation) return reject();
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude, city: "" }),
      reject, { timeout: 5000 }
    );
  });
  const byIP = () =>
    fetch("https://ipapi.co/json/")
      .then((r) => r.json())
      .then((d) => ({ lat: d.latitude, lon: d.longitude, city: d.city || "" }));
  return byGPS.catch(byIP);
}

async function refreshWeather(announce) {
  try {
    const loc = await getLocation();
    const url =
      `https://api.open-meteo.com/v1/forecast?latitude=${loc.lat}&longitude=${loc.lon}` +
      `&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,` +
      `wind_speed_10m,wind_direction_10m,surface_pressure&daily=sunrise,sunset&timezone=auto`;
    const data = await (await fetch(url)).json();
    const c = data.current;

    weather.live = true;
    weather.city = loc.city;
    weather.desc = WMO_CODES[c.weather_code] || "Unknown";
    weather.temp = Math.round(c.temperature_2m);
    weather.humidity = Math.round(c.relative_humidity_2m);
    weather.wind = Math.round(c.wind_speed_10m);

    $("temp").textContent = weather.temp;
    $("weather-desc").textContent = weather.desc;
    $("humidity").textContent = weather.humidity;
    $("feels").textContent = Math.round(c.apparent_temperature);
    $("wind").textContent = `${weather.wind} km/h (${compass(c.wind_direction_10m)})`;
    $("pressure").textContent = c.surface_pressure.toFixed(1);
    const fmtTime = (iso) =>
      new Date(iso).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
    $("sunrise").textContent = fmtTime(data.daily.sunrise[0]);
    $("sunset").textContent = fmtTime(data.daily.sunset[0]);
    $("weather-loc").textContent = loc.city ? loc.city.toUpperCase() : "LOCAL CONDITIONS";
    $("weather-src").textContent = "LIVE SATELLITE FEED — OPEN-METEO";

    if (announce) speak(weatherReport());
  } catch (e) {
    $("weather-src").textContent = "SIMULATED DATA — UPLINK UNAVAILABLE";
    if (announce) speak("I'm afraid the weather uplink is unavailable, sir. Displaying cached atmospheric data.");
  }
}

function weatherReport() {
  const where = weather.city ? ` in ${weather.city}` : "";
  return `Current conditions${where}: ${weather.desc.toLowerCase()}, ${weather.temp} degrees, ` +
         `${weather.humidity} percent humidity, wind at ${weather.wind} kilometers per hour.`;
}

setInterval(() => refreshWeather(false), 10 * 60 * 1000); // refresh every 10 min

/* ---------- voice: speech synthesis ---------- */
// Ranked by closeness to JARVIS (calm, refined British male). The Edge
// "Ryan (Natural)" neural voice is by far the best match, followed by
// Chrome's "Google UK English Male" and Apple's "Daniel".
const VOICE_PREFS = [
  /ryan.*(natural|online)/i,
  /thomas.*(natural|online)/i,
  /google uk english male/i,
  /\bdaniel\b/i,
  /\barthur\b/i,
  /\bgeorge\b/i,
  /\boliver\b/i,
];

let voiceList = [];
let chosenVoice = null;

function scoreVoice(v) {
  for (let i = 0; i < VOICE_PREFS.length; i++)
    if (VOICE_PREFS[i].test(v.name)) return 1000 - i * 10;
  let s = 0;
  if (/en[-_]GB/i.test(v.lang)) s += 50;
  if (/natural|neural|online/i.test(v.name)) s += 25;
  if (/male/i.test(v.name) && !/female/i.test(v.name)) s += 20;
  return s;
}

function loadVoices() {
  voiceList = speechSynthesis.getVoices().filter((v) => /^en/i.test(v.lang));
  if (!voiceList.length) return;
  voiceList.sort((a, b) => scoreVoice(b) - scoreVoice(a));
  const saved = localStorage.getItem("jarvis-voice");
  chosenVoice = voiceList.find((v) => v.name === saved) || voiceList[0];

  const sel = $("voice-select");
  sel.innerHTML = "";
  voiceList.forEach((v) => {
    const opt = document.createElement("option");
    opt.textContent = v.name;
    opt.selected = v === chosenVoice;
    sel.appendChild(opt);
  });
}

$("voice-select").addEventListener("change", (e) => {
  const v = voiceList.find((x) => x.name === e.target.value);
  if (!v) return;
  chosenVoice = v;
  localStorage.setItem("jarvis-voice", v.name);
  speak("Vocal profile calibrated, sir. How do I sound?");
});

function speak(text) {
  $("jarvis-line").textContent = text;
  if (!("speechSynthesis" in window)) return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  if (chosenVoice) u.voice = chosenVoice;
  // JARVIS delivery: measured pace, slightly lowered pitch. Neural
  // "Natural" voices sound artificial when pitch-shifted, so leave
  // those at their native pitch.
  const neural = chosenVoice && /natural|neural|online/i.test(chosenVoice.name);
  u.rate = 0.95;
  u.pitch = neural ? 1.0 : 0.8;
  speechSynthesis.speak(u);
}

function greet() {
  const h = new Date().getHours();
  const part = h < 12 ? "morning" : h < 18 ? "afternoon" : "evening";
  speak(`Good ${part}, sir. All systems are online and functioning within normal parameters.`);
}

/* ---------- alert mode ---------- */
let alertMode = false;
function setAlert(on) {
  alertMode = on;
  document.body.classList.toggle("alert", on);
  $("sys-status").textContent = on ? "⚠ RED ALERT — DEFENSE PROTOCOLS ACTIVE" : "ALL SYSTEMS NOMINAL";
  const threat = $("threat");
  threat.textContent = on ? "HOSTILES DETECTED — WEAPONS HOT" : "NO HOSTILES DETECTED";
  threat.classList.toggle("alert", on);
  threat.classList.toggle("ok", !on);
}

/* ---------- timers ---------- */
function parseTimer(q) {
  const m = q.match(/timer.*?(\d+)\s*(second|minute|hour)/) || q.match(/(\d+)\s*(second|minute|hour).*timer/);
  if (!m) return null;
  const n = parseInt(m[1], 10);
  const ms = n * { second: 1000, minute: 60000, hour: 3600000 }[m[2]];
  setTimeout(() => {
    speak(`Sir, your ${n} ${m[2]}${n > 1 ? "s" : ""} timer has elapsed.`);
  }, ms);
  return `Timer set for ${n} ${m[2]}${n > 1 ? "s" : ""}, sir. I shall notify you.`;
}

/* ---------- arithmetic ---------- */
function parseMath(q) {
  const norm = q
    .replace(/\bplus\b/g, "+").replace(/\bminus\b/g, "-")
    .replace(/\b(times|multiplied by|x)\b/g, "*").replace(/\bdivided by\b|\bover\b/g, "/");
  const m = norm.match(/(-?\d+(?:\.\d+)?)\s*([+\-*/])\s*(-?\d+(?:\.\d+)?)/);
  if (!m) return null;
  const [, a, op, b] = m;
  const x = parseFloat(a), y = parseFloat(b);
  if (op === "/" && y === 0) return "Even I cannot divide by zero, sir.";
  const r = { "+": x + y, "-": x - y, "*": x * y, "/": x / y }[op];
  return `That would be ${parseFloat(r.toFixed(4))}, sir.`;
}

/* ---------- self destruct ---------- */
function selfDestruct() {
  let n = 5;
  setAlert(true);
  const tick = () => {
    if (n > 0) {
      speak(`${n}`);
      n--; setTimeout(tick, 1100);
    } else {
      setAlert(false);
      speak("Self-destruct cancelled. You really should stop testing that one, sir.");
    }
  };
  setTimeout(tick, 1500);
  return "Self-destruct sequence initiated. Counting down.";
}

/* ---------- voice: command handling ---------- */
function respond(query) {
  const q = query.toLowerCase();
  const t = telemetry;
  const now = new Date();

  // actions first
  if (/red alert|battle stations|defense protocol|intruder/.test(q)) {
    setAlert(true);
    return "Red alert, sir. Defense protocols engaged. All weapons systems online.";
  }
  if (/stand down|all clear|cancel alert|disengage/.test(q)) {
    setAlert(false);
    return "Standing down, sir. Returning all systems to nominal.";
  }
  if (/self.?destruct/.test(q)) return selfDestruct();
  if (/timer/.test(q)) return parseTimer(q) || "Please specify a duration, sir. For example: set a timer for five minutes.";
  if (/full.?screen/.test(q)) {
    document.documentElement.requestFullscreen?.();
    return "Engaging full immersion mode, sir.";
  }
  if (/search (?:the web |google )?for (.+)/.test(q)) {
    const term = q.match(/search (?:the web |google )?for (.+)/)[1];
    window.open(`https://www.google.com/search?q=${encodeURIComponent(term)}`, "_blank");
    return `Searching the web for ${term}, sir.`;
  }
  if (/open (youtube|google|github|wikipedia)/.test(q)) {
    const site = q.match(/open (youtube|google|github|wikipedia)/)[1];
    window.open(`https://www.${site}.${site === "wikipedia" ? "org" : "com"}`, "_blank");
    return `Opening ${site}, sir.`;
  }
  if (/refresh weather|update weather/.test(q)) {
    refreshWeather(true);
    return "Contacting the weather satellites now, sir.";
  }

  // arithmetic ("what is 12 times 8")
  const math = parseMath(q);
  if (math && /what is|what's|calculate|compute|how much/.test(q)) return math;

  // information
  if (/\btime\b/.test(q))
    return `The time is ${now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}, sir.`;
  if (/\bdate\b|\bday\b/.test(q))
    return `Today is ${now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}.`;
  if (/status|report|diagnostic/.test(q))
    return `Diagnostics complete. CPU at ${t.cpu.toFixed(0)} percent, memory at ${t.mem.toFixed(0)} percent, core temperature ${t.temp.toFixed(0)} degrees. All systems nominal, sir.`;
  if (/power|reactor|energy/.test(q))
    return `The arc reactor is stable and producing ${t.power.toFixed(2)} gigawatts. More than enough to keep the lights on, sir.`;
  if (/weather|temperature outside|forecast/.test(q))
    return weather.live
      ? weatherReport()
      : "The weather uplink is offline, sir. Cached data shows fair conditions.";
  if (/threat|hostile|danger/.test(q))
    return alertMode
      ? "Hostiles detected, sir. Might I suggest the Mark 42?"
      : "Scanning... no hostiles detected within the perimeter. You may relax, sir.";
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
  if (alertMode) return;
  $("sys-status").textContent = STATUSES[Math.floor(Math.random() * STATUSES.length)];
}, 8000);

/* ---------- go ---------- */
// Voices load asynchronously in Chrome/Edge; pick the best one as soon
// as the list is available (and again if it changes).
if ("speechSynthesis" in window) {
  loadVoices();
  speechSynthesis.onvoiceschanged = loadVoices;
}
refreshWeather(false);
runBoot();
