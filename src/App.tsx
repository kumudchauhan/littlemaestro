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
import { ensureAudioStarted, setVolume, getVolume, stopRhyme, playWelcomeJingle } from "./audio/engine";
import "./App.css";

const INSTRUMENTS = [
  { id: "piano", emoji: "🎹", component: Piano },
  { id: "guitar", emoji: "🎸", component: Guitar },
  { id: "xylo", emoji: "🌈", component: Xylophone },
  { id: "drums", emoji: "🥁", component: Drums },
  { id: "bells", emoji: "🔔", component: Bells },
  { id: "violin", emoji: "🎻", component: Violin },
  { id: "sitar", emoji: "🪕", component: Sitar },
  { id: "flute", emoji: "🪈", component: Flute },
  { id: "harmonica", emoji: "🎙️", component: MouthOrgan },
  { id: "rhymes", emoji: "🎶", component: Rhymes },
];

export default function App() {
  const [started, setStarted] = useState(false);
  const [activeInstrument, setActiveInstrument] = useState("piano");
  const [volume, setVolumeState] = useState(getVolume());

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
        {INSTRUMENTS.map(({ id, emoji }) => (
          <button
            key={id}
            className={`nav-btn ${activeInstrument === id ? "nav-active" : ""}`}
            onPointerDown={() => {
              stopRhyme();
              setActiveInstrument(id);
            }}
          >
            <span className="nav-emoji">{emoji}</span>
          </button>
        ))}
      </nav>

      <main className="stage">
        <ActiveComponent />
      </main>
    </div>
  );
}
