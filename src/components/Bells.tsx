import { useCallback, useState } from "react";
import { ensureAudioStarted, playBell } from "../audio/engine";

const BELLS = [
  { note: "C5", color: "#FFD700", label: "Do" },
  { note: "E5", color: "#C0C0C0", label: "Mi" },
  { note: "G5", color: "#CD7F32", label: "Sol" },
  { note: "C6", color: "#FFD700", label: "Do" },
];

export default function Bells() {
  const [ringing, setRinging] = useState<string | null>(null);

  const handlePlay = useCallback(async (note: string) => {
    await ensureAudioStarted();
    playBell(note);
    setRinging(note);
    setTimeout(() => setRinging(null), 500);
  }, []);

  return (
    <div className="instrument-container">
      <div className="instrument-title">🔔 Bells</div>
      <div className="bells-quad">
        {BELLS.map(({ note, color, label }) => (
          <button
            key={note}
            className={`bell-quad-btn ${ringing === note ? "bell-quad-ring" : ""}`}
            style={{ backgroundColor: color }}
            onPointerDown={() => handlePlay(note)}
          >
            <span className="bell-quad-icon">🔔</span>
            <span className="bell-quad-label">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
