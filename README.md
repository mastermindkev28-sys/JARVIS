# J.A.R.V.I.S. OS — Interactive Dashboard

> *"Just A Rather Very Intelligent System"* — an Iron Man–inspired HUD dashboard
> that runs entirely in your browser. No build step, no dependencies.

## Features

- **Boot sequence** — Stark Industries OS startup log with a spinning reactor loader
- **Animated arc reactor** — pulsing core with counter-rotating tick, dash, and arc rings; doubles as the voice trigger
- **Voice interface** — JARVIS greets you out loud and answers spoken commands (Web Speech API, prefers a British voice, naturally)
- **Live telemetry** — CPU, memory, network, power output, and core temperature panels with animated gauges and oscilloscope waveforms
- **Weather & threat panels**, live clock, status lights, and a Stark Industries ticker
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

| Say…                  | JARVIS will…                          |
| --------------------- | ------------------------------------- |
| "What time is it?"    | Tell you the time                     |
| "Status report"       | Read out live system diagnostics      |
| "How's the reactor?"  | Report arc reactor power output       |
| "Any threats?"        | Run a perimeter scan                  |
| "Tell me a joke"      | Attempt dry British humor             |
| "Who are you?"        | Introduce himself                     |
| "Play some music"     | Suggest AC/DC, as usual               |

## Project structure

```
index.html      — HUD layout
css/style.css   — glowing cyan theme, grid background, animations
js/jarvis.js    — boot sequence, telemetry simulation, waveforms, voice I/O
```
