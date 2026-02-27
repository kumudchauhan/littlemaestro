import { useCallback, useState } from "react";
import { ensureAudioStarted, playSitar } from "../audio/engine";

const STRINGS = [
  { note: "B4", label: "Ni" },
  { note: "A4", label: "Dha" },
  { note: "G4", label: "Pa" },
  { note: "F4", label: "Ma" },
  { note: "E4", label: "Ga" },
  { note: "D4", label: "Re" },
  { note: "C4", label: "Sa" },
];

export default function Sitar() {
  const [plucked, setPlucked] = useState<string | null>(null);

  const handlePlay = useCallback(async (note: string) => {
    await ensureAudioStarted();
    playSitar(note);
    setPlucked(note);
    setTimeout(() => setPlucked(null), 800);
  }, []);

  return (
    <div className="instrument-container">
      <div className="instrument-title">🪕 Sitar</div>
      <div className="sitar-realistic">
        <div className="sitar-wood-body">
          <div className="sitar-neck-wood">
            <div className="sitar-neck-edge left" />
            <div className="sitar-neck-edge right" />
            <div className="sitar-neck-inlay" />
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((f) => (
              <div
                key={f}
                className="sitar-curved-fret"
                style={{ top: `${5 + f * 6.5}%` }}
              />
            ))}
          </div>
          <div className="sitar-tumba-gourd">
            <div className="sitar-tumba-shine" />
            <div className="sitar-tumba-pattern" />
          </div>
          <div className="sitar-jawari" />
          <div className="sitar-touch-lanes">
            {STRINGS.map(({ note, label }, i) => (
              <button
                key={note}
                className={`sitar-touch-lane ${plucked === note ? "sitar-lane-plucked" : ""}`}
                onPointerDown={() => handlePlay(note)}
              >
                <div
                  className={`sitar-string-wire ${plucked === note ? "sitar-string-vibrate" : ""}`}
                  style={{ width: `${3 - i * 0.2}px` }}
                />
                <span className="sitar-note-label">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
