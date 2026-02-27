import { useCallback, useState } from "react";
import { ensureAudioStarted, playHarmonica } from "../audio/engine";

const HOLES = [
  { note: "C4", label: "1" },
  { note: "D4", label: "2" },
  { note: "E4", label: "3" },
  { note: "F4", label: "4" },
  { note: "G4", label: "5" },
  { note: "A4", label: "6" },
  { note: "B4", label: "7" },
  { note: "C5", label: "8" },
  { note: "D5", label: "9" },
  { note: "E5", label: "10" },
];

export default function MouthOrgan() {
  const [active, setActive] = useState<string | null>(null);

  const handlePlay = useCallback(async (note: string) => {
    await ensureAudioStarted();
    playHarmonica(note);
    setActive(note);
    setTimeout(() => setActive(null), 300);
  }, []);

  return (
    <div className="instrument-container">
      <div className="instrument-title">🎶 Mouth Organ</div>
      <div className="harmonica-body">
        <div className="harmonica-top-plate" />
        <div className="harmonica-holes">
          {HOLES.map(({ note, label }) => (
            <button
              key={note}
              className={`harmonica-hole ${active === note ? "harmonica-blow" : ""}`}
              onPointerDown={() => handlePlay(note)}
            >
              <div className="hole-opening" />
              <span className="hole-label">{label}</span>
            </button>
          ))}
        </div>
        <div className="harmonica-bottom-plate" />
      </div>
    </div>
  );
}
