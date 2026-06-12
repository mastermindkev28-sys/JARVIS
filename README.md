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
