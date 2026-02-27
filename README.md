# LittleMaestro

A browser-based music app built for my 16-month-old daughter who loves music. No downloads, no ads, no subscriptions — just pure musical joy for little hands.

**[Play Now](https://kumudchauhan.github.io/littlemaestro/)**

## What is it?

LittleMaestro is a collection of realistic virtual instruments designed for toddlers. Every instrument is built with large, colorful touch targets that work perfectly on iPads and phones. All sounds are synthesized in real-time using the Web Audio API — no audio files, no server needed. It even works offline.

## Instruments

- **Piano** — Realistic FM synthesis with hammer-strike feel, compressor, and concert hall reverb
- **Guitar** — Acoustic guitar with 6 strings (E A D G B e), wooden fretboard design, and vibrating string animations
- **Sitar** — Indian classical sitar with Sa Re Ga Ma Pa Dha Ni notes, curved frets, and gourd tumba
- **Xylophone** — Rainbow-colored bars that taper like a real xylophone, with bright bell-like FM tones
- **Harmonica** — 10-hole mouth organ with AM synthesis, chorus, and breathy reverb
- **Bells** — Golden, silver, and bronze bells in a 2x2 grid with ring animations
- **Drums** — Kick, snare, hi-hat, and tom in a big 2x2 grid with ripple effects
- **Beat Maker** — 4-track step sequencer to create drum patterns
- **Nursery Rhymes** — Twinkle Twinkle, Happy Birthday, Old MacDonald, Wheels on the Bus, and more — playable on any instrument

## Why I built this

I wanted to build something real that my daughter could actually use — not just a portfolio project. She lights up every time she hears music, and I wanted to give her a way to make her own. No budget for paid APIs or subscriptions, so everything runs entirely in the browser using Tone.js for audio synthesis.

## Tech Stack

- **React 19** + **TypeScript** + **Vite**
- **Tone.js** — Web Audio synthesis (PolySynth, FMSynth, AMSynth, MembraneSynth, NoiseSynth, MetalSynth)
- **PWA** — Installable, works offline, full-screen on mobile
- **Pure CSS** — Realistic instrument designs, no image assets

## Run locally

```bash
git clone https://github.com/kumudchauhan/littlemaestro.git
cd littlemaestro
npm install
npm run dev
```

Open on your phone/tablet using the network URL shown in the terminal.

## License

MIT
