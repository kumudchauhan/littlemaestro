import { useCallback, useState } from "react";
import { ensureAudioStarted, playFlute } from "../audio/engine";

const HOLES = [
  { note: "C4", label: "Sa" },
  { note: "D4", label: "Re" },
  { note: "E4", label: "Ga" },
  { note: "F4", label: "Ma" },
  { note: "G4", label: "Pa" },
  { note: "A4", label: "Dha" },
  { note: "B4", label: "Ni" },
  { note: "C5", label: "Sa" },
];

export default function Flute() {
  const [active, setActive] = useState<string | null>(null);

  const handlePlay = useCallback(async (note: string) => {
    await ensureAudioStarted();
    playFlute(note);
    setActive(note);
    setTimeout(() => setActive(null), 400);
  }, []);

  return (
    <div className="instrument-container">
      <div className="instrument-title">🪈 Flute</div>
      <div className="flute-body">
        <div className="flute-mouthpiece" />
        <div className="flute-tube">
          <div className="flute-shine" />
          <div className="flute-holes">
            {HOLES.map(({ note, label }) => (
              <button
                key={note}
                className={`flute-hole ${active === note ? "flute-hole-active" : ""}`}
                onPointerDown={() => handlePlay(note)}
              >
                <div className="flute-hole-circle" />
                <span className="flute-hole-label">{label}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="flute-end" />
      </div>
    </div>
  );
}
