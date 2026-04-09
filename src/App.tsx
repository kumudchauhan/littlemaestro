import { useState, useCallback } from "react";
import Piano from "./components/Piano";
import Drums from "./components/Drums";
import Xylophone from "./components/Xylophone";
import Guitar from "./components/Guitar";
import MouthOrgan from "./components/MouthOrgan";
import Sitar from "./components/Sitar";
import Violin from "./components/Violin";
import Flute from "./components/Flute";
import Bells from "./components/Bells";
import Rhymes from "./components/Rhymes";
import Tabla from "./components/Tabla";
import {
  ensureAudioStarted,
  setVolume,
  getVolume,
  stopRhyme,
  playWelcomeJingle,
  playPiano,
  playGuitar,
  playXylophone,
  playBell,
  playViolin,
  playSitar,
  playFlute,
  playHarmonica,
} from "./audio/engine";
import "./App.css";

const INSTRUMENTS = [
  { id: "piano", emoji: "🎹", component: Piano },
  { id: "guitar", emoji: "🎸", component: Guitar },
  { id: "xylo", emoji: "🌈", component: Xylophone },
  { id: "drums", emoji: "🥁", component: Drums },
  { id: "tabla", emoji: "🪘", component: Tabla },
  { id: "bells", emoji: "🔔", component: Bells },
  { id: "violin", emoji: "🎻", component: Violin },
  { id: "sitar", emoji: "🪕", component: Sitar },
  { id: "flute", emoji: "🪈", component: Flute },
  { id: "harmonica", emoji: "🎙️", component: MouthOrgan },
];

const RHYME_PLAY_FNS: Record<string, (note: string) => void> = {
  piano: playPiano,
  guitar: playGuitar,
  xylo: playXylophone,
  bells: playBell,
  violin: playViolin,
  sitar: playSitar,
  flute: playFlute,
  harmonica: playHarmonica,
};

export default function App() {
  const [started, setStarted] = useState(false);
  const [activeInstrument, setActiveInstrument] = useState("piano");
  const [rhymeInstrument, setRhymeInstrument] = useState("piano");
  const [volume, setVolumeState] = useState(getVolume());

  const isRhymesMode = activeInstrument === "rhymes";

  const handleStart = useCallback(async () => {
    await ensureAudioStarted();
    playWelcomeJingle();
    setStarted(true);
  }, []);

  if (!started) {
    return (
      <div className="splash" onPointerDown={handleStart}>
        <div className="splash-content">
          <div className="splash-floating">
            <span className="splash-float-emoji">🎹</span>
            <span className="splash-float-emoji">🎸</span>
            <span className="splash-float-emoji">🥁</span>
            <span className="splash-float-emoji">🎻</span>
            <span className="splash-float-emoji">🪈</span>
            <span className="splash-float-emoji">🔔</span>
            <span className="splash-float-emoji">🪕</span>
          </div>
          <h1 className="splash-title">LittleMaestro</h1>
          <p className="splash-sub">Tap anywhere to play!</p>
          <p className="splash-tip">Tip: Use Guided Access (triple-click side button) to lock screen</p>
        </div>
      </div>
    );
  }

  const ActiveComponent =
    INSTRUMENTS.find((i) => i.id === activeInstrument)?.component || Piano;

  return (
    <div className="app">
      <header className="header">
        <h1 className="logo">🎵 LittleMaestro</h1>
        <div className="header-controls">
          <div className="volume-control">
            <span className="volume-icon">{volume === 0 ? "🔇" : volume < 0.4 ? "🔈" : volume < 0.7 ? "🔉" : "🔊"}</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              className="volume-slider"
              onChange={(e) => {
                const v = parseFloat(e.target.value);
                setVolumeState(v);
                setVolume(v);
              }}
            />
          </div>
        </div>
      </header>

      <nav className="instrument-nav">
        {INSTRUMENTS.map(({ id, emoji }) => {
          const isMelodic = id in RHYME_PLAY_FNS;

          return (
            <button
              key={id}
              className={`nav-btn ${
                isRhymesMode
                  ? rhymeInstrument === id
                    ? "nav-active"
                    : !isMelodic
                      ? "nav-disabled"
                      : ""
                  : activeInstrument === id
                    ? "nav-active"
                    : ""
              }`}
              onPointerDown={() => {
                if (isRhymesMode) {
                  if (isMelodic) setRhymeInstrument(id);
                } else {
                  stopRhyme();
                  setActiveInstrument(id);
                }
              }}
            >
              <span className="nav-emoji">{emoji}</span>
            </button>
          );
        })}

        {/* Rhymes toggle button */}
        <button
          className={`nav-btn ${isRhymesMode ? "nav-active" : ""}`}
          onPointerDown={() => {
            stopRhyme();
            if (isRhymesMode) {
              setActiveInstrument(rhymeInstrument);
            } else {
              setActiveInstrument("rhymes");
            }
          }}
        >
          <span className="nav-emoji">{isRhymesMode ? "🔙" : "🎶"}</span>
        </button>
      </nav>

      <main className="stage">
        {isRhymesMode ? (
          <Rhymes
            playFn={RHYME_PLAY_FNS[rhymeInstrument] || playPiano}
            instrumentEmoji={INSTRUMENTS.find((i) => i.id === rhymeInstrument)?.emoji || "🎹"}
          />
        ) : (
          <ActiveComponent />
        )}
      </main>
    </div>
  );
}
