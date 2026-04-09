# LittleMaestro

🚧 **Work in Progress** - We're iterating! Features and UI may change.

![Status](https://img.shields.io/badge/status-in%20progress-yellow)



# LittleMaestro

A browser-based music app built for my toddler daughter who loves music. No downloads, no ads, no subscriptions — just pure musical joy for little hands.

**[Play Now](https://kumudchauhan.github.io/littlemaestro/)**

## What is it?

LittleMaestro is a collection of realistic virtual instruments designed for toddlers. Every instrument is built with large, colorful touch targets that work perfectly on iPads and phones. All sounds are synthesized in real-time using the Web Audio API — no audio files, no server needed. It even works offline.

## Instruments

Based on child development trends and common favorites in interactive apps, here are the top instruments kids love, categorized by why they appeal to "little maestros":

### 1. **The "Big Three" (Immediate Feedback)**

**Drums & Percussion:** 🥁 The absolute favorite for toddlers. It’s physical, loud, and teaches cause-and-effect instantly. For your redesign project, larger circular pads are great for developing motor skills.

**Piano/Keyboard:** 🎹 Visually intuitive. Kids love the linear layout and the ability to press multiple keys to create chords (or "discordant joy").

**Xylophone/Rainbow Glissando:** 🌈 The bright colors help kids associate specific pitches with visual cues.

### **2. Cultural & Unique Sounds**
**Tabla:** 🪘 Since you are planning to add the Tabla, it’s a fantastic addition. The "Bayon" (bass) and "Dayan" (treble) sounds provide a unique rhythmic texture that is very engaging for young ears.

**Guitar/Violin:** 🎸 Smaller string instruments are popular because they feel "grown-up" but are manageable.

**Shakers & Maracas:** 🪇 Kids love the "sustained" sound of shaking, which is different from the single strike of a drum.

3. **"Magic" & Wind Instruments**
**Bells/Chimes:** 🔔 High-pitched, clear sounds often feel "magical" to children and are great for capturing attention.

**Flute/Recorder:** 🪈 While physically harder to play in real life, in a digital app like LittleMaestro, wind sounds provide a soothing contrast to percussion.

## Inspiration behind Why I built this ## 

There are plenty of fun music apps on the App Store, but none of them let me customize the experience for my daughter. I wanted something that grows with her dynamizally where I can add the instruments she loves, the rhymes she hums along to, and remove what she doesn't care about. This gives me the freedom to shape it around her choices, and gives her a playground of musical instruments to explore as her tastes evolve.

I wanted to build something real that my daughter could actually use everyday. She lights up every time she hears music, and I wanted to give her a way to make her own. No paid APIs, no subscriptions — everything runs entirely in the browser using Tone.js for audio synthesis.

### Future Roadmap ###

From a personal "gift" to a "App-as-a-Gift" model for the music lover kids of my family and friends


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
