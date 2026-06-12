# J.A.R.V.I.S. OS — Interactive Dashboard

> *"Just A Rather Very Intelligent System"* — an Iron Man–inspired HUD dashboard
> that runs entirely in your browser. No build step, no dependencies.

## Features

- **Boot sequence** — Stark Industries OS startup log with a spinning reactor loader
- **Animated arc reactor** — pulsing core with counter-rotating tick, dash, and arc rings; doubles as the voice trigger
- **Voice interface** — JARVIS greets you out loud and answers spoken commands (Web Speech API, prefers a British voice, naturally)
- **Live telemetry** — CPU, memory, network, power output, and core temperature panels with animated gauges and oscilloscope waveforms
- **Real weather** — live conditions from the [Open-Meteo](https://open-meteo.com/) API (no key required), located via browser geolocation with an IP-lookup fallback; falls back to simulated data offline
- **Red alert mode** — the whole HUD shifts to red with pulsing reactor and threat warnings ("red alert" / "stand down")
- **Threat panel**, live clock, status lights, and a Stark Industries ticker
- **Responsive** — collapses to a single column on small screens

## Run it

Just open `index.html` in a browser, or serve it locally:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

> **Note:** Voice *recognition* requires Chrome or Edge and microphone
> permission (and a `localhost` or `https` origin). Voice *output* (JARVIS
> speaking) works in most modern browsers.

### The real JARVIS voice (ElevenLabs)

For a genuinely film-grade voice, JARVIS can speak through
[ElevenLabs](https://elevenlabs.io) neural TTS:

1. Create a free ElevenLabs account and copy your API key
   (profile → API Keys). The free tier includes ~10k characters/month.
2. Paste the key into the **EL UPLINK** field on the dashboard and click
   **LINK**.
3. JARVIS auto-selects their most British voice (*Daniel* or *George* —
   both excellent) and the VOCAL PROFILE dropdown fills with all your
   ElevenLabs voices, marked with ◆.

The key is stored only in your browser's localStorage and sent only to
`api.elevenlabs.io` — there is no backend. If the uplink ever fails,
JARVIS falls back to the best browser voice automatically.

### Getting the most JARVIS-like browser voice

JARVIS automatically picks the most British-butler voice your system has,
and the **VOCAL PROFILE** dropdown in the console lets you audition the
rest (your choice is remembered). Best options by browser:

- **Microsoft Edge** — *Ryan (Natural)*, a UK neural voice and easily the
  closest to the films. Edge ships it by default; JARVIS auto-selects it.
- **Chrome** — *Google UK English Male* (requires being online).
- **macOS/iOS** — *Daniel* (enable more voices in System Settings →
  Accessibility → Spoken Content).
- **Windows** — add UK voices via Settings → Time & Language → Speech.

## Talk to JARVIS

Click the arc reactor (or the **ENGAGE VOICE INTERFACE** button) and try:

| Say…                          | JARVIS will…                                   |
| ----------------------------- | ---------------------------------------------- |
| "What time is it?"            | Tell you the time                              |
| "Status report"               | Read out live system diagnostics               |
| "What's the weather?"         | Read the live local forecast                   |
| "How's the reactor?"          | Report arc reactor power output                |
| "Any threats?"                | Run a perimeter scan                           |
| "Red alert" / "Stand down"    | Switch the whole HUD to/from combat mode       |
| "Set a timer for 5 minutes"   | Set a spoken-countdown timer                   |
| "What is 12 times 8?"         | Do the math                                    |
| "Search for arc reactors"     | Open a web search in a new tab                 |
| "Open YouTube / GitHub"       | Open the site in a new tab                     |
| "Full screen"                 | Engage full immersion mode                     |
| "Self destruct"               | Count down dramatically, then think better of it |
| "Tell me a joke"              | Attempt dry British humor                      |
| "Play some music"             | Suggest AC/DC, as usual                        |

## Project structure

```
index.html      — HUD layout
css/style.css   — glowing cyan theme, grid background, animations
js/jarvis.js    — boot sequence, telemetry simulation, waveforms, voice I/O
```
