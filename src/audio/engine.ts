import * as Tone from "tone";

let started = false;
let masterVolume = 0.8;

export function setVolume(value: number) {
  masterVolume = Math.max(0, Math.min(1, value));
  Tone.getDestination().volume.value = masterVolume === 0 ? -Infinity : -40 + masterVolume * 40;
}

export function getVolume(): number {
  return masterVolume;
}

let limiter: Tone.Limiter | null = null;

export async function ensureAudioStarted() {
  if (!started) {
    await Tone.start();
    await Tone.getContext().resume();
    if (!limiter) {
      limiter = new Tone.Limiter(-3).toDestination();
    }
    Tone.getDestination().volume.value = masterVolume === 0 ? -Infinity : -40 + masterVolume * 40;
    started = true;
  }
  if (Tone.getContext().state !== "running") {
    await Tone.getContext().resume();
  }
}

const pianoSynth = new Tone.PolySynth(Tone.Synth, {
  oscillator: { type: "fmtriangle", modulationType: "sine", modulationIndex: 0.8, harmonicity: 2 },
  envelope: { attack: 0.005, decay: 1.5, sustain: 0.08, release: 1.8 },
});
const pianoCompressor = new Tone.Compressor({ threshold: -20, ratio: 3, attack: 0.003, release: 0.15 }).toDestination();
const pianoEQ = new Tone.EQ3({ low: 2, mid: -2, high: -4 }).connect(pianoCompressor);
const pianoFilter = new Tone.Filter({ frequency: 4000, type: "lowpass", rolloff: -12 }).connect(pianoEQ);
const pianoReverb = new Tone.Reverb({ decay: 2.5, wet: 0.2 }).connect(pianoCompressor);
pianoSynth.connect(pianoFilter);
pianoSynth.connect(pianoReverb);
pianoSynth.volume.value = 0;

const xylophoneSynth = new Tone.PolySynth(Tone.FMSynth, {
  harmonicity: 6,
  modulationIndex: 0.8,
  oscillator: { type: "sine" },
  envelope: { attack: 0.005, decay: 1.0, sustain: 0, release: 0.8 },
  modulation: { type: "sine" },
  modulationEnvelope: { attack: 0.005, decay: 0.6, sustain: 0, release: 0.4 },
}).toDestination();
const xyloFilter = new Tone.Filter({ frequency: 3000, type: "lowpass", rolloff: -12 }).toDestination();
const xyloReverb = new Tone.Reverb({ decay: 2, wet: 0.3 }).toDestination();
xylophoneSynth.connect(xyloFilter);
xylophoneSynth.connect(xyloReverb);
xylophoneSynth.volume.value = -4;

const drumKick = new Tone.MembraneSynth({
  pitchDecay: 0.05,
  octaves: 6,
  envelope: { attack: 0.001, decay: 0.3, sustain: 0, release: 0.1 },
}).toDestination();

const drumSnare = new Tone.NoiseSynth({
  noise: { type: "white" },
  envelope: { attack: 0.001, decay: 0.15, sustain: 0, release: 0.05 },
}).toDestination();

const drumHihat = new Tone.MetalSynth({
  envelope: { attack: 0.001, decay: 0.1, release: 0.01 },
  harmonicity: 5.1,
  modulationIndex: 32,
  resonance: 4000,
  octaves: 1.5,
}).toDestination();
const drumTom = new Tone.MembraneSynth({
  pitchDecay: 0.08,
  octaves: 4,
  envelope: { attack: 0.001, decay: 0.25, sustain: 0, release: 0.1 },
}).toDestination();
drumKick.volume.value = 4;
drumSnare.volume.value = 4;
drumHihat.volume.value = 0;
drumTom.volume.value = 4;

const guitarSynth = new Tone.PolySynth(Tone.FMSynth, {
  harmonicity: 1,
  modulationIndex: 3,
  oscillator: { type: "triangle" },
  envelope: { attack: 0.005, decay: 0.5, sustain: 0.05, release: 0.8 },
  modulation: { type: "square" },
  modulationEnvelope: { attack: 0.002, decay: 0.2, sustain: 0, release: 0.5 },
}).toDestination();
guitarSynth.volume.value = 6;

const bassSynth = new Tone.MonoSynth({
  oscillator: { type: "fmsquare" },
  envelope: { attack: 0.02, decay: 0.3, sustain: 0.4, release: 0.5 },
  filterEnvelope: { attack: 0.02, decay: 0.1, sustain: 0.5, release: 0.5, baseFrequency: 200, octaves: 2.6 },
}).toDestination();
bassSynth.volume.value = 4;

const sitarSynth = new Tone.FMSynth({
  harmonicity: 2,
  modulationIndex: 3,
  oscillator: { type: "sine" },
  envelope: { attack: 0.01, decay: 2, sustain: 0.05, release: 2 },
  modulation: { type: "triangle" },
  modulationEnvelope: { attack: 0.01, decay: 1.5, sustain: 0.1, release: 1.5 },
}).toDestination();
const sitarVibrato = new Tone.Vibrato({ frequency: 4.5, depth: 0.08 }).toDestination();
const sitarReverb = new Tone.Reverb({ decay: 2.5, wet: 0.3 }).toDestination();
sitarSynth.connect(sitarVibrato);
sitarSynth.connect(sitarReverb);
sitarSynth.volume.value = 6;

const bellSynth = new Tone.PolySynth(Tone.FMSynth, {
  harmonicity: 8,
  modulationIndex: 2,
  envelope: { attack: 0.001, decay: 1.5, sustain: 0, release: 0.5 },
}).toDestination();
bellSynth.volume.value = 4;

export function playPiano(note: string) {
  pianoSynth.triggerAttackRelease(note, "4n");
}

export function playXylophone(note: string) {
  xylophoneSynth.triggerAttackRelease(note, "16n");
}

export function playDrum(type: "kick" | "snare" | "hihat" | "tom") {
  switch (type) {
    case "kick":
      drumKick.triggerAttackRelease("C1", "8n");
      break;
    case "snare":
      drumSnare.triggerAttackRelease("16n");
      break;
    case "hihat":
      drumHihat.triggerAttackRelease("C4", "32n");
      break;
    case "tom":
      drumTom.triggerAttackRelease("G2", "8n");
      break;
  }
}

export function playGuitar(note: string) {
  guitarSynth.triggerAttackRelease(note, "8n");
}

export function playBass(note: string) {
  bassSynth.triggerAttackRelease(note, "8n");
}

export function playSitar(note: string) {
  sitarSynth.triggerAttackRelease(note, "2n");
}

export function playBell(note: string) {
  bellSynth.triggerAttackRelease(note, "4n");
}

const harmonicaSynth = new Tone.PolySynth(Tone.AMSynth, {
  harmonicity: 2,
  oscillator: { type: "sine" },
  envelope: { attack: 0.08, decay: 0.4, sustain: 0.5, release: 0.6 },
  modulation: { type: "sine" },
  modulationEnvelope: { attack: 0.1, decay: 0.3, sustain: 0.4, release: 0.5 },
}).toDestination();
const harmonicaFilter = new Tone.Filter(1800, "lowpass").toDestination();
const harmonicaChorus = new Tone.Chorus({ frequency: 3, delayTime: 3.5, depth: 0.4 }).toDestination();
const harmonicaReverb = new Tone.Reverb({ decay: 1.5, wet: 0.2 }).toDestination();
harmonicaSynth.connect(harmonicaFilter);
harmonicaSynth.connect(harmonicaChorus);
harmonicaSynth.connect(harmonicaReverb);
harmonicaSynth.volume.value = 6;

const violinSynth = new Tone.PolySynth(Tone.FMSynth, {
  harmonicity: 2,
  modulationIndex: 0.8,
  oscillator: { type: "sine" },
  envelope: { attack: 0.2, decay: 0.5, sustain: 0.7, release: 1.5 },
  modulation: { type: "sine" },
  modulationEnvelope: { attack: 0.3, decay: 0.5, sustain: 0.5, release: 1.0 },
}).toDestination();
const violinVibrato = new Tone.Vibrato({ frequency: 4.5, depth: 0.06 }).toDestination();
const violinFilter = new Tone.Filter({ frequency: 2200, type: "lowpass", rolloff: -24 }).toDestination();
const violinReverb = new Tone.Reverb({ decay: 2.5, wet: 0.3 }).toDestination();
violinSynth.connect(violinVibrato);
violinSynth.connect(violinFilter);
violinSynth.connect(violinReverb);
violinSynth.volume.value = 8;

export function playViolin(note: string) {
  violinSynth.triggerAttackRelease(note, "2n");
}

const fluteSynth = new Tone.PolySynth(Tone.Synth, {
  oscillator: { type: "sine" },
  envelope: { attack: 0.12, decay: 0.3, sustain: 0.6, release: 1.0 },
}).toDestination();
const fluteVibrato = new Tone.Vibrato({ frequency: 5, depth: 0.05 }).toDestination();
const fluteFilter = new Tone.Filter({ frequency: 2500, type: "lowpass", rolloff: -12 }).toDestination();
const fluteReverb = new Tone.Reverb({ decay: 2, wet: 0.3 }).toDestination();
fluteSynth.connect(fluteVibrato);
fluteSynth.connect(fluteFilter);
fluteSynth.connect(fluteReverb);
fluteSynth.volume.value = 8;

export function playFlute(note: string) {
  fluteSynth.triggerAttackRelease(note, "4n");
}

export function playHarmonica(note: string) {
  harmonicaSynth.triggerAttackRelease(note, "4n");
}

export function playWelcomeJingle(): Promise<void> {
  const notes = ["C4", "E4", "G4", "C5", "E5", "G5", "C6"];
  const delay = 100;
  return new Promise((resolve) => {
    notes.forEach((note, i) => {
      setTimeout(() => {
        pianoSynth.triggerAttackRelease(note, "16n");
        xylophoneSynth.triggerAttackRelease(note, "16n");
      }, i * delay);
    });
    setTimeout(resolve, notes.length * delay + 300);
  });
}

export type RhymeNote = { note: string; duration: number };

export const RHYMES: Record<string, { name: string; notes: RhymeNote[] }> = {
  twinkle: {
    name: "Twinkle Twinkle",
    notes: [
      { note: "C4", duration: 400 }, { note: "C4", duration: 400 },
      { note: "G4", duration: 400 }, { note: "G4", duration: 400 },
      { note: "A4", duration: 400 }, { note: "A4", duration: 400 },
      { note: "G4", duration: 800 },
      { note: "F4", duration: 400 }, { note: "F4", duration: 400 },
      { note: "E4", duration: 400 }, { note: "E4", duration: 400 },
      { note: "D4", duration: 400 }, { note: "D4", duration: 400 },
      { note: "C4", duration: 800 },
      { note: "G4", duration: 400 }, { note: "G4", duration: 400 },
      { note: "F4", duration: 400 }, { note: "F4", duration: 400 },
      { note: "E4", duration: 400 }, { note: "E4", duration: 400 },
      { note: "D4", duration: 800 },
      { note: "G4", duration: 400 }, { note: "G4", duration: 400 },
      { note: "F4", duration: 400 }, { note: "F4", duration: 400 },
      { note: "E4", duration: 400 }, { note: "E4", duration: 400 },
      { note: "D4", duration: 800 },
      { note: "C4", duration: 400 }, { note: "C4", duration: 400 },
      { note: "G4", duration: 400 }, { note: "G4", duration: 400 },
      { note: "A4", duration: 400 }, { note: "A4", duration: 400 },
      { note: "G4", duration: 800 },
      { note: "F4", duration: 400 }, { note: "F4", duration: 400 },
      { note: "E4", duration: 400 }, { note: "E4", duration: 400 },
      { note: "D4", duration: 400 }, { note: "D4", duration: 400 },
      { note: "C4", duration: 800 },
    ],
  },
  wheelsonbus: {
    name: "Wheels on the Bus",
    notes: [
      { note: "C4", duration: 400 }, { note: "C4", duration: 200 },
      { note: "C4", duration: 400 }, { note: "E4", duration: 400 },
      { note: "G4", duration: 400 }, { note: "G4", duration: 400 },
      { note: "E4", duration: 800 },
      { note: "D4", duration: 400 }, { note: "D4", duration: 400 },
      { note: "E4", duration: 400 }, { note: "F4", duration: 400 },
      { note: "F4", duration: 400 }, { note: "E4", duration: 400 },
      { note: "D4", duration: 800 },
      { note: "C4", duration: 400 }, { note: "C4", duration: 200 },
      { note: "C4", duration: 400 }, { note: "E4", duration: 400 },
      { note: "G4", duration: 400 }, { note: "G4", duration: 400 },
      { note: "E4", duration: 800 },
      { note: "D4", duration: 400 }, { note: "F4", duration: 400 },
      { note: "E4", duration: 400 }, { note: "D4", duration: 400 },
      { note: "C4", duration: 800 },
    ],
  },
  jingle: {
    name: "Jingle Bells",
    notes: [
      { note: "E4", duration: 300 }, { note: "E4", duration: 300 },
      { note: "E4", duration: 600 },
      { note: "E4", duration: 300 }, { note: "E4", duration: 300 },
      { note: "E4", duration: 600 },
      { note: "E4", duration: 300 }, { note: "G4", duration: 300 },
      { note: "C4", duration: 300 }, { note: "D4", duration: 300 },
      { note: "E4", duration: 800 },
    ],
  },
  happybirthday: {
    name: "Happy Birthday",
    notes: [
      { note: "C4", duration: 300 }, { note: "C4", duration: 200 },
      { note: "D4", duration: 500 }, { note: "C4", duration: 500 },
      { note: "F4", duration: 500 }, { note: "E4", duration: 800 },
      { note: "C4", duration: 300 }, { note: "C4", duration: 200 },
      { note: "D4", duration: 500 }, { note: "C4", duration: 500 },
      { note: "G4", duration: 500 }, { note: "F4", duration: 800 },
      { note: "C4", duration: 300 }, { note: "C4", duration: 200 },
      { note: "C5", duration: 500 }, { note: "A4", duration: 500 },
      { note: "F4", duration: 500 }, { note: "E4", duration: 500 },
      { note: "D4", duration: 800 },
      { note: "Bb4", duration: 300 }, { note: "Bb4", duration: 200 },
      { note: "A4", duration: 500 }, { note: "F4", duration: 500 },
      { note: "G4", duration: 500 }, { note: "F4", duration: 800 },
    ],
  },
  oldmcdonald: {
    name: "Old MacDonald",
    notes: [
      { note: "C4", duration: 400 }, { note: "C4", duration: 400 },
      { note: "C4", duration: 400 }, { note: "G3", duration: 400 },
      { note: "A3", duration: 400 }, { note: "A3", duration: 400 },
      { note: "G3", duration: 800 },
      { note: "E4", duration: 400 }, { note: "E4", duration: 400 },
      { note: "D4", duration: 400 }, { note: "D4", duration: 400 },
      { note: "C4", duration: 800 },
    ],
  },
  baabaa: {
    name: "Baa Baa Black Sheep",
    notes: [
      { note: "C4", duration: 400 }, { note: "C4", duration: 400 },
      { note: "G4", duration: 400 }, { note: "G4", duration: 400 },
      { note: "A4", duration: 300 }, { note: "B4", duration: 300 },
      { note: "A4", duration: 300 }, { note: "G4", duration: 600 },
      { note: "F4", duration: 400 }, { note: "F4", duration: 400 },
      { note: "E4", duration: 400 }, { note: "E4", duration: 400 },
      { note: "D4", duration: 400 }, { note: "D4", duration: 400 },
      { note: "C4", duration: 800 },
    ],
  },
  zoomzoom: {
    name: "Zoom Zoom Zoom",
    notes: [
      { note: "C4", duration: 350 }, { note: "D4", duration: 350 },
      { note: "E4", duration: 350 }, { note: "F4", duration: 700 },
      { note: "E4", duration: 350 }, { note: "D4", duration: 350 },
      { note: "C4", duration: 700 },
      { note: "G4", duration: 350 }, { note: "G4", duration: 350 },
      { note: "F4", duration: 350 }, { note: "E4", duration: 350 },
      { note: "D4", duration: 700 },
      { note: "C4", duration: 350 }, { note: "D4", duration: 350 },
      { note: "E4", duration: 350 }, { note: "F4", duration: 700 },
      { note: "G4", duration: 350 }, { note: "A4", duration: 350 },
      { note: "G4", duration: 900 },
    ],
  },
  mary: {
    name: "Mary Had a Little Lamb",
    notes: [
      { note: "E4", duration: 400 }, { note: "D4", duration: 400 },
      { note: "C4", duration: 400 }, { note: "D4", duration: 400 },
      { note: "E4", duration: 400 }, { note: "E4", duration: 400 },
      { note: "E4", duration: 800 },
      { note: "D4", duration: 400 }, { note: "D4", duration: 400 },
      { note: "D4", duration: 800 },
      { note: "E4", duration: 400 }, { note: "G4", duration: 400 },
      { note: "G4", duration: 800 },
    ],
  },
};

let rhymeTimeout: ReturnType<typeof setTimeout>[] = [];
let rhymePlayFn: ((note: string) => void) | null = null;

export function setRhymeInstrument(playFn: (note: string) => void) {
  rhymePlayFn = playFn;
}

export function playRhyme(
  rhymeId: string,
  playFn: (note: string) => void,
  onStep: (index: number) => void,
  onDone: () => void
) {
  stopRhyme();
  rhymePlayFn = playFn;
  const rhyme = RHYMES[rhymeId];
  if (!rhyme) return;

  let time = 0;
  rhyme.notes.forEach((n, i) => {
    const t = setTimeout(() => {
      if (rhymePlayFn) rhymePlayFn(n.note);
      onStep(i);
    }, time);
    rhymeTimeout.push(t);
    time += n.duration;
  });

  const done = setTimeout(onDone, time + 200);
  rhymeTimeout.push(done);
}

export function stopRhyme() {
  rhymeTimeout.forEach(clearTimeout);
  rhymeTimeout = [];
}

let sequencerLoop: Tone.Loop | null = null;
let sequencerStep = 0;
type SequencerCallback = (step: number) => void;

export function startSequencer(bpm: number, steps: number, callback: SequencerCallback) {
  Tone.getTransport().bpm.value = bpm;
  sequencerStep = 0;
  sequencerLoop = new Tone.Loop((time) => {
    Tone.getDraw().schedule(() => {
      callback(sequencerStep);
      sequencerStep = (sequencerStep + 1) % steps;
    }, time);
  }, "8n");
  sequencerLoop.start(0);
  Tone.getTransport().start();
}

export function stopSequencer() {
  if (sequencerLoop) {
    sequencerLoop.stop();
    sequencerLoop.dispose();
    sequencerLoop = null;
  }
  Tone.getTransport().stop();
  sequencerStep = 0;
}

let recorder: MediaRecorder | null = null;
let recordedChunks: Blob[] = [];
let mediaStreamDest: MediaStreamAudioDestinationNode | null = null;

export function startRecording(): Promise<void> {
  return new Promise((resolve) => {
    const ctx = Tone.getContext().rawContext as AudioContext;
    mediaStreamDest = ctx.createMediaStreamDestination();
    Tone.getDestination().connect(mediaStreamDest);
    const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
      ? "audio/webm;codecs=opus"
      : "audio/mp4";
    recorder = new MediaRecorder(mediaStreamDest.stream, { mimeType });
    recordedChunks = [];
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) recordedChunks.push(e.data);
    };
    recorder.start(100);
    resolve();
  });
}

export function stopRecording(): Promise<Blob | null> {
  return new Promise((resolve) => {
    if (!recorder) {
      resolve(null);
      return;
    }
    recorder.onstop = () => {
      const mimeType = recorder?.mimeType || "audio/webm";
      const blob = new Blob(recordedChunks, { type: mimeType });
      if (mediaStreamDest) {
        Tone.getDestination().disconnect(mediaStreamDest);
        mediaStreamDest = null;
      }
      recorder = null;
      recordedChunks = [];
      resolve(blob);
    };
    recorder.stop();
  });
}
