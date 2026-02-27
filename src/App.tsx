import { useState, useCallback } from "react";
import Piano from "./components/Piano";
import Drums from "./components/Drums";
import Xylophone from "./components/Xylophone";
import Guitar from "./components/Guitar";
import MouthOrgan from "./components/MouthOrgan";
import Sitar from "./components/Sitar";
import Rhymes from "./components/Rhymes";
import Recorder from "./components/Recorder";
import { ensureAudioStarted, setVolume, getVolume } from "./audio/engine";
import "./App.css";

const INSTRUMENTS = [
  { id: "piano", emoji: "🎹", component: Piano },
  { id: "guitar", emoji: "🎸", component: Guitar },
  { id: "sitar", emoji: "🪕", component: Sitar },
  { id: "xylo", emoji: "🌈", component: Xylophone },
  { id: "harmonica", emoji: "🎙️", component: MouthOrgan },
  { id: "drums", emoji: "🥁", component: Drums },
  { id: "rhymes", emoji: "🎼", component: Rhymes },
];

export default function App() {
  const [started, setStarted] = useState(false);
  const [activeInstrument, setActiveInstrument] = useState("piano");
  const [volume, setVolumeState] = useState(getVolume());

  const handleStart = useCallback(async () => {
    await ensureAudioStarted();
    setStarted(true);
  }, []);

  if (!started) {
    return (
      <div className="splash" onPointerDown={handleStart}>
        <div className="splash-content">
          <div className="splash-emoji">🎵🎹🥁🎸</div>
          <h1 className="splash-title">LittleMaestro</h1>
          <p className="splash-sub">Tap anywhere to start playing!</p>
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
          <Recorder />
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
            onPointerDown={() => setActiveInstrument(id)}
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
